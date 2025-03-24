using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using System;
using System.IO;

namespace EventMate.Data
{
	public class DataContextFactory : IDesignTimeDbContextFactory<DataContext>
	{
		public DataContext CreateDbContext(string[] args)
		{
			// Tìm thư mục chứa appsettings.json
			var basePath = Path.Combine(Directory.GetCurrentDirectory(), "../EventMate_WebAPI");

			var config = new ConfigurationBuilder()
				.SetBasePath(basePath) // Đặt thư mục chứa appsettings.json
				.AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
				.Build();

			var optionsBuilder = new DbContextOptionsBuilder<DataContext>();
			var connectionString = config.GetConnectionString("EventMate");

			if (string.IsNullOrEmpty(connectionString))
			{
				throw new Exception("Connection string 'EventMate' not found in appsettings.json");
			}

			optionsBuilder.UseSqlServer(connectionString);

			return new DataContext(optionsBuilder.Options);
		}
	}
}
