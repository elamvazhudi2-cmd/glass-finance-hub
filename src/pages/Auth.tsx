import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Mail, Lock, User, ArrowRight, Eye, EyeOff } from "lucide-react";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        toast({ title: "Login failed", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Welcome back!" });
        navigate("/");
      }
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
          emailRedirectTo: window.location.origin,
        },
      });
      if (error) {
        toast({ title: "Sign up failed", description: error.message, variant: "destructive" });
      } else {
        toast({
          title: "Verification email sent!",
          description: "Please check your inbox and verify your email before signing in.",
        });
        setIsLogin(true);
      }
    }
    setLoading(false);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "hsl(var(--background))" }}
    >
      <div
        className="w-full max-w-md rounded-2xl p-8"
        style={{
          background: "hsl(var(--card))",
          border: "1px solid hsl(var(--border))",
          boxShadow: "0 20px 60px hsl(0 0% 0% / 0.4)",
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold"
            style={{ background: "var(--gradient-primary)", color: "hsl(var(--primary-foreground))" }}
          >
            FI
          </div>
          <div>
            <p className="text-lg font-bold font-display" style={{ color: "hsl(var(--foreground))" }}>
              FinAnalyst Hub
            </p>
            <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
              Investment Platform
            </p>
          </div>
        </div>

        {/* Toggle */}
        <div
          className="flex rounded-xl mb-6 p-1"
          style={{ background: "hsl(var(--muted))" }}
        >
          <button
            onClick={() => setIsLogin(true)}
            className="flex-1 py-2 rounded-lg text-sm font-medium transition-all"
            style={{
              background: isLogin ? "hsl(var(--primary))" : "transparent",
              color: isLogin ? "hsl(var(--primary-foreground))" : "hsl(var(--muted-foreground))",
            }}
          >
            Sign In
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className="flex-1 py-2 rounded-lg text-sm font-medium transition-all"
            style={{
              background: !isLogin ? "hsl(var(--primary))" : "transparent",
              color: !isLogin ? "hsl(var(--primary-foreground))" : "hsl(var(--muted-foreground))",
            }}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="relative">
              <User
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: "hsl(var(--muted-foreground))" }}
              />
              <Input
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="pl-10"
                required={!isLogin}
                style={{
                  background: "hsl(var(--muted))",
                  border: "1px solid hsl(var(--border))",
                  color: "hsl(var(--foreground))",
                }}
              />
            </div>
          )}

          <div className="relative">
            <Mail
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: "hsl(var(--muted-foreground))" }}
            />
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10"
              required
              style={{
                background: "hsl(var(--muted))",
                border: "1px solid hsl(var(--border))",
                color: "hsl(var(--foreground))",
              }}
            />
          </div>

          <div className="relative">
            <Lock
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: "hsl(var(--muted-foreground))" }}
            />
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 pr-10"
              required
              minLength={6}
              style={{
                background: "hsl(var(--muted))",
                border: "1px solid hsl(var(--border))",
                color: "hsl(var(--foreground))",
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
              style={{ color: "hsl(var(--muted-foreground))" }}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <Button
            type="submit"
            className="w-full gap-2"
            disabled={loading}
            style={{ background: "var(--gradient-primary)", color: "hsl(var(--primary-foreground))" }}
          >
            {loading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
            <ArrowRight size={16} />
          </Button>
        </form>

        {!isLogin && (
          <p className="text-xs text-center mt-4" style={{ color: "hsl(var(--muted-foreground))" }}>
            A verification email will be sent to confirm your account.
          </p>
        )}
      </div>
    </div>
  );
}
