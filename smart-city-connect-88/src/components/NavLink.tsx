import { NavLink as RouterNavLink, NavLinkProps, useNavigate } from "react-router-dom";
import { forwardRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface NavLinkCompatProps extends Omit<NavLinkProps, "className"> {
  className?: string;
  activeClassName?: string;
  pendingClassName?: string;

  // 🔥 Backend / auth props
  protected?: boolean; // only logged-in users can see
  roles?: string[]; // ["ADMIN", "USER"]
  redirectTo?: string; // optional redirect if access denied
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkCompatProps>(
  (
    {
      className,
      activeClassName,
      pendingClassName,
      to,
      protected: isProtected,
      roles,
      redirectTo,
      ...props
    },
    ref
  ) => {
    const navigate = useNavigate();
    const [isAllowed, setIsAllowed] = useState(true);

    // ✅ Check access on mount + login/logout changes
    useEffect(() => {
      const checkAccess = () => {
        const token = localStorage.getItem("token");
        const userRole = localStorage.getItem("role");

        // 🔐 Not logged in but route is protected
        if (isProtected && !token) {
          setIsAllowed(false);
          if (redirectTo) navigate(redirectTo);
          return;
        }

        // 🔐 Role-based access
        if (roles && roles.length > 0) {
          if (!roles.includes(userRole || "")) {
            setIsAllowed(false);

            // Optional auto-redirect based on role
            if (userRole === "ADMIN") navigate("/admin/dashboard");
            else if (userRole === "USER") navigate("/dashboard");
            return;
          }
        }

        // ✅ Allowed access
        setIsAllowed(true);
      };

      checkAccess();

      // 🔄 Realtime update if another tab logs in/out
      window.addEventListener("storage", checkAccess);
      return () => window.removeEventListener("storage", checkAccess);
    }, [isProtected, roles, navigate, redirectTo]);

    // ✅ Recheck on route change
    useEffect(() => {
      const token = localStorage.getItem("token");
      const userRole = localStorage.getItem("role");

      if (isProtected && !token) setIsAllowed(false);
      else if (roles && roles.length > 0 && !roles.includes(userRole || "")) setIsAllowed(false);
      else setIsAllowed(true);
    }, [to, isProtected, roles]);

    // ❌ Not allowed → don't render
    if (!isAllowed) return null;

    return (
      <RouterNavLink
        ref={ref}
        to={to}
        className={({ isActive, isPending }) =>
          cn(className, isActive && activeClassName, isPending && pendingClassName)
        }
        {...props}
      />
    );
  }
);

NavLink.displayName = "NavLink";

export { NavLink };