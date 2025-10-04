
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sparkles, User, Lock } from 'lucide-react';

interface LoginPageProps {
  onLogin: () => void;
}

export const LoginPage = ({ onLogin }: LoginPageProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple validation - in real app, you'd validate against backend
    if (username && password) {
      onLogin();
    }
  };

  return (
    <div className="min-h-screen gradient-warm flex items-center justify-center p-4 relative overflow-hidden">
      {/* Festive cracker decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-8 h-8 bg-primary/20 rounded-full animate-pulse"></div>
        <div className="absolute top-1/4 right-20 w-6 h-6 bg-secondary/30 rounded-full animate-pulse delay-200"></div>
        <div className="absolute bottom-1/3 left-1/4 w-4 h-4 bg-accent/25 rounded-full animate-pulse delay-300"></div>
        <div className="absolute bottom-20 right-1/3 w-10 h-10 bg-primary/15 rounded-full animate-pulse delay-500"></div>
        <Sparkles className="absolute top-20 right-1/4 w-6 h-6 text-accent/30 animate-pulse" />
        <Sparkles className="absolute bottom-40 left-20 w-4 h-4 text-primary/40 animate-pulse delay-300" />
      </div>
      
      <Card className="w-full max-w-md shadow-festive-lg border-0 bg-white/95 backdrop-blur-sm hover-glow">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto w-20 h-20 mb-4 flex items-center justify-center">
            <img 
              src="/lovable-uploads/63d95643-faed-4321-8694-2ebed77ad127.png" 
              alt="Crackers Craze Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <CardTitle className="text-2xl font-bold text-gradient">
            🎆 Crackers Craze Admin Panel 🎆
          </CardTitle>
          <p className="text-muted-foreground text-sm mt-2">
            Welcome back! Please sign in to manage your festive store
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-gray-700 font-medium">
                Username
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700 font-medium">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                  required
                />
              </div>
            </div>
            
            <Button
              type="submit"
              className="w-full btn-festive font-semibold py-2.5 rounded-lg"
            >
              🚀 Sign In to Dashboard
            </Button>
          </form>
          
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              🔒 Secure admin access for festive cracker store management
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
