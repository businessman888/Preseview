import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  ArrowRight, 
  Play, 
  Star, 
  TrendingUp, 
  Heart, 
  DollarSign, 
  BarChart3, 
  MessageSquare, 
  Shield, 
  Zap,
  Wand2,
  Settings,
  Menu,
  Image as ImageIcon,
  User,
  ChevronDown,
  MessageCircle,
  Check,
  Mail,
  Instagram,
  Twitter,
  Youtube,
  Linkedin,
  LogIn,
  X,
  PlayCircle,
  HelpCircle,
  UserPlus
} from "lucide-react";
import { useState, useEffect } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { TypewriterText } from "@/components/TypewriterText";
import preseviewLogo from "@/assets/preseview-logo.png";
import heroModel from "@/assets/hero-model.jpg";
import avatar1 from "@/assets/avatar-1.jpg";
import avatar2 from "@/assets/avatar-2.jpg";
import avatar3 from "@/assets/avatar-3.jpg";
import avatar4 from "@/assets/avatar-4.jpg";

const Index = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Scroll animations
  const { ref: heroRef, isVisible: heroVisible } = useScrollAnimation({ threshold: 0.1 });
  const { ref: featuresRef, isVisible: featuresVisible } = useScrollAnimation({ threshold: 0.15 });
  const { ref: stepsRef, isVisible: stepsVisible } = useScrollAnimation({ threshold: 0.2 });
  const { ref: statsRef, isVisible: statsVisible } = useScrollAnimation({ threshold: 0.2 });
  const { ref: showcaseRef, isVisible: showcaseVisible } = useScrollAnimation({ threshold: 0.15 });
  const { ref: testimonialsRef, isVisible: testimonialsVisible } = useScrollAnimation({ threshold: 0.15 });
  const { ref: faqRef, isVisible: faqVisible } = useScrollAnimation({ threshold: 0.15 });
  const { ref: ctaRef, isVisible: ctaVisible } = useScrollAnimation({ threshold: 0.3 });

  // Prevenir scroll quando menu aberto
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [isMobileMenuOpen]);

  return (
    <div className="min-h-screen bg-background w-full max-w-full overflow-x-hidden">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-border w-full">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between w-full">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <img src={preseviewLogo} alt="Preseview" className="h-8 sm:h-10 max-w-full" />
          </div>
          
          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center gap-4 lg:gap-8 text-sm lg:text-base">
            <a href="#features" className="text-[hsl(var(--neutral-700))] hover:text-primary transition-colors whitespace-nowrap">
              Features
            </a>
            <a href="#como-funciona" className="text-[hsl(var(--neutral-700))] hover:text-primary transition-colors whitespace-nowrap">
              Como Funciona
            </a>
            <a href="#stats" className="text-[hsl(var(--neutral-700))] hover:text-primary transition-colors whitespace-nowrap">
              Resultados
            </a>
          </div>
          
          {/* CTA Buttons - Desktop */}
          <div className="hidden md:flex items-center gap-2 lg:gap-3">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs sm:text-sm px-3 sm:px-4"
              onClick={() => window.location.href = '/auth'}
            >
              Entrar
            </Button>
            <Button 
              variant="default" 
              size="sm" 
              className="text-xs sm:text-sm px-3 sm:px-4 whitespace-nowrap"
              onClick={() => window.location.href = '/auth'}
            >
              Cadastrar Agora →
            </Button>
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden p-2 hover:bg-[#F1F1F1] rounded-lg transition-colors"
            aria-label="Abrir menu"
          >
            <Menu className="w-6 h-6 text-[#191818]" />
          </button>
        </nav>
      </header>

      {/* ==================== MENU MOBILE ==================== */}
      {isMobileMenuOpen && (
        <>
          {/* Overlay Escuro */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
            style={{ top: 0, left: 0, right: 0, bottom: 0 }}
          />
          
          {/* Sidebar Menu */}
          <div 
            className="fixed top-0 right-0 bottom-0 w-[85vw] max-w-[320px] bg-white z-50 shadow-2xl md:hidden overflow-y-auto animate-slide-in"
          >
            
      {/* Header do Menu */}
      <div className="sticky top-0 bg-white z-10 flex items-center justify-between p-5 border-b border-[#F1F1F1]">
        <div className="flex items-center gap-2">
          <img 
            src={preseviewLogo} 
            alt="Preseview" 
            className="h-8"
          />
        </div>
              
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 hover:bg-[#F1F1F1] rounded-lg transition-colors"
                aria-label="Fechar menu"
              >
                <X className="w-6 h-6 text-[#666666]" />
              </button>
            </div>
            
            {/* Navigation Links */}
            <nav className="p-5 space-y-2">
              <a 
                href="#features" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3.5 text-[#191818] hover:bg-[#F9F9F9] hover:text-[#E71D36] rounded-xl transition-all font-medium"
              >
                <Sparkles className="w-5 h-5 flex-shrink-0" />
                <span>Features</span>
              </a>
              
              <a 
                href="#como-funciona" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3.5 text-[#191818] hover:bg-[#F9F9F9] hover:text-[#E71D36] rounded-xl transition-all font-medium"
              >
                <PlayCircle className="w-5 h-5 flex-shrink-0" />
                <span>Como Funciona</span>
              </a>
              
              <a 
                href="#stats" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3.5 text-[#191818] hover:bg-[#F9F9F9] hover:text-[#E71D36] rounded-xl transition-all font-medium"
              >
                <BarChart3 className="w-5 h-5 flex-shrink-0" />
                <span>Resultados</span>
              </a>
              
              <a 
                href="#contato" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3.5 text-[#191818] hover:bg-[#F9F9F9] hover:text-[#E71D36] rounded-xl transition-all font-medium"
              >
                <Mail className="w-5 h-5 flex-shrink-0" />
                <span>Contato</span>
              </a>
            </nav>
            
            {/* Divider */}
            <div className="mx-5 border-t border-[#F1F1F1]" />
            
            {/* CTA Buttons */}
            <div className="p-5 space-y-3">
              <button 
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  window.location.href = '/auth';
                }}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-white border-2 border-[#E71D36] text-[#E71D36] rounded-xl font-semibold hover:bg-[#E71D36] hover:text-white transition-all"
              >
                <LogIn className="w-5 h-5" />
                <span>Entrar</span>
              </button>
              
              <button 
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  window.location.href = '/auth';
                }}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-[#E71D36] text-white rounded-xl font-semibold hover:bg-[#D11A31] transition-all shadow-lg shadow-[#E71D36]/20"
              >
                <UserPlus className="w-5 h-5" />
                <span>Cadastrar Como Criador</span>
              </button>
            </div>
            
            {/* Social Media */}
            <div className="p-5 pt-8">
              <p className="text-xs text-[#666666] text-center mb-4 font-medium">
                Siga-nos nas redes sociais
              </p>
              <div className="flex items-center justify-center gap-3">
                <a 
                  href="#" 
                  className="w-11 h-11 rounded-xl bg-[#F9F9F9] border border-[#F1F1F1] flex items-center justify-center hover:bg-[#E71D36] hover:text-white hover:border-[#E71D36] transition-all"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a 
                  href="#" 
                  className="w-11 h-11 rounded-xl bg-[#F9F9F9] border border-[#F1F1F1] flex items-center justify-center hover:bg-[#E71D36] hover:text-white hover:border-[#E71D36] transition-all"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a 
                  href="#" 
                  className="w-11 h-11 rounded-xl bg-[#F9F9F9] border border-[#F1F1F1] flex items-center justify-center hover:bg-[#E71D36] hover:text-white hover:border-[#E71D36] transition-all"
                >
                  <Youtube className="w-5 h-5" />
                </a>
              </div>
            </div>
            
          </div>
        </>
      )}
      {/* ==================== FIM MENU MOBILE ==================== */}

      {/* Hero Section */}
      <section ref={heroRef} className="pt-16 sm:pt-24 pb-12 sm:pb-20 px-4 sm:px-6 bg-gradient-to-b from-white via-[hsl(var(--background-accent))] to-[hsl(var(--background-secondary))] w-full max-w-full overflow-hidden">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Column - Content */}
            <div className="text-center lg:text-left">
              
              {/* Badge */}
              <div className={`inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-6 ${
                heroVisible ? 'animate-slide-in-left delay-100' : 'opacity-0'
              }`}>
                <Sparkles className="w-4 h-4" />
                Plataforma Brasileira
              </div>
              
              {/* Headline */}
              <h1 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-foreground leading-tight mb-6 font-display px-2 break-words ${
                heroVisible ? 'animate-slide-in-up delay-200' : 'opacity-0'
              }`}>
                <TypewriterText
                  text="Monetize seu Conteúdo com"
                  trigger={heroVisible}
                  speed={30}
                />{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[hsl(var(--primary-900))]">
                  <TypewriterText
                    text="Liberdade e Controle"
                    trigger={heroVisible}
                    speed={30}
                  />
                </span>
              </h1>
              
              {/* Subtitle */}
              <p className={`text-base sm:text-lg md:text-xl text-[hsl(var(--neutral-500))] mb-8 max-w-2xl px-2 leading-relaxed break-words ${
                heroVisible ? 'animate-fade-in delay-300' : 'opacity-0'
              }`}>
                A plataforma brasileira completa para criadores monetizarem conteúdo exclusivo através de assinaturas, stories premium, gorjetas e afiliados. Sem taxas abusivas.
              </p>
              
              {/* CTAs */}
              <div className={`flex flex-col sm:flex-row gap-3 sm:gap-4 mb-10 w-full px-2 ${
                heroVisible ? 'animate-slide-in-up delay-400' : 'opacity-0'
              }`}>
                <Button 
                  variant="default" 
                  size="lg" 
                  className="group w-full sm:w-auto text-sm sm:text-base px-4 sm:px-6"
                  onClick={() => window.location.href = '/auth'}
                >
                  Cadastrar Como Criador
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full sm:w-auto text-sm sm:text-base px-4 sm:px-6"
                  onClick={() => window.location.href = '/auth'}
                >
                  <LogIn className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Entrar como Usuário
                </Button>
              </div>
              
              {/* Social Proof */}
              <div className={`flex flex-col sm:flex-row items-center gap-6 pt-6 border-t border-border ${
                heroVisible ? 'animate-scale-up delay-500' : 'opacity-0'
              }`}>
                {/* Stacked Avatars */}
                <div className="flex -space-x-3">
                  <img 
                    src={avatar1} 
                    alt="Criador" 
                    className="w-12 h-12 rounded-full border-3 border-white object-cover shadow-md" 
                  />
                  <img 
                    src={avatar2} 
                    alt="Criador" 
                    className="w-12 h-12 rounded-full border-3 border-white object-cover shadow-md" 
                  />
                  <img 
                    src={avatar3} 
                    alt="Criador" 
                    className="w-12 h-12 rounded-full border-3 border-white object-cover shadow-md" 
                  />
                  <img 
                    src={avatar4} 
                    alt="Criador" 
                    className="w-12 h-12 rounded-full border-3 border-white object-cover shadow-md" 
                  />
                  <div className="w-12 h-12 rounded-full bg-primary border-3 border-white flex items-center justify-center text-primary-foreground text-sm font-semibold shadow-md">
                    +10k
                  </div>
                </div>
                
                <div className="text-left">
                  <div className="flex items-center gap-1 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[hsl(var(--warning))] text-[hsl(var(--warning))]" />
                    ))}
                  </div>
                  <p className="text-sm text-[hsl(var(--neutral-500))]">
                    Mais de <span className="font-semibold text-foreground">10.000 criadores</span> ativos
                  </p>
                </div>
              </div>
              
            </div>
            
            {/* Right Column - Hero Visual */}
            <div className="relative">
              
              {/* Main Floating Card */}
              <div className={`relative z-10 bg-white rounded-3xl shadow-2xl p-6 sm:p-8 transform hover:scale-105 transition-transform duration-500 w-full max-w-full ${
                heroVisible ? 'animate-bounce-in' : 'opacity-0'
              }`}>
                
                {/* Card Header */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative">
                    <img 
                      src={heroModel} 
                      alt="Sophia AI" 
                      className="w-16 h-16 rounded-full object-cover border-3 border-white shadow-md" 
                    />
                    <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white bg-[hsl(var(--success))]"></div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-xl text-foreground">Sophia AI</h3>
                    <p className="text-sm text-[hsl(var(--neutral-500))]">@sophia.ai</p>
                  </div>
                  <Badge variant="default">Premium</Badge>
                </div>
                
                {/* Image Preview */}
                <div className="relative rounded-2xl overflow-hidden mb-4 aspect-[3/4]">
                  <img 
                    src={heroModel} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">1.2k</div>
                    <div className="text-xs text-[hsl(var(--neutral-500))]">Assinantes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">245</div>
                    <div className="text-xs text-[hsl(var(--neutral-500))]">Posts</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">R$15k</div>
                    <div className="text-xs text-[hsl(var(--neutral-500))]">Mês</div>
                  </div>
                </div>
                
              </div>
              
              {/* Floating Cards */}
              <div className={`hidden md:block absolute top-10 -left-6 bg-white rounded-2xl shadow-lg p-3 md:p-4 animate-float max-w-[180px] ${
                heroVisible ? 'animate-slide-in-left delay-200' : 'opacity-0'
              }`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[hsl(var(--success))]/10 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-[hsl(var(--success))]" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">+127%</div>
                    <div className="text-xs text-[hsl(var(--neutral-500))]">Este mês</div>
                  </div>
                </div>
              </div>
              
              <div className={`hidden md:block absolute bottom-10 -right-6 bg-white rounded-2xl shadow-lg p-3 md:p-4 animate-float-delayed max-w-[180px] ${
                heroVisible ? 'animate-slide-in-right delay-400' : 'opacity-0'
              }`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Heart className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">98%</div>
                    <div className="text-xs text-[hsl(var(--neutral-500))]">Satisfação</div>
                  </div>
                </div>
              </div>
              
              {/* Background Blurs */}
              <div className="hidden sm:block absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 lg:w-72 lg:h-72 bg-primary/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>
              <div className="hidden sm:block absolute bottom-0 left-0 w-40 h-40 sm:w-56 sm:h-56 lg:w-64 lg:h-64 bg-[hsl(var(--primary-900))]/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>
              
            </div>
            
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section ref={featuresRef} id="features" className="py-16 sm:py-24 px-4 sm:px-6 bg-white w-full max-w-full overflow-hidden">
        <div className="max-w-7xl mx-auto w-full">
          
          {/* Header */}
          <div className="text-center mb-12 sm:mb-16 px-2">
            <div className={`inline-block ${featuresVisible ? 'animate-fade-in delay-0' : 'opacity-0'}`}>
              <Badge variant="neutral" className="mb-4">Features</Badge>
            </div>
            <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6 font-display break-words ${
              featuresVisible ? 'animate-slide-in-up delay-100' : 'opacity-0'
            }`}>
              Por que escolher a Preseview?
            </h2>
            <p className={`text-base sm:text-lg md:text-xl text-[hsl(var(--neutral-500))] max-w-3xl mx-auto break-words leading-relaxed ${
              featuresVisible ? 'animate-fade-in delay-200' : 'opacity-0'
            }`}>
              Uma plataforma completa com todas as ferramentas para monetizar, 
              gerenciar e escalar seu conteúdo exclusivo com taxas justas.
            </p>
          </div>
          
          {/* Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 w-full">
            
            {/* Feature 1 */}
            <div 
              className={`group bg-white rounded-2xl p-6 md:p-8 border border-border hover:border-primary/20 hover:shadow-lg transition-all duration-300 w-full max-w-full ${
                featuresVisible ? 'animate-slide-in-up' : 'opacity-0'
              }`}
              style={{ animationDelay: featuresVisible ? '0.1s' : '0s' }}
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Sparkles className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-foreground mb-3 font-display break-words">
                Plataforma Completa para Criadores
              </h3>
              <p className="text-sm sm:text-base text-[hsl(var(--neutral-500))] leading-relaxed break-words">
                Tudo que você precisa para monetizar: assinaturas, pay-per-view, stories premium, chat direto e muito mais em uma única plataforma.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div 
              className={`group bg-white rounded-2xl p-6 md:p-8 border border-border hover:border-primary/20 hover:shadow-lg transition-all duration-300 w-full max-w-full ${
                featuresVisible ? 'animate-slide-in-up' : 'opacity-0'
              }`}
              style={{ animationDelay: featuresVisible ? '0.2s' : '0s' }}
            >
              <div className="w-14 h-14 rounded-xl bg-[hsl(var(--success))]/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <DollarSign className="w-7 h-7 text-[hsl(var(--success))]" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-foreground mb-3 font-display break-words">
                Múltiplas Fontes de Receita
              </h3>
              <p className="text-sm sm:text-base text-[hsl(var(--neutral-500))] leading-relaxed break-words">
                Assinaturas recorrentes, conteúdo pago individualmente, gorjetas, stories premium e programa de afiliados integrado.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div 
              className={`group bg-white rounded-2xl p-6 md:p-8 border border-border hover:border-primary/20 hover:shadow-lg transition-all duration-300 w-full max-w-full ${
                featuresVisible ? 'animate-slide-in-up' : 'opacity-0'
              }`}
              style={{ animationDelay: featuresVisible ? '0.3s' : '0s' }}
            >
              <div className="w-14 h-14 rounded-xl bg-[hsl(var(--info))]/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-7 h-7 text-[hsl(var(--info))]" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-foreground mb-3 font-display break-words">
                Dashboard Completo
              </h3>
              <p className="text-sm sm:text-base text-[hsl(var(--neutral-500))] leading-relaxed break-words">
                Acompanhe métricas em tempo real: vendas, assinantes, 
                engajamento, receita e relatórios detalhados.
              </p>
            </div>
            
            {/* Feature 4 */}
            <div 
              className={`group bg-white rounded-2xl p-6 md:p-8 border border-border hover:border-primary/20 hover:shadow-lg transition-all duration-300 w-full max-w-full ${
                featuresVisible ? 'animate-slide-in-up' : 'opacity-0'
              }`}
              style={{ animationDelay: featuresVisible ? '0.4s' : '0s' }}
            >
              <div className="w-14 h-14 rounded-xl bg-[hsl(var(--warning))]/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <MessageSquare className="w-7 h-7 text-[hsl(var(--warning))]" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-foreground mb-3 font-display break-words">
                Chat Direto com Assinantes
              </h3>
              <p className="text-sm sm:text-base text-[hsl(var(--neutral-500))] leading-relaxed break-words">
                Sistema de mensagens completo para interagir com seus assinantes. Configure mensagens automatizadas baseadas em eventos e engaje sua audiência.
              </p>
            </div>
            
            {/* Feature 5 */}
            <div 
              className={`group bg-white rounded-2xl p-6 md:p-8 border border-border hover:border-primary/20 hover:shadow-lg transition-all duration-300 w-full max-w-full ${
                featuresVisible ? 'animate-slide-in-up' : 'opacity-0'
              }`}
              style={{ animationDelay: featuresVisible ? '0.5s' : '0s' }}
            >
              <div className="w-14 h-14 rounded-xl bg-purple-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Shield className="w-7 h-7 text-purple-500" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-foreground mb-3 font-display break-words">
                Pagamentos Seguros
              </h3>
              <p className="text-sm sm:text-base text-[hsl(var(--neutral-500))] leading-relaxed break-words">
                Gateway integrado com split automático. Pix, cartão de crédito 
                e repasses programados diretamente na conta.
              </p>
            </div>
            
            {/* Feature 6 */}
            <div 
              className={`group bg-white rounded-2xl p-6 md:p-8 border border-border hover:border-primary/20 hover:shadow-lg transition-all duration-300 w-full max-w-full ${
                featuresVisible ? 'animate-slide-in-up' : 'opacity-0'
              }`}
              style={{ animationDelay: featuresVisible ? '0.6s' : '0s' }}
            >
              <div className="w-14 h-14 rounded-xl bg-pink-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-7 h-7 text-pink-500" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-foreground mb-3 font-display break-words">
                Stories com Paywall
              </h3>
              <p className="text-sm sm:text-base text-[hsl(var(--neutral-500))] leading-relaxed break-words">
                Publique stories exclusivos para assinantes ou com 
                desbloqueio individual. Engajamento e monetização.
              </p>
            </div>
            
          </div>
          
        </div>
      </section>

      {/* How It Works */}
      <section ref={stepsRef} id="como-funciona" className="py-16 sm:py-24 px-4 sm:px-6 bg-[hsl(var(--background-secondary))] w-full max-w-full overflow-hidden">
        <div className="max-w-7xl mx-auto w-full">
          
          {/* Header */}
          <div className="text-center mb-12 sm:mb-20 px-2">
            <div className={`inline-block ${stepsVisible ? 'animate-scale-in delay-0' : 'opacity-0'}`}>
              <Badge variant="neutral" className="mb-4">Como Funciona</Badge>
            </div>
            <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6 font-display break-words ${
              stepsVisible ? 'animate-slide-in-up delay-100' : 'opacity-0'
            }`}>
              Como funciona para criadores
            </h2>
            <p className={`text-base sm:text-lg md:text-xl text-[hsl(var(--neutral-500))] max-w-2xl mx-auto break-words leading-relaxed ${
              stepsVisible ? 'animate-fade-in delay-200' : 'opacity-0'
            }`}>
              Do cadastro ao primeiro pagamento, tudo em minutos
            </p>
          </div>
          
          {/* Timeline */}
          <div className="relative">
            
            {/* Connecting Line - Desktop */}
            <div className="hidden lg:block absolute top-20 left-0 right-0 h-1 mx-auto max-w-4xl">
              <div className="absolute inset-0 bg-gradient-to-r from-primary via-[hsl(var(--primary-600))] to-[hsl(var(--primary-900))]"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-primary via-[hsl(var(--primary-600))] to-[hsl(var(--primary-900))] blur-sm"></div>
            </div>
            
            {/* Steps Grid */}
            <div className="grid lg:grid-cols-3 gap-12 lg:gap-8 relative">
              
              {/* Step 1 */}
              <div className={`relative ${
                stepsVisible ? 'animate-slide-in-left delay-200' : 'opacity-0'
              }`}>
                <div className="flex justify-center mb-6">
                  <div className="relative z-10 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary flex items-center justify-center shadow-lg">
                    <span className="text-2xl sm:text-3xl font-bold text-primary-foreground">1</span>
                  </div>
                </div>
                
                <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-lg transition-shadow w-full max-w-full">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-primary/10 flex items-center justify-center mb-6 mx-auto">
                    <User className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-4 text-center font-display px-2 break-words">
                    Crie seu Perfil
                  </h3>
                  <p className="text-sm sm:text-base text-[hsl(var(--neutral-500))] text-center leading-relaxed break-words px-2">
                    Cadastre-se gratuitamente e configure seu perfil de criador. Adicione fotos, biografia, redes sociais e personalize sua página.
                  </p>
                </div>
              </div>
              
              {/* Step 2 */}
              <div className={`relative ${
                stepsVisible ? 'animate-scale-up delay-300' : 'opacity-0'
              }`}>
                <div className="flex justify-center mb-6">
                  <div className="relative z-10 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[hsl(var(--primary-600))] flex items-center justify-center shadow-lg">
                    <span className="text-2xl sm:text-3xl font-bold text-primary-foreground">2</span>
                  </div>
                </div>
                
                <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-lg transition-shadow w-full max-w-full">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-[hsl(var(--primary-600))]/10 flex items-center justify-center mb-6 mx-auto">
                    <Settings className="w-7 h-7 sm:w-8 sm:h-8 text-[hsl(var(--primary-600))]" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-4 text-center font-display px-2 break-words">
                    Configure seus Planos de Assinatura
                  </h3>
                  <p className="text-sm sm:text-base text-[hsl(var(--neutral-500))] text-center leading-relaxed break-words px-2">
                    Defina os preços das suas assinaturas (mensal, trimestral, anual), crie promoções e configure o acesso ao conteúdo exclusivo.
                  </p>
                </div>
              </div>
              
              {/* Step 3 */}
              <div className={`relative ${
                stepsVisible ? 'animate-slide-in-right delay-400' : 'opacity-0'
              }`}>
                <div className="flex justify-center mb-6">
                  <div className="relative z-10 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[hsl(var(--primary-900))] flex items-center justify-center shadow-lg">
                    <span className="text-2xl sm:text-3xl font-bold text-primary-foreground">3</span>
                  </div>
                </div>
                
                <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-lg transition-shadow w-full max-w-full">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-[hsl(var(--primary-900))]/10 flex items-center justify-center mb-6 mx-auto">
                    <TrendingUp className="w-7 h-7 sm:w-8 sm:h-8 text-[hsl(var(--primary-900))]" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-4 text-center font-display px-2 break-words">
                    Comece a Lucrar
                  </h3>
                  <p className="text-sm sm:text-base text-[hsl(var(--neutral-500))] text-center leading-relaxed break-words px-2">
                    Publique conteúdo, interaja com assinantes através do chat, receba gorjetas e acompanhe seus ganhos em tempo real no dashboard.
                  </p>
                </div>
              </div>
              
            </div>
            
          </div>
          
          {/* CTA */}
          <div className="text-center mt-16">
            <Button 
              variant="default" 
              size="lg"
              onClick={() => window.location.href = '/auth'}
            >
              Cadastrar Como Criador →
            </Button>
          </div>
          
        </div>
      </section>

      {/* Stats */}
      <section ref={statsRef} id="stats" className="py-12 sm:py-20 px-4 sm:px-6 bg-white w-full max-w-full overflow-hidden">
        <div className="max-w-7xl mx-auto w-full">
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            
            {/* Stat 1 */}
            <div className={`text-center ${
              statsVisible ? 'animate-scale-up delay-100' : 'opacity-0'
            }`}>
              <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-primary mb-2 sm:mb-3 font-display break-words">
                10k+
              </div>
              <div className="text-sm sm:text-base md:text-lg text-[hsl(var(--neutral-500))] break-words px-2">
                Criadores Ativos
              </div>
            </div>
            
            {/* Stat 2 */}
            <div className={`text-center ${
              statsVisible ? 'animate-scale-up delay-200' : 'opacity-0'
            }`}>
              <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-primary mb-2 sm:mb-3 font-display break-words">
                R$2.5M
              </div>
              <div className="text-sm sm:text-base md:text-lg text-[hsl(var(--neutral-500))] break-words px-2">
                Pagamentos Mensais
              </div>
            </div>
            
            {/* Stat 3 */}
            <div className={`text-center ${
              statsVisible ? 'animate-scale-up delay-300' : 'opacity-0'
            }`}>
              <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-primary mb-2 sm:mb-3 font-display break-words">
                98%
              </div>
              <div className="text-sm sm:text-base md:text-lg text-[hsl(var(--neutral-500))] break-words px-2">
                Satisfação
              </div>
            </div>
            
            {/* Stat 4 */}
            <div className={`text-center ${
              statsVisible ? 'animate-scale-up delay-400' : 'opacity-0'
            }`}>
              <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-primary mb-2 sm:mb-3 font-display break-words">
                24/7
              </div>
              <div className="text-sm sm:text-base md:text-lg text-[hsl(var(--neutral-500))] break-words px-2">
                Suporte
              </div>
            </div>
            
          </div>
          
        </div>
      </section>

      {/* Showcase de Modelos */}
      <section ref={showcaseRef} className="py-16 sm:py-24 px-4 sm:px-6 bg-[hsl(var(--background-secondary))] w-full max-w-full overflow-hidden">
        <div className="max-w-7xl mx-auto w-full">
          
          {/* Header */}
          <div className="text-center mb-12 sm:mb-16 px-2">
            <div className={`inline-block ${showcaseVisible ? 'animate-fade-in delay-0' : 'opacity-0'}`}>
              <Badge variant="neutral" className="mb-4">Showcase</Badge>
            </div>
            <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6 font-display break-words ${
              showcaseVisible ? 'animate-slide-in-up delay-100' : 'opacity-0'
            }`}>
              Criadores em destaque
            </h2>
            <p className={`text-base sm:text-lg md:text-xl text-[hsl(var(--neutral-500))] max-w-3xl mx-auto break-words leading-relaxed ${
              showcaseVisible ? 'animate-fade-in delay-200' : 'opacity-0'
            }`}>
              Conheça alguns dos criadores de maior sucesso da plataforma
            </p>
          </div>
          
          {/* Grid de Modelos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12 w-full">
            
            {/* Modelo 1 - Sophia AI */}
            <div 
              className={`group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 w-full max-w-full ${
                showcaseVisible ? 'animate-bounce-in' : 'opacity-0'
              }`}
              style={{ animationDelay: showcaseVisible ? '0.1s' : '0s' }}
            >
              {/* Badge */}
              <div className="absolute top-4 right-4 z-10">
                <Badge variant="default">Premium</Badge>
              </div>
              
              {/* Imagem */}
              <div className="relative aspect-[3/4] bg-gradient-to-br from-[hsl(var(--neutral-50))] to-[hsl(var(--neutral-200))] flex items-center justify-center overflow-hidden">
                <User className="w-16 h-16 text-[hsl(var(--neutral-400))]" />
                {/* Overlay no hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                  <Button variant="secondary" size="sm">Ver Perfil</Button>
                </div>
              </div>
              
              {/* Info */}
              <div className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="relative">
                    <img 
                      src={avatar1} 
                      alt="Sophia AI" 
                      className="w-10 h-10 rounded-full object-cover" 
                    />
                    <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white bg-[hsl(var(--success))]"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg text-foreground truncate">Sophia AI</h3>
                    <p className="text-sm text-[hsl(var(--neutral-500))] truncate">@sophia.ai</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1 text-[hsl(var(--neutral-500))]">
                    <Heart className="w-4 h-4" />
                    <span>1.2k</span>
                  </div>
                  <div className="flex items-center gap-1 text-primary font-medium">
                    <TrendingUp className="w-4 h-4" />
                    <span>Top 5%</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Modelo 2 - Luna Model */}
            <div 
              className={`group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 ${
                showcaseVisible ? 'animate-bounce-in' : 'opacity-0'
              }`}
              style={{ animationDelay: showcaseVisible ? '0.2s' : '0s' }}
            >
              <div className="absolute top-4 right-4 z-10">
                <Badge variant="success">Popular</Badge>
              </div>
              
              <div className="relative aspect-[3/4] bg-gradient-to-br from-[hsl(var(--neutral-50))] to-[hsl(var(--neutral-200))] flex items-center justify-center">
                <User className="w-16 h-16 text-[hsl(var(--neutral-400))]" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                  <Button variant="secondary" size="sm">Ver Perfil</Button>
                </div>
              </div>
              
              <div className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="relative">
                    <img 
                      src={avatar2} 
                      alt="Luna Model" 
                      className="w-10 h-10 rounded-full object-cover" 
                    />
                    <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white bg-[hsl(var(--success))]"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg text-foreground truncate">Luna Model</h3>
                    <p className="text-sm text-[hsl(var(--neutral-500))] truncate">@luna.model</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1 text-[hsl(var(--neutral-500))]">
                    <Heart className="w-4 h-4" />
                    <span>890</span>
                  </div>
                  <div className="flex items-center gap-1 text-[hsl(var(--success))] font-medium">
                    <TrendingUp className="w-4 h-4" />
                    <span>Rising</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Modelo 3 - Aria Virtual */}
            <div 
              className={`group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 ${
                showcaseVisible ? 'animate-bounce-in' : 'opacity-0'
              }`}
              style={{ animationDelay: showcaseVisible ? '0.3s' : '0s' }}
            >
              <div className="absolute top-4 right-4 z-10">
                <Badge className="bg-purple-500 text-white border-transparent">VIP</Badge>
              </div>
              
              <div className="relative aspect-[3/4] bg-gradient-to-br from-[hsl(var(--neutral-50))] to-[hsl(var(--neutral-200))] flex items-center justify-center">
                <User className="w-16 h-16 text-[hsl(var(--neutral-400))]" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                  <Button variant="secondary" size="sm">Ver Perfil</Button>
                </div>
              </div>
              
              <div className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="relative">
                    <img 
                      src={avatar3} 
                      alt="Aria Virtual" 
                      className="w-10 h-10 rounded-full object-cover" 
                    />
                    <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white bg-[hsl(var(--success))]"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg text-foreground truncate">Aria Virtual</h3>
                    <p className="text-sm text-[hsl(var(--neutral-500))] truncate">@aria.virtual</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1 text-[hsl(var(--neutral-500))]">
                    <Heart className="w-4 h-4" />
                    <span>2.1k</span>
                  </div>
                  <div className="flex items-center gap-1 text-primary font-medium">
                    <Sparkles className="w-4 h-4" />
                    <span>Hot</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Modelo 4 - Nova Star */}
            <div 
              className={`group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 ${
                showcaseVisible ? 'animate-bounce-in' : 'opacity-0'
              }`}
              style={{ animationDelay: showcaseVisible ? '0.4s' : '0s' }}
            >
              <div className="absolute top-4 right-4 z-10">
                <Badge className="bg-[hsl(var(--info))] text-white border-transparent">New</Badge>
              </div>
              
              <div className="relative aspect-[3/4] bg-gradient-to-br from-[hsl(var(--neutral-50))] to-[hsl(var(--neutral-200))] flex items-center justify-center">
                <User className="w-16 h-16 text-[hsl(var(--neutral-400))]" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                  <Button variant="secondary" size="sm">Ver Perfil</Button>
                </div>
              </div>
              
              <div className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="relative">
                    <img 
                      src={avatar4} 
                      alt="Nova Star" 
                      className="w-10 h-10 rounded-full object-cover" 
                    />
                    <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white bg-[hsl(var(--success))]"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg text-foreground truncate">Nova Star</h3>
                    <p className="text-sm text-[hsl(var(--neutral-500))] truncate">@nova.star</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1 text-[hsl(var(--neutral-500))]">
                    <Heart className="w-4 h-4" />
                    <span>456</span>
                  </div>
                  <div className="flex items-center gap-1 text-[hsl(var(--info))] font-medium">
                    <Star className="w-4 h-4" />
                    <span>New</span>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
          
          {/* CTA */}
          <div className="text-center">
            <Button variant="outline" size="lg">
              Explorar Criadores →
            </Button>
          </div>
          
        </div>
      </section>

      {/* Depoimentos */}
      <section ref={testimonialsRef} className="py-16 sm:py-24 px-4 sm:px-6 bg-white w-full max-w-full overflow-hidden">
        <div className="max-w-7xl mx-auto w-full">
          
          {/* Header */}
          <div className="text-center mb-12 sm:mb-16 px-2">
            <div className={`inline-block ${testimonialsVisible ? 'animate-fade-in delay-0' : 'opacity-0'}`}>
              <Badge variant="neutral" className="mb-4">Depoimentos</Badge>
            </div>
            <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6 font-display break-words ${
              testimonialsVisible ? 'animate-slide-in-up delay-100' : 'opacity-0'
            }`}>
              O que nossos criadores dizem
            </h2>
            <p className={`text-base sm:text-lg md:text-xl text-[hsl(var(--neutral-500))] max-w-3xl mx-auto break-words leading-relaxed ${
              testimonialsVisible ? 'animate-fade-in delay-200' : 'opacity-0'
            }`}>
              Histórias reais de criadores que transformaram suas vidas com a Preseview
            </p>
          </div>
          
          {/* Grid de Depoimentos */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 w-full">
            
            {/* Depoimento 1 */}
            <div 
              className={`bg-white rounded-2xl p-6 sm:p-8 border border-border hover:shadow-lg transition-shadow w-full max-w-full ${
                testimonialsVisible ? 'animate-slide-in-up' : 'opacity-0'
              }`}
              style={{ animationDelay: testimonialsVisible ? '0.1s' : '0s' }}
            >
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-[hsl(var(--warning))] text-[hsl(var(--warning))]" />
                ))}
              </div>
              <p className="text-sm sm:text-base text-[hsl(var(--neutral-500))] mb-6 leading-relaxed break-words">
                "Migrei de outra plataforma e a diferença é absurda. Aqui pago apenas 8% de comissão e tenho muito mais controle sobre meu conteúdo."
              </p>
              <div className="flex items-center gap-3">
                <img 
                  src={avatar1} 
                  alt="Carlos Silva" 
                  className="w-12 h-12 rounded-full object-cover" 
                />
                <div>
                  <h4 className="font-semibold text-foreground">Carlos Silva</h4>
                  <p className="text-sm text-[hsl(var(--neutral-500))]">4 meses na plataforma</p>
                  <p className="text-sm text-primary font-medium">R$12k/mês</p>
                </div>
              </div>
            </div>
            
            {/* Depoimento 2 */}
            <div 
              className={`bg-white rounded-2xl p-8 border border-border hover:shadow-lg transition-shadow ${
                testimonialsVisible ? 'animate-slide-in-up' : 'opacity-0'
              }`}
              style={{ animationDelay: testimonialsVisible ? '0.2s' : '0s' }}
            >
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-[hsl(var(--warning))] text-[hsl(var(--warning))]" />
                ))}
              </div>
              <p className="text-[hsl(var(--neutral-500))] mb-6 leading-relaxed">
                "O dashboard é completo e intuitivo. Consigo acompanhar tudo: vendas, assinantes, engajamento e repasses. Com o programa de afiliados consegui multiplicar minha receita!"
              </p>
              <div className="flex items-center gap-3">
                <img 
                  src={avatar2} 
                  alt="Mariana Costa" 
                  className="w-12 h-12 rounded-full object-cover" 
                />
                <div>
                  <h4 className="font-semibold text-foreground">Mariana Costa</h4>
                  <p className="text-sm text-[hsl(var(--neutral-500))]">6 meses na plataforma</p>
                  <p className="text-sm text-primary font-medium">R$18k/mês</p>
                </div>
              </div>
            </div>
            
            {/* Depoimento 3 */}
            <div 
              className={`bg-white rounded-2xl p-8 border border-border hover:shadow-lg transition-shadow ${
                testimonialsVisible ? 'animate-slide-in-up' : 'opacity-0'
              }`}
              style={{ animationDelay: testimonialsVisible ? '0.3s' : '0s' }}
            >
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-[hsl(var(--warning))] text-[hsl(var(--warning))]" />
                ))}
              </div>
              <p className="text-[hsl(var(--neutral-500))] mb-6 leading-relaxed">
                "Comecei do zero e em 2 meses já estava lucrando. A plataforma é intuitiva e o suporte em português faz toda a diferença!"
              </p>
              <div className="flex items-center gap-3">
                <img 
                  src={avatar3} 
                  alt="Pedro Oliveira" 
                  className="w-12 h-12 rounded-full object-cover" 
                />
                <div>
                  <h4 className="font-semibold text-foreground">Pedro Oliveira</h4>
                  <p className="text-sm text-[hsl(var(--neutral-500))]">2 meses na plataforma</p>
                  <p className="text-sm text-primary font-medium">R$7k/mês</p>
                </div>
              </div>
            </div>
            
            {/* Depoimento 4 */}
            <div 
              className={`bg-white rounded-2xl p-8 border border-border hover:shadow-lg transition-shadow ${
                testimonialsVisible ? 'animate-slide-in-up' : 'opacity-0'
              }`}
              style={{ animationDelay: testimonialsVisible ? '0.4s' : '0s' }}
            >
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-[hsl(var(--warning))] text-[hsl(var(--warning))]" />
                ))}
              </div>
              <p className="text-[hsl(var(--neutral-500))] mb-6 leading-relaxed">
                "O sistema de mensagens é perfeito! Consigo interagir com meus assinantes de forma organizada e configurar respostas automáticas para agilizar."
              </p>
              <div className="flex items-center gap-3">
                <img 
                  src={avatar4} 
                  alt="Ana Paula" 
                  className="w-12 h-12 rounded-full object-cover" 
                />
                <div>
                  <h4 className="font-semibold text-foreground">Ana Paula</h4>
                  <p className="text-sm text-[hsl(var(--neutral-500))]">5 meses na plataforma</p>
                  <p className="text-sm text-primary font-medium">R$25k/mês</p>
                </div>
              </div>
            </div>
            
            {/* Depoimento 5 */}
            <div 
              className={`bg-white rounded-2xl p-8 border border-border hover:shadow-lg transition-shadow ${
                testimonialsVisible ? 'animate-slide-in-up' : 'opacity-0'
              }`}
              style={{ animationDelay: testimonialsVisible ? '0.5s' : '0s' }}
            >
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-[hsl(var(--warning))] text-[hsl(var(--warning))]" />
                ))}
              </div>
              <p className="text-[hsl(var(--neutral-500))] mb-6 leading-relaxed">
                "Recebo meus pagamentos rapidamente via Pix e o suporte é excelente. A comissão de 8% é muito justa comparada às outras plataformas!"
              </p>
              <div className="flex items-center gap-3">
                <img 
                  src={avatar1} 
                  alt="Lucas Ferreira" 
                  className="w-12 h-12 rounded-full object-cover" 
                />
                <div>
                  <h4 className="font-semibold text-foreground">Lucas Ferreira</h4>
                  <p className="text-sm text-[hsl(var(--neutral-500))]">8 meses na plataforma</p>
                  <p className="text-sm text-primary font-medium">R$32k/mês</p>
                </div>
              </div>
            </div>
            
            {/* Depoimento 6 */}
            <div 
              className={`bg-white rounded-2xl p-8 border border-border hover:shadow-lg transition-shadow ${
                testimonialsVisible ? 'animate-slide-in-up' : 'opacity-0'
              }`}
              style={{ animationDelay: testimonialsVisible ? '0.6s' : '0s' }}
            >
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-[hsl(var(--warning))] text-[hsl(var(--warning))]" />
                ))}
              </div>
              <p className="text-[hsl(var(--neutral-500))] mb-6 leading-relaxed">
                "A plataforma é super fácil de usar! Mesmo sem conhecimento técnico consegui configurar tudo e começar a monetizar em poucos dias."
              </p>
              <div className="flex items-center gap-3">
                <img 
                  src={avatar2} 
                  alt="Juliana Mendes" 
                  className="w-12 h-12 rounded-full object-cover" 
                />
                <div>
                  <h4 className="font-semibold text-foreground">Juliana Mendes</h4>
                  <p className="text-sm text-[hsl(var(--neutral-500))]">7 meses na plataforma</p>
                  <p className="text-sm text-primary font-medium">R$22k/mês</p>
                </div>
              </div>
            </div>
            
          </div>
          
        </div>
      </section>

      {/* FAQ */}
      <FAQSection />

      {/* Final CTA */}
      <section ref={ctaRef} className="relative py-16 sm:py-24 px-4 sm:px-6 bg-gradient-to-br from-primary via-[hsl(var(--primary-600))] to-[hsl(var(--primary-900))] text-primary-foreground overflow-hidden w-full max-w-full">
        {/* Elementos decorativos */}
        <div className="hidden sm:block absolute top-0 right-0 w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="hidden sm:block absolute bottom-0 left-0 w-56 h-56 sm:w-72 sm:h-72 lg:w-80 lg:h-80 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10 w-full px-2">
          {/* Icon */}
          <div className={`w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto mb-8 ${
            ctaVisible ? 'animate-bounce-in delay-0' : 'opacity-0'
          }`}>
            <Sparkles className="w-10 h-10 text-white animate-float-up" />
          </div>
          
          <h2 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 font-display leading-tight px-2 break-words ${
            ctaVisible ? 'animate-slide-in-up delay-100' : 'opacity-0'
          }`}>
            <TypewriterText
              text="Pronto para monetizar seu conteúdo com liberdade?"
              trigger={ctaVisible}
              speed={25}
            />
          </h2>
          <p className={`text-base sm:text-lg md:text-xl mb-10 opacity-90 max-w-2xl mx-auto px-2 break-words leading-relaxed ${
            ctaVisible ? 'animate-fade-in delay-200' : 'opacity-0'
          }`}>
            Junte-se a milhares de criadores que escolheram a plataforma brasileira com as menores taxas do mercado
          </p>
          
          {/* Form */}
          <div className={`flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-xl mx-auto mb-8 w-full ${
            ctaVisible ? 'animate-scale-up delay-300' : 'opacity-0'
          }`}>
            <input 
              type="email" 
              placeholder="Seu melhor email"
              className="flex-1 rounded-xl px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base text-foreground bg-white border-2 border-transparent focus:border-white focus:ring-4 focus:ring-white/20 transition-all outline-none w-full"
            />
            <Button 
              variant="secondary" 
              size="lg" 
              className="whitespace-nowrap w-full sm:w-auto text-sm sm:text-base px-4 sm:px-6"
              onClick={() => window.location.href = '/auth'}
            >
              Cadastrar Agora
            </Button>
          </div>
          
          {/* Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm opacity-90">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                <Check className="w-3 h-3" />
              </div>
              <span>Comissão de apenas 8%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                <Check className="w-3 h-3" />
              </div>
              <span>Cancele quando quiser</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                <Check className="w-3 h-3" />
              </div>
              <span>Suporte em português</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 sm:py-16 px-4 sm:px-6 bg-[hsl(var(--neutral-800))] text-white w-full max-w-full overflow-hidden">
        <div className="max-w-7xl mx-auto w-full">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-12 mb-12 w-full">
            
            {/* Brand - 2 colunas no desktop */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <img 
                  src={preseviewLogo} 
                  alt="Preseview" 
                  className="h-10 brightness-0 invert"
                />
              </div>
              <p className="text-sm sm:text-base text-gray-400 mb-6 max-w-sm break-words leading-relaxed">
                A plataforma brasileira completa para criadores monetizarem conteúdo exclusivo com comissão justa e ferramentas profissionais.
              </p>
              
              {/* Social Icons */}
              <div className="flex items-center gap-3">
                <a href="#" className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
                  <Youtube className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
            
            {/* Produto */}
            <div>
              <h4 className="font-semibold mb-4 text-lg">Produto</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#features" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Preços</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Roadmap</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Changelog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
            
            {/* Recursos */}
            <div>
              <h4 className="font-semibold mb-4 text-lg">Recursos</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Guias</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">API Docs</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Suporte</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Comunidade</a></li>
              </ul>
            </div>
            
            {/* Legal */}
            <div>
              <h4 className="font-semibold mb-4 text-lg">Legal</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Termos de Uso</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacidade</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Cookies</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">LGPD</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contato</a></li>
              </ul>
            </div>
            
          </div>
          
          {/* Bottom bar */}
          <div className="pt-6 md:pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 w-full">
            <p className="text-xs sm:text-sm text-gray-400 text-center md:text-left">
              © 2025 Preseview. Todos os direitos reservados.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
              <span className="text-xs text-gray-500 whitespace-nowrap">Pagamentos via:</span>
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center">
                <div className="px-2 sm:px-3 py-1 bg-white/5 rounded text-xs font-medium">Pix</div>
                <div className="px-2 sm:px-3 py-1 bg-white/5 rounded text-xs font-medium">Visa</div>
                <div className="px-2 sm:px-3 py-1 bg-white/5 rounded text-xs font-medium">Master</div>
                <div className="px-2 sm:px-3 py-1 bg-white/5 rounded text-xs font-medium">Elo</div>
              </div>
            </div>
          </div>
          
        </div>
      </footer>
      
    </div>
  );
};

