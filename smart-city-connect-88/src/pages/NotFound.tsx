import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error:", location.pathname);

    fetch("http://localhost:8080/api/logs/404", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        path: location.pathname,
        timestamp: new Date().toISOString(),
      }),
    }).catch(() => {});
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted px-4">
      <div className="text-center max-w-md">
        
        <h1 className="text-7xl font-extrabold text-primary mb-2">404</h1>

        <p className="text-xl text-muted-foreground mb-4">
          Oops! Page not found
        </p>

        <p className="text-sm text-muted-foreground mb-6">
          Route: <span className="text-foreground font-medium">{location.pathname}</span>
        </p>

        <div className="flex gap-3 justify-center">
          <button
            onClick={() => navigate("/")}
            className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-all"
          >
            Go Home
          </button>

          <button
            onClick={() => navigate(-1)}
            className="px-5 py-2.5 rounded-lg border border-border hover:bg-secondary transition-all"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;