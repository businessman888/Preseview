import { ReactNode } from "react";
import { UserSidebar } from "./UserSidebar";
import { Plus, Home as HomeIcon, MessageCircle, Bell, User, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

interface UserLayoutProps {
  children: ReactNode;
}

export function UserLayout({ children }: UserLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <UserSidebar />
      </div>

      {/* Main Content */}
      <div className="md:ml-64">
        {children}
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t dark:border-gray-800 px-6 py-3 z-20 md:hidden">
        <div className="flex items-center justify-around max-w-2xl mx-auto">
          <Link href="/">
            <Button variant="ghost" size="icon" data-testid="nav-home">
              <HomeIcon className="w-7 h-7 text-pink-500" />
            </Button>
          </Link>

          <Link href="/messages">
            <Button variant="ghost" size="icon" data-testid="nav-messages">
              <MessageCircle className="w-7 h-7 text-gray-600 dark:text-gray-400" />
            </Button>
          </Link>

          <Link href="/search">
            <Button variant="ghost" size="icon" data-testid="nav-search">
              <Search className="w-7 h-7 text-gray-600 dark:text-gray-400" />
            </Button>
          </Link>

          <Link href="/notifications">
            <Button variant="ghost" size="icon" data-testid="nav-notifications">
              <Bell className="w-7 h-7 text-gray-600 dark:text-gray-400" />
            </Button>
          </Link>

          <Link href="/profile">
            <Button variant="ghost" size="icon" data-testid="nav-profile">
              <User className="w-7 h-7 text-gray-600 dark:text-gray-400" />
            </Button>
          </Link>
        </div>
      </nav>
    </div>
  );
}