// FAQ Component with Accordion
const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { ref: faqRef, isVisible: faqVisible } = useScrollAnimation({ threshold: 0.15 });
  
  const faqs = [
    {
      question: "Como funciona a monetização na Preseview?",
      answer: "A Preseview oferece múltiplas formas de monetização: assinaturas recorrentes (mensal, trimestral, anual), pay-per-view para conteúdo específico, stories premium com desbloqueio individual, gorjetas diretas dos fãs e programa de afiliados. Você tem controle total sobre os preços e pode combinar todas essas fontes de receita."
    },
    {
      question: "Qual a comissão cobrada pela plataforma?",
      answer: "Cobramos apenas 8% sobre cada transação, uma das menores taxas do mercado. Diferente de outras plataformas que cobram 20-30%, na Preseview você fica com a maior parte da receita que gera. Não há mensalidades ou taxas escondidas."
    },
    {
      question: "Quanto tempo leva para receber os pagamentos?",
      answer: "Os pagamentos são processados automaticamente. Após a confirmação do pagamento do assinante, o valor fica disponível para saque em até 7 dias úteis. Suportamos Pix (instantâneo) e transferência bancária. O repasse é transparente e você acompanha tudo em tempo real no dashboard."
    },
    {
      question: "Como funciona o programa de afiliados?",
      answer: "Você recebe uma comissão de 20% sobre todas as vendas geradas por seus links de afiliado durante 12 meses. É uma forma excelente de aumentar sua receita promovendo a plataforma para outros criadores. O sistema de tracking é automático e transparente."
    },
    {
      question: "Preciso de conhecimentos técnicos?",
      answer: "Não! A plataforma é intuitiva e fácil de usar. Qualquer pessoa consegue cadastrar seu perfil, configurar planos de assinatura, publicar conteúdo e gerenciar assinantes. Todo o processo é guiado e, se tiver dúvidas, nosso suporte em português está sempre disponível."
    },
    {
      question: "Os dados e pagamentos são seguros?",
      answer: "Sim, levamos segurança muito a sério. Todos os dados são criptografados, usamos certificados SSL, e os pagamentos são processados pelo Pagar.me, um gateway certificado PCI-DSS. Suas informações financeiras e dos assinantes estão totalmente protegidas."
    }
  ];
  
  return (
    <section ref={faqRef} id="faq" className="py-16 sm:py-24 px-4 sm:px-6 bg-[hsl(var(--background-secondary))] w-full max-w-full overflow-hidden">
      <div className="max-w-4xl mx-auto w-full">
        
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16 px-2">
          <div className={`inline-block ${faqVisible ? 'animate-fade-in delay-0' : 'opacity-0'}`}>
            <Badge variant="neutral" className="mb-4">FAQ</Badge>
          </div>
          <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6 font-display break-words ${
            faqVisible ? 'animate-slide-in-up delay-100' : 'opacity-0'
          }`}>
            Perguntas Frequentes
          </h2>
          <p className={`text-base sm:text-lg md:text-xl text-[hsl(var(--neutral-500))] break-words leading-relaxed ${
            faqVisible ? 'animate-fade-in delay-200' : 'opacity-0'
          }`}>
            Tudo o que você precisa saber sobre a Preseview
          </p>
        </div>
        
        {/* Accordion */}
        <div className="space-y-4 mb-12 w-full">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className={`bg-white rounded-2xl border border-border overflow-hidden ${
                faqVisible ? 'animate-slide-in-up' : 'opacity-0'
              }`}
              style={{ animationDelay: faqVisible ? `${index * 0.1}s` : '0s' }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-[hsl(var(--neutral-50))] transition-colors"
              >
                <span className="font-semibold text-lg text-foreground pr-8">
                  {faq.question}
                </span>
                <ChevronDown 
                  className={`w-5 h-5 text-[hsl(var(--neutral-500))] flex-shrink-0 transition-transform duration-200 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              
              <div 
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <div className="px-4 sm:px-8 pb-4 sm:pb-6 text-sm sm:text-base text-[hsl(var(--neutral-500))] leading-relaxed break-words">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Card de Suporte */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 text-center border border-border w-full max-w-full">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-3 font-display break-words px-2">
            Ainda tem dúvidas?
          </h3>
          <p className="text-sm sm:text-base text-[hsl(var(--neutral-500))] mb-6 break-words px-2">
            Nossa equipe está pronta para ajudar você a começar
          </p>
          <Button variant="outline" size="lg" className="w-full sm:w-auto text-sm sm:text-base">
            <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            Falar com Suporte
          </Button>
        </div>
        
      </div>
    </section>
  );
};

export default Index;
