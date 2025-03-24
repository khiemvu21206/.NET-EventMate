using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace EventMate_Common.Common
{
    public class ApiResponse<T>(int status, string? key = null, T? data = default)
    {
        public int Status { get; set; } = status;
        public string Key { get; set; } = key;
        public T? Data { get; set; } = data;
        public long Timestamp { get; set; } = DateTimeOffset.Now.ToUnixTimeSeconds();
    }
}
