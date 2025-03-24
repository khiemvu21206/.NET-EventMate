using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.IdentityModel.Tokens.Jwt;
using EventMate_Common.Common;
using FluentAssertions;

namespace EventMate_UnitTest.Commons
{
    public class HelperTest
    {
        [Fact]
        public void GetEmailFromToken_ValidToken_ReturnsEmail()
        {
            // Arrange
            string token = "eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJ2aW5obnFoZTE2MTYzMEBmcHQuZWR1LnYiLCJ1c2VySWQiOiJlZDI0YWI0Ny01NGJiLTQ4YWQtYzhhYS0wOGRkNjY0Y2U0MzMiLCJ1c2VybmFtZSI6InN0cmluZyIsImp0aSI6Ijk1ZGVlMmY5LWFjNTYtNGIxMS1hNDdiLTAyZGFlODhlMzZhNiIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlVzZXIiLCJleHAiOjE3NDQ5MTU0NTksImlzcyI6Imh0dHBzOi8vbG9jYWxob3N0OjcxMjEiLCJhdWQiOiJodHRwczovL2xvY2FsaG9zdDo3MTIxIn0.f4jswIs_FQWSlzv-hZq2FpoWvmrkR6gInd__HOWir5I";

            string expectedEmail = "vinhnqhe161630@fpt.edu.vn";

            // Act
            string actualEmail = Helper.GetEmailFromToken(token);

            // Assert
            actualEmail.Should().Be(expectedEmail);
        }

        [Fact]
        public void GetUserFromToken_ValidToken_ReturnsUserId()
        {
            // Arrange
            string token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJlZDI0YWI0Ny01NGJiLTQ4YWQtYzhhYS0wOGRkNjY0Y2U0MzMifQ.dummySignature";
            Guid expectedUserId = Guid.Parse("ed24ab47-54bb-48ad-c8aa-08dd664ce433");

            // Act
            Guid? actualUserId = Helper.GetUserFromToken(token);

            // Assert
            actualUserId.Should().Be(expectedUserId);
        }

        [Fact]
        public void GetRoleFromToken_ValidToken_ReturnsRole()
        {
            // Arrange
            string token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiVXNlciJ9.dummySignature";
            string expectedRole = "User";

            // Act
            string actualRole = Helper.GetRoleFromToken(token);

            // Assert
            actualRole.Should().Be(expectedRole);
        }


    }
}
