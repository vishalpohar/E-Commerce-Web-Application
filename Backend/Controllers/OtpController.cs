using ECommerce.Data;
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
    public class OtpController : ControllerBase
    {
        private readonly EmailService _emailService;
        private readonly IMemoryCache _cache;
        private readonly IConfiguration _config;

        private readonly ECommerceDbContext _context;

        public OtpController(EmailService emailService, IMemoryCache cache, IConfiguration config, ECommerceDbContext context)
        {
            _emailService = emailService;
            _cache = cache;
            _config = config;
            _context = context;
        }

        [HttpPost("send")]
        public async Task<IActionResult> SendOtp([FromBody] EmailDto dto)
        {
            var existingEmail = await _context.Users.AsNoTracking().FirstOrDefaultAsync(u => u.email == dto.Email);

            if (existingEmail == null)
            {
                return BadRequest(new { message = "We couldn't find a user with that email." });
            }

            var otp = new Random().Next(100000, 999999).ToString();
            var expiryMinutes = _config.GetValue<int>("OtpSettings:ExpiryMinutes");

            // Cache OTP
            _cache.Set(dto.Email, otp, TimeSpan.FromMinutes(expiryMinutes));

            var sent = await _emailService.SendOtpEmailAsync(dto.Email, otp, expiryMinutes);
            if (sent) return Ok(new { message = "OTP sent successfully" });

            return BadRequest(new { message = "Failed to send OTP" });
        }

        [HttpPost("verify")]
        public async Task<IActionResult> VerifyOtp([FromBody] OtpVerifyDto request)
        {
            if (_cache.TryGetValue(request.Email, out string storedOtp) && storedOtp == request.Otp)
            {
                var user = await _context.Users.AsNoTracking().FirstOrDefaultAsync(u => u.email == request.Email);

                _cache.Remove(request.Email);
                return Ok(new { message = "OTP verified", user = new { user.Id, user.userName, user.email} });
            }
            return BadRequest(new { message = "Invalid or expired OTP" });
        }
    }
}

public record EmailDto (string Email);
public record OtpVerifyDto(string Email, string Otp);