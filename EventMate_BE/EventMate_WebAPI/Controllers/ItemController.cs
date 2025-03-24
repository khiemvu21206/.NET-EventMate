using AutoMapper;
using EventMate_Common.Common;
using EventMate_Data.Entities;
using EventMate_Service.Services;
using EventMate_WebAPI.ModelsMapping.Item;
using Microsoft.AspNetCore.Mvc;

namespace EventMate_WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ItemController : Controller
    {
        private readonly ItemService _itemService;
        private readonly IMapper _mapper;
        private readonly AwsService _awsService;
        public ItemController(ItemService itemService, IMapper mapper, AwsService awsService)
        {
            _itemService = itemService;
            _mapper = mapper;
            _awsService = awsService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllItems()
        {
            try
            {
                var items = await _itemService.GetItemsAsync();
                return Ok(new ApiResponse<IEnumerable<Item>>(200, ResponseKeys.FetchItemSuccess, items));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<string>(500, ResponseKeys.ErrorSystem, ex.Message));
            }
        }
        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetItemByUser(Guid userId)
        {
            try
            {
                var item = await _itemService.GetItemByUserAsync(userId);
                return Ok(new ApiResponse<IEnumerable<Item>>(200, ResponseKeys.LoginSuccess, item));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<string>(500, ResponseKeys.ErrorSystem, ex.Message));
            }
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetItemById(Guid id)
        {
            try
            {
                var item = await _itemService.GetItemByIdAsync(id);

                if (item == null)
                {
                    return NotFound(new ApiResponse<string>(404, ResponseKeys.NotFound, "Item not found"));
                }

                return Ok(new ApiResponse<Item>(200, ResponseKeys.FetchItemSuccess, item));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<string>(500, ResponseKeys.ErrorSystem, ex.Message));
            }
        }
        [HttpPost("purchase")]
        public async Task<IActionResult> PurchaseItem([FromBody] PurchaseItem request)
        {
            try
            {
                var orderId = await _itemService.PurchaseItemAsync(request.BuyerId, request.ItemId, request.Quantity);

                if (orderId == null)
                {
                    return BadRequest(new ApiResponse<string>(400, "PurchaseFailed", "Item is out of stock or unavailable"));
                }

                return Ok(new ApiResponse<object>(200, "PurchaseSuccess", new { orderId = orderId }));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<string>(500, "ErrorSystem", ex.Message));
            }
        }
    }
}
