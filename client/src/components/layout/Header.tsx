import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

interface User {
  id: string;
  name: string;
  email: string;
}

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const userResponse = await api.get("/api/user");
          const userData = userResponse.data;
          const user = userData.data?.user || userData;

          if (user?.id && user?.name) {
            setUser({
              id: user.id,
              name: user.name,
              email: user.email || "N/A",
            });
          } else {
            throw new Error("Invalid user data format");
          }
        } catch (err) {
          console.error("Failed to fetch user data:", err);
          localStorage.removeItem("token");
          setUser(null);
        }
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    toast({
      title: "Logged out",
      description: "You've been successfully logged out.",
    });
    navigate("/login");
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link to="/" className="flex items-center">
            <span className="h-8 w-8 rounded-full bg-agro-primary flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" className="text-white">
                <path d="M12 2a10 10 0 1 0 10 10H12V2z" />
                <path d="M12 2a10 10 0 0 0-10 10h10V2z" />
                <path d="M12 12v10" />
                <path d="M12 12h10" />
              </svg>
            </span>
            <span className="ml-2 text-xl font-bold text-agro-dark">AgriSolutions</span>
          </Link>
        </div>

        <div className="flex items-center">
          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Hi, {user.name || user.email}</span>
              <Button
                onClick={handleLogout}
                className="className= bg-agro-primary hover:bg-agro-dark"
              >
                Logout
              </Button>
            </div>
          ) : (
            <div className="space-x-2">
              <Button
                variant="ghost"
                className="text-agro-primary hover:text-agro-dark hover:bg-agro-light/20"
                onClick={() => navigate("/login")}
              >
                Login
              </Button>
              <Button
                className="bg-agro-primary hover:bg-agro-dark"
                onClick={() => navigate("/register")}
              >
                Register
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}