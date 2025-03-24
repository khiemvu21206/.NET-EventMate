using EventMate_WebAPI.ModelsMapping.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using Xunit;

namespace EventMate_UnitTest.Commons
{
    public class QueryableExtensionsTests
    {
        private class TestEntity
        {
            public string Name { get; set; }
            public int Age { get; set; }
            public bool IsActive { get; set; }
            public DateTime CreatedDate { get; set; }
        }

        private readonly List<TestEntity> testData = new()
        {
            new TestEntity { Name = "Alice", Age = 25, IsActive = true, CreatedDate = new DateTime(2023, 1, 1) },
            new TestEntity { Name = "Bob", Age = 30, IsActive = false, CreatedDate = new DateTime(2023, 2, 1) },
            new TestEntity { Name = "Charlie", Age = 35, IsActive = true, CreatedDate = new DateTime(2023, 3, 1) },
            new TestEntity { Name = "David", Age = 40, IsActive = false, CreatedDate = new DateTime(2023, 4, 1) },
            new TestEntity { Name = "Eve", Age = 45, IsActive = true, CreatedDate = new DateTime(2023, 5, 1) },
        };

        // ApplySearch Tests
        [Fact]
        public void ApplySearch_FindsMatchingNames()
        {
            var result = testData.AsQueryable().ApplySearch("Alice", x => x.Name).ToList();
            Assert.Single(result);
            Assert.Equal("Alice", result.First().Name);
        }

        [Fact]
        public void ApplySearch_CaseInsensitiveSearch()
        {
            var result = testData.AsQueryable().ApplySearch("alice", x => x.Name).ToList();
            Assert.Single(result);
            Assert.Equal("Alice", result.First().Name);
        }

        [Fact]
        public void ApplySearch_NoMatches_ReturnsEmpty()
        {
            var result = testData.AsQueryable().ApplySearch("Zach", x => x.Name).ToList();
            Assert.Empty(result);
        }

        [Fact]
        public void ApplySearch_EmptySearchTerm_ReturnsAll()
        {
            var result = testData.AsQueryable().ApplySearch("", x => x.Name).ToList();
            Assert.Equal(5, result.Count);
        }

        [Fact]
        public void ApplySearch_MultiplePropertiesSearch()
        {
            var result = testData.AsQueryable().ApplySearch("Charlie", x => x.Name, x => x.Age.ToString()).ToList();
            Assert.Single(result);
            Assert.Equal("Charlie", result.First().Name);
        }

        // ApplySorting Tests
        [Fact]
        public void ApplySorting_SortsByAgeAscending()
        {
            var result = testData.AsQueryable().ApplySorting("Age", true).ToList();
            Assert.Equal(25, result.First().Age);
        }

        [Fact]
        public void ApplySorting_SortsByAgeDescending()
        {
            var result = testData.AsQueryable().ApplySorting("Age", false).ToList();
            Assert.Equal(45, result.First().Age);
        }

        [Fact]
        public void ApplySorting_InvalidProperty_ReturnsSameOrder()
        {
            var result = testData.AsQueryable().ApplySorting("InvalidProperty", true).ToList();
            Assert.Equal(testData.Count, result.Count);
        }

        [Fact]
        public void ApplySorting_SortsByCreatedDateAscending()
        {
            var result = testData.AsQueryable().ApplySorting("CreatedDate", true).ToList();
            Assert.Equal(new DateTime(2023, 1, 1), result.First().CreatedDate);
        }

        [Fact]
        public void ApplySorting_SortsByCreatedDateDescending()
        {
            var result = testData.AsQueryable().ApplySorting("CreatedDate", false).ToList();
            Assert.Equal(new DateTime(2023, 5, 1), result.First().CreatedDate);
        }

        // ApplyPaging Tests
        [Fact]
        public void ApplyPaging_ReturnsCorrectPage()
        {
            var result = testData.AsQueryable().ApplyPaging(2, 2).ToList();
            Assert.Equal(2, result.Count);
            Assert.Equal("Charlie", result.First().Name);
        }

        [Fact]
        public void ApplyPaging_FirstPageReturnsExpectedItems()
        {
            var result = testData.AsQueryable().ApplyPaging(1, 3).ToList();
            Assert.Equal(3, result.Count);
            Assert.Equal("Alice", result.First().Name);
        }

        [Fact]
        public void ApplyPaging_HandlesOutOfBoundsPage()
        {
            var result = testData.AsQueryable().ApplyPaging(10, 2).ToList();
            Assert.Empty(result);
        }

        [Fact]
        public void ApplyPaging_NegativePageDefaultsToFirstPage()
        {
            var result = testData.AsQueryable().ApplyPaging(-1, 2).ToList();
            Assert.Equal(2, result.Count);
        }

        [Fact]
        public void ApplyPaging_PageSizeZeroDefaultsToTen()
        {
            var result = testData.AsQueryable().ApplyPaging(1, 0).ToList();
            Assert.Equal(5, result.Count);
        }

        // ApplyFilters Tests
        [Fact]
        public void ApplyFilters_FiltersByIsActiveTrue()
        {
            var filters = new Dictionary<string, object> { { "IsActive", true } };
            var result = testData.AsQueryable().ApplyFilters(filters).ToList();
            Assert.Equal(3, result.Count);
        }

        [Fact]
        public void ApplyFilters_FiltersByIsActiveFalse()
        {
            var filters = new Dictionary<string, object> { { "IsActive", false } };
            var result = testData.AsQueryable().ApplyFilters(filters).ToList();
            Assert.Equal(2, result.Count);
        }

        [Fact]
        public void ApplyFilters_FiltersByExactAge()
        {
            var filters = new Dictionary<string, object> { { "Age", 30 } };
            var result = testData.AsQueryable().ApplyFilters(filters).ToList();
            Assert.Single(result);
            Assert.Equal(30, result.First().Age);
        }

        [Fact]
        public void ApplyFilters_FiltersByNonExistingProperty_ReturnsSameList()
        {
            var filters = new Dictionary<string, object> { { "NonExistingProperty", "Test" } };
            var result = testData.AsQueryable().ApplyFilters(filters).ToList();
            Assert.Equal(testData.Count, result.Count);
        }

        [Fact]
        public void ApplyFilters_HandlesNullFilter_ReturnsSameList()
        {
            var result = testData.AsQueryable().ApplyFilters(null).ToList();
            Assert.Equal(testData.Count, result.Count);
        }
    }
}
