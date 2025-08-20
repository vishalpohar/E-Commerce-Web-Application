using System.ComponentModel.DataAnnotations.Schema;

namespace ECommerce.Models
{
    public class Address
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        [ForeignKey ("UserId")]
        public User? User { get; set; }
        public string FullName { get; set; } = "";
        public string Phone { get; set; } = "";
        public string PinCode { get; set; } = "";
        public string State { get; set; } = "";
        public string District { get; set; } = "";
        public string City { get; set; } = "";
        public string AddressLine { get; set; } = "";

    }
}
