import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Eye, EyeOff, AlertCircle } from "lucide-react";

// 🔥 API BASE
const API_BASE = "http://localhost:8080/api";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ officerId: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const set = (key: string, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: "" }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.officerId.trim()) e.officerId = "Email is required";
    if (!form.password) e.password = "Password is required";
    return e;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const errs = validate();

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setLoading(true);

    try {
      // 🔥 Call Admin Login API
      const res = await fetch(`${API_BASE}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.officerId, // fixed key
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || data.error || "Invalid credentials");
      }

      // 🔐 Save login state in localStorage for Navbar + role-based access
      localStorage.setItem("token", data.token); // JWT or session token
      localStorage.setItem("role", "ADMIN"); // role used by Navbar
      localStorage.setItem("admin_data", JSON.stringify(data));

      // 🔥 Redirect to admin dashboard
      navigate("/admin/dashboard");
    } catch (err: any) {
      setErrors({ password: err.message || "Invalid credentials" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4 py-16">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-accent/20 border border-accent/40 mb-3 shadow-[0_0_24px_hsl(38_100%_55%/0.25)]">
            <Shield className="h-8 w-8 text-accent" />
          </div>
          <h1 className="text-2xl font-bold">
            Municipal <span className="text-accent">Officer Portal</span>
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Restricted access — authorised personnel only
          </p>
        </div>

        <div className="card-surface rounded-2xl p-8">
          <h2 className="text-xl font-semibold mb-6">Officer Sign In</h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* 🔥 Email Input */}
            <div>
              <label className="block text-sm font-medium mb-1.5">Official Email</label>
              <input
                type="text"
                value={form.officerId}
                onChange={(e) => set("officerId", e.target.value)}
                placeholder="Enter your official email"
                className={`w-full bg-secondary border rounded-lg px-4 py-2.5 text-sm ${
                  errors.officerId ? "border-destructive" : "border-border"
                }`}
              />
              {errors.officerId && (
                <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.officerId}
                </p>
              )}
            </div>

            {/* 🔐 Password Input */}
            <div>
              <label className="block text-sm font-medium mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => set("password", e.target.value)}
                  placeholder="••••••••"
                  className={`w-full bg-secondary border rounded-lg px-4 py-2.5 pr-11 text-sm ${
                    errors.password ? "border-destructive" : "border-border"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPass ? <EyeOff /> : <Eye />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.password}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent text-accent-foreground font-semibold py-3 rounded-lg flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? "Verifying..." : "Sign In as Officer"}
            </button>
          </form>

          <p className="text-center text-xs text-muted-foreground mt-6">
            Are you a citizen?{" "}
            <a href="/login" className="text-primary hover:underline font-medium">
              Citizen Login
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}