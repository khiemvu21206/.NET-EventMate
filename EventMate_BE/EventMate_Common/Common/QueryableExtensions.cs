using System.Linq.Expressions;
using System.Reflection;

namespace EventMate_WebAPI.ModelsMapping.Common
{
    public static class QueryableExtensions
    {
        public static IQueryable<T> ApplySearch<T>(
            this IQueryable<T> query,
            string searchTerm,
            params Expression<Func<T, string>>[] properties)
        {
            if (string.IsNullOrWhiteSpace(searchTerm))
                return query;

            searchTerm = searchTerm.ToLower();
            var parameter = Expression.Parameter(typeof(T), "x");
            Expression searchExpression = null;

            foreach (var prop in properties)
            {
                var propertyAccess = Expression.Invoke(prop, parameter);
                var toLowerMethod = typeof(string).GetMethod("ToLower", System.Type.EmptyTypes);
                var containsMethod = typeof(string).GetMethod("Contains", new[] { typeof(string) });

                if (toLowerMethod == null || containsMethod == null) continue;

                var lowerProperty = Expression.Call(propertyAccess, toLowerMethod);
                var searchTermExpression = Expression.Constant(searchTerm);
                var containsExpression = Expression.Call(lowerProperty, containsMethod, searchTermExpression);

                searchExpression = searchExpression == null
                    ? containsExpression
                    : Expression.OrElse(searchExpression, containsExpression);
            }

            if (searchExpression == null)
                return query;

            var lambda = Expression.Lambda<Func<T, bool>>(searchExpression, parameter);
            return query.Where(lambda);
        }

        public static IQueryable<T> ApplySorting<T>(this IQueryable<T> query, string sortBy, bool ascending = true)
        {
            if (string.IsNullOrEmpty(sortBy))
                return query;

            var parameter = Expression.Parameter(typeof(T), "x");
            var property = typeof(T).GetProperty(sortBy, BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance);

            if (property == null)
                return query;

            var propertyAccess = Expression.Property(parameter, property);
            var lambda = Expression.Lambda<Func<T, object>>(Expression.Convert(propertyAccess, typeof(object)), parameter);

            return ascending ? query.OrderBy(lambda) : query.OrderByDescending(lambda);
        }

        public static IQueryable<T> ApplyPaging<T>(this IQueryable<T> query, int currentPage, int pageSize)
        {
            if (currentPage <= 0) currentPage = 1;
            if (pageSize <= 0) pageSize = 10;

            return query.Skip((currentPage - 1) * pageSize).Take(pageSize);
        }
        private static object ConvertValue(object value, Type targetType)
        {
            if (value == null) return null;

            Type underlyingType = Nullable.GetUnderlyingType(targetType) ?? targetType;

            if (underlyingType == typeof(string))
                return value.ToString();

            if (underlyingType == typeof(int) && int.TryParse(value.ToString(), out int intValue))
                return intValue;

            if (underlyingType == typeof(bool) && bool.TryParse(value.ToString(), out bool boolValue))
                return boolValue;

            if (underlyingType == typeof(DateTime) && DateTime.TryParse(value.ToString(), out DateTime dateTimeValue))
                return dateTimeValue;

            if (underlyingType == typeof(double) && double.TryParse(value.ToString(), out double doubleValue))
                return doubleValue;

            if (underlyingType == typeof(decimal) && decimal.TryParse(value.ToString(), out decimal decimalValue))
                return decimalValue;

            if (underlyingType.IsEnum && Enum.TryParse(underlyingType, value.ToString(), true, out object enumValue))
                return enumValue;

            return Convert.ChangeType(value, underlyingType);
        }

        public static IQueryable<T> ApplyFilters<T>(this IQueryable<T> query, Dictionary<string, object>? filters)
        {
            if (filters == null || filters.Count == 0)
                return query;

            var parameter = Expression.Parameter(typeof(T), "x");
            Expression combinedExpression = null;

            foreach (var filter in filters)
            {
                var property = typeof(T).GetProperty(filter.Key, BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance);
                if (property == null) continue;

                var propertyAccess = Expression.Property(parameter, property);
                object convertedValue;

                try
                {
                    if (filter.Value == null && Nullable.GetUnderlyingType(property.PropertyType) == null)
                        continue;

                    convertedValue = ConvertValue(filter.Value, property.PropertyType);
                }
                catch
                {
                    continue;
                }

                var filterValue = Expression.Constant(convertedValue, property.PropertyType);

                Expression equalExpression;

                if (property.PropertyType == typeof(string))
                {
                    // So sánh string theo cách an toàn (có thể thêm ToLower() nếu cần không phân biệt hoa thường)
                    var toLowerMethod = typeof(string).GetMethod("ToLower", Type.EmptyTypes);
                    var containsMethod = typeof(string).GetMethod("Contains", new[] { typeof(string) });

                    if (toLowerMethod != null && containsMethod != null)
                    {
                        var propertyLower = Expression.Call(propertyAccess, toLowerMethod);
                        var searchTermExpression = Expression.Constant(convertedValue.ToString().ToLower(), typeof(string));
                        equalExpression = Expression.Call(propertyLower, containsMethod, searchTermExpression);
                    }
                    else
                    {
                        equalExpression = Expression.Equal(propertyAccess, filterValue);
                    }
                }
                else
                {
                    equalExpression = Expression.Equal(propertyAccess, filterValue);
                }

                combinedExpression = combinedExpression == null
                    ? equalExpression
                    : Expression.AndAlso(combinedExpression, equalExpression);
            }

            if (combinedExpression == null)
                return query;

            var lambda = Expression.Lambda<Func<T, bool>>(combinedExpression, parameter);
            return query.Where(lambda);
        }

    }
}
