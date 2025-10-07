import {
  ArrowLeftIcon,
  BellIcon,
  HomeIcon,
  MessageCircleIcon,
  SearchIcon,
  UserIcon,
  HeartIcon,
  MessageSquareIcon,
  DollarSignIcon,
  UserPlusIcon,
  Plus,
} from "lucide-react";
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { CreatePostModal } from "@/components/CreatePostModal";

export const ScreenNotifications = (): JSX.Element => {
  const { user } = useAuth();
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const notifications = [
    {
      id: 1,
      type: "like",
      user: "Marina Macedo",
      username: "@marihot_",
      avatar: "/figmaAssets/ellipse-14.png",
      action: "curtiu seu post",
      time: "há 5 min",
      isNew: true,
    },
    {
      id: 2,
      type: "follow",
      user: "Lorena ruiva",
      username: "@ruivinhaa",
      avatar: "/figmaAssets/ellipse-13.png",
      action: "começou a seguir você",
      time: "há 15 min",
      isNew: true,
    },
    {
      id: 3,
      type: "comment",
      user: "Beatriz Santos",
      username: "@biasantos",
      avatar: "/figmaAssets/ellipse-4.png",
      action: "comentou: 'Que foto linda! ❤️'",
      time: "há 30 min",
      isNew: false,
    },
    {
      id: 4,
      type: "tip",
      user: "Carolina Lima",
      username: "@caroli_lima",
      avatar: "/figmaAssets/ellipse-5.png",
      action: "enviou uma gorjeta de R$ 10,00",
      time: "há 1h",
      isNew: false,
    },
    {
      id: 5,
      type: "like",
      user: "Fernanda Costa",
      username: "@fe_costa",
      avatar: "/figmaAssets/ellipse-7.png",
      action: "curtiu seu post",
      time: "há 2h",
      isNew: false,
    },
    {
      id: 6,
      type: "comment",
      user: "Mariana Cardoso",
      username: "@marimaricar_",
      avatar: "/figmaAssets/ellipse-19.png",
      action: "comentou em seu post",
      time: "há 3h",
      isNew: false,
    },
  ];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "like":
        return <HeartIcon className="w-5 h-5 text-[#e71d36]" />;
      case "comment":
        return <MessageSquareIcon className="w-5 h-5 text-[#5d5b5b]" />;
      case "follow":
        return <UserPlusIcon className="w-5 h-5 text-[#e71d36]" />;
      case "tip":
        return <DollarSignIcon className="w-5 h-5 text-green-500" />;
      default:
        return <BellIcon className="w-5 h-5 text-[#5d5b5b]" />;
    }
  };

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
          Notificações
        </h1>
        <Button variant="ghost" size="icon" data-testid="button-mark-all-read">
          <BellIcon className="w-6 h-6 text-[#5d5b5b]" />
        </Button>
      </div>

      {/* Notifications List */}
      <div className="flex-1 px-4 py-2 space-y-2 overflow-y-auto">
        {notifications.map((notification) => (
          <Card
            key={notification.id}
            className={`rounded-lg border border-[#cccccc] hover:bg-gray-50 cursor-pointer transition-colors ${
              notification.isNew ? "bg-blue-50" : "bg-white"
            }`}
            onClick={() => {
              console.log(`Navegando para notificação de ${notification.user}`);
            }}
            data-testid={`notification-${notification.id}`}
          >
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <Avatar 
                  className="w-12 h-12 cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log(`Navegando para o perfil de ${notification.user}`);
                  }}
                  data-testid={`avatar-${notification.id}`}
                >
                  <AvatarImage
                    src={notification.avatar}
                    alt={notification.user}
                    className="object-cover"
                  />
                  <AvatarFallback>{notification.user.charAt(0)}</AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="[font-family:'Inria_Sans',Helvetica] font-bold text-[#5d5b5b] text-sm">
                      {notification.user}
                    </h3>
                    <span className="[font-family:'Inria_Sans',Helvetica] font-normal text-[#e71d36] text-xs">
                      {notification.username}
                    </span>
                    {notification.isNew && (
                      <div className="w-2 h-2 bg-[#e71d36] rounded-full" />
                    )}
                  </div>
                  <p className="[font-family:'Inria_Sans',Helvetica] font-normal text-[#5d5b5b] text-sm">
                    {notification.action}
                  </p>
                  <span className="[font-family:'Inria_Sans',Helvetica] font-normal text-[#8b8585] text-xs">
                    {notification.time}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  {getNotificationIcon(notification.type)}
                  {notification.type === "follow" && (
                    <Button
                      className="bg-[#e71d36] hover:bg-[#c41a2f] text-white px-3 py-1 rounded-full text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log(`Seguindo de volta ${notification.user}`);
                      }}
                      data-testid={`button-follow-back-${notification.id}`}
                    >
                      Seguir
                    </Button>
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
          <Link href="/search">
            <Button variant="ghost" size="icon" className="p-0" data-testid="nav-search">
              <Plus className="w-[38px] h-[38px] text-[#5d5b5b]" />
            </Button>
          </Link>
        )}

        <Button variant="ghost" size="icon" className="p-0" data-testid="nav-notifications">
          <BellIcon className="w-[43px] h-[43px] text-[#e71d36]" />
        </Button>

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