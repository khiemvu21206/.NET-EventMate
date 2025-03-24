using Moq;
using Xunit;
using Eventmate_Data.Repositories;
using EventMate_Data.Entities;
using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using EventMate.Data;
using System.Linq.Expressions;

public class PlanRepositoryTests
{
    private readonly Mock<DataContext> _mockContext;
    private readonly PlanRepository _planRepository;

    public PlanRepositoryTests()
    {
        _mockContext = new Mock<DataContext>();
        _planRepository = new PlanRepository(_mockContext.Object);
    }

    [Fact]
    public async Task AddPlanAsync_AddsPlanToDatabase()
    {
        // Arrange
        var plan = new Plans { PlanId = Guid.NewGuid(), Title = "Test Plan" };
        _mockContext.Setup(c => c.Plans.AddAsync(plan, default)).ReturnsAsync((Microsoft.EntityFrameworkCore.ChangeTracking.EntityEntry<Plans>)null);

        // Act
        await _planRepository.AddPlanAsync(plan);

        // Assert
        _mockContext.Verify(c => c.Plans.AddAsync(plan, default), Times.Once);
        _mockContext.Verify(c => c.SaveChangesAsync(default), Times.Once);
    }

    [Fact]
    public async Task DeletePlanAsync_RemovesPlanFromDatabase()
    {
        // Arrange
        var planId = Guid.NewGuid();
        var plan = new Plans { PlanId = planId, Activities = new List<Activity>() };
        _mockContext.Setup(c => c.Plans.Include(p => p.Activities).FirstOrDefaultAsync(It.IsAny<Expression<Func<Plans, bool>>>(), default)).ReturnsAsync(plan);

        // Act
        await _planRepository.DeletePlanAsync(planId);

        // Assert
        _mockContext.Verify(c => c.Plans.Remove(plan), Times.Once);
        _mockContext.Verify(c => c.SaveChangesAsync(default), Times.Once);
    }

    [Fact]
    public async Task GetPlansByGroupIdAsync_ReturnsSortedPlans()
    {
        // Arrange
        var groupId = Guid.NewGuid();
        var plans = new List<Plans>
        {
            new Plans { PlanId = Guid.NewGuid(), GroupId = groupId, Schedule = DateTime.UtcNow.AddDays(1) },
            new Plans { PlanId = Guid.NewGuid(), GroupId = groupId, Schedule = DateTime.UtcNow }
        };
        _mockContext.Setup(c => c.Plans.Include(p => p.Activities).ThenInclude(a => a.User).Where(It.IsAny<Expression<Func<Plans, bool>>>()).OrderBy(p => p.Schedule).ToListAsync(default)).ReturnsAsync(plans);

        // Act
        var result = await _planRepository.GetPlansByGroupIdAsync(groupId);

        // Assert
        Assert.Equal(2, result.Count());
        Assert.True(result.First().Schedule < result.Last().Schedule);
    }
}
