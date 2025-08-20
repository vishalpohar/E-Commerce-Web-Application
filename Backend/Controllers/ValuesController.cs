using Azure.Core;
using ECommerce.Data;
using ECommerce.DTOs;
using ECommerce.Models;
using ECommerce.Services;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;

namespace ECommerce.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors("allowCors")]
    public class ValuesController : ControllerBase
    {
        private readonly EmailService _emailService;
        private readonly IMemoryCache _cache;
        private readonly IConfiguration _config;
        private readonly ECommerceDbContext _context;
        public ValuesController(EmailService emailService, IMemoryCache cache, IConfiguration config, ECommerceDbContext context)
        {
            _emailService = emailService;
            _cache = cache;
            _config = config;
            _context = context;
        }

        [HttpGet("{userId}")]
        public async Task<ActionResult> GetUser(int userId)
        {
            var user = await _context.Users.AsNoTracking().Where(u => u.Id == userId).FirstOrDefaultAsync();
            if (user == null)
            {
                return NotFound(new { message = "User Not Found!" });
            }

            return Ok();
        }

        [HttpPost]
        public async Task<ActionResult> RegistrationOtp([FromBody] User user)
        {
            var existingEmailId = await _context.Users
                .AsNoTracking()
                .Where(u => u.email == user.email)
                .FirstOrDefaultAsync();
            var existingUserName = await _context.Users
                .AsNoTracking()
                .Where(u => u.userName == user.userName)
                .FirstOrDefaultAsync();

            if (existingEmailId != null)
            {
                return Conflict(new
                {
                    message = "Email Id already exists!"
                });
            }

            if (existingUserName != null)
            {
                return Conflict(new
                {
                    message = "username already exists!"
                });
            }

            var otp = new Random().Next(100000, 999999).ToString();
            var expiryMinutes = _config.GetValue<int>("OtpSettings:ExpiryMinutes");

            _cache.Set(user.email, otp, TimeSpan.FromMinutes(expiryMinutes));

            var sent = await _emailService.SendOtpEmailAsync(user.email, otp, expiryMinutes);
            if (sent) return Ok(new { message = "Otp sent successfully." });

            return BadRequest(new { message = "Failed to send otp! " });
        }

        [HttpPost("newUser")]
        public async Task<ActionResult> VerifyNewUser([FromBody] NewUserDto dto)
        {
                if (_cache.TryGetValue(dto.email, out string storedOtp) && storedOtp == dto.otp)
            {
                var newUser = new User 
                { 
                  userName = dto.userName,
                  email=dto.email 
                };

                _cache.Remove(dto.email);

                _context.Users.Add(newUser);
                await _context.SaveChangesAsync();
                return Ok(new { message = "Registration successful." });
            }
            return BadRequest(new { message = "Invalid or expired OTP!" });
        }

        [HttpPut]
        public async Task<ActionResult> UpdateUserDetails([FromBody] UserNameUpdateDto changeRequest)
        {
            var existingUser = _context.Users.Where(u => u.Id == changeRequest.Id).FirstOrDefault();

            if (existingUser == null)
            {
                return BadRequest(new { message = "User Not Found!" });
            } 
            if (string.Equals(existingUser.userName, changeRequest.userName.Trim(), StringComparison.Ordinal))
            {
                return BadRequest(new { message = "Username already exists!" });
            }

            existingUser.userName = changeRequest.userName.Trim();
                
            await _context.SaveChangesAsync();
            return Ok(new { message = "User Name changed." });
        }
    }
}

public record NewUserDto(string userName, string email, string otp); 
