namespace ECommerce.Models
{
    public class User
    {
        public int Id { get; set; }
        public string userName { get; set; } = null!;
        public string email { get; set; } = null!;

        public ICollection<Wishlist> Wishlists { get; set; } = new List<Wishlist>();
        public ICollection<Cart> Carts { get; set; } = new List<Cart>();
        public ICollection<Address> Addresses { get; set; } = new List<Address>();
        public ICollection<Order> Orders { get; set; } = new List<Order>();
    }
}
