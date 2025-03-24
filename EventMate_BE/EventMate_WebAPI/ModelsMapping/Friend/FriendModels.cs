namespace EventMate_WebAPI.ModelsMapping.Friend
{
  

    public class FriendListModel
    {
        public Guid Id { get; set; }
        public Guid FrinedId { get; set; }
        public string Status { get; set; }
        public DateTime CreatedAt { get; set; }
    }

   
} 