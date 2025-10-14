import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Badge } from "@shared/schema";

export function BadgeSection() {
  const [isExpanded, setIsExpanded] = useState(false);
  const { data: badges = [], isLoading } = useQuery<Badge[]>({
    queryKey: ["/api/creator/badges"],
  });

  const unlockedBadges = badges.filter(b => b.unlocked);
  const lockedBadges = badges.filter(b => !b.unlocked);
  const currentBadge = unlockedBadges[unlockedBadges.length - 1];

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-4">
        <Button
          variant="ghost"
          className="w-full flex items-center justify-between p-0 hover:bg-transparent"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-3">
            {currentBadge ? (
              <>
                <span className="text-3xl">{currentBadge.icon}</span>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Insígnia {currentBadge.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {currentBadge.description}
                  </p>
                </div>
              </>
            ) : (
              <>
                <span className="text-3xl">🏆</span>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Conquiste suas primeiras badges
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Complete desafios para desbloquear
                  </p>
                </div>
              </>
            )}
          </div>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </Button>

        {isExpanded && (
          <div className="mt-4 space-y-3 pt-4 border-t dark:border-gray-800">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className={`flex items-center gap-3 p-3 rounded-lg ${
                  badge.unlocked
                    ? "bg-green-50 dark:bg-green-950/20"
                    : "bg-gray-50 dark:bg-gray-800/50"
                }`}
              >
                <span className={`text-2xl ${!badge.unlocked && "grayscale opacity-50"}`}>
                  {badge.icon}
                </span>
                <div className="flex-1">
                  <h4 className="font-medium text-sm text-gray-900 dark:text-white">
                    {badge.name}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {badge.description}
                  </p>
                </div>
                {badge.unlocked && (
                  <span className="text-xs font-medium text-green-600 dark:text-green-400">
                    ✓ Desbloqueado
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

