import { Link, useLocation, useNavigate } from "react-router-dom";
import { Building2, Menu, X, LogIn, UserPlus, Shield } from "lucide-react";
import { useState, useEffect } from "react";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(""); // "USER" or "ADMIN"

  // ✅ Check login state from localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("role");
    if (token) {
      setIsLoggedIn(true);
      setRole(userRole || "");
    } else {
      setIsLoggedIn(false);
      setRole("");
    }

    // Realtime update if another tab logs in/out
    const handleStorage = () => {
      const t = localStorage.getItem("token");
      const r = localStorage.getItem("role");
      if (t) {
        setIsLoggedIn(true);
        setRole(r || "");
      } else {
        setIsLoggedIn(false);
        setRole("");
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setIsLoggedIn(false);
    setRole("");
    navigate("/"); // go back home
  };

  // Define nav links dynamically
  let navLinks = [{ href: "/", label: "Home" }];
  if (!isLoggedIn) {
    navLinks.push({ href: "/dashboard", label: "Dashboard" });
  } else if (role === "USER") {
    navLinks.push({ href: "/submit", label: "Submit Complaint" });
    navLinks.push({ href: "/track", label: "Track Status" });
    navLinks.push({ href: "/dashboard", label: "Dashboard" });
  } else if (role === "ADMIN") {
    navLinks.push({ href: "/admin/dashboard", label: "Admin Dashboard" });
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/40">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-md gradient-primary glow-cyan">
            <Building2 className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-lg tracking-tight">
            <span className="text-gradient-cyan">Smart</span>
            <span className="text-foreground">City</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.href;
            return (
              <Link
                key={link.href}
                to={link.href}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-primary/10 text-primary border border-primary/30 glow-cyan"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-2">
          {!isLoggedIn ? (
            <>
              <Link
                to="/login"
                className="flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium hover:bg-secondary transition-all"
              >
                <LogIn className="h-4 w-4" /> Login
              </Link>
              <Link
                to="/signup"
                className="flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-semibold gradient-primary text-primary-foreground hover:opacity-90 transition-all"
              >
                <UserPlus className="h-4 w-4" /> Sign Up
              </Link>
              <Link
                to="/admin/login"
                className="flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-semibold bg-accent/10 border border-accent/40 text-accent hover:bg-accent/20 transition-all"
              >
                <Shield className="h-4 w-4" /> Officer Portal
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 bg-accent/10 border border-accent/40 text-accent px-4 py-2 rounded-md text-sm font-semibold hover:bg-accent/20 transition-all"
            >
              Logout
            </button>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground"
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden glass border-t border-border/40 px-4 pb-4 pt-2 flex flex-col gap-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.href;
            return (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setOpen(false)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  isActive
                    ? "bg-primary/10 text-primary border border-primary/30"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          {!isLoggedIn ? (
            <div className="flex gap-2 mt-2 pt-2 border-t border-border/40">
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="flex-1 flex items-center justify-center gap-1.5 border border-border bg-secondary text-foreground text-sm font-medium py-2 rounded-md"
              >
                <LogIn className="h-4 w-4" /> Login
              </Link>
              <Link
                to="/signup"
                onClick={() => setOpen(false)}
                className="flex-1 flex items-center justify-center gap-1.5 gradient-primary text-primary-foreground text-sm font-semibold py-2 rounded-md"
              >
                <UserPlus className="h-4 w-4" /> Sign Up
              </Link>
              <Link
                to="/admin/login"
                onClick={() => setOpen(false)}
                className="flex-1 flex items-center justify-center gap-1.5 bg-accent/10 border border-accent/40 text-accent text-sm font-semibold py-2 rounded-md"
              >
                <Shield className="h-4 w-4" /> Officer Portal
              </Link>
            </div>
          ) : (
            <button
              onClick={handleLogout}
              className="mt-2 py-2 rounded-md bg-accent/10 border border-accent/40 text-accent text-sm font-semibold"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
}