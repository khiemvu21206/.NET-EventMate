using EventMate_Service.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EventMate_WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportsController : ControllerBase
    {
        private readonly ReportService _reportService;

        public ReportsController(ReportService reportService)
        {
            _reportService = reportService;
        }

        [HttpGet]
        public async Task<ActionResult<List<ReportDTO>>> GetAllReports()
        {
            return await _reportService.GetAllReportsAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ReportDTO>> GetReportById(Guid id)
        {
            var report = await _reportService.GetReportByIdAsync(id);
            if (report == null)
                return NotFound();
            return report;
        }

        [HttpPut("status")]
        public async Task<ActionResult<ReportDTO>> UpdateReportStatus(UpdateReportStatusDTO updateDTO)
        {
            try
            {
                return await _reportService.UpdateReportStatusAsync(updateDTO);
            }
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }
        }
    }
}
