import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import dogRegister from "../../assets/dogRegister.svg";
import { useAuthStore } from "../../stores/authStore";
import { registerSchema, loginSchema } from "../../schemas/auth";

/** @param {{ mode?: "register" | "login" }} props */
const Register = ({ mode = "register" }) => {
  const navigate = useNavigate();
  const isRegister = mode === "register";
  const [showPassword, setShowPassword] = useState(false);

  const user = useAuthStore((s) => s.user);
  const submitting = useAuthStore((s) => s.submitting);
  const error = useAuthStore((s) => s.error);
  const register = useAuthStore((s) => s.register);
  const login = useAuthStore((s) => s.login);
  const loginGoogle = useAuthStore((s) => s.loginGoogle);
  const clearError = useAuthStore((s) => s.clearError);

  const {
    register: field,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(isRegister ? registerSchema : loginSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  useEffect(() => {
    if (user) navigate("/home", { replace: true });
  }, [user, navigate]);

  // Reset form-level error when switching between routes (login ↔ register).
  useEffect(() => {
    clearError();
  }, [mode, clearError]);

  const switchTo = isRegister ? "/login" : "/register";

  const onSubmit = async (values) => {
    try {
      if (isRegister) {
        await register(values);
      } else {
        await login({ email: values.email, password: values.password });
      }
    } catch {
      // store surfaces the error message
    }
  };

  const onGoogle = async () => {
    try {
      await loginGoogle();
    } catch {
      // store surfaces the error message
    }
  };

  return (
    <section className="min-h-svh bg-[#f4a52c] flex flex-col">
      {/* Orange top area — natural height, dog sits near bottom edge */}
      <div className="flex justify-center pt-10 pb-0">
        <img
          src={dogRegister}
          alt=""
          className="h-36 sm:h-40 relative z-20 -mb-6 select-none pointer-events-none"
        />
      </div>

      {/* Cream panel — fills remaining space */}
      <div className="bg-[#FFE4c4] rounded-t-3xl px-3 pt-5 flex-1 flex flex-col">
        {/* White card — fills cream */}
        <div className="bg-white rounded-t-[1.75rem] px-6 pt-5 pb-8 shadow-sm flex-1">
          <h1 className="text-center font-extrabold text-2xl mb-5 text-[#2F2F2F]">
            {isRegister ? "Register" : "Log In"}
          </h1>

          {error && (
            <div className="mb-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-2">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
            {isRegister && (
              <div className="flex flex-col gap-1">
                <input
                  {...field("name")}
                  type="text"
                  placeholder="Enter your name"
                  autoComplete="name"
                  className="text-base text-gray-700 border border-gray-300 outline-[#f4a52c] rounded-xl px-4 py-2.5"
                />
                {errors.name && (
                  <span className="text-xs text-red-600">{errors.name.message}</span>
                )}
              </div>
            )}

            <div className="flex flex-col gap-1">
              <input
                {...field("email")}
                type="email"
                placeholder="Enter your email"
                autoComplete="email"
                className="text-base text-gray-700 border border-gray-300 outline-[#f4a52c] rounded-xl px-4 py-2.5"
              />
              {errors.email && (
                <span className="text-xs text-red-600">{errors.email.message}</span>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <div className="relative">
                <input
                  {...field("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder={isRegister ? "Choose a password" : "Enter your password"}
                  autoComplete={isRegister ? "new-password" : "current-password"}
                  className="w-full text-base text-gray-700 border border-gray-300 outline-[#f4a52c] rounded-xl px-4 py-2.5 pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <span className="text-xs text-red-600">{errors.password.message}</span>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#f4a52c] text-white font-semibold py-2.5 rounded-xl text-lg hover:bg-[#e6971f] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting
                ? isRegister
                  ? "Creating account..."
                  : "Logging in..."
                : isRegister
                ? "Register"
                : "Log In"}
            </button>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-gray-500 text-xs">or</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            <button
              type="button"
              onClick={onGoogle}
              disabled={submitting}
              className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-xl py-2.5 text-base text-gray-700 hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
                <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.4 29.3 35.5 24 35.5c-6.3 0-11.5-5.2-11.5-11.5S17.7 12.5 24 12.5c2.9 0 5.6 1.1 7.6 2.9l5.7-5.7C33.6 6.5 29 4.5 24 4.5 13.2 4.5 4.5 13.2 4.5 24S13.2 43.5 24 43.5 43.5 34.8 43.5 24c0-1.2-.1-2.3-.3-3.5z" />
                <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 12.5 24 12.5c2.9 0 5.6 1.1 7.6 2.9l5.7-5.7C33.6 6.5 29 4.5 24 4.5 16.3 4.5 9.7 8.9 6.3 14.7z" />
                <path fill="#4CAF50" d="M24 43.5c5 0 9.5-1.9 12.9-5l-6-4.9c-1.9 1.3-4.3 2-6.9 2-5.3 0-9.7-3-11.3-7.4l-6.5 5C9.6 39.1 16.2 43.5 24 43.5z" />
                <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.7 2-2 3.7-3.7 4.9h.1l6 4.9c-.4.4 6.3-4.6 6.3-13.8 0-1.2-.1-2.3-.4-3.5z" />
              </svg>
              Continue with Google
            </button>

            <div className="flex justify-center gap-2 items-center pt-2">
              <p className="text-center text-gray-600 text-sm">
                {isRegister ? "Already have an account?" : "Don't have an account?"}
              </p>
              <button
                type="button"
                onClick={() => navigate(switchTo)}
                className="text-sm text-[#f4a52c] font-semibold"
              >
                {isRegister ? "Log In" : "Register"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Register;
