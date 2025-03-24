using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Eventmate_Data.Entities;

namespace Eventmate_Data.IRepositories
{
    public interface IReportRepository
    {
        Task<List<EventMate_Data.Entities.Report>> GetAllReportsAsync();
        Task<EventMate_Data.Entities.Report?> GetReportByIdAsync(Guid reportId);
        Task<List<EventMate_Data.Entities.Report>> GetReportsByUserIdAsync(Guid userId);
        Task<EventMate_Data.Entities.Report> UpdateReportStatusAsync(Guid reportId, EventMate_Data.Entities.Report updatedReport);
        Task<bool> DeleteReportAsync(Guid reportId);
        Task<EventMate_Data.Entities.Report> CreateReportAsync(EventMate_Data.Entities.Report report);
    }
}
