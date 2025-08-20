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
    public class AddressesController : ControllerBase
    {
        private ECommerceDbContext _context;

        public AddressesController(ECommerceDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<ActionResult> AddAddress([FromBody] Address address)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(e => e.Errors)
                    .Select(e => e.ErrorMessage)
                    .ToList();
                return BadRequest(new {message= "Invalid data!", errors});
            }

            var existingUserAddress = await _context.Addresses.FirstOrDefaultAsync(a => a.UserId == address.UserId);

            if (existingUserAddress != null)
            {
                return BadRequest(new { message = "Address already exists" });
            }

                _context.Addresses.Add(address);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(Address), new { addressId = address.Id}, address);
        }

        [HttpGet("{userId}")]
        public async Task<ActionResult> GetAddress(int userId)
        {
            var address = await _context.Addresses.FirstOrDefaultAsync(a => a.UserId == userId);

            if (address == null)
                return NotFound(new { message = "Address not found." });

            return Ok(address);
        }

        [HttpPut("{userId}")]
        public async Task<ActionResult> UpdateAddress(int userId, [FromBody] Address updatedAddress)
        {
            if (userId != updatedAddress.UserId)
            {
                return BadRequest(new { message = "UserId mismatch!" });
            }

            var existingAddress = await _context.Addresses.FirstOrDefaultAsync(a => a.Id == updatedAddress.Id);

            if (existingAddress == null)
            {
                return NotFound(new { message = "Address not found!" });
            }

            bool isSame = existingAddress.Phone == updatedAddress.Phone &&
                  existingAddress.State == updatedAddress.State &&
                  existingAddress.District == updatedAddress.District &&
                  existingAddress.City == updatedAddress.City &&
                  existingAddress.PinCode == updatedAddress.PinCode &&
                  existingAddress.AddressLine == updatedAddress.AddressLine;

            if (isSame)
            {
                return BadRequest(new { message = "Sorry, the new address matches the existing one in the database!" });
            }

            _context.Entry(existingAddress).CurrentValues.SetValues(updatedAddress);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Address updated successfully!" });
        }

        [HttpDelete("{userId}")]
        public async Task<ActionResult> DeleteAddressByUser(int userId)
        {
            var existingAddress = _context.Addresses.FirstOrDefault(a => a.UserId == userId);
            if (existingAddress == null )
            {
                return BadRequest(new { message = "Address not found!" });
            }

            _context.Addresses.Remove(existingAddress);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Address deleted successfully." });
        }
    }
}
