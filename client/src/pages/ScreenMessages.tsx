import {
  ArrowLeftIcon,
  MessageCircleIcon,
  SearchIcon,
  SendIcon,
  HomeIcon,
  BellIcon,
  UserIcon,
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

export const ScreenMessages = (): JSX.Element => {
  const { user } = useAuth();
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const conversations = [
    {
      id: 1,
      name: "Lorena ruiva",
      username: "@ruivinhaa",
      lastMessage: "Oi amor, como você está?",
      time: "há 2 min",
      avatar: "/figmaAssets/ellipse-13.png",
      unread: true,
    },
    {
      id: 2,
      name: "Marina Macedo",
      username: "@marihot_",
      lastMessage: "Obrigada pelo carinho 💕",
      time: "há 15 min",
      avatar: "/figmaAssets/ellipse-14.png",
      unread: false,
    },
    {
      id: 3,
      name: "Mariana Cardoso",
      username: "@marimaricar_",
      lastMessage: "Viu meu último post?",
      time: "há 1h",
      avatar: "/figmaAssets/ellipse-19.png",
      unread: false,
    },
  ];

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
          Mensagens
        </h1>
        <Button variant="ghost" size="icon" data-testid="button-search">
          <SearchIcon className="w-6 h-6 text-[#5d5b5b]" />
        </Button>
      </div>

      {/* Search Bar */}
      <div className="p-4">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#8b8585]" />
          <Input
            placeholder="Buscar conversas..."
            className="pl-10 bg-white border-[#cccccc] rounded-full"
            data-testid="input-search-conversations"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 px-4 space-y-2">
        {conversations.map((conversation) => (
          <Card
            key={conversation.id}
            className="bg-white rounded-lg border border-[#cccccc] hover:bg-gray-50 cursor-pointer transition-colors"
            onClick={() => {
              console.log(`Abrindo conversa com ${conversation.name}`);
            }}
            data-testid={`card-conversation-${conversation.id}`}
          >
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Avatar 
                  className="w-12 h-12 cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log(`Navegando para o perfil de ${conversation.name}`);
                  }}
                  data-testid={`avatar-${conversation.id}`}
                >
                  <AvatarImage
                    src={conversation.avatar}
                    alt={conversation.name}
                    className="object-cover"
                  />
                  <AvatarFallback>{conversation.name.charAt(0)}</AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <h3 className="[font-family:'Inria_Sans',Helvetica] font-bold text-[#5d5b5b] text-sm truncate">
                      {conversation.name}
                    </h3>
                    <span className="[font-family:'Inria_Sans',Helvetica] font-normal text-[#e71d36] text-xs">
                      {conversation.username}
                    </span>
                  </div>
                  <p className="[font-family:'Inria_Sans',Helvetica] font-normal text-[#8b8585] text-sm truncate">
                    {conversation.lastMessage}
                  </p>
                </div>

                <div className="flex flex-col items-end space-y-1">
                  <span className="[font-family:'Inria_Sans',Helvetica] font-normal text-[#8b8585] text-xs">
                    {conversation.time}
                  </span>
                  {conversation.unread && (
                    <div className="w-2 h-2 bg-[#e71d36] rounded-full" />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bottom Navigation */}
      <div className="flex w-full items-center justify-center gap-[30px] px-[5px] py-2.5 bg-white rounded-[30px_30px_0px_0px] overflow-hidden shadow-[3px_4px_4px_#00000040]">
        <Link href="/">
          <Button variant="ghost" size="icon" className="p-0" data-testid="nav-home">
            <HomeIcon className="w-[43px] h-9 text-[#5d5b5b]" />
          </Button>
        </Link>

        <Button variant="ghost" size="icon" className="p-0" data-testid="nav-messages">
          <MessageCircleIcon className="w-[38px] h-[38px] text-[#e71d36]" />
        </Button>

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
          <Link href="/search">
            <Button variant="ghost" size="icon" className="p-0" data-testid="nav-search">
              <Plus className="w-[38px] h-[38px] text-[#5d5b5b]" />
            </Button>
          </Link>
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