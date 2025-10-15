import { Badge } from "@/components/ui/badge";
import { CreatorLayout } from "@/components/creator/CreatorLayout";

export function ManagementPage() {
  return (
    <CreatorLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-black">
        <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Gestão
            </h1>
            <Badge className="bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400">
              Beta
            </Badge>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-6 py-8">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-8 text-center border border-gray-200 dark:border-gray-800">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Esta funcionalidade está em desenvolvimento.
            </p>
            <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
              Em breve você terá acesso a ferramentas avançadas de gestão e configurações.
            </p>
          </div>
        </main>
      </div>
    </CreatorLayout>
  );
}

