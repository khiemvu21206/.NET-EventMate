using EventMate_Service.Service.BackgroundServices;
using EventMate_Service.Services;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EventMate_Service.ScheduleTask
{
    public class OTPTask : ScheduledProcessor
    {
        public OTPTask(IServiceScopeFactory serviceScopeFactory) : base(serviceScopeFactory)
        {
            
        }
        protected override string Schedule => "0 * * * *"; // Chạy mỗi phút

        public override async Task ProcessInScope(IServiceProvider serviceProvider)
        {
            var authService = serviceProvider.GetRequiredService<AuthService>();

            await authService.RemoveOTPExpired();
          
        }

    }
}
