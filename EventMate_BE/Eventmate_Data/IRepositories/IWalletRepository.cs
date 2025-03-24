using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Transactions;
using EventMate_Data.Entities;

namespace Eventmate_Data.IRepositories
{
    public interface IWalletRepository
    {
        public Task<List<EventMate_Data.Entities.Transactions>> GetTransactions(Guid userId);
        public Task<Wallet> GetWalletByUserId(Guid userId);
        public Task<Transactions> CreateTransaction(Transactions transaction);
        public Task<Wallet> UpdateWalletBalance(Guid walletId, decimal amount);
        }
}
