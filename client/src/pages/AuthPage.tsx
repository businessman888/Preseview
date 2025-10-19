import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, EyeOff } from "lucide-react";

export default function AuthPage() {
  const { user, isLoading, loginMutation, registerMutation, logoutMutation } = useAuth();
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // Redirecionar se já estiver logado
  useEffect(() => {
    const search = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const force = search?.get('force') === 'true';
    const isGuest = !!user && ((user as any).username === 'convidado' || (user as any).email === 'convidado@app.com');

    if (!isLoading && user && !isGuest && !force) {
      setLocation("/");
    }
  }, [user, isLoading, setLocation]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(loginData);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // Convert to the format expected by the backend
    const userData = {
      username: registerData.email, // Use email as username for now
      email: registerData.email,
      password: registerData.password,
      displayName: registerData.name,
      userType: "user" as const
    };
    registerMutation.mutate(userData);
  };

  const handleCreatorRedirect = () => {
    setLocation("/register/creator");
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        
        {/* Hero Section */}
        <div className="text-gray-900 space-y-6 text-center lg:text-left">
          <div className="space-y-4">
            <h1 className="text-4xl lg:text-6xl font-bold">
              Conecte-se com
              <br />
              seus{" "}
              <span className="text-red-500">
                criadores
              </span>
              <br />
              <span className="text-red-500">
                favoritos
              </span>
            </h1>
            <p className="text-xl lg:text-2xl text-gray-600">
              Uma plataforma feita
              <br />
              exclusivamente para a
              <br />
              conexão premium
              <br />
              entre criadores e fãs
            </p>
          </div>
        </div>

        {/* Auth Forms */}
        <div className="w-full max-w-md mx-auto">
          <Card className="shadow-lg">
            <CardContent className="p-0">
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 rounded-none border-b bg-gray-50">
                  <TabsTrigger value="login" className="rounded-none">Login</TabsTrigger>
                  <TabsTrigger value="register" className="rounded-none">Cadastrar-se</TabsTrigger>
                </TabsList>

                {/* Login Form */}
                <TabsContent value="login" className="p-6">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email">Email</Label>
                      <Input
                        id="login-email"
                        data-testid="input-login-email"
                        type="email"
                        placeholder="Seu email..."
                        value={loginData.email}
                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-password">Senha</Label>
                      <div className="relative">
                        <Input
                          id="login-password"
                          data-testid="input-login-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Digite sua senha..."
                          value={loginData.password}
                          onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </Button>
                      </div>
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white"
                      data-testid="button-login"
                      disabled={loginMutation.isPending}
                    >
                      {loginMutation.isPending ? "Entrando..." : "Login"}
                    </Button>
                  </form>
                </TabsContent>

                {/* Register Form */}
                <TabsContent value="register" className="p-6">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Cadastrar-se como usuário padrão
                    </h3>
                  </div>
                  
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="register-name">Nome:</Label>
                      <Input
                        id="register-name"
                        data-testid="input-register-name"
                        type="text"
                        placeholder="Digite seu nome..."
                        value={registerData.name}
                        onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="register-email">Email:</Label>
                      <Input
                        id="register-email"
                        data-testid="input-register-email"
                        type="email"
                        placeholder="Seu email..."
                        value={registerData.email}
                        onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="register-password">Senha:</Label>
                      <div className="relative">
                        <Input
                          id="register-password"
                          data-testid="input-register-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Digite sua senha..."
                          value={registerData.password}
                          onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </Button>
                      </div>
                    </div>

                    {/* Social Login Buttons */}
                    <div className="flex justify-center gap-3 py-4">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="w-12 h-12 rounded-full bg-red-500 border-red-500 hover:bg-red-600"
                        data-testid="button-google"
                      >
                        <span className="text-white font-bold">G</span>
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="w-12 h-12 rounded-full bg-red-500 border-red-500 hover:bg-red-600"
                        data-testid="button-twitter"
                      >
                        <span className="text-white">𝕏</span>
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="w-12 h-12 rounded-full bg-red-500 border-red-500 hover:bg-red-600"
                        data-testid="button-facebook"
                      >
                        <span className="text-white font-bold">f</span>
                      </Button>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white"
                      data-testid="button-register"
                      disabled={registerMutation.isPending}
                    >
                      {registerMutation.isPending ? "Cadastrando..." : "Cadastrar-se"}
                    </Button>

                    {/* Link para cadastro de criador */}
                    <div className="text-center mt-4">
                      <button
                        type="button"
                        onClick={handleCreatorRedirect}
                        className="text-sm text-gray-600 hover:text-gray-800 underline"
                        data-testid="link-sou-criador"
                      >
                        Sou criador
                      </button>
                    </div>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}