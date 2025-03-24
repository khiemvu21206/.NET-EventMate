using MailKit.Security;
using Microsoft.Extensions.Configuration;
using MimeKit.Text;
using MimeKit;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EventMate_Service.Services
{
    public class EmailService
    {
        private readonly IConfiguration _config;
        public EmailService(IConfiguration config)
        {
            _config = config;
        }
        public async Task SendEmail(string to, string subject,string body)
        {
            var email = new MimeKit.MimeMessage();
            email.From.Add(MailboxAddress.Parse(_config["EmailSettings:Email"]));
            email.To.Add(MailboxAddress.Parse(to));
            email.Subject = subject;
            email.Body = new TextPart(TextFormat.Html)
            {
                Text = body
            };
            using var smtp = new MailKit.Net.Smtp.SmtpClient();
            smtp.Connect(_config["EmailSettings:Host"], 587, SecureSocketOptions.StartTls);
            smtp.Authenticate(_config["EmailSettings:Email"], _config["EmailSettings:Password"]);
            smtp.Send(email);
            smtp.Disconnect(true);
        }
       
          
        
    }
}
