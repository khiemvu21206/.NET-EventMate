using Eventmate_Data.IRepositories;
using Eventmate_Data.Repositories;
using Eventmate_Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using EventMate_Common.Status;
using EventMate_Data.Entities;

namespace EventMate_Service.Services
{
    public class WalletService
    {
        private readonly IWalletRepository _walletRepository;
        public WalletService(IWalletRepository walletRepository) {
            _walletRepository = walletRepository;
        }
        public async Task<List<EventMate_Data.Entities.Transactions>> GetTransaction(Guid userId)
        {
            var transaction = await _walletRepository.GetTransactions(userId);
            return transaction;
        }

        public async Task<(EventMate_Data.Entities.Wallet wallet, List<EventMate_Data.Entities.Transactions> transactions)> GetWalletInfo(Guid userId)
        {
            var wallet = await _walletRepository.GetWalletByUserId(userId);
            var transactions = await _walletRepository.GetTransactions(userId);
            return (wallet, transactions);
        }

        public async Task<bool> DepositAsync(Guid userId, decimal amount, string method)
        {
            var wallet = await _walletRepository.GetWalletByUserId(userId);
            if (wallet == null) return false;

            // Create transaction record
            var transaction = new EventMate_Data.Entities.Transactions
            {
                TransactionId = Guid.NewGuid(),
                UserId = userId,
                WalletId = wallet.WalletId,
                Amount = amount,
                Type = "Deposit",
                Method = method,
                Status = (System.Transactions.TransactionStatus)TransactionStatus.Completed,
                CreatedAt = DateTime.UtcNow
            };

            await _walletRepository.CreateTransaction(transaction);
            await _walletRepository.UpdateWalletBalance(wallet.WalletId, amount);

            return true;
        }

        public async Task<bool> WithdrawAsync(Guid userId, decimal amount, string method)
        {
            var wallet = await _walletRepository.GetWalletByUserId(userId);
            if (wallet == null || wallet.Balance < amount) return false;

            // Create transaction record
            var transaction = new Transactions
            {
                TransactionId = Guid.NewGuid(),
                UserId = userId,
                WalletId = wallet.WalletId,
                Amount = -amount, // Negative amount for withdrawal
                Type = "Withdraw",
                Method = method,
                Status = (System.Transactions.TransactionStatus)TransactionStatus.Completed,
                CreatedAt = DateTime.UtcNow
            };

            await _walletRepository.CreateTransaction(transaction);
            await _walletRepository.UpdateWalletBalance(wallet.WalletId, -amount);

            return true;
        }

        public async Task<bool> ProcessPaymentAsync(Guid buyerId, decimal amount)
        {
            var wallet = await _walletRepository.GetWalletByUserId(buyerId);
            if (wallet == null || wallet.Balance < amount)
            {
                return false; // Không đủ tiền hoặc không tìm thấy ví
            }

            // Tạo transaction record
            var transaction = new Transactions
            {
                TransactionId = Guid.NewGuid(),
                UserId = buyerId,
                WalletId = wallet.WalletId,
                Amount = -amount, // Số tiền âm vì đây là thanh toán
                Type = "Payment",
                Method = "Wallet",
                Status = (System.Transactions.TransactionStatus)TransactionStatus.Completed,
                CreatedAt = DateTime.UtcNow
            };

            await _walletRepository.CreateTransaction(transaction);
            await _walletRepository.UpdateWalletBalance(wallet.WalletId, -amount);

            return true;
        }
    }
}
