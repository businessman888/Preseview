import {
  ArrowLeftIcon,
  BellIcon,
  HomeIcon,
  MessageCircleIcon,
  SearchIcon,
  UserIcon,
  SettingsIcon,
  ShareIcon,
  GridIcon,
  PlayIcon,
  BookmarkIcon,
} from "lucide-react";
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";

export const ScreenProfile = (): JSX.Element => {
  const [activeTab, setActiveTab] = useState("posts");

  const userProfile = {
    name: "Você",
    username: "@seuusername",
    bio: "Bem-vindo ao meu perfil! Compartilhando momentos especiais da minha vida ✨",
    followers: "1,234",
    following: "567",
    posts: "89",
    avatar: "/figmaAssets/ellipse-19.png",
    verified: false,
  };

  const userPosts = [
    {
      id: 1,
      type: "image",
      thumbnail: "/figmaAssets/fttpost2.png",
      likes: "125",
      comments: "23",
    },
    {
      id: 2,
      type: "video",
      thumbnail: "/figmaAssets/frame-14.png",
      likes: "89",
      comments: "15",
    },
    {
      id: 3,
      type: "image",
      thumbnail: "/figmaAssets/frame-15.png",
      likes: "203",
      comments: "31",
    },
    {
      id: 4,
      type: "image",
      thumbnail: "/figmaAssets/frame-16.png",
      likes: "156",
      comments: "28",
    },
    {
      id: 5,
      type: "video",
      thumbnail: "/figmaAssets/frame-17.png",
      likes: "178",
      comments: "42",
    },
    {
      id: 6,
      type: "image",
      thumbnail: "/figmaAssets/frame-18.png",
      likes: "94",
      comments: "19",
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
          {userProfile.username}
        </h1>
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon" data-testid="button-share">
            <ShareIcon className="w-5 h-5 text-[#5d5b5b]" />
          </Button>
          <Button variant="ghost" size="icon" data-testid="button-settings">
            <SettingsIcon className="w-5 h-5 text-[#5d5b5b]" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Profile Info */}
        <div className="p-6 bg-white">
          <div className="flex items-start space-x-4">
            <Avatar className="w-20 h-20">
              <AvatarImage
                src={userProfile.avatar}
                alt={userProfile.name}
                className="object-cover"
              />
              <AvatarFallback>{userProfile.name.charAt(0)}</AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h2 className="[font-family:'Inria_Sans',Helvetica] font-bold text-[#5d5b5b] text-lg">
                  {userProfile.name}
                </h2>
                {userProfile.verified && (
                  <img
                    className="w-5 h-5"
                    alt="Verified"
                    src="/figmaAssets/verified.png"
                  />
                )}
              </div>
              
              <div className="flex space-x-6 mb-3">
                <div 
                  className="text-center cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => console.log("Visualizando posts")}
                  data-testid="stats-posts"
                >
                  <div className="[font-family:'Inria_Sans',Helvetica] font-bold text-[#5d5b5b] text-lg">
                    {userProfile.posts}
                  </div>
                  <div className="[font-family:'Inria_Sans',Helvetica] font-normal text-[#8b8585] text-sm">
                    Posts
                  </div>
                </div>
                <div 
                  className="text-center cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => console.log("Visualizando seguidores")}
                  data-testid="stats-followers"
                >
                  <div className="[font-family:'Inria_Sans',Helvetica] font-bold text-[#5d5b5b] text-lg">
                    {userProfile.followers}
                  </div>
                  <div className="[font-family:'Inria_Sans',Helvetica] font-normal text-[#8b8585] text-sm">
                    Seguidores
                  </div>
                </div>
                <div 
                  className="text-center cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => console.log("Visualizando seguindo")}
                  data-testid="stats-following"
                >
                  <div className="[font-family:'Inria_Sans',Helvetica] font-bold text-[#5d5b5b] text-lg">
                    {userProfile.following}
                  </div>
                  <div className="[font-family:'Inria_Sans',Helvetica] font-normal text-[#8b8585] text-sm">
                    Seguindo
                  </div>
                </div>
              </div>

              <Button
                className="w-full bg-[#e71d36] hover:bg-[#c41a2f] text-white rounded-lg"
                onClick={() => {
                  console.log("Abrindo edição de perfil");
                }}
                data-testid="button-edit-profile"
              >
                Editar Perfil
              </Button>
            </div>
          </div>

          <p className="[font-family:'Inria_Sans',Helvetica] font-normal text-[#5d5b5b] text-sm mt-4">
            {userProfile.bio}
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-white border-b border-[#cccccc]">
          <Button
            variant="ghost"
            className={`flex-1 py-3 ${
              activeTab === "posts"
                ? "border-b-2 border-[#e71d36] text-[#e71d36]"
                : "text-[#8b8585]"
            }`}
            onClick={() => setActiveTab("posts")}
            data-testid="tab-posts"
          >
            <GridIcon className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            className={`flex-1 py-3 ${
              activeTab === "videos"
                ? "border-b-2 border-[#e71d36] text-[#e71d36]"
                : "text-[#8b8585]"
            }`}
            onClick={() => setActiveTab("videos")}
            data-testid="tab-videos"
          >
            <PlayIcon className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            className={`flex-1 py-3 ${
              activeTab === "saved"
                ? "border-b-2 border-[#e71d36] text-[#e71d36]"
                : "text-[#8b8585]"
            }`}
            onClick={() => setActiveTab("saved")}
            data-testid="tab-saved"
          >
            <BookmarkIcon className="w-5 h-5" />
          </Button>
        </div>

        {/* Posts Grid */}
        <div className="p-4">
          <div className="grid grid-cols-3 gap-2">
            {userPosts.map((post) => (
              <div
                key={post.id}
                className="relative aspect-square bg-gray-200 rounded-lg overflow-hidden cursor-pointer"
                onClick={() => {
                  console.log(`Abrindo post ${post.id} em tela cheia`);
                }}
                data-testid={`post-${post.id}`}
              >
                <img
                  src={post.thumbnail}
                  alt={`Post ${post.id}`}
                  className="w-full h-full object-cover hover:opacity-80 transition-opacity"
                />
                {post.type === "video" && (
                  <div className="absolute top-2 right-2">
                    <PlayIcon className="w-4 h-4 text-white" />
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2">
                  <div className="flex items-center space-x-2 text-xs">
                    <span>❤️ {post.likes}</span>
                    <span>💬 {post.comments}</span>
                  </div>
                </div>
              </div>
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

        <Link href="/search">
          <Button variant="ghost" size="icon" className="p-0" data-testid="nav-search">
            <SearchIcon className="w-[38px] h-[38px] text-[#5d5b5b]" />
          </Button>
        </Link>

        <Link href="/notifications">
          <Button variant="ghost" size="icon" className="p-0" data-testid="nav-notifications">
            <BellIcon className="w-[43px] h-[43px] text-[#5d5b5b]" />
          </Button>
        </Link>

        <Button variant="ghost" size="icon" className="p-0" data-testid="nav-profile">
          <UserIcon className="w-[50px] h-[49px] text-[#e71d36]" />
        </Button>
      </div>
    </div>
  );
};