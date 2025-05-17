using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using MiniJira.Server.DTOs;
using MiniJira.Server.Entities;
using MiniJira.Server.Filters;
using MiniJira.Server.Mappers;
using MiniJira.Server.UOW;
using MiniJira.Server.Utils;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace MiniJira.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IConfiguration _configuration;

        public UserController(IUnitOfWork unitOfWork, IConfiguration configuration)
        {
            _unitOfWork = unitOfWork;
            _configuration = configuration;
        }

        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<IActionResult> Register([FromBody] UserDTO userDto)
        {
            var user = userDto.ToEntity();
            user.Password = PasswordHelper.HashPassword(userDto.Password!);
            user.CreatedAt = DateTime.UtcNow;
            user.UpdatedAt = DateTime.UtcNow;

            await _unitOfWork.UserRepository.AddAsync(user);
            
            return Created();
        }

        [HttpPost("change-role")]
        [Authorize]
        public async Task<IActionResult> ChangeRole([FromBody] UserDTO userDTO)
        {
            await _unitOfWork.UserRepository.ChangeRoleAsync(userDTO.Id!.Value, userDTO.Role!);
            return NoContent();
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetListUsers()
        {
            var users = await _unitOfWork.UserRepository.GetAllAsync();
                
            return Ok(users.ToDTO());
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> GetUser(Guid id)
        {
            try
            {
                var user = await _unitOfWork.UserRepository.GetByIdAsync(id);
                return Ok(user.ToDTO());
            }
            catch (KeyNotFoundException)
            {
                return NotFound("User not found.");
            }
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] LoginDTO loginDto)
        {
            var user = await _unitOfWork.UserRepository.GetUserByUsernameAsync(loginDto.Username);
            if (user == null || !PasswordHelper.VerifyPassword(loginDto.Password, user.Password))
            {
                return BadRequest(new { message = "Invalid username or password" });
            }

            var tokenData = ProcessToken(user);
            return Ok(tokenData);
        }

        [HttpPost("change-password")]
        [Authorize]
        public async Task<IActionResult> ChangePasswordAsync([FromBody] ChangePasswordDTO changePasswordDTO)
        {
            var user = await _unitOfWork.UserRepository.GetUserByUsernameAsync(changePasswordDTO.Username);
            if (user == null || !PasswordHelper.VerifyPassword(changePasswordDTO.CurrentPassword, user.Password))
            {
                return Unauthorized(new { message = "Invalid username or password" });
            }
            user.Password = PasswordHelper.HashPassword(changePasswordDTO.NewPassword);
            user.UpdatedAt = DateTime.UtcNow;
            await _unitOfWork.UserRepository.UpdateAsync(user);
            return NoContent();
        }

        private TokenDTO ProcessToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"]!);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()!),
                    new Claim(ClaimTypes.Name, user.Username),
                    new Claim(ClaimTypes.Email, user.Email),
                    new Claim(ClaimTypes.Role, user.Role)
                }),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
                Audience = _configuration["Jwt:Audience"],
                Issuer = _configuration["Jwt:Issuer"]
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            var accessToken = tokenHandler.WriteToken(token);
            var refreshToken = Guid.NewGuid().ToString();

            return new TokenDTO
            {
                AccessToken = accessToken,
                UserId = user.Id,
                UserEmail = user.Email,
                UserRole = user.Role,
                Username = user.Username
            };
        }
    }
}
