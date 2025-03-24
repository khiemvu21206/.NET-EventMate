namespace EventMate_WebAPI.ModelsMapping.Item
{
    public class PurchaseItem
    {
        public Guid BuyerId { get; set; }
        public Guid ItemId { get; set; }
        public int Quantity { get; set; }
    }
}
