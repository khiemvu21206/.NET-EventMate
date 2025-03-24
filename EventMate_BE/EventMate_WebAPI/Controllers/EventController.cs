using AutoMapper;
using EventMate_Common.Common;
using EventMate_Common.Constants;
using EventMate_Common.Enum;
using EventMate_Common.Status;
using EventMate_Common.Type;
using EventMate_Data.Entities;
using EventMate_Service.Services;
using EventMate_WebAPI.ModelsMapping;
using EventMate_WebAPI.ModelsMapping.Common;
using EventMate_WebAPI.ModelsMapping.Event;
using EventMate_WebAPI.ModelsMapping.Group;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using System.Globalization;
using System.Linq;

namespace EventMate_WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EventController : ControllerBase
    {
        private readonly EventService _eventService;
        private readonly IMapper _mapper;
        private readonly AwsService _awsService;
        public EventController(EventService eventService, IMapper mapper, AwsService awsService)
        {
            _eventService = eventService;
            _mapper = mapper;
            _awsService = awsService;
        }



        [HttpGet("{id}")]
        public async Task<IActionResult> GetEventById(Guid id)
        {
            try
            {
                var eventEntity = await _eventService.GetEventByIdAsync(id);

                if (eventEntity == null)
                {
                    return NotFound(new ApiResponse<string>(404, ResponseKeys.NotFound, "Không tìm thấy sự kiện."));
                }

                // Mapping Event to EventDto
                var eventDto = new EventDto
                {
                    EventId = eventEntity.EventId,
                    Name = eventEntity.Name,
                    Place = eventEntity.Place,
                    CreatedAt = eventEntity.CreatedAt,
                    TimeStart = eventEntity.TimeStart,
                    TimeEnd = eventEntity.TimeEnd,
                    Img = eventEntity.Img,
                    Description = eventEntity.Description,
                    Type = eventEntity.Type,
                    Status = eventEntity.Status,
                    OrganizerName= eventEntity.OrganizerName,
                    OrganizerLogo = eventEntity.OrganizerLogo,
                    OrganizerDescription = eventEntity.OrganizerDescription,
                    Banner = eventEntity.banner,
                };

                return Ok(new ApiResponse<EventDto>(200, ResponseKeys.FetchEventSuccess, eventDto));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<string>(500, ResponseKeys.ErrorSystem, ex.Message));
            }
        }





        [HttpPost]
        public async Task<IActionResult> CreateEvent(EventCreateModel model)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new ApiResponse<string>(400, ResponseKeys.InvalidRequest, "Dữ liệu không hợp lệ."));
                }

                if (model.TimeStart >= model.TimeEnd)
                {
                    return BadRequest(new ApiResponse<string>(400, ResponseKeys.InvalidEventTime, "Thời gian bắt đầu phải trước thời gian kết thúc."));
                }

                // Ánh xạ dữ liệu từ model sang entity
                var eventEntity = _mapper.Map<Events>(model);

                // Lưu tạm sự kiện vào DB để lấy EventId
                var createdEvent = await _eventService.AddEventAsync(eventEntity);
                if (createdEvent == null)
                {
                    return StatusCode(500, new ApiResponse<string>(500, ResponseKeys.EventCreationFailed, "Không thể tạo sự kiện."));
                }

                // Upload ảnh sự kiện lên AWS S3
                string imgUrl = await UploadFileToAWS(model.Img, "amzn-eventmate-event", createdEvent.EventId.ToString());

                // Upload ảnh logo tổ chức lên AWS S3
                string logoUrl = await UploadFileToAWS(model.OrganizerLogo, "amzn-eventmate-organization", createdEvent.EventId.ToString());

                // Upload ảnh banner lên AWS S3 (mới thêm)
                string bannerUrl = await UploadFileToAWS(model.banner, "amzn-eventmate-banner", createdEvent.EventId.ToString());

                // Cập nhật lại sự kiện với URL ảnh
                createdEvent.Img = imgUrl;
                createdEvent.OrganizerLogo = logoUrl;
                createdEvent.banner = bannerUrl;
                await _eventService.UpdateEventAsync(createdEvent);

                return CreatedAtAction(nameof(GetEventById), new { id = createdEvent.EventId },
                    new ApiResponse<Events>(201, ResponseKeys.EventCreated, createdEvent));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<string>(500, ResponseKeys.ErrorSystem, ex.Message));
            }
        }


        private async Task<string> UploadFileToAWS(IFormFile file, string bucketName, string fileName)
        {
            if (file == null)
                return string.Empty;

            using (var stream = file.OpenReadStream())
            {
                await _awsService.addFile(stream, bucketName, fileName);
                return string.Format(Constants.urlImg, bucketName, fileName);
            }
        }


        [HttpPost("status")]
        public async Task<IActionResult> GetEventsByStatus([FromBody] int status) 
        {
            try
            {
                var eventStatus = (EventStatus)status; 
                var events = await _eventService.GetEventsByStatusAsync(eventStatus);

                if (events == null || !events.Any())
                {
                    return NotFound(new ApiResponse<string>(404, ResponseKeys.NotFound, "Không tìm thấy sự kiện với trạng thái được chỉ định."));
                }

                return Ok(new ApiResponse<IEnumerable<Events>>(200, ResponseKeys.FetchEventSuccess, events));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<string>(500, ResponseKeys.ErrorSystem, ex.Message));
            }
        }




        [HttpPost("user/{userId}")]
        public async Task<IActionResult> GetEventsByUser(Guid userId, ListRequestModel request)
        {
            try
            {
                if (request == null)
                    return BadRequest(new ApiResponse<object>(400, ResponseKeys.InvalidRequest, "Invalid request data"));

                var events = await _eventService.GetEventsByUserAsync(userId);

                if (events == null || !events.Any())
                    return NotFound(new ApiResponse<object>(404, ResponseKeys.NotFound, "Data not found"));

                // Lấy tất cả event của user
                var query = events.AsQueryable();

                // Áp dụng tìm kiếm nếu có
                if (!string.IsNullOrWhiteSpace(request.KeySearch))
                {
                    query = query.ApplySearch(request.KeySearch, 
                        e => e.Name, 
                        e => e.Place, 
                        e => e.Description
                    );
                }

                // Áp dụng sắp xếp nếu có
                if (!string.IsNullOrEmpty(request.SortBy))
                {
                    query = query.ApplySorting(request.SortBy, request.Ascending ?? true);
                }

                // Đếm tổng số record
                var totalCount = query.Count();

                // Áp dụng phân trang
                query = query.ApplyPaging(request.CurrentPage, request.PageSize);

                var data = new
                {
                    totalCount,
                    currentPage = request.CurrentPage,
                    data = query.ToList()
                };

                return Ok(new ApiResponse<object>(200, ResponseKeys.FetchEventSuccess, data));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<string>(500, ResponseKeys.ErrorSystem, ex.Message));
            }
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEvent(Guid id)
        {
            try
            {
                var eventEntity = await _eventService.GetEventByIdAsync(id);
                if (eventEntity == null)
                {
                    return NotFound(new ApiResponse<string>(404, ResponseKeys.NotFound, "Không tìm thấy sự kiện cần xóa."));
                }

                await _eventService.DeleteEventAsync(id);
                return Ok(new ApiResponse<string>(200, ResponseKeys.EventDeleted, "Sự kiện đã được xóa thành công."));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<string>(500, ResponseKeys.ErrorSystem, ex.Message));
            }
        }


        [HttpPut("change-status/{eventId}")]
        public async Task<IActionResult> ChangeEventStatus(Guid eventId, [FromBody] EventStatus newStatus)
        {
            try
            {
                var eventEntity = await _eventService.GetEventByIdAsync(eventId);
                if (eventEntity == null)
                {
                    return NotFound(new ApiResponse<string>(404, ResponseKeys.NotFound, "Không tìm thấy sự kiện cần cập nhật."));
                }

                var success = await _eventService.ChangeEventStatusAsync(eventId, newStatus);
                if (!success)
                {
                    return StatusCode(500, new ApiResponse<string>(500, ResponseKeys.ErrorSystem, "Không thể cập nhật trạng thái sự kiện."));
                }

                return Ok(new ApiResponse<string>(200, ResponseKeys.EventUpadated, "Trạng thái sự kiện đã được cập nhật thành công."));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<string>(500, ResponseKeys.ErrorSystem, ex.Message));
            }
        }

       
        [HttpGet("similar/{eventType}")]
        public async Task<IActionResult> GetRandomEventsByType(EventType eventType)
        {
            try
            {
                var events = await _eventService.GetRandomEventsByTypeAsync(eventType, 8);



                var eventDtos = events.Select(e => new EventDto
                {
                    EventId = e.EventId,
                    Name = e.Name,
                    Place = e.Place,
                    CreatedAt = e.CreatedAt,
                    TimeStart = e.TimeStart,
                    TimeEnd = e.TimeEnd,
                    Img = e.Img,
                    Description = e.Description,
                    Type = e.Type,
                    Status = e.Status,

                }).ToList();

                return Ok(new ApiResponse<List<EventDto>>(200, ResponseKeys.FetchEventSuccess, eventDtos));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<string>(500, ResponseKeys.ErrorSystem, ex.Message));
            }
        }

        [HttpPost("events_list")]
        public async Task<IActionResult> GetEvents(ListRequestModel request)
        {
            if (request == null)
                return BadRequest(new ApiResponse<object>(400, ResponseKeys.InvalidRequest, "Invalid request data"));

         

            var events = await _eventService.GetActiveEvents();

            if (events == null || !events.Any())
                return NotFound(new ApiResponse<object>(404, ResponseKeys.NotFound, "Data not found"));

            // Lọc các sự kiện có Status = 1
            var query = events.Where(e => e.Status == EventStatus.Approved).AsQueryable();

         

            if (!string.IsNullOrWhiteSpace(request.KeySearch))
            {
                query = query.ApplySearch(request.KeySearch, e => e.Name, e => e.Place, e => e.Description);
            }

            if (!string.IsNullOrEmpty(request.SortBy))
            {
                query = query.ApplySorting(request.SortBy, request.Ascending ?? true);
            }
            if (request.Filters != null)
            {
                query = query.ApplyFilters(request.Filters);
            }

            var totalCount = query.Count();
            query = query.ApplyPaging(request.CurrentPage, request.PageSize);

            var data = new
            {
                totalCount,
                currentPage = request.CurrentPage,
                data = query.ToList()
            };

            return Ok(new ApiResponse<object>(200, null, data));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateEvent(Guid id, [FromForm] EventUpdateModel model)
        {
            try
            {
                // Log dữ liệu nhận được
                System.Diagnostics.Debug.WriteLine($"TimeStart: {model.TimeStart}");
                System.Diagnostics.Debug.WriteLine($"TimeEnd: {model.TimeEnd}");
                System.Diagnostics.Debug.WriteLine($"Banner: {model.Banner?.FileName}");
            
                // Kiểm tra event tồn tại
                var existingEvent = await _eventService.GetEventByIdAsync(id);
                if (existingEvent == null)
                {
                    return NotFound(new ApiResponse<string>(404, ResponseKeys.NotFound, "Không tìm thấy sự kiện."));
                }



                // Cập nhật thông tin thời gian
                existingEvent.TimeStart = DateTime.ParseExact(model.TimeStart, "yyyy-MM-dd HH:mm:ss.fffffff", CultureInfo.InvariantCulture);
                existingEvent.TimeEnd = DateTime.ParseExact(model.TimeEnd, "yyyy-MM-dd HH:mm:ss.fffffff", CultureInfo.InvariantCulture);
              

                // Upload và cập nhật banner mới nếu có
                if (model.Banner != null)
                {
                    // Xóa banner cũ nếu có
                    if (!string.IsNullOrEmpty(existingEvent.banner))
                    {
                        string oldBannerKey = existingEvent.banner.Split('/').Last();
                        await _awsService.deleteFile("amzn-eventmate-banner", oldBannerKey);
                    }

                    // Upload banner mới
                    string bannerUrl = await UploadFileToAWS(model.Banner, "amzn-eventmate-banner", id.ToString());
                    existingEvent.banner = bannerUrl;
                }

                // Lưu cập nhật
                var updatedEvent = await _eventService.UpdateEventAsync(existingEvent);
                if (updatedEvent == null)
                {
                    return StatusCode(500, new ApiResponse<string>(500, ResponseKeys.ErrorSystem, "Không thể cập nhật sự kiện."));
                }

                // Tạo EventDto từ event đã cập nhật
                var eventDto = new EventDto
                {
                    EventId = updatedEvent.EventId,
                    Name = updatedEvent.Name,
                    Place = updatedEvent.Place,
                    CreatedAt = updatedEvent.CreatedAt,
                    TimeStart = updatedEvent.TimeStart,
                    TimeEnd = updatedEvent.TimeEnd,
                    Img = updatedEvent.Img,
                    Description = updatedEvent.Description,
                    Type = updatedEvent.Type,
                    Status = updatedEvent.Status,
                    OrganizerName = updatedEvent.OrganizerName,
                    OrganizerLogo = updatedEvent.OrganizerLogo,
                    Banner = updatedEvent.banner,
                };

                return Ok(new ApiResponse<EventDto>(200, ResponseKeys.EventUpadated, eventDto));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<string>(500, ResponseKeys.ErrorSystem, ex.Message));
            }
        }

       

        [HttpPost("organizer")]
        public async Task<IActionResult> GetEventsByOrganizer(ListRequestModel request)
        {
            try
            {
                if (request == null)
                    return BadRequest(new ApiResponse<object>(400, ResponseKeys.InvalidRequest, "Invalid request data"));

                // Lấy tất cả event có userRole là "28A1F3F0-B5E8-4C5F-9DA8-8F61C351C1B4" và status là 0
                var events = await _eventService.GetEventsByRoleAndStatusAsync("28A1F3F0-B5E8-4C5F-9DA8-8F61C351C1B4", EventStatus.Pending);


                var query = events.AsQueryable();

                // Áp dụng tìm kiếm nếu có
                if (!string.IsNullOrWhiteSpace(request.KeySearch))
                {
                    query = query.ApplySearch(request.KeySearch, 
                        e => e.Name, 
                        e => e.Place, 
                        e => e.Description
                    );
                }

                // Áp dụng sắp xếp nếu có
                if (!string.IsNullOrEmpty(request.SortBy))
                {
                    query = query.ApplySorting(request.SortBy, request.Ascending ?? true);
                }

                // Đếm tổng số record
                var totalCount = query.Count();

                // Áp dụng phân trang
                query = query.ApplyPaging(request.CurrentPage, request.PageSize);

                var data = new
                {
                    totalCount,
                    currentPage = request.CurrentPage,
                    data = query.ToList()
                };

                return Ok(new ApiResponse<object>(200, ResponseKeys.FetchEventSuccess, data));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<string>(500, ResponseKeys.ErrorSystem, ex.Message));
            }
        }

        [HttpPut("change-banner-status/{eventId}")]
        public async Task<IActionResult> ChangeBannerStatus(Guid eventId, [FromBody] BannerStatus newStatus)
        {
            try
            {
                var eventEntity = await _eventService.GetEventByIdAsync(eventId);
                if (eventEntity == null)
                {
                    return NotFound(new ApiResponse<string>(404, ResponseKeys.NotFound, "Không tìm thấy sự kiện cần cập nhật."));
                }

                var success = await _eventService.ChangeBannerStatusAsync(eventId, newStatus);
                if (!success)
                {
                    return StatusCode(500, new ApiResponse<string>(500, ResponseKeys.ErrorSystem, "Không thể cập nhật trạng thái banner."));
                }

                return Ok(new ApiResponse<string>(200, ResponseKeys.EventUpadated, "Trạng thái banner đã được cập nhật thành công."));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<string>(500, ResponseKeys.ErrorSystem, ex.Message));
            }
        }

        [HttpPost("banners")]
        public async Task<IActionResult> GetBannerList(ListRequestModel request)
        {
            try
            {
                if (request == null)
                    return BadRequest(new ApiResponse<object>(400, ResponseKeys.InvalidRequest, "Invalid request data"));

                var events = await _eventService.GetBannerListAsync();

                if (events == null || !events.Any())
                    return NotFound(new ApiResponse<object>(404, ResponseKeys.NotFound, "Không tìm thấy banner nào."));

                // Chuyển sang IQueryable để xử lý
                var query = events.AsQueryable();

                // Áp dụng tìm kiếm nếu có
                if (!string.IsNullOrWhiteSpace(request.KeySearch))
                {
                    query = query.ApplySearch(request.KeySearch,
                        e => e.Name
                    );
                }

                // Áp dụng sắp xếp nếu có
                if (!string.IsNullOrEmpty(request.SortBy))
                {
                    query = query.ApplySorting(request.SortBy, request.Ascending ?? true);
                }

                // Đếm tổng số record
                var totalCount = query.Count();

                // Áp dụng phân trang
                query = query.ApplyPaging(request.CurrentPage, request.PageSize);

                // Chuyển đổi sang DTO
                var bannerDtos = query.Select(e => new BannerDto
                {
                    EventId = e.EventId,
                    Name = e.Name,
                    Banner = e.banner,
                    BannerStatus = e.BannerStatus
                }).ToList();

                var data = new
                {
                    totalCount,
                    currentPage = request.CurrentPage,
                    data = bannerDtos
                };

                return Ok(new ApiResponse<object>(200, ResponseKeys.FetchEventSuccess, data));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<string>(500, ResponseKeys.ErrorSystem, ex.Message));
            }
        }

    }
}
