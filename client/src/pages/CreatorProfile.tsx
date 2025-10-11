import { useState } from "react";
import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { 
  ArrowLeft, 
  Check, 
  MessageCircle, 
  Image as ImageIcon,
  Video,
  Grid3x3,
  Lock
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Post, CreatorProfile as CreatorProfileType } from "@shared/schema";
import { SubscriptionModal } from "@/components/SubscriptionModal";

interface CreatorWithProfile extends User {
  creatorProfile?: CreatorProfileType;
  isFollowing: boolean;
  isSubscribed: boolean;
}

interface PostWithCreator extends Post {
  creator: User;
}

export function CreatorProfile() {
  const { id } = useParams<{ id: string }>();
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");

  const { data: creator, isLoading: loadingCreator } = useQuery<CreatorWithProfile>({
    queryKey: ["/api/creators", id],
  });

  const { data: posts = [] } = useQuery<PostWithCreator[]>({
    queryKey: ["/api/creators", id, "posts"],
  });

  if (loadingCreator) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black">
        <div className="animate-pulse">
          <div className="h-48 bg-gray-200 dark:bg-gray-800" />
          <div className="max-w-4xl mx-auto px-4 -mt-16">
            <div className="w-32 h-32 rounded-full bg-gray-300 dark:bg-gray-700 border-4 border-white dark:border-gray-900" />
          </div>
        </div>
      </div>
    );
  }

  if (!creator) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">Criador não encontrado</p>
      </div>
    );
  }

  const photoPosts = posts.filter(p => p.mediaUrls && p.mediaUrls.some(url => url.match(/\.(jpg|jpeg|png|gif|webp)$/i)));
  const videoPosts = posts.filter(p => p.mediaUrls && p.mediaUrls.some(url => url.match(/\.(mp4|webm|mov)$/i)));

  const getDisplayPosts = () => {
    switch (activeTab) {
      case "photos": return photoPosts;
      case "videos": return videoPosts;
      default: return posts;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black pb-20">
      {/* Header with back button */}
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b dark:border-gray-800 px-4 py-3">
        <div className="flex items-center gap-3">
          <Link href="/">
            <Button variant="ghost" size="icon" data-testid="button-back">
              <ArrowLeft className="w-6 h-6" />
            </Button>
          </Link>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
            {creator.displayName}
          </h1>
        </div>
      </div>

      {/* Cover Image */}
      <div className="relative h-48 bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-500">
        {creator.coverImage && (
          <img 
            src={creator.coverImage} 
            alt="Cover" 
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Profile Section */}
      <div className="max-w-4xl mx-auto px-4">
        {/* Avatar */}
        <div className="relative -mt-16 mb-4">
          <Avatar className="w-32 h-32 border-4 border-white dark:border-gray-900">
            <AvatarImage src={creator.profileImage || undefined} />
            <AvatarFallback className="text-2xl bg-gradient-to-br from-pink-500 to-purple-600 text-white">
              {creator.displayName[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Creator Info */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {creator.displayName}
            </h2>
            {creator.isVerified && (
              <div className="bg-pink-500 rounded-full p-1">
                <Check className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
          
          <p className="text-gray-600 dark:text-gray-400">@{creator.username}</p>

          {/* Stats */}
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-1">
              <Grid3x3 className="w-4 h-4 text-gray-500" />
              <span className="font-semibold text-gray-900 dark:text-white">
                {creator.creatorProfile?.postCount || 0}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-semibold text-gray-900 dark:text-white">
                {Math.floor(Math.random() * 10000)}
              </span>
              <span className="text-gray-500 dark:text-gray-400">Likes</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-semibold text-gray-900 dark:text-white">
                {creator.creatorProfile?.subscriberCount || 0}
              </span>
              <span className="text-gray-500 dark:text-gray-400">Fãs</span>
            </div>
          </div>

          {/* Bio */}
          {creator.bio && (
            <p className="text-gray-700 dark:text-gray-300 text-sm">
              {creator.bio}
            </p>
          )}

          {/* Benefits */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <MessageCircle className="w-4 h-4 text-pink-500" />
              <span>Mensagens ilimitadas</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <ImageIcon className="w-4 h-4 text-pink-500" />
              <span>Novos snapshots</span>
            </div>
          </div>

          {/* CTA Section */}
          {!creator.isSubscribed && (
            <div className="space-y-3 mt-6">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Apenas 3 vagas disponíveis!
              </p>
              <Button 
                onClick={() => setShowSubscriptionModal(true)}
                className="w-full bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white font-semibold py-6 rounded-full text-base"
                data-testid="button-subscribe-cta"
              >
                Cadastre-se gratuitamente por 1 semana
              </Button>
              <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                Somente até hoje 23:59!
              </p>
            </div>
          )}

          {creator.isSubscribed && (
            <div className="flex gap-3 mt-6">
              <Button 
                className="flex-1 bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-full"
                data-testid="button-message"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Mensagem
              </Button>
            </div>
          )}
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-3 bg-gray-100 dark:bg-gray-800">
            <TabsTrigger value="photos" className="flex items-center gap-2" data-testid="tab-photos">
              <ImageIcon className="w-4 h-4" />
              Fotos
            </TabsTrigger>
            <TabsTrigger value="videos" className="flex items-center gap-2" data-testid="tab-videos">
              <Video className="w-4 h-4" />
              Vídeos
            </TabsTrigger>
            <TabsTrigger value="posts" className="flex items-center gap-2" data-testid="tab-posts">
              <Grid3x3 className="w-4 h-4" />
              Posts
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-4">
            {getDisplayPosts().length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">
                  Nenhum conteúdo disponível
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-1">
                {getDisplayPosts().map((post) => (
                  <Card 
                    key={post.id} 
                    className="relative aspect-square overflow-hidden group cursor-pointer"
                    data-testid={`post-${post.id}`}
                  >
                    {post.mediaUrls && post.mediaUrls[0] ? (
                      <>
                        {post.mediaUrls[0].match(/\.(mp4|webm|mov)$/i) ? (
                          <video 
                            src={post.mediaUrls[0]} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <img 
                            src={post.mediaUrls[0]} 
                            alt={post.title}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </>
                    ) : (
                      <div className="w-full h-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                        <Grid3x3 className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                    {post.isExclusive && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Lock className="w-8 h-8 text-white" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Subscription Modal */}
      <SubscriptionModal 
        isOpen={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
        creator={creator}
      />
    </div>
  );
}
