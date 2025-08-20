using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECommerce.Models
{
    public class Order
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public int UserId { get; set; }
        [Required]
        public int AddressId { get; set; }
        [Required]
        public DateTime OrderDate { get; set; }
        [Required]
        [Column(TypeName = "decimal(18, 2)")]
        public decimal TotalAmount { get; set; }
        [Required]
        [StringLength(50)]
        public string OrderStatus { get; set; } = string.Empty;

        public string PaymentMethod { get; set; } = string.Empty;

        [ForeignKey("UserId")]
        public User? User { get; set; }
        [ForeignKey("AddressId")]
        public Address? Address { get; set; }

        // This is the collection property
        public ICollection<OrderDetail> OrderDetails { get; set; }

        // The constructor ensures the collection is ready to be used immediately
        public Order()
        {
            OrderDetails = new HashSet<OrderDetail>();
        }
    }
}
