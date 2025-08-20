using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ECommerce.Models;
using ECommerce.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Cors;

namespace ECommerce.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors("allowCors")]
    public class WishlistsController : ControllerBase
    {
        private ECommerceDbContext _context;
        public WishlistsController(ECommerceDbContext context)
        {
            _context = context;
        }

        [HttpGet("{userId}")]
        public async Task<ActionResult> GetWishlistByUser(int userId)
        {
            var wishlist = await _context.Wishlists
                .Where(w => w.UserId == userId)
                .Include(w => w.Product)
                .Select(w => new
                {
                    w.ProductId,
                    ProductName = w.Product.Name,
                    ProductImage = w.Product.ImageUrl,
                    ProductPrice = w.Product.Price
                })
                .ToListAsync();
            return Ok(wishlist);
        }

        [HttpPost]
        public async Task<ActionResult> SaveWishlist([FromBody] Wishlist wishlist)
        {
            if(!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(e => e.Errors)
                    .Select(e => e.ErrorMessage).ToList();
                return BadRequest(new { message = "Invalid data", errors });
            }

            _context.Wishlists.Add(wishlist);
            await _context.SaveChangesAsync();
            return Ok(wishlist);
        }

        [HttpDelete]
        public async Task<ActionResult> DeleteWishlist(int userId, int productId)
        {
            var entry = await _context.Wishlists.FirstOrDefaultAsync(w => w.UserId == userId && w.ProductId == productId);
            if (entry == null)
                return NotFound();

            _context.Wishlists.Remove(entry);
            await _context.SaveChangesAsync();
            return Ok();
        }
    }
}
