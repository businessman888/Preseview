import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Heart, Image, TrendingUp, DollarSign, Video } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface InsightsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface InsightsData {
  totalSubscribers: number;
  totalPosts: number;
  totalLikes: number;
  totalImages: number;
  totalVideos: number;
  avgLikesPerPost: number;
  subscribersGrowth: number;
  monthlyRevenue: number;
}

export function InsightsModal({ isOpen, onClose }: InsightsModalProps) {
  const { user } = useAuth();

  const { data: insights, isLoading } = useQuery<InsightsData>({
    queryKey: ["/api/creator/insights"],
    enabled: isOpen && user?.type === "creator",
  });

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    subtitle,
    trend 
  }: { 
    title: string; 
    value: string | number; 
    icon: any; 
    subtitle?: string;
    trend?: string;
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
        {trend && (
          <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            {trend}
          </p>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Insights do Criador</DialogTitle>
          <DialogDescription>
            Acompanhe suas métricas e desempenho
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i}>
                <CardHeader className="space-y-0 pb-2">
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-3 w-32 mt-2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Main Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <StatCard
                title="Total de Assinantes"
                value={insights?.totalSubscribers || 0}
                icon={Users}
                trend={insights?.subscribersGrowth ? `+${insights.subscribersGrowth} este mês` : undefined}
                data-testid="stat-subscribers"
              />
              
              <StatCard
                title="Total de Posts"
                value={insights?.totalPosts || 0}
                icon={Image}
                subtitle="Conteúdo publicado"
                data-testid="stat-posts"
              />
              
              <StatCard
                title="Curtidas Totais"
                value={insights?.totalLikes || 0}
                icon={Heart}
                subtitle={`Média: ${insights?.avgLikesPerPost?.toFixed(1) || 0} por post`}
                data-testid="stat-likes"
              />

              <StatCard
                title="Imagens"
                value={insights?.totalImages || 0}
                icon={Image}
                subtitle="Conteúdo visual"
                data-testid="stat-images"
              />

              <StatCard
                title="Vídeos"
                value={insights?.totalVideos || 0}
                icon={Video}
                subtitle="Conteúdo em vídeo"
                data-testid="stat-videos"
              />

              <StatCard
                title="Receita Mensal"
                value={`R$ ${insights?.monthlyRevenue?.toFixed(2) || '0.00'}`}
                icon={DollarSign}
                subtitle="Estimado"
                data-testid="stat-revenue"
              />
            </div>

            {/* Engagement Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Visão Geral de Engajamento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Taxa de Engajamento</span>
                    <span className="text-sm text-muted-foreground">
                      {insights?.avgLikesPerPost 
                        ? `${((insights.avgLikesPerPost / (insights.totalSubscribers || 1)) * 100).toFixed(1)}%`
                        : '0%'
                      }
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Conteúdo por Tipo</span>
                    <span className="text-sm text-muted-foreground">
                      {insights?.totalImages || 0} fotos, {insights?.totalVideos || 0} vídeos
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Crescimento</span>
                    <span className="text-sm text-green-600">
                      +{insights?.subscribersGrowth || 0} assinantes este mês
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
