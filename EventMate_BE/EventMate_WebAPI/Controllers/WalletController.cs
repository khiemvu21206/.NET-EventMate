using Eventmate_Common.Helpers;
using EventMate_Common.Common;
using EventMate_Data.Entities;
using EventMate_Service.Services;
using EventMate_WebAPI.ModelsMapping.Authentication;
using EventMate_WebAPI.ModelsMapping.Common;
using EventMate_WebAPI.ModelsMapping.Wallet;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace EventMate_WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WalletController : ControllerBase
    {
        private readonly WalletService _walletService;
        public WalletController(WalletService walletService)
        {
            _walletService = walletService;
        }

        [HttpGet("wallet-info")]
        public async Task<IActionResult> GetWalletInfo()
        {
            try
            {
                string? token = HttpContext.Request.Headers["Authorization"].FirstOrDefault()?.Replace("Bearer ", "");
                if (string.IsNullOrEmpty(token))
                {
                    return Unauthorized(new ApiResponse<string>(401, ResponseKeys.BadRequest, "Token is required"));
                }

                var userId = Helper.GetUserFromToken(token);
                if (!userId.HasValue)
                {
                    return Unauthorized(new ApiResponse<string>(401, ResponseKeys.BadRequest, "Invalid token"));
                }

                var (wallet, transactions) = await _walletService.GetWalletInfo(userId.Value);

                if (wallet == null)
                    return NotFound(new ApiResponse<string>(404, ResponseKeys.NotFound, "Wallet not found"));

                var data = new
                {
                    walletId = wallet.WalletId,
                    balance = wallet.Balance,
                    transactions = transactions.OrderByDescending(t => t.CreatedAt)
                        .Select(t => new {
                            t.TransactionId,
                            t.Type,
                            t.Method,
                            t.Amount,
                            t.Status,
                            t.CreatedAt
                        })
                        .ToList()
                };

                return Ok(new ApiResponse<object>(200, ResponseKeys.FetchEventSuccess, data));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<string>(500, ResponseKeys.ErrorSystem, ex.Message));
            }
        }

        [HttpPost("deposit")]
        public async Task<IActionResult> Deposit([FromBody] DepositModel model)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(new ApiResponse<object>(400, ResponseKeys.InvalidRequest, ModelState));

                string? token = HttpContext.Request.Headers["Authorization"].FirstOrDefault()?.Replace("Bearer ", "");
                if (string.IsNullOrEmpty(token))
                {
                    return Unauthorized(new ApiResponse<string>(401, ResponseKeys.BadRequest, "Token is required"));
                }

                var userId = Helper.GetUserFromToken(token);
                if (!userId.HasValue)
                {
                    return Unauthorized(new ApiResponse<string>(401, ResponseKeys.BadRequest, "Invalid token"));
                }

                var success = await _walletService.DepositAsync(userId.Value, model.Amount, model.Method);
                if (!success)
                    return BadRequest(new ApiResponse<string>(400, ResponseKeys.BadRequest, "Deposit failed"));

                return Ok(new ApiResponse<string>(200, ResponseKeys.FetchEventSuccess, "Deposit successful"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<string>(500, ResponseKeys.ErrorSystem, ex.Message));
            }
        }

        [HttpPost("withdraw")]
        public async Task<IActionResult> Withdraw([FromBody] WithdrawModel model)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(new ApiResponse<object>(400, ResponseKeys.InvalidRequest, ModelState));

                string? token = HttpContext.Request.Headers["Authorization"].FirstOrDefault()?.Replace("Bearer ", "");
                if (string.IsNullOrEmpty(token))
                {
                    return Unauthorized(new ApiResponse<string>(401, ResponseKeys.BadRequest, "Token is required"));
                }

                var userId = Helper.GetUserFromToken(token);
                if (!userId.HasValue)
                {
                    return Unauthorized(new ApiResponse<string>(401, ResponseKeys.BadRequest, "Invalid token"));
                }

                var success = await _walletService.WithdrawAsync(userId.Value, model.Amount, model.Method);
                if (!success)
                    return BadRequest(new ApiResponse<string>(400, ResponseKeys.BadRequest, "Withdrawal failed. Insufficient balance or invalid wallet."));

                return Ok(new ApiResponse<string>(200, ResponseKeys.FetchEventSuccess, "Withdrawal successful"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<string>(500, ResponseKeys.ErrorSystem, ex.Message));
            }
        }

        [HttpPost("transactions_list")]
        public async Task<IActionResult> GetTransactions(ListRequestModel request)
        {
            if (request == null)
                return BadRequest(new ApiResponse<object>(400, ResponseKeys.InvalidRequest, "Invalid request data"));

            var token = HttpContext.Request.Headers.Authorization.ToString().Replace("Bearer ", "");
            var userId = Helper.GetUserFromToken(token);
            if (!userId.HasValue)
            {
                return Unauthorized();
            }

            var transactions = await _walletService.GetTransaction(userId.Value);


            if (transactions == null || !transactions.Any())
                return NotFound(new ApiResponse<object>(404, ResponseKeys.NotFound, "Data not found"));

           
            var query = transactions.AsQueryable();

            if (!string.IsNullOrWhiteSpace(request.KeySearch))
            {
                query = query.ApplySearch(request.KeySearch, t => t.Method, t => t.Type);
            }
            if (request.Filters != null)
            {
                query = query.ApplyFilters(request.Filters);
            }
            if (!string.IsNullOrEmpty(request?.SortBy))
            {
                query = query.ApplySorting(request.SortBy, request.Ascending ?? true);
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

        [HttpPost("process-payment")]
        public async Task<IActionResult> ProcessPayment([FromBody] ProcessPaymentModel model)
        {
            try
            {
                // Kiểm tra token
                string? token = HttpContext.Request.Headers["Authorization"].FirstOrDefault()?.Replace("Bearer ", "");
                if (string.IsNullOrEmpty(token))
                {
                    return Unauthorized(new ApiResponse<string>(401, ResponseKeys.BadRequest, "Token is required"));
                }

                var userId = Helper.GetUserFromToken(token);
                if (!userId.HasValue)
                {
                    return Unauthorized(new ApiResponse<string>(401, ResponseKeys.BadRequest, "Invalid token"));
                }

                // Xử lý payment
                var success = await _walletService.ProcessPaymentAsync(userId.Value, model.Amount);
                if (!success)
                {
                    return BadRequest(new ApiResponse<string>(400, ResponseKeys.BadRequest, "Payment failed: Insufficient balance or wallet not found"));
                }

                return Ok(new ApiResponse<string>(200, ResponseKeys.FetchEventSuccess, "Payment processed successfully"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<string>(500, ResponseKeys.ErrorSystem, ex.Message));
            }
        }
    }
}
