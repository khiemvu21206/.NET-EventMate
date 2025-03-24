using Eventmate_Common.Helpers;
using FluentAssertions;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace EventMate_UnitTest.Commons
{
    public class AESHelperTests
    {
        private readonly AESHelper _aesHelper;

        public AESHelperTests()
        {
            var inMemorySettings = new Dictionary<string, string>
        {
            {"AES:Key", "12345678901234567890123456789012"},
            {"AES:IV", "1234567890123456"}
        };

            IConfiguration configuration = new ConfigurationBuilder()
                .AddInMemoryCollection(inMemorySettings)
                .Build();

            _aesHelper = new AESHelper(configuration);
        }

        [Fact]
        public void EncryptDecrypt_ValidInput_ReturnsOriginalText()
        {
            // Arrange
            string originalText = "Hello, AES Encryption!";

            // Act
            string encryptedText = _aesHelper.Encrypt(originalText);
            string decryptedText = _aesHelper.Decrypt(encryptedText);

            // Assert
            decryptedText.Should().Be(originalText);
        }

        [Fact]
        public void Encrypt_ValidInput_ReturnsEncryptedString()
        {
            // Arrange
            string originalText = "Test encryption";

            // Act
            string encryptedText = _aesHelper.Encrypt(originalText);

            // Assert
            encryptedText.Should().NotBeNullOrEmpty();
            encryptedText.Should().NotBe(originalText);
        }

        [Fact]
        public void Decrypt_InvalidCipherText_ThrowsException()
        {
            // Arrange
            string invalidCipherText = "InvalidCipherText";

            // Act
            Action act = () => _aesHelper.Decrypt(invalidCipherText);

            // Assert
            act.Should().Throw<CryptographicException>();
        }
    }
}
