using Microsoft.EntityFrameworkCore;
using ECommerce.Models;
namespace ECommerce.Data
{
    public class ECommerceDbContext:DbContext
    {
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Unique indexes
            modelBuilder.Entity<User>()
                .HasIndex(u => u.userName)
                .IsUnique();

            modelBuilder.Entity<User>()
                .HasIndex(u => u.email)
                .IsUnique();

            //Composite key for Wishlist
            modelBuilder.Entity<Wishlist>()
                .HasKey(w => new { w.UserId, w.ProductId });

            //Relationships
            modelBuilder.Entity<Wishlist>()
                .HasOne(w => w.User)
                .WithMany(u => u.Wishlists)
                .HasForeignKey(w => w.UserId);

            modelBuilder.Entity<Wishlist>()
                .HasOne(w => w.Product)
                .WithMany(u => u.Wishlists)
                .HasForeignKey(w => w.ProductId);

            //Composite key for Cart
            modelBuilder.Entity<Cart>()
                .HasKey(c => new { c.UserId, c.ProductId });

            //Relationships
            modelBuilder.Entity<Cart>()
                .HasOne(c => c.User)
                .WithMany(u => u.Carts)
                .HasForeignKey(c => c.UserId);

            modelBuilder.Entity<Cart>()
                .HasOne(c => c.Product)
                .WithMany(u => u.Carts)
                .HasForeignKey(c => c.ProductId);

            // Address
            modelBuilder.Entity<Address>()
                .HasOne(a => a.User)
                .WithMany(u => u.Addresses)
                .HasForeignKey(a => a.UserId);

            // Order Configuration
            modelBuilder.Entity<Order>(order =>
            {
                order.HasOne(o => o.User)
                     .WithMany(u => u.Orders) 
                     .HasForeignKey(o => o.UserId)
                     .OnDelete(DeleteBehavior.Restrict); 

                order.HasOne(o => o.Address)
                     .WithMany() 
                     .HasForeignKey(o => o.AddressId)
                     .OnDelete(DeleteBehavior.Restrict); 

                order.Property(o => o.TotalAmount)
                     .HasColumnType("decimal(18, 2)");
            });

            // OrderDetail Configuration
            modelBuilder.Entity<OrderDetail>(orderDetail =>
            {
                orderDetail.HasOne(od => od.Product)
                            .WithMany(u => u.OrderDetails)
                            .HasForeignKey(od => od.ProductId);

                orderDetail.HasOne(od => od.Order)
                            .WithMany(o => o.OrderDetails)
                            .HasForeignKey(od => od.OrderId);

                orderDetail.Property(od => od.PricePerUnit)
                            .HasColumnType("decimal(18, 2)");
            });
                

            base.OnModelCreating(modelBuilder);
        }
        public ECommerceDbContext(DbContextOptions<ECommerceDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Wishlist> Wishlists { get; set; }
        public DbSet<Cart> Carts { get; set; }
        public DbSet<Address> Addresses { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderDetail> OrderDetails { get; set; }
    }
}
