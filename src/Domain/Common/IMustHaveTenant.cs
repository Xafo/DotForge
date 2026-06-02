namespace DotForge.Domain.Common;

public interface IMustHaveTenant
{
    Guid OrganizationId { get; set; }
}
