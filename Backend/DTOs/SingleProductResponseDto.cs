namespace ECommerce.DTOs
{
    public class SingleProductResponseDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = "";
        public decimal Price { get; set; }
        public string Description { get; set; } = "";
        public string ImageUrl { get; set; } = "";
    }
}
