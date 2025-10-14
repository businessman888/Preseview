import { Target } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useCreatorProgress } from "@/hooks/use-creator-progress";

export function ProgressCard() {
  const { data: progress, isLoading } = useCreatorProgress();

  if (isLoading) {
    return (
      <Card className="bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-950/20 dark:to-purple-950/20 border-pink-200 dark:border-pink-800">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-950/20 dark:to-purple-950/20 border-pink-200 dark:border-pink-800">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Progresso para
            </h3>
            <p className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              o primeiro ${progress?.goal || 100}
            </p>
          </div>
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
            <Target className="w-6 h-6 text-white" />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium text-gray-700 dark:text-gray-300">
              ${progress?.current?.toFixed(2) || "0.00"}
            </span>
            <span className="text-gray-500 dark:text-gray-400">
              ${progress?.goal || 100}
            </span>
          </div>
          <Progress 
            value={progress?.percentage || 0} 
            className="h-2 bg-pink-100 dark:bg-pink-950"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 text-right">
            {progress?.percentage?.toFixed(1) || 0}% concluído
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

