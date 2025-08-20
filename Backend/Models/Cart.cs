using System.ComponentModel.DataAnnotations.Schema;

namespace ECommerce.Models
{
    public class Cart
    {
        public int UserId { get; set; }
        [ForeignKey("UserId")]
        public User? User { get; set; }
        public int ProductId { get; set; }
        [ForeignKey("ProductId")]
        public Product? Product { get; set; }
    }
}
