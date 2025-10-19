import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { UserLayout } from "@/components/user/UserLayout";
import { PurchasedGrid } from "@/components/user/PurchasedGrid";
import { LikedGrid } from "@/components/user/LikedGrid";
import { ProfileSuggestedCreators } from "@/components/user/ProfileSuggestedCreators";

export const ScreenProfile = (): JSX.Element => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("purchased");

  return (
    <UserLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-black">
        {/* Main Content Area */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex gap-6">
            {/* Left Column - Profile Content */}
            <div className="flex-1 max-w-2xl">
              {/* Banner */}
              <div className="relative h-32 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-t-lg">
                {/* Banner content */}
              </div>

              {/* Profile Info */}
              <div className="bg-white dark:bg-gray-900 rounded-b-lg shadow-sm">
                {/* Profile Picture */}
                <div className="flex justify-center -mt-16 mb-4">
                  <Avatar className="w-32 h-32 border-4 border-white dark:border-gray-900">
                    <AvatarImage src={user?.profilePicture || ""} />
                    <AvatarFallback className="bg-gradient-to-r from-pink-500 to-purple-600 text-white text-2xl">
                      {user?.username?.[0]?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </div>

                {/* Name and Username */}
                <div className="text-center mb-4">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {user?.displayName || user?.username || "Usuário"}
                  </h1>
                  <p className="text-gray-500 dark:text-gray-400">
                    @{user?.username || "username"}
                  </p>
                </div>

                {/* Edit Profile Button */}
                <div className="flex justify-center mb-6">
                  <Link href="/profile/edit">
                    <Button className="bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 rounded-lg px-6 py-2">
                      Editar perfil
                    </Button>
                  </Link>
                </div>

                {/* Tab Navigation */}
                <div className="flex border-b border-gray-200 dark:border-gray-700">
                  <Button
                    variant="ghost"
                    className={`flex-1 py-3 rounded-none ${
                      activeTab === "purchased"
                        ? "border-b-2 border-pink-500 text-pink-600 dark:text-pink-400"
                        : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                    }`}
                    onClick={() => setActiveTab("purchased")}
                    data-testid="tab-purchased"
                  >
                    Purchased
                  </Button>
                  <Button
                    variant="ghost"
                    className={`flex-1 py-3 rounded-none ${
                      activeTab === "liked"
                        ? "border-b-2 border-pink-500 text-pink-600 dark:text-pink-400"
                        : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                    }`}
                    onClick={() => setActiveTab("liked")}
                    data-testid="tab-liked"
                  >
                    Liked
                  </Button>
                </div>

                {/* Content Grid */}
                <div className="p-4">
                  {activeTab === "purchased" ? (
                    <PurchasedGrid />
                  ) : (
                    <LikedGrid />
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Suggested Creators (Desktop only) */}
            <div className="hidden lg:block w-80">
              <ProfileSuggestedCreators />
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};
