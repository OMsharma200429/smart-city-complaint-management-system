import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Building2, Eye, EyeOff, AlertCircle, UserPlus, Check } from "lucide-react";

const API_BASE = "http://localhost:8080/api";

const passwordChecks = [
  { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { label: "One uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { label: "One number", test: (p: string) => /\d/.test(p) },
];

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const set = (key: string, value: string | boolean) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: "" }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.fullName.trim()) e.fullName = "Full name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 8) e.password = "Minimum 8 characters";
    if (!form.confirmPassword) e.confirmPassword = "Please confirm your password";
    else if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords do not match";
    if (!form.agree) e.agree = "You must accept the terms";
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
      const res = await fetch(`${API_BASE}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.fullName,
          email: form.email,
          phone: form.phone,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors({ email: data.message || "Signup failed" });
        return;
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      navigate("/login");

    } catch (error) {
      console.error(error);
      setErrors({ email: "Server error, try again" });
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
          <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-primary glow-cyan mb-3">
            <Building2 className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold">
            <span className="text-gradient-cyan">Smart</span>City Portal
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Create your citizen account
          </p>
        </div>

        <div className="card-surface rounded-2xl p-8">
          <h2 className="text-xl font-semibold mb-6">Create Account</h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            <div>
              <label className="block text-sm font-medium mb-1.5">Full Name</label>
              <input
                type="text"
                value={form.fullName}
                onChange={(e) => set("fullName", e.target.value)}
                placeholder="e.g. Rahul Sharma"
                className={`w-full bg-secondary border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${errors.fullName ? "border-destructive" : "border-border"}`}
              />
              {errors.fullName && <p className="text-xs text-destructive mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.fullName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Email Address</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                placeholder="you@example.com"
                className={`w-full bg-secondary border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${errors.email ? "border-destructive" : "border-border"}`}
              />
              {errors.email && <p className="text-xs text-destructive mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Phone Number <span className="text-muted-foreground">(optional)</span></label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => set("password", e.target.value)}
                  placeholder="••••••••"
                  className={`w-full bg-secondary border rounded-lg px-4 py-2.5 pr-11 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${errors.password ? "border-destructive" : "border-border"}`}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-destructive mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.password}</p>}

              {form.password && (
                <div className="mt-2 flex flex-col gap-1">
                  {passwordChecks.map(({ label, test }) => {
                    const ok = test(form.password);
                    return (
                      <div key={label} className={`flex items-center gap-1.5 text-xs ${ok ? "text-status-green" : "text-muted-foreground"}`}>
                        <Check className={`h-3 w-3 ${ok ? "opacity-100" : "opacity-30"}`} />
                        {label}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={form.confirmPassword}
                  onChange={(e) => set("confirmPassword", e.target.value)}
                  placeholder="••••••••"
                  className={`w-full bg-secondary border rounded-lg px-4 py-2.5 pr-11 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${errors.confirmPassword ? "border-destructive" : "border-border"}`}
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-xs text-destructive mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.confirmPassword}</p>}
            </div>

            <div>
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.agree}
                  onChange={(e) => set("agree", e.target.checked)}
                  className="mt-0.5 rounded border-border accent-primary w-4 h-4 flex-shrink-0"
                />
                <span className="text-sm text-muted-foreground">
                  I agree to the{" "}
                  <button type="button" className="text-primary hover:underline">Terms of Service</button>{" "}
                  and{" "}
                  <button type="button" className="text-primary hover:underline">Privacy Policy</button>
                </span>
              </label>
              {errors.agree && <p className="text-xs text-destructive mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.agree}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full gradient-primary text-primary-foreground font-semibold py-3 rounded-lg glow-cyan hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-60 mt-1"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  Create Account
                </span>
              )}
            </button>

          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}