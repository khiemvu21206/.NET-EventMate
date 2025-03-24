using Microsoft.AspNetCore.Mvc;

namespace EventMate_WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MapController : Controller
    {
        private static readonly HttpClient httpClient = new HttpClient();
        private const string ApiKey = "AIzaSyAhuvkbu8iQU3vptKQSbaHQNlTJv0ndTVw"; // Replace with your actual API Key  

        [HttpGet("hotels")]
        public async Task<IActionResult> GetHotels([FromQuery] double lat, [FromQuery] double lng)
        {
            var url = $"https://maps.googleapis.com/maps/api/place/nearbysearch/json?location={lat},{lng}&radius=1500&type=lodging&key={ApiKey}";
            var response = await httpClient.GetAsync(url);

            if (response.IsSuccessStatusCode)
            {
                var data = await response.Content.ReadAsStringAsync();
                return Ok(data);
            }

            return StatusCode((int)response.StatusCode, await response.Content.ReadAsStringAsync()); // Return the error from Google API  
        }

        [HttpGet("restaurants")]
        public async Task<IActionResult> GetRestaurants([FromQuery] double lat, [FromQuery] double lng)
        {
            var url = $"https://maps.googleapis.com/maps/api/place/nearbysearch/json?location={lat},{lng}&radius=1500&type=restaurant&key={ApiKey}";
            var response = await httpClient.GetAsync(url);

            if (response.IsSuccessStatusCode)
            {
                var data = await response.Content.ReadAsStringAsync();
                return Ok(data);
            }

            return StatusCode((int)response.StatusCode, await response.Content.ReadAsStringAsync()); // Return the error from Google API  
        }
    }
}
