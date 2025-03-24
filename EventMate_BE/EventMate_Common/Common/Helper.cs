using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.IdentityModel.Tokens.Jwt;

namespace EventMate_Common.Common
{
    public static class Helper
    {
        public static string GetEmailFromToken(string token)
        {
            var tokenHandler = new JwtSecurityTokenHandler();

            if (tokenHandler.ReadToken(token) is not JwtSecurityToken jwtToken) return string.Empty;
            var emailClaim = jwtToken.Claims.FirstOrDefault(c => c.Type == "email");
            if (emailClaim != null)
            {
                return emailClaim.Value;
            }

            return string.Empty;
        }

        public static Guid? GetUserFromToken(string token)
        {
            var tokenHandler = new JwtSecurityTokenHandler();

            if (tokenHandler.ReadToken(token) is not JwtSecurityToken jwtToken)
                return null;

            var userIdClaim = jwtToken.Claims.FirstOrDefault(c => c.Type == "userId");

            if (userIdClaim != null && Guid.TryParse(userIdClaim.Value, out Guid userId))
            {
                return userId;
            }

            return null;
        }

        public static string GetRoleFromToken(string token)
        {
            var tokenHandler = new JwtSecurityTokenHandler();

            if (tokenHandler.ReadToken(token) is not JwtSecurityToken jwtToken)
                return string.Empty;

            var roleClaim = jwtToken.Claims.FirstOrDefault(c => c.Type == "role");

            if (roleClaim != null)
            {
                return roleClaim.Value;
            }

            return string.Empty;
        }
    }
}
