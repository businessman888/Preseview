import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { Link } from "wouter";
import { User, CreatorProfile } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { SubscriptionCheckoutModal } from "@/components/SubscriptionCheckoutModal";

interface CreatorWithProfile extends User {
  creatorProfile?: CreatorProfile;
  isFollowing: boolean;
}

export function ProfileSuggestedCreators() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [selectedCreator, setSelectedCreator] = useState<CreatorWithProfile | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 3;
  
  const { data: creators = [], isLoading } = useQuery<CreatorWithProfile[]>({
    queryKey: ["/api/creators/suggested"],
    enabled: !!user && !isAuthLoading,
  });

  const handleFollowClick = (creator: CreatorWithProfile) => {
    setSelectedCreator(creator);
    setIsCheckoutOpen(true);
  };

  const totalPages = Math.ceil(creators.length / itemsPerPage);
  const currentCreators = creators.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-sm">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Criadores sugeridos
          </h2>
        </div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-gray-200 dark:bg-gray-800 rounded-lg p-4 animate-pulse">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-700" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4" />
                  <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (creators.length === 0) return null;

  return (
    <div className="w-full max-w-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Criadores sugeridos
        </h2>
        
        {totalPages > 1 && (
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={prevPage}
              className="h-8 w-8"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={nextPage}
              className="h-8 w-8"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
      
      {/* Creators List */}
      <div className="space-y-3">
        {currentCreators.map((creator) => (
          <Card key={creator.id} className="p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3">
              <Avatar className="w-12 h-12">
                <AvatarImage src={creator.profileImage || undefined} />
                <AvatarFallback className="bg-gradient-to-br from-pink-500 to-purple-600 text-white">
                  {creator.displayName[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                    {creator.displayName}
                  </h3>
                  {creator.isVerified && (
                    <div className="bg-pink-500 rounded-full p-0.5">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                  @{creator.username}
                </p>
              </div>
              
              <Button 
                size="sm"
                className="bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white font-semibold rounded-full px-3 py-1 text-xs"
                onClick={() => handleFollowClick(creator)}
              >
                Seguir
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Pagination Dots */}
      {totalPages > 1 && (
        <div className="flex justify-center space-x-1 mt-4">
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index)}
              className={`w-2 h-2 rounded-full ${
                index === currentPage ? "bg-pink-500" : "bg-gray-300 dark:bg-gray-600"
              }`}
            />
          ))}
        </div>
      )}

      {selectedCreator && (
        <SubscriptionCheckoutModal
          open={isCheckoutOpen}
          onClose={() => {
            setIsCheckoutOpen(false);
            setSelectedCreator(null);
          }}
          creator={selectedCreator}
        />
      )}
    </div>
  );
}
