import { useState } from "react";
import { ChevronDown, ChevronUp, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const EARNING_STEPS = [
  {
    id: 1,
    title: "Anuncie nas redes sociais que você entrou no Preseview",
    reward: "+100% aumento de ganhos",
    completed: true,
  },
  {
    id: 2,
    title: "Configure seu perfil de criador",
    reward: "Perfil mais atraente",
    completed: true,
  },
  {
    id: 3,
    title: "Publique seu primeiro conteúdo",
    reward: "Comece a ganhar",
    completed: true,
  },
  {
    id: 4,
    title: "Defina seu preço de assinatura",
    reward: "Monetize seu conteúdo",
    completed: true,
  },
  {
    id: 5,
    title: "Consiga seus primeiros 10 assinantes",
    reward: "Construa sua base",
    completed: true,
  },
];

export function EarningSteps() {
  const [isExpanded, setIsExpanded] = useState(true);
  
  const completedCount = EARNING_STEPS.filter(step => step.completed).length;
  const totalSteps = EARNING_STEPS.length;

  return (
    <Card>
      <CardContent className="p-4">
        <Button
          variant="ghost"
          className="w-full flex items-center justify-between p-0 mb-2 hover:bg-transparent"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="text-left">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Start earning in {totalSteps} steps
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              You've completed {completedCount} out of {totalSteps} steps
            </p>
          </div>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </Button>

        {isExpanded && (
          <div className="mt-4 space-y-3">
            {EARNING_STEPS.map((step) => (
              <div
                key={step.id}
                className={`flex items-start gap-3 p-3 rounded-lg ${
                  step.completed
                    ? "bg-green-50 dark:bg-green-950/20"
                    : "bg-gray-50 dark:bg-gray-800/50"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${
                    step.completed
                      ? "bg-green-500"
                      : "bg-gray-300 dark:bg-gray-600"
                  }`}
                >
                  {step.completed && <Check className="w-3 h-3 text-white" />}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-sm text-gray-900 dark:text-white">
                    {step.title}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {step.reward}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

