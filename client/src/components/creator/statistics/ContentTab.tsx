import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Eye, Heart, MessageCircle, Gift } from "lucide-react";
import { useContentStats } from "@/hooks/use-statistics";

interface ContentTabProps {
  period: string;
  onPeriodChange: (period: string) => void;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    dataKey: string;
    payload: { date: string; posts: number; views: number; likes: number; comments: number };
  }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          {format(new Date(label || ''), 'dd/MM/yyyy', { locale: ptBR })}
        </p>
        <div className="space-y-1">
          <p className="text-sm text-blue-600 font-medium">
            👁️ {data.views.toLocaleString()} visualizações
          </p>
          <p className="text-sm text-red-600 font-medium">
            ❤️ {data.likes.toLocaleString()} curtidas
          </p>
          <p className="text-sm text-green-600 font-medium">
            💬 {data.comments.toLocaleString()} comentários
          </p>
          <p className="text-sm text-yellow-600 font-medium">
            🎁 {data.posts} posts
          </p>
        </div>
      </div>
    );
  }
  return null;
}

export function ContentTab({ period, onPeriodChange }: ContentTabProps) {
  const [visibleMetrics, setVisibleMetrics] = useState<Set<string>>(new Set(['views', 'likes', 'comments', 'posts']));
  
  const { data: contentStats, isLoading } = useContentStats(period);

  const toggleMetric = (metric: string) => {
    setVisibleMetrics(prev => {
      const newSet = new Set(prev);
      if (newSet.has(metric)) {
        newSet.delete(metric);
      } else {
        newSet.add(metric);
      }
      return newSet;
    });
  };

  if (isLoading) {
    return <ContentTabSkeleton />;
  }

  const chartData = contentStats?.data || [];
  const averageViewsPerPost = contentStats?.averageViews || 0;

  return (
    <div className="space-y-6">
      {/* Cards de resumo */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total de Posts
              </h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {contentStats?.totalPosts || 0}
              </p>
            </div>
            <div className="h-12 w-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
              <span className="text-purple-600 dark:text-purple-400 text-xl">📝</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Visualizações
              </h3>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {(contentStats?.totalViews || 0).toLocaleString()}
              </p>
            </div>
            <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
              <Eye className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Curtidas
              </h3>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                {(contentStats?.totalLikes || 0).toLocaleString()}
              </p>
            </div>
            <div className="h-12 w-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
              <Heart className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Comentários
              </h3>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {(contentStats?.totalComments || 0).toLocaleString()}
              </p>
            </div>
            <div className="h-12 w-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <MessageCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Média por Post
              </h3>
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {averageViewsPerPost.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                views/post
              </p>
            </div>
            <div className="h-12 w-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
              <Gift className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Gráfico de desempenho */}
      <Card className="p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Desempenho do Conteúdo
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Métricas de engajamento ao longo do tempo
              </p>
            </div>
            
            {/* Toggles para mostrar/ocultar métricas */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400 mr-2">Mostrar:</span>
              <ToggleGroup type="multiple" value={Array.from(visibleMetrics)} onValueChange={(value) => setVisibleMetrics(new Set(value))}>
                <ToggleGroupItem 
                  value="views" 
                  className="data-[state=on]:bg-blue-100 data-[state=on]:text-blue-700 dark:data-[state=on]:bg-blue-900 dark:data-[state=on]:text-blue-300"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Views
                </ToggleGroupItem>
                <ToggleGroupItem 
                  value="likes"
                  className="data-[state=on]:bg-red-100 data-[state=on]:text-red-700 dark:data-[state=on]:bg-red-900 dark:data-[state=on]:text-red-300"
                >
                  <Heart className="h-4 w-4 mr-1" />
                  Likes
                </ToggleGroupItem>
                <ToggleGroupItem 
                  value="comments"
                  className="data-[state=on]:bg-green-100 data-[state=on]:text-green-700 dark:data-[state=on]:bg-green-900 dark:data-[state=on]:text-green-300"
                >
                  <MessageCircle className="h-4 w-4 mr-1" />
                  Comments
                </ToggleGroupItem>
                <ToggleGroupItem 
                  value="posts"
                  className="data-[state=on]:bg-yellow-100 data-[state=on]:text-yellow-700 dark:data-[state=on]:bg-yellow-900 dark:data-[state=on]:text-yellow-300"
                >
                  📝 Posts
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          </div>
        </div>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(date) => format(new Date(date), 'dd/MM', { locale: ptBR })}
                tick={{ fontSize: 12, fill: '#6b7280' }}
                className="dark:text-gray-400"
              />
              <YAxis 
                tick={{ fontSize: 12, fill: '#6b7280' }}
                className="dark:text-gray-400"
              />
              <Tooltip content={<CustomTooltip />} />
              
              {visibleMetrics.has('views') && (
                <Area
                  type="monotone"
                  dataKey="views"
                  stackId="1"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.3}
                />
              )}
              
              {visibleMetrics.has('likes') && (
                <Area
                  type="monotone"
                  dataKey="likes"
                  stackId="2"
                  stroke="#ef4444"
                  fill="#ef4444"
                  fillOpacity={0.3}
                />
              )}
              
              {visibleMetrics.has('comments') && (
                <Area
                  type="monotone"
                  dataKey="comments"
                  stackId="3"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.3}
                />
              )}
              
              {visibleMetrics.has('posts') && (
                <Area
                  type="monotone"
                  dataKey="posts"
                  stackId="4"
                  stroke="#f59e0b"
                  fill="#f59e0b"
                  fillOpacity={0.3}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Insights e recomendações */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            💡 Insights
          </h3>
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-300">
                <strong>Engajamento:</strong> Sua taxa de curtidas está {contentStats && contentStats.totalViews > 0 ? ((contentStats.totalLikes / contentStats.totalViews) * 100).toFixed(1) : '0'}% das visualizações.
              </p>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-sm text-green-800 dark:text-green-300">
                <strong>Comentários:</strong> {contentStats && contentStats.totalPosts > 0 ? (contentStats.totalComments / contentStats.totalPosts).toFixed(1) : '0'} comentários por post em média.
              </p>
            </div>
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <p className="text-sm text-yellow-800 dark:text-yellow-300">
                <strong>Performance:</strong> {averageViewsPerPost.toLocaleString()} visualizações por post.
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            🎯 Recomendações
          </h3>
          <div className="space-y-3">
            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <p className="text-sm text-purple-800 dark:text-purple-300">
                <strong>Horário:</strong> Poste entre 18h-20h para maior engajamento.
              </p>
            </div>
            <div className="p-3 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
              <p className="text-sm text-pink-800 dark:text-pink-300">
                <strong>Frequência:</strong> Publique 3-4 vezes por semana para manter engajamento.
              </p>
            </div>
            <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
              <p className="text-sm text-indigo-800 dark:text-indigo-300">
                <strong>Conteúdo:</strong> Posts com vídeos têm 2x mais engajamento.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function ContentTabSkeleton() {
  return (
    <div className="space-y-6">
      {/* Cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="p-6 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 animate-pulse">
            <div className="flex items-center justify-between">
              <div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 mb-2"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
              </div>
              <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Chart skeleton */}
      <div className="p-6 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 animate-pulse">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-64"></div>
            </div>
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-96"></div>
          </div>
        </div>
        <div className="h-80 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>

      {/* Insights skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="p-6 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 animate-pulse">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-4"></div>
            <div className="space-y-3">
              {[...Array(3)].map((_, j) => (
                <div key={j} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-1"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
