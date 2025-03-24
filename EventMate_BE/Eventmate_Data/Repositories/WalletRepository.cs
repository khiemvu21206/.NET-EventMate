using EventMate.Data;
using Eventmate_Common.Helpers;
using Eventmate_Data.IRepositories;
using Eventmate_Data.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Eventmate_Data.Repositories
{
    public class WalletRepository: IWalletRepository
    {
        private readonly DataContext _context;
        public WalletRepository(DataContext context)
        {
            _context = context;
           
        }
        public async Task<List<EventMate_Data.Entities.Transactions>> GetTransactions(Guid userId)
        {
            return await _context.Transactions.Where(t => t.UserId == userId).ToListAsync();
        }

        public async Task<EventMate_Data.Entities.Wallet> GetWalletByUserId(Guid userId)
        {
            return await _context.Wallets.FirstOrDefaultAsync(w => w.UserId == userId);
        }

        public async Task<EventMate_Data.Entities.Transactions> CreateTransaction(EventMate_Data.Entities.Transactions transaction)
        {
            await _context.Transactions.AddAsync(transaction);
            await _context.SaveChangesAsync();
            return transaction;
        }

        public async Task<EventMate_Data.Entities.Wallet> UpdateWalletBalance(Guid walletId, decimal amount)
        {
            var wallet = await _context.Wallets.FindAsync(walletId);
            if (wallet != null)
            {
                wallet.Balance += amount;
                await _context.SaveChangesAsync();
            }
            return wallet;
        }
    }
}
