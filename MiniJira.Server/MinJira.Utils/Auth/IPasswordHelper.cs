using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MinJira.Utils.Auth
{
    public interface IPasswordHelper<TUser> where TUser : class
    {
        string HashPassword(TUser user, string password);
        bool VerifyPassword(TUser user, string password, string hashedPassword);
    }
}
