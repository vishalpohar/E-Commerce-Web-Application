using ECommerce.Data;
using ECommerce.Models;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors("allowCors")]
    public class CartsController : ControllerBase
    {
        public ECommerceDbContext _context;
        public CartsController(ECommerceDbContext context)
        {
            _context = context;
        }

        [HttpGet("{userId}")]
        public async Task<ActionResult> GetCartsByUser(int userId)
        {
            var Carts = await _context.Carts
                .Where(c => c.UserId == userId)
                .Include(c => c.Product)
                .Select(c => new
                {
                    c.ProductId,
                    ProductName = c.Product.Name,
                    ProductImage = c.Product.ImageUrl,
                    ProductPrice = c.Product.Price,
                    ProductStock = c.Product.Stock
                })
                .ToListAsync();
            return Ok(Carts);
        }

        [HttpPost]
        public async Task<ActionResult> AddToCart([FromBody] Cart newCartEntry)
        {
            if(!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(c => c.Errors)
                    .Select(e => e.ErrorMessage)
                    .ToList();
                return BadRequest(new { message = "Invalid data", errors });
            }

            _context.Carts.Add(newCartEntry);
            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpDelete]
        public async Task<ActionResult> DeleteCart(int userId, int productId)
        {
            var entry = await _context.Carts.FirstOrDefaultAsync(w => w.UserId == userId && w.ProductId == productId);
            if (entry == null)
                return NotFound(new { message = "Item not found in cart!"});

            _context.Carts.Remove(entry);
            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpDelete("clearcart/{userId}")]
        public async Task<ActionResult> ClearCart(int userId)
        {
            var cartItems = await _context.Carts
                .Where(w => w.UserId == userId)
                .ToListAsync();
            if (cartItems == null || !cartItems.Any())
                return Ok(new { message = "Cart is already empty." });

            _context.Carts.RemoveRange(cartItems);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Cart cleared successfully." });
        }

    }
}
