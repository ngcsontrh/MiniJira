using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MinJira.Utils.Auth
{
    public class PasswordHelper<TUser> : IPasswordHelper<TUser> where TUser : class
    {
        private readonly IPasswordHasher<TUser> _passwordHasher;

        public PasswordHelper(IPasswordHasher<TUser> passwordHasher)
        {
            _passwordHasher = passwordHasher;
        }

        public string HashPassword(TUser user, string password)
        {
            return _passwordHasher.HashPassword(user, password);
        }

        public bool VerifyPassword(TUser user, string hashedPassword, string password)
        {
            var result = _passwordHasher.VerifyHashedPassword(user, hashedPassword, password);
            return result == PasswordVerificationResult.Success;
        }
    }
}
