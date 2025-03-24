using EventMate_Common.Common;
using EventMate_Common.DTOs;
using EventMate_Common.Status;
using EventMate_Service.Services;
using Microsoft.AspNetCore.Mvc;

namespace EventMate_WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly OrderService _orderService;

        public OrderController(OrderService orderService)
        {
            _orderService = orderService;
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetUserOrders([FromRoute] Guid userId, [FromQuery] OrderFilterRequest request)
        {
            try
            {
                var (orders, totalCount) = await _orderService.GetOrdersByUserIdAsync(userId, request.CurrentPage, request.PageSize);
                
                var response = new
                {
                    totalCount,
                    currentPage = request.CurrentPage,
                    data = orders
                };

                return Ok(new ApiResponse<object>(200, "Fetch orders successfully", response));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<string>(500, "Error occurred", ex.Message));
            }
        }

        [HttpGet("seller/{sellerId}")]
        public async Task<IActionResult> GetSellerOrders([FromRoute] Guid sellerId, [FromQuery] OrderFilterRequest request)
        {
            try
            {
                Console.WriteLine($"Fetching orders for seller: {sellerId}");
                Console.WriteLine($"Request parameters - CurrentPage: {request.CurrentPage}, PageSize: {request.PageSize}");
                
                var (orders, totalCount) = await _orderService.GetOrdersBySellerIdAsync(sellerId, request.CurrentPage, request.PageSize);
                
                Console.WriteLine($"Retrieved {orders?.Count ?? 0} orders, total count: {totalCount}");
                
                var response = new
                {
                    totalCount,
                    currentPage = request.CurrentPage,
                    data = orders
                };

                return Ok(new ApiResponse<object>(200, "Fetch orders successfully", response));
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetSellerOrders: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                return StatusCode(500, new ApiResponse<string>(500, "Error occurred", ex.Message));
            }
        }

        [HttpGet("{orderId}")]
        public async Task<IActionResult> GetOrderById(Guid orderId)
        {
            try
            {
                var order = await _orderService.GetOrderByIdAsync(orderId);
                if (order == null)
                    return NotFound(new ApiResponse<string>(404, "Order not found", null));

                return Ok(new ApiResponse<OrderDTO>(200, "Fetch order successfully", order));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<string>(500, "Error occurred", ex.Message));
            }
        }

        [HttpPut("status")]
        public async Task<IActionResult> UpdateOrderStatus([FromBody] UpdateOrderStatusRequest request)
        {
            try
            {
                // Kiểm tra token
                string? token = HttpContext.Request.Headers["Authorization"].FirstOrDefault()?.Replace("Bearer ", "");
                if (string.IsNullOrEmpty(token))
                {
                    return Unauthorized(new ApiResponse<string>(401, "Unauthorized", "Token is required"));
                }

                var updatedOrder = await _orderService.UpdateOrderStatusAsync(request.OrderId, request.NewStatus);
                
                // Nếu order được accepted, trả về thông tin chi tiết hơn
                if (request.NewStatus == OrderStatus.Accepted)
                {
                    var response = new
                    {
                        orderId = updatedOrder.OrderId,
                        status = updatedOrder.Status,
                        totalPrice = updatedOrder.TotalPrice,
                        message = "Order has been accepted and payment processed successfully"
                    };
                    return Ok(new ApiResponse<object>(200, "OrderAccepted", response));
                }

                return Ok(new ApiResponse<OrderDTO>(200, "Update order status successfully", updatedOrder));
            }
            catch (Exception ex)
            {
                // Xử lý các lỗi cụ thể
                if (ex.Message.Contains("Payment failed"))
                {
                    return BadRequest(new ApiResponse<string>(400, "PaymentFailed", ex.Message));
                }
                if (ex.Message.Contains("Item quantity not enough"))
                {
                    return BadRequest(new ApiResponse<string>(400, "QuantityNotEnough", ex.Message));
                }
                return StatusCode(500, new ApiResponse<string>(500, "Error occurred", ex.Message));
            }
        }
    }
}
