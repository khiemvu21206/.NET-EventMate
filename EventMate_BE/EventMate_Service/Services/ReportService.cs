using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using EventMate_Common.Status;
using Eventmate_Data.Entities;
using Eventmate_Data.IRepositories;

namespace EventMate_Service.Services
{
    public class ReportDTO
    {
        public Guid ReportId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public Guid OrderId { get; set; }
        public Guid UserId { get; set; }
        public ReportStatus Status { get; set; }
        public string UserName { get; set; } = string.Empty;
        public decimal OrderTotalPrice { get; set; }
        public DateTime OrderCreatedAt { get; set; }
    }

    public class UpdateReportStatusDTO
    {
        public Guid ReportId { get; set; }
        public ReportStatus NewStatus { get; set; }
    }

    public interface IReportService
    {
        Task<List<ReportDTO>> GetAllReportsAsync();
        Task<ReportDTO?> GetReportByIdAsync(Guid reportId);
        Task<ReportDTO> UpdateReportStatusAsync(UpdateReportStatusDTO updateDTO);
    }

    public class ReportService : IReportService
    {
        private readonly IReportRepository _reportRepository;

        public ReportService(IReportRepository reportRepository)
        {
            _reportRepository = reportRepository;
        }

        private ReportDTO MapToDTO(EventMate_Data.Entities.Report report)
        {
            return new ReportDTO
            {
                ReportId = report.ReportId,
                Title = report.Title,
                Description = report.Description,
                OrderId = report.OrderId,
                UserId = report.UserId,
                Status = report.Status,
                UserName = report.User?.FullName ?? "Unknown",
                OrderTotalPrice = report.Order?.TotalPrice ?? 0,
                OrderCreatedAt = report.Order?.CreatedAt ?? DateTime.MinValue
            };
        }

        public async Task<List<ReportDTO>> GetAllReportsAsync()
        {
            var reports = await _reportRepository.GetAllReportsAsync();
            return reports.Select(MapToDTO).ToList();
        }

        public async Task<ReportDTO?> GetReportByIdAsync(Guid reportId)
        {
            var report = await _reportRepository.GetReportByIdAsync(reportId);
            return report != null ? MapToDTO(report) : null;
        }

        public async Task<ReportDTO> UpdateReportStatusAsync(UpdateReportStatusDTO updateDTO)
        {
            var existingReport = await _reportRepository.GetReportByIdAsync(updateDTO.ReportId);
            if (existingReport == null)
            {
                throw new Exception("Report not found");
            }

            existingReport.Status = updateDTO.NewStatus;
            var updatedReport = await _reportRepository.UpdateReportStatusAsync(updateDTO.ReportId, existingReport);
            return MapToDTO(updatedReport);
        }
    }
}
