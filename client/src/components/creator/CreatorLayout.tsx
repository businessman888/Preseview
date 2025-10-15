import { ReactNode } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { CreatorSidebar } from "./CreatorSidebar";

interface CreatorLayoutProps {
  children: ReactNode;
  showBottomNav?: boolean;
  onAddContent?: () => void;
}

export function CreatorLayout({
  children,
  showBottomNav = false,
  onAddContent = () => {},
}: CreatorLayoutProps) {
  const isMobile = useIsMobile();

  // Mobile: apenas renderiza children (que já tem bottom nav)
  if (isMobile) {
    return <>{children}</>;
  }

  // Web: renderiza sidebar + children
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-black">
      <CreatorSidebar onAddContent={onAddContent} />
      <main className="flex-1 ml-64">
        {children}
      </main>
    </div>
  );
}

