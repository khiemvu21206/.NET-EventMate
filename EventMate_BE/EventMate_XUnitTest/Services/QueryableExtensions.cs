using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace EventMate_XUnitTest.Services
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

        [Fact]
        public void ApplySearch_ShouldFilterByName()
        {
            var data = new List<TestEntity>
        {
            new TestEntity { Name = "Alice" },
            new TestEntity { Name = "Bob" },
            new TestEntity { Name = "Charlie" }
        }.AsQueryable();

            var result = data.ApplySearch("bo", x => x.Name).ToList();

            Assert.Single(result);
            Assert.Equal("Bob", result.First().Name);
        }

        [Fact]
        public void ApplySorting_ShouldSortByAgeAscending()
        {
            var data = new List<TestEntity>
        {
            new TestEntity { Age = 30 },
            new TestEntity { Age = 20 },
            new TestEntity { Age = 40 }
        }.AsQueryable();

            var result = data.ApplySorting("Age", true).ToList();

            Assert.Equal(20, result.First().Age);
            Assert.Equal(40, result.Last().Age);
        }

        [Fact]
        public void ApplyPaging_ShouldReturnCorrectPage()
        {
            var data = Enumerable.Range(1, 50)
                .Select(i => new TestEntity { Age = i })
                .AsQueryable();

            var result = data.ApplyPaging(2, 10).ToList();

            Assert.Equal(10, result.Count);
            Assert.Equal(11, result.First().Age);
        }

        [Fact]
        public void ApplyFilters_ShouldFilterByBoolean()
        {
            var data = new List<TestEntity>
        {
            new TestEntity { IsActive = true },
            new TestEntity { IsActive = false },
            new TestEntity { IsActive = true }
        }.AsQueryable();

            var filters = new Dictionary<string, object> { { "IsActive", true } };
            var result = data.ApplyFilters(filters).ToList();

            Assert.Equal(2, result.Count);
            Assert.All(result, x => Assert.True(x.IsActive));
        }

        [Fact]
        public void ApplySearch_WithNullSearchTerm_ShouldReturnAllItems()
        {
            var data = new List<TestEntity>
            {
                new TestEntity { Name = "Alice" },
                new TestEntity { Name = "Bob" },
                new TestEntity { Name = "Charlie" }
            }.AsQueryable();

            var result = data.ApplySearch(null, x => x.Name).ToList();

            Assert.Equal(3, result.Count);
        }

        [Fact]
        public void ApplySearch_CaseInsensitive_ShouldMatchCorrectly()
        {
            var data = new List<TestEntity>
            {
                new TestEntity { Name = "Alice" },
                new TestEntity { Name = "BOB" },
                new TestEntity { Name = "Charlie" }
            }.AsQueryable();

            var result = data.ApplySearch("bob", x => x.Name).ToList();

            Assert.Single(result);
            Assert.Equal("BOB", result.First().Name);
        }

        [Fact]
        public void ApplySorting_WithInvalidPropertyName_ShouldReturnUnsortedData()
        {
            var data = new List<TestEntity>
            {
                new TestEntity { Age = 30 },
                new TestEntity { Age = 20 },
                new TestEntity { Age = 40 }
            }.AsQueryable();

            var result = data.ApplySorting("InvalidProperty", true).ToList();

            Assert.Equal(30, result[0].Age);
            Assert.Equal(20, result[1].Age);
            Assert.Equal(40, result[2].Age);
        }

        [Fact]
        public void ApplyPaging_WithNegativePageNumber_ShouldReturnFirstPage()
        {
            var data = Enumerable.Range(1, 50)
                .Select(i => new TestEntity { Age = i })
                .AsQueryable();

            var result = data.ApplyPaging(-1, 10).ToList();

            Assert.Equal(10, result.Count);
            Assert.Equal(1, result.First().Age);
        }

        [Fact]
        public void ApplyPaging_WithZeroPageSize_ShouldUseDefaultPageSize()
        {
            var data = Enumerable.Range(1, 50)
                .Select(i => new TestEntity { Age = i })
                .AsQueryable();

            var result = data.ApplyPaging(1, 0).ToList();

            Assert.Equal(10, result.Count); // Assuming default page size is 10
        }

        [Fact]
        public void ApplyFilters_WithMultipleFilters_ShouldApplyAllFilters()
        {
            var data = new List<TestEntity>
            {
                new TestEntity { IsActive = true, Age = 25 },
                new TestEntity { IsActive = true, Age = 30 },
                new TestEntity { IsActive = false, Age = 25 },
                new TestEntity { IsActive = true, Age = 35 }
            }.AsQueryable();

            var filters = new Dictionary<string, object> 
            { 
                { "IsActive", true },
                { "Age", 25 }
            };
            
            var result = data.ApplyFilters(filters).ToList();

            Assert.Single(result);
            Assert.True(result[0].IsActive);
            Assert.Equal(25, result[0].Age);
        }

        [Fact]
        public void ApplyFilters_WithNonExistentProperty_ShouldIgnoreInvalidFilter()
        {
            var data = new List<TestEntity>
            {
                new TestEntity { IsActive = true },
                new TestEntity { IsActive = false }
            }.AsQueryable();

            var filters = new Dictionary<string, object> 
            { 
                { "NonExistentProperty", "value" },
                { "IsActive", true }
            };

            var result = data.ApplyFilters(filters).ToList();

            Assert.Single(result);
            Assert.True(result[0].IsActive);
        }
    }
}