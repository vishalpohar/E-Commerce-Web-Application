// In DTOs/OrderDto.cs
using ECommerce.Models;

namespace ECommerce.DTOs
{
    // DTO for a single line item in an order
    public class OrderDetailDto
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; }
        public string ProductImageUrl { get; set; }
        public int Quantity { get; set; }
        public decimal PricePerUnit { get; set; }
        public string PaymentMethod { get; set; } = string.Empty;
    }

    // DTO for the entire order
    public class OrderDto
    {
        public int OrderId { get; set; }
        public DateTime OrderDate { get; set; }
        public decimal TotalAmount { get; set; }
        public string PaymentMethod { get; set; } = string.Empty;
        public string OrderStatus { get; set; }
        public string ShippingAddress { get; set; }
        public List<OrderDetailDto> Items { get; set; }

        // A constructor to easily map from the entity to the DTO
        public OrderDto(Order order)
        {
            OrderId = order.Id;
            OrderDate = order.OrderDate;
            TotalAmount = order.TotalAmount;
            OrderStatus = order.OrderStatus;
            PaymentMethod = order.PaymentMethod;
            ShippingAddress = $"{order.Address.AddressLine}, {order.Address.City}, {order.Address.State} - {order.Address.PinCode}";
            Items = order.OrderDetails.Select(od => new OrderDetailDto
            {
                ProductId = od.ProductId,
                ProductName = od.Product.Name,
                ProductImageUrl = od.Product.ImageUrl,
                Quantity = od.Quantity,
                PricePerUnit = od.PricePerUnit
            }).ToList();
        }
    }
}