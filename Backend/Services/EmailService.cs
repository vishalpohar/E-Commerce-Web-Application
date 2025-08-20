using Microsoft.Extensions.Options;
using System.Net;
using System.Net.Mail;

namespace ECommerce.Services
{
    public class EmailService
    {
        private readonly SmtpSettings _smtpSettings;

        public EmailService(IOptions<SmtpSettings> smtpSettings)
        {
            _smtpSettings = smtpSettings.Value;
        }

        public async Task<bool> SendOtpEmailAsync (string toEmail, string otp, int expiryMinutes)
        {
            try
            {
                using var client = new SmtpClient(_smtpSettings.Host, _smtpSettings.Port)
                {
                    Credentials = new NetworkCredential(_smtpSettings.User, _smtpSettings.Pass),
                    EnableSsl = true
                };

                var mail = new MailMessage
                {
                    From = new MailAddress(_smtpSettings.User, "E-Commerce Support Team"),
                    Subject = "Your OTP Code",
                    Body = $@"
                    <html>
                        <body style='font-family: Arial, sans-serif; color: #333;'>
                            <h2 style='color:#4CAF50;'>E-Commerce Security Verification</h2>
                            <p>Dear Customer,</p>
                            <p>We received a request to verify your account. Please use the One-Time Password (OTP) below to proceed:</p>
                            <h3 style='background-color:#f4f4f4; padding:10px; border-radius:5px; display:inline-block;'>{otp}</h3>
                            <p><strong>Note:</strong> This OTP will expire in <strong>{expiryMinutes} minutes</strong>.</p>
                            <p>If you did not request this code, please ignore this email or contact our support immediately.</p>
                            <br/>
                            <p>Thank you,<br/>The E-Commerce Team</p>
                            <hr/>
                            <small style='color:#777;'>This is an automated message. Please do not reply.</small>
                        </body>
                    </html>",
                    IsBodyHtml = true
                };
                mail.To.Add(toEmail);

                await client.SendMailAsync(mail);
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Email error: {ex.Message}");
                return false;
            }
        }
    }
}

public class SmtpSettings
{
    public string Host { get; set; } = "";
    public int Port { get; set; }
    public string User { get; set; } = "";
    public string Pass { get; set; } = "";
}
