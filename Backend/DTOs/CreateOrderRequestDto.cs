namespace ECommerce.DTOs
{
    public class CreateOrderRequestDto
    {
        public int UserId { get; set; }
        public int AddressId { get; set; }
        public string PaymentMethod { get; set; } = string.Empty;
        public List<CartItemDto> Items { get; set; } 
    }

    public class CartItemDto
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
    }
}
