using Microsoft.Extensions.DependencyInjection;
using MinJira.Utils.Auth;

namespace MinJira.Utils
{
    public static class RegisterUtils
    {
        public static IServiceCollection AddAuthUtils<TUser>(this  IServiceCollection services) where TUser : class
        {
            services.AddScoped<IPasswordHelper<TUser>, PasswordHelper<TUser>>();
            return services;
        }
    }
}
