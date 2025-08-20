namespace ECommerce.DTOs
{
    public class OrderResponseDto
    {
        public int OrderId { get; set; }
        public int ProductId { get; set; }
        public string ProductName { get; set; } = "";
        public string ProductImageUrl { get; set; } = "";
        public decimal Price { get; set; }
        public string PaymentMethod { get; set; } = "";
        public DateTime OrderPlaced { get; set; }
        public string? ShippingAddress { get; set; }
    }
}
