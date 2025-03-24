using Amazon.S3;
using Amazon.S3.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EventMate_Service.Services
{
    public class AwsService
    {
        private readonly IConfiguration _configuration;
        private IAmazonS3 _s3Client;

        public AwsService(IConfiguration configuration)
        {
            _configuration = configuration;
            InitializeS3Client();
        }

        private void InitializeS3Client()
        {
            var accessKey = _configuration["AWS:AccessKey"];
            var secretKey = _configuration["AWS:SecretKey"];
            _s3Client = new AmazonS3Client(accessKey, secretKey, Amazon.RegionEndpoint.APSoutheast2);
        }

        public async Task<string> addFile(IFormFile file, string bucketName)
        {
            try
            {
                var bucketExists = await Amazon.S3.Util.AmazonS3Util.DoesS3BucketExistV2Async(_s3Client, bucketName);
                if (!bucketExists) return $"Bucket {bucketName} does not exist.";
                var request = new PutObjectRequest()
                {
                    BucketName = bucketName,
                    Key = file.FileName,
                    InputStream = file.OpenReadStream()
                };
                request.Metadata.Add("Content-Type", file.ContentType);
                await _s3Client.PutObjectAsync(request);
                return "success";
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }

        public async Task<string> addFile(Stream fileStream, string bucketName, string fileName)
        {
            try
            {
                var bucketExists = await Amazon.S3.Util.AmazonS3Util.DoesS3BucketExistV2Async(_s3Client, bucketName);
                if (!bucketExists) return $"Bucket {bucketName} does not exist.";

                var request = new PutObjectRequest()
                {
                    BucketName = bucketName,
                    Key = fileName,
                    InputStream = fileStream
                };

                request.Metadata.Add("Content-Type", "image/jpeg");

                await _s3Client.PutObjectAsync(request);
                return "success";
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }

        public async Task<string> addFile(Stream fileStream, string bucketName, string fileName, string contentType)
        {
            try
            {
                var bucketExists = await Amazon.S3.Util.AmazonS3Util.DoesS3BucketExistV2Async(_s3Client, bucketName);
                if (!bucketExists) return $"Bucket {bucketName} does not exist.";

                var request = new PutObjectRequest()
                {
                    BucketName = bucketName,
                    Key = fileName,
                    InputStream = fileStream,
                    ContentType = contentType
                };

                await _s3Client.PutObjectAsync(request);
                return "success";
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }

        public async Task<bool> deleteFile(string bucketName, string fileName)
        {
            try
            {
                var deleteRequest = new DeleteObjectRequest
                {
                    BucketName = bucketName,
                    Key = fileName
                };

                await _s3Client.DeleteObjectAsync(deleteRequest);
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error deleting file: {ex.Message}");
                return false;
            }
        }
    }
}
