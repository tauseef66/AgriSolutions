import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { login, googleLogin } from "@/services/api";
import { auth, googleProvider, signInWithPopup } from "@/services/firebase";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await login(email, password); 
      console.log("Login response:", response);  
      
      const { token, isAdmin } = response;
      if (token) {
        localStorage.setItem("token", token);
        toast({
          title: "Success!",
          description: "You've successfully logged in.",
          duration: 5000,
        });
 
        if (isAdmin) {
          console.log("Navigating to /admin-dashboard");
          navigate("/admin-dashboard", { replace: true });
        } else {
          console.log("Navigating to /dashboard");
          navigate("/dashboard", { replace: true });
        }
      } else {
        throw new Error("No token received from server");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        variant: "destructive",
        title: "Error!",
        description: error.response?.data?.message || "Failed to log in. Please try again.",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      const response = await googleLogin(idToken); 
      console.log("Google login response:", response);

      const { token, isAdmin } = response;
      if (token) {
        localStorage.setItem("token", token);
        toast({
          title: "Success!",
          description: "Google login successful!",
          duration: 5000,
        });

        if (isAdmin) {
          console.log("Navigating to /admin-dashboard");
          navigate("/admin-dashboard", { replace: true });
        } else {
          console.log("Navigating to /dashboard");
          navigate("/dashboard", { replace: true });
        }
      } else {
        throw new Error("No token received from server");
      }
    } catch (error: any) {
      console.error("Google login error:", error);
      toast({
        variant: "destructive",
        title: "Error!",
        description: error.response?.data?.message || "Google login failed.",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Welcome Back</CardTitle>
        <CardDescription className="text-center">
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-agro-primary hover:bg-agro-dark"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>
          <Button
            variant="outline"
            className="w-full border-agro-primary text-agro-primary hover:bg-agro-primary hover:text-white"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
              />
            </svg>
            Sign in with Google
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-agro-primary hover:text-agro-dark"
          >
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}