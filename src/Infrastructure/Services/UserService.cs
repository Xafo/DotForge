using DotForge.Application.DTOs;
using DotForge.Application.Interfaces;

namespace DotForge.Infrastructure.Services;

public class UserService : IUserService
{
    private readonly IUserRepository _users;
    private readonly IUnitOfWork _unitOfWork;

    public UserService(IUserRepository users, IUnitOfWork unitOfWork)
    {
        _users = users;
        _unitOfWork = unitOfWork;
    }

    public async Task<UserProfileDto> GetProfileAsync(Guid userId)
    {
        var user = await _users.GetByIdAsync(userId)
                   ?? throw new InvalidOperationException("User not found.");

        return new UserProfileDto(user.Id, user.Email, user.Name, user.AvatarUrl, user.CreatedAt);
    }

    public async Task<UserProfileDto> UpdateProfileAsync(Guid userId, UpdateProfileRequest request)
    {
        var user = await _users.GetByIdAsync(userId)
                   ?? throw new InvalidOperationException("User not found.");

        user.Name = request.Name.Trim();
        user.AvatarUrl = request.AvatarUrl;

        await _users.UpdateAsync(user);
        await _unitOfWork.SaveChangesAsync();

        return new UserProfileDto(user.Id, user.Email, user.Name, user.AvatarUrl, user.CreatedAt);
    }

    public async Task ChangePasswordAsync(Guid userId, ChangePasswordRequest request)
    {
        var user = await _users.GetByIdAsync(userId)
                   ?? throw new InvalidOperationException("User not found.");

        if (!BCrypt.Net.BCrypt.Verify(request.CurrentPassword, user.PasswordHash))
            throw new InvalidOperationException("Current password is incorrect.");

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
        await _users.UpdateAsync(user);
        await _unitOfWork.SaveChangesAsync();
    }
}
