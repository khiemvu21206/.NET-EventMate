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

public class GroupRepositoryTests
{
    private readonly Mock<DataContext> _mockContext;
    private readonly GroupRepository _groupRepository;

    public GroupRepositoryTests()
    {
        _mockContext = new Mock<DataContext>();
        _groupRepository = new GroupRepository(_mockContext.Object);
    }

    [Fact]
    public async Task AddUserToGroupAsync_IncrementsTotalMember()
    {
        // Arrange
        var groupId = Guid.NewGuid();
        var userGroup = new User_Group { GroupId = groupId, UserId = Guid.NewGuid() };
        var group = new Groups { GroupId = groupId, TotalMember = 0 };
        _mockContext.Setup(c => c.Groups.FindAsync(groupId)).ReturnsAsync(group);
        _mockContext.Setup(c => c.User_Groups.AddAsync(userGroup, default)).ReturnsAsync((Microsoft.EntityFrameworkCore.ChangeTracking.EntityEntry<User_Group>)null);

        // Act
        var result = await _groupRepository.AddUserToGroupAsync(userGroup);

        // Assert
        Assert.True(result);
        Assert.Equal(1, group.TotalMember);
    }

    [Fact]
    public async Task RemoveUserFromGroupAsync_DecrementsTotalMember()
    {
        // Arrange
        var groupId = Guid.NewGuid();
        var userId = Guid.NewGuid();
        var userGroup = new User_Group { GroupId = groupId, UserId = userId };
        var group = new Groups { GroupId = groupId, TotalMember = 1 };

        _mockContext.Setup(c => c.User_Groups.FirstOrDefaultAsync(It.IsAny<Expression<Func<User_Group, bool>>>(), default)).ReturnsAsync(userGroup);
        _mockContext.Setup(c => c.Groups.FindAsync(groupId)).ReturnsAsync(group);

        // Act
        var result = await _groupRepository.RemoveUserFromGroupAsync(userId, groupId);

        // Assert
        Assert.True(result);
        Assert.Equal(0, group.TotalMember);
    }

    [Fact]
    public async Task CreateTemplateTimeLineAsync_CreatesPlansAndActivities()
    {
        // Arrange
        var groupId = Guid.NewGuid();
        var userId = Guid.NewGuid();
        var group = new Groups { GroupId = groupId, Plans = new List<Plans>() };

        _mockContext.Setup(c => c.Groups.Include(g => g.Plans).FirstOrDefaultAsync(It.IsAny<Expression<Func<Groups, bool>>>(), default)).ReturnsAsync(group);

        // Act
        var result = await _groupRepository.CreateTemplateTimeLineAsync(1, groupId, userId);

        // Assert
        Assert.True(result);
        Assert.NotEmpty(group.Plans);
    }
}
