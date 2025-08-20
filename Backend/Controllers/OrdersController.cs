using ECommerce.Data;
using ECommerce.DTOs;
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
    public class OrdersController : ControllerBase
    {
        private readonly ECommerceDbContext _context;
        public OrdersController(ECommerceDbContext context)
        {
            _context = context;
        }

        [HttpGet("{userId}")]
        public async Task<ActionResult<IEnumerable<OrderDto>>> GetOrdersForUser(int userId, [FromQuery] int pageNumber, [FromQuery] int pageSize)
        {
            var query = _context.Orders
                .Where(o => o.UserId == userId)
                .Include(o => o.Address)
                .Include(o => o.OrderDetails)
                    .ThenInclude(od => od.Product);

            var totalOrders = await query.CountAsync();

            var orders = await query
                .OrderByDescending(o => o.OrderDate)
                .Select(o => new OrderDto(o))
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            if (!orders.Any())
            {
                return NotFound("No orders found for this user.");
            }

            return Ok(new
            {
                totalOrders = totalOrders,
                pageNumber = pageNumber,
                pageSize = pageSize,
                data = orders

            });
        }

        [HttpPost]
        public async Task<IActionResult> CreateOrderFromCart([FromBody] CreateOrderRequestDto orderRequest)
        {
            if (!ModelState.IsValid || !orderRequest.Items.Any())
            {
                return BadRequest("Invalid order data.");
            }

            var productIds = orderRequest.Items.Select(item => item.ProductId).ToList();
            var products = await _context.Products
                .Where(p => productIds.Contains(p.Id))
                .ToDictionaryAsync(p => p.Id);

            var addressExists = await _context.Addresses
                        .AnyAsync(a => a.Id == orderRequest.AddressId && a.UserId == orderRequest.UserId);

            if (!addressExists)
            {
                return BadRequest($"Address with ID {orderRequest.AddressId} does not exist for this user.");
            }


            var newOrder = new Order
            {
                UserId = orderRequest.UserId,
                AddressId = orderRequest.AddressId,
                OrderDate = DateTime.UtcNow,
                OrderStatus = "Processing",
                PaymentMethod = orderRequest.PaymentMethod,
                OrderDetails = new List<OrderDetail>()
            };

            decimal totalAmount = 0;

            foreach (var item in orderRequest.Items)
            {
                if (!products.TryGetValue(item.ProductId, out var product))
                {
                    return BadRequest($"Product with ID {item.ProductId} not found.");
                }

                var orderDetail = new OrderDetail
                {
                    ProductId = item.ProductId,
                    Quantity = item.Quantity,
                    PricePerUnit = product.Price
                };

                totalAmount += product.Price * item.Quantity;
                newOrder.OrderDetails.Add(orderDetail);
            }
            newOrder.TotalAmount = totalAmount;

            _context.Orders.Add(newOrder);

            await _context.SaveChangesAsync();
            return Ok(new { message = "Order created successfully!", orderId = newOrder.Id });
        }
    }
}
