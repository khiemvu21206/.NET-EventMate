using AutoMapper;
using EventMate_Common.Common;
using EventMate_Common.Constants;
using EventMate_Common.Enum;
using EventMate_Common.Status;
using EventMate_Common.Type;
using EventMate_Data.Entities;
using EventMate_Service.Services;
using EventMate_WebAPI.ModelsMapping;
using EventMate_WebAPI.ModelsMapping.Album;

using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EventMate_WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MediaController : ControllerBase
    {
        private readonly AlbumService _albumService;
        private readonly IMapper _mapper;
        private readonly AwsService _awsService;
        private readonly UserService _userService;

        public MediaController(AlbumService albumService, IMapper mapper, AwsService awsService, UserService userService)
        {
            _albumService = albumService;
            _mapper = mapper;
            _awsService = awsService;
            _userService = userService;
        }

        [HttpPost("album")]
        public async Task<IActionResult> CreateAlbum([FromBody] AlbumCreateModel model)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new ApiResponse<string>(400, ResponseKeys.InvalidRequest, "Dữ liệu không hợp lệ."));
                }

                var album = _mapper.Map<Albums>(model);
                var createdAlbum = await _albumService.AddAlbumAsync(album);
                if (createdAlbum == null)
                {
                    return StatusCode(500, new ApiResponse<string>(500, ResponseKeys.ErrorSystem, "Không thể tạo album."));
                }

                return CreatedAtAction(nameof(GetAlbumById), new { id = createdAlbum.AlbumId },
                    new ApiResponse<Albums>(201, ResponseKeys.AlbumCreated, createdAlbum));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<string>(500, ResponseKeys.ErrorSystem, ex.Message));
            }
        }

        [HttpPost("{albumId}/multimedia")]
        public async Task<IActionResult> AddMultimedia(Guid albumId, [FromForm] MultimediaCreateModel model)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new ApiResponse<string>(400, ResponseKeys.InvalidRequest, "Dữ liệu không hợp lệ."));
                }

                var createdMultimediaList = new List<MultimediaDto>();

                foreach (var file in model.MediaFiles)
                {
                    MultimediaType mediaType = GetMediaType(file.FileName);
                    // Upload file lên AWS S3
                    string imgUrl = await UploadFileToAWS(file, "amzn-eventmate-media", Guid.NewGuid().ToString());

                    var multimedia = new Multimedia
                    {
                        Url = imgUrl,
                        CreatedBy = model.CreatedBy,
                        Type = mediaType,
                        AlbumId = albumId,
                        CreatedAt = DateTime.UtcNow
                    };

                    var createdMultimedia = await _albumService.AddMultimediaAsync(multimedia);
                    if (createdMultimedia == null)
                    {
                        return StatusCode(500, new ApiResponse<string>(500, ResponseKeys.ErrorSystem, "Không thể tạo multimedia."));
                    }

                    // Lấy thông tin người tạo
                    var creator = await _userService.GetUserByIdAsync(model.CreatedBy); // Giả sử bạn có một dịch vụ để lấy thông tin người dùng
                    var multimediaDto = _mapper.Map<MultimediaDto>(createdMultimedia);
                    multimediaDto.CreatorName = creator?.FullName; // Tên người tạo
                    multimediaDto.CreatorImg = creator?.Avatar; // Ảnh đại diện của người tạo
                    multimediaDto.CreatedAt = createdMultimedia.CreatedAt; // Ngày tạo

                    createdMultimediaList.Add(multimediaDto);
                }

                return CreatedAtAction(nameof(GetMultimediaById), new { id = createdMultimediaList.First().ImageId },
                    new ApiResponse<IEnumerable<MultimediaDto>>(201, "Multimedia đã được tạo thành công", createdMultimediaList));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<string>(500, ResponseKeys.ErrorSystem, ex.Message));
            }
        }

        [HttpPost("favorite")]
        public async Task<IActionResult> AddFavoriteMedia([FromBody] FavoriteMediaDTO model)
        {
            try
            {
                if (model == null || model.MultimediaId == Guid.Empty || model.UserId == Guid.Empty)
                {
                    return BadRequest(new ApiResponse<string>(400, ResponseKeys.InvalidRequest, "Dữ liệu không hợp lệ."));
                }

                // Chuyển đổi từ FavoriteMediaDTO sang FavoriteMedia
                var favoriteMedia = new FavoriteMedia
                {
                    MultimediaId = model.MultimediaId,
                    UserId = model.UserId
                };

                var addedFavoriteMedia = await _albumService.AddFavoriteMediaAsync(favoriteMedia);
                if (addedFavoriteMedia == null)
                {
                    return StatusCode(500, new ApiResponse<string>(500, ResponseKeys.ErrorSystem, "Không thể thêm vào danh sách yêu thích."));
                }

                return Ok(new ApiResponse<FavoriteMedia>(200, "Đã thêm vào danh sách yêu thích thành công.", addedFavoriteMedia));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<string>(500, ResponseKeys.ErrorSystem, ex.Message));
            }
        }

        [HttpDelete("favorite")]
        public async Task<IActionResult> RemoveFavoriteMedia(Guid userId, Guid multimediaId)
        {
            try
            {
                bool removed = await _albumService.RemoveFavoriteMediaAsync(userId, multimediaId);
                if (!removed)
                {
                    return NotFound(new ApiResponse<string>(404, "Không tìm thấy mục yêu thích để xóa."));
                }
                return Ok(new ApiResponse<string>(200, "Đã xóa thành công mục yêu thích."));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<string>(500, ResponseKeys.ErrorSystem, ex.Message));
            }
        }

        private MultimediaType GetMediaType(string fileName)
        {
            string extension = Path.GetExtension(fileName).ToLowerInvariant();
            switch (extension)
            {
                case ".jpg":
                case ".jpeg":
                case ".png":
                case ".gif":
                    return MultimediaType.Img; // Ảnh
                case ".mp4":
                case ".mov":
                case ".avi":
                    return MultimediaType.Video; // Video
                default:
                    return MultimediaType.None;
            }
        }

        [HttpGet("multimedia/{id}")]
        public async Task<IActionResult> GetMultimediaById(Guid id)
        {
            try
            {
                var multimedia = await _albumService.GetMultimediaByIdAsync(id);
                if (multimedia == null)
                {
                    return NotFound(new ApiResponse<string>(404, ResponseKeys.NotFound, "Không tìm thấy multimedia."));
                }

                var multimediaDto = _mapper.Map<MultimediaDto>(multimedia);
                return Ok(new ApiResponse<MultimediaDto>(200, ResponseKeys.AlbumCreated, multimediaDto));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<string>(500, ResponseKeys.ErrorSystem, ex.Message));
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetAlbumById(Guid id)
        {
            try
            {
                var album = await _albumService.GetAlbumByIdAsync(id);
                if (album == null)
                {
                    return NotFound(new ApiResponse<string>(404, ResponseKeys.NotFound, "Không tìm thấy album."));
                }

                var albumDto = _mapper.Map<AlbumDto>(album);
                return Ok(new ApiResponse<AlbumDto>(200, ResponseKeys.AlbumLoaded, albumDto));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<string>(500, ResponseKeys.ErrorSystem, ex.Message));
            }
        }

        [HttpGet("user/{userId}/albums")]
        public async Task<IActionResult> GetAlbumsByUser(Guid userId)
        {
            try
            {
                var albums = await _albumService.GetAlbumsByUserAsync(userId);
                
              

                var albumDtos = _mapper.Map<IEnumerable<AlbumDto>>(albums);
                return Ok(new ApiResponse<IEnumerable<AlbumDto>>(200, ResponseKeys.AlbumLoaded, albumDtos));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<string>(500, ResponseKeys.ErrorSystem, ex.Message));
            }
        }

        [HttpGet("group/{groupId}/albums")]
        public async Task<IActionResult> GetAlbumsByGroup(Guid groupId)
        {
            try
            {
                var albums = await _albumService.GetAlbumsByGroupAsync(groupId);
            

                var albumDtos = _mapper.Map<IEnumerable<AlbumDto>>(albums);
                return Ok(new ApiResponse<IEnumerable<AlbumDto>>(200, ResponseKeys.AlbumLoaded, albumDtos));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<string>(500, ResponseKeys.ErrorSystem, ex.Message));
            }
        }

        [HttpGet("favorite/count/{mediaId}")]
        public async Task<IActionResult> CountFavoriteMedia(Guid mediaId)
        {
            try
            {
                int count = await _albumService.CountFavoriteMediaByMediaIdAsync(mediaId);
                return Ok(new ApiResponse<int>(200, "Đếm số lượng thành công.", count));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<string>(500, ResponseKeys.ErrorSystem, ex.Message));
            }
        }

        [HttpGet("favorite/check")]
        public async Task<IActionResult> CheckFavoriteMedia(Guid userId, Guid multimediaId)
        {
            try
            {
                bool exists = await _albumService.CheckFavoriteMediaAsync(userId, multimediaId);
                return Ok(new ApiResponse<bool>(200, "Kiểm tra thành công.", exists));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<string>(500, ResponseKeys.ErrorSystem, ex.Message));
            }
        }

        private async Task<string> UploadFileToAWS(IFormFile file, string bucketName, string fileName)
        {
            if (file == null || file.Length == 0)
                return string.Empty;

            using (var stream = file.OpenReadStream())
            {
                // Xác định Content-Type dựa trên phần mở rộng của file
                string contentType = GetContentType(file.FileName);

                // Gọi phương thức addFile với Content-Type chính xác
                await _awsService.addFile(stream, bucketName, fileName, contentType);

                return string.Format(Constants.urlImg, bucketName, fileName);
            }
        }

        private string GetContentType(string fileName)
        {
            string extension = Path.GetExtension(fileName).ToLowerInvariant();
            switch (extension)
            {
                case ".jpg":
                case ".jpeg":
                    return "image/jpeg";
                case ".png":
                    return "image/png";
                case ".gif":
                    return "image/gif";
                case ".mp4":
                    return "video/mp4";
                case ".mov":
                    return "video/quicktime";
                case ".avi":
                    return "video/x-msvideo";
                // Thêm các loại file khác nếu cần
                default:
                    return "application/octet-stream"; // Loại mặc định cho các file không xác định
            }
        }

        [HttpDelete("{multimediaId}")]
        public async Task<IActionResult> RemoveMultimedia(Guid multimediaId)
        {
            try
            {
                // Lấy thông tin multimedia trước khi xóa
                var multimedia = await _albumService.GetMultimediaByIdAsync(multimediaId);
                if (multimedia == null)
                {
                    return NotFound(new ApiResponse<string>(404, "Không tìm thấy multimedia để xóa."));
                }
                string FileName = multimedia.Url.Split('/').Last();
                // Xóa ảnh từ AWS S3
                bool isDeletedFromS3 = await _awsService.deleteFile("amzn-eventmate-media", FileName); 
                if (!isDeletedFromS3)
                {
                    return StatusCode(500, new ApiResponse<string>(500, ResponseKeys.ErrorSystem, "Không thể xóa ảnh từ AWS S3."));
                }

                var favoriteMedias = await _albumService.GetFavoriteMediaByMultimediaIdAsync(multimediaId);
                foreach (var favoriteMedia in favoriteMedias)
                {
                    await _albumService.RemoveFavoriteMediaAsync(favoriteMedia.UserId, multimediaId);
                }

                // Xóa multimedia
                bool removed = await _albumService.RemoveMultimediaAsync(multimediaId);
                if (!removed)
                {
                    return StatusCode(500, new ApiResponse<string>(500, ResponseKeys.ErrorSystem, "Không thể xóa multimedia."));
                }

                return Ok(new ApiResponse<string>(200, "Đã xóa multimedia thành công."));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<string>(500, ResponseKeys.ErrorSystem, ex.Message));
            }
        }
    }
} 