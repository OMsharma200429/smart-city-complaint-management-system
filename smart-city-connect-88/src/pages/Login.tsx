import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Building2, Eye, EyeOff, AlertCircle, LogIn } from "lucide-react";

const API_BASE = "http://localhost:8080/api";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const set = (key: string, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: "" }));
  };

  const validate = () => {
    const e: Record<string, string> = {};

    if (!form.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      e.email = "Enter a valid email";

    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 6)
      e.password = "Minimum 6 characters";

    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors({ email: data.message || "Invalid credentials" });
        return;
      }

      localStorage.setItem("token", data.token);
      if (data.role) localStorage.setItem("role", data.role);

      if (data.role === "ADMIN") navigate("/admin/dashboard");
      else navigate("/dashboard");

    } catch (err) {
      console.error(err);
      setErrors({ email: "Server error, try again" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4 py-16">
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">

        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-primary glow-cyan mb-3">
            <Building2 className="h-7 w-7 text-primary-foreground" />
          </div>

          <h1 className="text-2xl font-bold">
            <span className="text-gradient-cyan">Smart</span>City Portal
          </h1>

          <p className="text-muted-foreground text-sm mt-1">
            Sign in to your citizen account
          </p>
        </div>

        {/* Card */}
        <div className="card-surface rounded-2xl p-8">
          <h2 className="text-xl font-semibold mb-6">Welcome Back</h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-1.5">
                Email Address
              </label>

              <input
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                placeholder="you@example.com"
                className={`w-full bg-secondary border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${
                  errors.email ? "border-destructive" : "border-border"
                }`}
              />

              {errors.email && (
                <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium">Password</label>

                <button
                  type="button"
                  className="text-xs text-primary hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => set("password", e.target.value)}
                  placeholder="••••••••"
                  className={`w-full bg-secondary border rounded-lg px-4 py-2.5 pr-11 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${
                    errors.password ? "border-destructive" : "border-border"
                  }`}
                />

                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPass ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              {errors.password && (
                <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Remember */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="rounded border-border accent-primary w-4 h-4"
              />
              <span className="text-sm text-muted-foreground">
                Remember me for 30 days
              </span>
            </label>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full gradient-primary text-primary-foreground font-semibold py-3 rounded-lg glow-cyan hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <LogIn className="h-4 w-4" />
                  Sign In
                </span>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">
              or continue with
            </span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Social */}
          <div className="grid grid-cols-2 gap-3">
            {[{ label: "Google", icon: "G" }, { label: "GitHub", icon: "GH" }].map(
              ({ label, icon }) => (
                <button
                  key={label}
                  type="button"
                  className="flex items-center justify-center gap-2 border border-border bg-secondary hover:bg-secondary/80 text-foreground text-sm font-medium py-2.5 rounded-lg transition-all"
                >
                  <span className="font-bold text-xs text-primary">{icon}</span>
                  {label}
                </button>
              )
            )}
          </div>

          {/* Footer */}
          <p className="text-center text-sm text-muted-foreground mt-6">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary font-medium hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}