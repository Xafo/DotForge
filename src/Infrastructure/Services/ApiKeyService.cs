using System.Security.Cryptography;
using System.Text;
using DotForge.Application.DTOs;
using DotForge.Application.Interfaces;
using DotForge.Domain.Entities;

namespace DotForge.Infrastructure.Services;

public class ApiKeyService : IApiKeyService
{
    private readonly IApiKeyRepository _apiKeys;
    private readonly IUnitOfWork _unitOfWork;

    public ApiKeyService(IApiKeyRepository apiKeys, IUnitOfWork unitOfWork)
    {
        _apiKeys = apiKeys;
        _unitOfWork = unitOfWork;
    }

    public async Task<List<ApiKeyDto>> GetApiKeysAsync(Guid organizationId)
    {
        var keys = await _apiKeys.GetByOrganizationAsync(organizationId);
        return keys.Select(k => new ApiKeyDto(
            k.Id, k.Name, k.Prefix,
            k.Scopes.Split(',', StringSplitOptions.RemoveEmptyEntries).ToList(),
            k.LastUsedAt, k.ExpiresAt, k.CreatedAt, k.IsActive
        )).ToList();
    }

    public async Task<ApiKeyCreatedDto> CreateApiKeyAsync(Guid organizationId, CreateApiKeyRequest request)
    {
        var plainKey = $"df_{Guid.NewGuid():N}{Guid.NewGuid():N}";
        var prefix = plainKey[..10];

        var apiKey = new ApiKey
        {
            Id = Guid.NewGuid(),
            OrganizationId = organizationId,
            Name = request.Name.Trim(),
            KeyHash = HashKey(plainKey),
            Prefix = prefix,
            Scopes = string.Join(",", request.Scopes.Select(s => s.Trim().ToLowerInvariant())),
            ExpiresAt = request.ExpiresAt,
            CreatedAt = DateTime.UtcNow
        };

        await _apiKeys.AddAsync(apiKey);
        await _unitOfWork.SaveChangesAsync();

        return new ApiKeyCreatedDto(apiKey.Id, apiKey.Name, prefix, plainKey, apiKey.CreatedAt);
    }

    public async Task RevokeApiKeyAsync(Guid organizationId, Guid apiKeyId)
    {
        var key = await _apiKeys.GetByIdAsync(apiKeyId)
                  ?? throw new InvalidOperationException("API key not found.");

        if (key.OrganizationId != organizationId)
            throw new InvalidOperationException("API key not found in this organization.");

        key.IsRevoked = true;
        await _apiKeys.UpdateAsync(key);
        await _unitOfWork.SaveChangesAsync();
    }

    private static string HashKey(string key)
    {
        var bytes = SHA256.HashData(Encoding.UTF8.GetBytes(key));
        return Convert.ToHexString(bytes).ToLowerInvariant();
    }
}
