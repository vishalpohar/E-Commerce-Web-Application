using ECommerce.Data;
using ECommerce.Models;
using ECommerce.DTOs;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors("allowCors")]
    public class ProductsController : ControllerBase
    {
        private readonly ECommerceDbContext _context;

        public ProductsController(ECommerceDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
        {
            return await _context.Products.AsNoTracking().ToListAsync();
        }

        [HttpGet("{productId}")]
        public async Task<ActionResult<SingleProductResponseDto>> GetProduct(int productId)
        {
            var productDetails = await _context.Products
                                                .AsNoTracking()
                                                .Where(p => p.Id == productId)
                                                .Select(p => new SingleProductResponseDto
                                                {
                                                    Id = p.Id,
                                                    Name = p.Name,
                                                    Price = p.Price,
                                                    Description = p.Description,
                                                    ImageUrl = p.ImageUrl
                                                })
                                                .FirstOrDefaultAsync();
            if (productDetails == null)
            {
                return NotFound(new { message = "sorry, Product not found!" });
            }
            return Ok(productDetails);
        }

        [HttpGet("search")]
        public async Task<ActionResult<Product>> GetSearchedProducts(string keywords, int loadClick, int loadSize)
        {
            if (string.IsNullOrWhiteSpace(keywords))
            {
                return BadRequest(new { message = "Seach keywords cannot be empty." });
            }
            keywords = keywords.Trim().ToLower();

            var query = _context.Products
                .AsNoTracking()
                .Where(p => p.Name.ToLower().Contains(keywords) ||
                            p.Category.ToLower().Contains(keywords));

            var totalCount = await query.CountAsync();

            var products = await query
                .Skip((loadClick - 1) * loadSize)
                .Take(loadSize)
                .ToListAsync();

            return Ok(new
            {
                totalCount,
                currentPage = loadClick,
                pageSize = loadSize,
                hasMore = (loadClick * loadSize) <= totalCount,
                products
            });
        }
    }
}
