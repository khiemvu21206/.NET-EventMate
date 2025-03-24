namespace EventMate_WebAPI.ModelsMapping.Group
{
    public class GroupFilterRequest
    {
        public string SearchTerm { get; set; } // For searching  
        public string SortBy { get; set; } // For sorting  
        public bool Ascending { get; set; } // For sort order  
        public int CurrentPage { get; set; } // Current page for pagination  
        public int PageSize { get; set; } // Number of items per page  
    }
}
