import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronRight, Check } from "lucide-react";
import { Link } from "wouter";
import { User, CreatorProfile } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { SubscriptionCheckoutModal } from "@/components/SubscriptionCheckoutModal";

interface CreatorWithProfile extends User {
  creatorProfile?: CreatorProfile;
  isFollowing: boolean;
}

export function SuggestedCreators() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [selectedCreator, setSelectedCreator] = useState<CreatorWithProfile | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  
  const { data: creators = [], isLoading } = useQuery<CreatorWithProfile[]>({
    queryKey: ["/api/creators/suggested"],
    enabled: !!user && !isAuthLoading,
  });

  const handleFollowClick = (creator: CreatorWithProfile) => {
    setSelectedCreator(creator);
    setIsCheckoutOpen(true);
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between px-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Criadores sugeridos
          </h2>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </div>
        <div className="flex gap-3 px-4 overflow-x-auto scrollbar-hide">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex-shrink-0 w-72 h-40 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (creators.length === 0) return null;

  return (
    <div className="space-y-3 mb-6">
      <div className="flex items-center justify-between px-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Criadores sugeridos
        </h2>
        <ChevronRight className="w-5 h-5 text-gray-400" />
      </div>
      
      <div className="flex gap-3 px-4 overflow-x-auto scrollbar-hide pb-2" data-testid="suggested-creators">
        {creators.map((creator) => (
          <Card 
            key={creator.id}
            className="relative flex-shrink-0 w-72 h-40 overflow-hidden group cursor-pointer"
            data-testid={`creator-card-${creator.id}`}
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              {creator.coverImage ? (
                <img 
                  src={creator.coverImage} 
                  alt={creator.displayName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-500" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            </div>

            {/* Content */}
            <Link href={`/creator/${creator.id}`}>
              <div className="relative h-full p-4 flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <Avatar className="w-16 h-16 border-2 border-white">
                    <AvatarImage src={creator.profileImage || undefined} />
                    <AvatarFallback className="bg-gradient-to-br from-pink-500 to-purple-600 text-white text-lg">
                      {creator.displayName[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <Button 
                    size="sm"
                    className="bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white font-semibold rounded-full px-4"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleFollowClick(creator);
                    }}
                    data-testid={`button-follow-${creator.id}`}
                  >
                    Seguir
                  </Button>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1">
                    <h3 className="text-white font-semibold text-base">
                      {creator.displayName}
                    </h3>
                    {creator.isVerified && (
                      <div className="bg-pink-500 rounded-full p-0.5">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                  <p className="text-white/90 text-sm line-clamp-2">
                    {creator.bio || `Sou ${creator.displayName} e adoro me divertir!`}
                  </p>
                </div>
              </div>
            </Link>
          </Card>
        ))}
      </div>

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
