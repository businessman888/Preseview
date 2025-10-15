import { useState } from "react";
import { Plus, Home as HomeIcon, MessageCircle, Bell, User, Search } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreatorHeader } from "@/components/creator/CreatorHeader";
import { ProgressCard } from "@/components/creator/ProgressCard";
import { BadgeSection } from "@/components/creator/BadgeSection";
import { EarningSteps } from "@/components/creator/EarningSteps";
import { ContentManagementFeed } from "@/components/creator/ContentManagementFeed";
import { AddContentModal } from "@/components/AddContentModal";
import { CreatorLayout } from "@/components/creator/CreatorLayout";
import { useAuth } from "@/hooks/use-auth";
import { useIsMobile } from "@/hooks/use-mobile";

export function CreatorDashboard() {
  const [isAddContentModalOpen, setIsAddContentModalOpen] = useState(false);
  const { user } = useAuth();
  const isMobile = useIsMobile();

  const dashboardContent = (
    <div className={`flex flex-col min-h-screen bg-gray-50 dark:bg-black ${isMobile ? 'pb-20' : ''}`}>
      <CreatorHeader />

      <main className="max-w-2xl mx-auto w-full px-4 py-6">
        <Tabs defaultValue="painel" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="painel">Painel</TabsTrigger>
            <TabsTrigger value="feed">Feed</TabsTrigger>
          </TabsList>

          <TabsContent value="painel" className="space-y-6">
            <ProgressCard />
            <BadgeSection />
            <EarningSteps />
          </TabsContent>

          <TabsContent value="feed">
            <ContentManagementFeed />
          </TabsContent>
        </Tabs>
      </main>

      {/* Bottom Navigation - Only on Mobile */}
      {isMobile && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t dark:border-gray-800 px-6 py-3 z-20">
          <div className="flex items-center justify-around max-w-2xl mx-auto">
            <Link href="/">
              <Button variant="ghost" size="icon" className="h-12 w-12" data-testid="button-home">
                <HomeIcon className="w-6 h-6 text-pink-500" fill="currentColor" />
              </Button>
            </Link>
            <Link href="/search">
              <Button variant="ghost" size="icon" className="h-12 w-12" data-testid="button-search">
                <Search className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="h-12 w-12 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
              onClick={() => setIsAddContentModalOpen(true)}
              data-testid="button-add"
            >
              <Plus className="w-6 h-6 text-white" />
            </Button>
            <Link href="/messages">
              <Button variant="ghost" size="icon" className="h-12 w-12 relative" data-testid="button-messages">
                <MessageCircle className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              </Button>
            </Link>
            <Link href="/notifications">
              <Button variant="ghost" size="icon" className="h-12 w-12 relative" data-testid="button-notifications">
                <Bell className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-pink-500 rounded-full"></span>
              </Button>
            </Link>
            <Link href="/profile">
              <Button variant="ghost" size="icon" className="h-12 w-12" data-testid="button-profile">
                <User className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              </Button>
            </Link>
          </div>
        </nav>
      )}

      <AddContentModal
        open={isAddContentModalOpen}
        onClose={() => setIsAddContentModalOpen(false)}
      />
    </div>
  );

  return (
    <CreatorLayout onAddContent={() => setIsAddContentModalOpen(true)}>
      {dashboardContent}
    </CreatorLayout>
  );
}

