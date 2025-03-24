using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using EventMate.Data;
using Eventmate_Data.Entities;
using Eventmate_Data.IRepositories;
using Microsoft.EntityFrameworkCore;

namespace Eventmate_Data.Repositories
{
    public class ReportRepository : IReportRepository
    {
        private readonly DataContext _context;

        public ReportRepository(DataContext context)
        {
            _context = context;
        }

        public async Task<List<EventMate_Data.Entities.Report>> GetAllReportsAsync()
        {
            return await _context.Reports
                .Include(r => r.User)
                .Include(r => r.Order)
                .ToListAsync();
        }

        public async Task<EventMate_Data.Entities.Report?> GetReportByIdAsync(Guid reportId)
        {
            return await _context.Reports
                .Include(r => r.User)
                .Include(r => r.Order)
                .FirstOrDefaultAsync(r => r.ReportId == reportId);
        }

        public async Task<List<EventMate_Data.Entities.Report>> GetReportsByUserIdAsync(Guid userId)
        {
            return await _context.Reports
                .Include(r => r.User)
                .Include(r => r.Order)
                .Where(r => r.UserId == userId)
                .ToListAsync();
        }

        public async Task<EventMate_Data.Entities.Report> UpdateReportStatusAsync(Guid reportId, EventMate_Data.Entities.Report updatedReport)
        {
            var report = await _context.Reports.FindAsync(reportId);
            if (report != null)
            {
                report.Status = updatedReport.Status;
                await _context.SaveChangesAsync();
            }
            return report!;
        }

        public async Task<bool> DeleteReportAsync(Guid reportId)
        {
            var report = await _context.Reports.FindAsync(reportId);
            if (report != null)
            {
                _context.Reports.Remove(report);
                await _context.SaveChangesAsync();
                return true;
            }
            return false;
        }

        public async Task<EventMate_Data.Entities.Report> CreateReportAsync(EventMate_Data.Entities.Report report)
        {
            await _context.Reports.AddAsync(report);
            await _context.SaveChangesAsync();
            return report;
        }
    }
}
