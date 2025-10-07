import {
  ArrowLeftIcon,
  BellIcon,
  HomeIcon,
  MessageCircleIcon,
  SearchIcon,
  UserIcon,
  FilterIcon,
  Plus,
} from "lucide-react";
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { CreatePostModal } from "@/components/CreatePostModal";

export const ScreenSearch = (): JSX.Element => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);

  const trendingTopics = [
    { id: 1, tag: "#VerãoBrasil", posts: "125K posts" },
    { id: 2, tag: "#ConteúdoExclusivo", posts: "89K posts" },
    { id: 3, tag: "#VidasReais", posts: "67K posts" },
    { id: 4, tag: "#AmizadeVirtual", posts: "45K posts" },
  ];

  const suggestedCreators = [
    {
      id: 1,
      name: "Beatriz Santos",
      username: "@biasantos",
      verified: true,
      followers: "12.5K",
      avatar: "/figmaAssets/ellipse-4.png",
      category: "Lifestyle",
    },
    {
      id: 2,
      name: "Carolina Lima",
      username: "@caroli_lima",
      verified: false,
      followers: "8.3K",
      avatar: "/figmaAssets/ellipse-5.png",
      category: "Fitness",
    },
    {
      id: 3,
      name: "Fernanda Costa",
      username: "@fe_costa",
      verified: true,
      followers: "15.7K",
      avatar: "/figmaAssets/ellipse-7.png",
      category: "Arte",
    },
  ];

  const recentSearches = ["Marina Macedo", "Lorena ruiva", "#VerãoBrasil"];

  return (
    <div className="flex flex-col h-screen bg-[#fdfdfa]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white shadow-sm">
        <Link href="/">
          <Button variant="ghost" size="icon" data-testid="button-back">
            <ArrowLeftIcon className="w-6 h-6 text-[#5d5b5b]" />
          </Button>
        </Link>
        <h1 className="[font-family:'Inria_Sans',Helvetica] font-bold text-[#5d5b5b] text-xl">
          Explorar
        </h1>
        <Button variant="ghost" size="icon" data-testid="button-filter">
          <FilterIcon className="w-6 h-6 text-[#5d5b5b]" />
        </Button>
      </div>

      {/* Search Bar */}
      <div className="p-4">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#8b8585]" />
          <Input
            placeholder="Buscar pessoas, hashtags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white border-[#cccccc] rounded-full"
            data-testid="input-search"
          />
        </div>
      </div>

      <div className="flex-1 px-4 space-y-6 overflow-y-auto">
        {/* Recent Searches */}
        {searchQuery === "" && (
          <div>
            <h2 className="[font-family:'Inria_Sans',Helvetica] font-bold text-[#5d5b5b] text-lg mb-3">
              Buscas recentes
            </h2>
            <div className="space-y-2">
              {recentSearches.map((search, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-white rounded-lg border border-[#cccccc] cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => {
                    setSearchQuery(search);
                    console.log(`Pesquisando por: ${search}`);
                  }}
                  data-testid={`recent-search-${index}`}
                >
                  <span className="[font-family:'Inria_Sans',Helvetica] font-normal text-[#5d5b5b] text-sm">
                    {search}
                  </span>
                  <SearchIcon className="w-4 h-4 text-[#8b8585]" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Trending Topics */}
        <div>
          <h2 className="[font-family:'Inria_Sans',Helvetica] font-bold text-[#5d5b5b] text-lg mb-3">
            Tendências
          </h2>
          <div className="space-y-2">
            {trendingTopics.map((topic) => (
              <Card
                key={topic.id}
                className="bg-white rounded-lg border border-[#cccccc] hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => {
                  setSearchQuery(topic.tag);
                  console.log(`Explorando tendência: ${topic.tag}`);
                }}
                data-testid={`trend-${topic.id}`}
              >
                <CardContent className="p-4">
                  <h3 className="[font-family:'Inria_Sans',Helvetica] font-bold text-[#e71d36] text-base">
                    {topic.tag}
                  </h3>
                  <p className="[font-family:'Inria_Sans',Helvetica] font-normal text-[#8b8585] text-sm">
                    {topic.posts}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Suggested Creators */}
        <div>
          <h2 className="[font-family:'Inria_Sans',Helvetica] font-bold text-[#5d5b5b] text-lg mb-3">
            Criadores sugeridos
          </h2>
          <div className="space-y-3">
            {suggestedCreators.map((creator) => (
              <Card
                key={creator.id}
                className="bg-white rounded-lg border border-[#cccccc] cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => {
                  console.log(`Navegando para o perfil de ${creator.name}`);
                }}
                data-testid={`creator-${creator.id}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <Avatar 
                      className="w-12 h-12 cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log(`Navegando para o perfil de ${creator.name}`);
                      }}
                      data-testid={`avatar-creator-${creator.id}`}
                    >
                      <AvatarImage
                        src={creator.avatar}
                        alt={creator.name}
                        className="object-cover"
                      />
                      <AvatarFallback>{creator.name.charAt(0)}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="[font-family:'Inria_Sans',Helvetica] font-bold text-[#5d5b5b] text-sm">
                          {creator.name}
                        </h3>
                        {creator.verified && (
                          <img
                            className="w-4 h-4"
                            alt="Verified"
                            src="/figmaAssets/verified.png"
                          />
                        )}
                      </div>
                      <p className="[font-family:'Inria_Sans',Helvetica] font-normal text-[#e71d36] text-xs">
                        {creator.username}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="[font-family:'Inria_Sans',Helvetica] font-normal text-[#8b8585] text-xs">
                          {creator.followers} seguidores
                        </span>
                        <span className="[font-family:'Inria_Sans',Helvetica] font-normal text-[#8b8585] text-xs">
                          • {creator.category}
                        </span>
                      </div>
                    </div>

                    <Button
                      className="bg-[#e71d36] hover:bg-[#c41a2f] text-white px-4 py-1 rounded-full text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log(`Seguindo ${creator.name}`);
                      }}
                      data-testid={`button-follow-${creator.id}`}
                    >
                      Seguir
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="flex w-full items-center justify-center gap-[30px] px-[5px] py-2.5 bg-white rounded-[30px_30px_0px_0px] overflow-hidden shadow-[3px_4px_4px_#00000040]">
        <Link href="/">
          <Button variant="ghost" size="icon" className="p-0" data-testid="nav-home">
            <HomeIcon className="w-[43px] h-9 text-[#5d5b5b]" />
          </Button>
        </Link>

        <Link href="/messages">
          <Button variant="ghost" size="icon" className="p-0" data-testid="nav-messages">
            <MessageCircleIcon className="w-[38px] h-[38px] text-[#5d5b5b]" />
          </Button>
        </Link>

        {user?.userType === 'creator' ? (
          <Button 
            variant="ghost" 
            size="icon" 
            className="p-0" 
            onClick={() => setIsCreatePostModalOpen(true)}
            data-testid="nav-create-post"
          >
            <Plus className="w-[38px] h-[38px] text-[#5d5b5b]" />
          </Button>
        ) : (
          <Button variant="ghost" size="icon" className="p-0" data-testid="nav-search">
            <Plus className="w-[38px] h-[38px] text-[#e71d36]" />
          </Button>
        )}

        <Link href="/notifications">
          <Button variant="ghost" size="icon" className="p-0" data-testid="nav-notifications">
            <BellIcon className="w-[43px] h-[43px] text-[#5d5b5b]" />
          </Button>
        </Link>

        <Link href="/profile">
          <Button variant="ghost" size="icon" className="p-0" data-testid="nav-profile">
            <UserIcon className="w-[50px] h-[49px] text-[#5d5b5b]" />
          </Button>
        </Link>
      </div>

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={isCreatePostModalOpen}
        onClose={() => setIsCreatePostModalOpen(false)}
      />
    </div>
  );
};