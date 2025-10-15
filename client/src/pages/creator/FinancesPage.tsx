import { CreatorLayout } from "@/components/creator/CreatorLayout";

export function FinancesPage() {
  return (
    <CreatorLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-black">
        <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Finanças
          </h1>
        </header>
        <main className="max-w-7xl mx-auto px-6 py-8">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-8 text-center border border-gray-200 dark:border-gray-800">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Esta funcionalidade está em desenvolvimento.
            </p>
            <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
              Em breve você terá acesso a relatórios financeiros detalhados e análises de receita.
            </p>
          </div>
        </main>
      </div>
    </CreatorLayout>
  );
}

