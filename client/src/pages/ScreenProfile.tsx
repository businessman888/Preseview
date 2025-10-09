import {
  ArrowLeftIcon,
  BellIcon,
  HomeIcon,
  MessageCircleIcon,
  Plus,
  UserIcon,
  SettingsIcon,
  ShareIcon,
  GridIcon,
  PlayIcon,
  BookmarkIcon,
  ImageIcon,
  Edit2Icon,
  Trash2Icon,
  MoreVerticalIcon,
} from "lucide-react";
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useCreatorPosts } from "@/hooks/use-creator-posts";
import { CreatePostModal } from "@/components/CreatePostModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const ScreenProfile = (): JSX.Element => {
  const { user } = useAuth();
  const { posts, imagePosts, videoPosts, deletePost, isDeleting } = useCreatorPosts(user?.id);
  const [activeTab, setActiveTab] = useState("posts");
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<number | null>(null);

  const getDisplayPosts = () => {
    switch (activeTab) {
      case "videos":
        return videoPosts;
      case "images":
        return imagePosts;
      default:
        return posts;
    }
  };

  const handleViewPost = (post: any) => {
    setSelectedPost(post);
    setIsViewDialogOpen(true);
  };

  const handleDeleteClick = (postId: number) => {
    setPostToDelete(postId);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (postToDelete) {
      deletePost(postToDelete);
      setIsDeleteDialogOpen(false);
      setPostToDelete(null);
    }
  };

  const displayPosts = getDisplayPosts();

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
          {user?.username || "@seuusername"}
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

      <div className="flex-1 overflow-y-auto pb-20">
        {/* Profile Info */}
        <div className="p-6 bg-white">
          <div className="flex items-start space-x-4">
            <Avatar className="w-20 h-20">
              <AvatarImage
                src={user?.profileImage || "/figmaAssets/ellipse-19.png"}
                alt={user?.displayName || "Você"}
                className="object-cover"
              />
              <AvatarFallback>{user?.displayName?.charAt(0) || "V"}</AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h2 className="[font-family:'Inria_Sans',Helvetica] font-bold text-[#5d5b5b] text-lg">
                  {user?.displayName || "Você"}
                </h2>
                {user?.isVerified && (
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
                  data-testid="stats-posts"
                >
                  <div className="[font-family:'Inria_Sans',Helvetica] font-bold text-[#5d5b5b] text-lg">
                    {posts.length}
                  </div>
                  <div className="[font-family:'Inria_Sans',Helvetica] font-normal text-[#8b8585] text-sm">
                    Posts
                  </div>
                </div>
                <div 
                  className="text-center cursor-pointer hover:opacity-80 transition-opacity"
                  data-testid="stats-followers"
                >
                  <div className="[font-family:'Inria_Sans',Helvetica] font-bold text-[#5d5b5b] text-lg">
                    0
                  </div>
                  <div className="[font-family:'Inria_Sans',Helvetica] font-normal text-[#8b8585] text-sm">
                    Seguidores
                  </div>
                </div>
                <div 
                  className="text-center cursor-pointer hover:opacity-80 transition-opacity"
                  data-testid="stats-following"
                >
                  <div className="[font-family:'Inria_Sans',Helvetica] font-bold text-[#5d5b5b] text-lg">
                    0
                  </div>
                  <div className="[font-family:'Inria_Sans',Helvetica] font-normal text-[#8b8585] text-sm">
                    Seguindo
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Button
                  className="w-full bg-[#e71d36] hover:bg-[#c41a2f] text-white rounded-lg"
                  onClick={() => {
                    console.log("Abrindo edição de perfil");
                  }}
                  data-testid="button-edit-profile"
                >
                  Editar Perfil
                </Button>
                
                {user?.userType !== 'creator' && (
                  <Link href="/become-creator">
                    <Button
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg"
                      data-testid="button-become-creator"
                    >
                      ✨ Tornar-se Criador
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>

          <p className="[font-family:'Inria_Sans',Helvetica] font-normal text-[#5d5b5b] text-sm mt-4">
            {user?.bio || "Bem-vindo ao meu perfil! Compartilhando momentos especiais da minha vida ✨"}
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
              activeTab === "images"
                ? "border-b-2 border-[#e71d36] text-[#e71d36]"
                : "text-[#8b8585]"
            }`}
            onClick={() => setActiveTab("images")}
            data-testid="tab-images"
          >
            <ImageIcon className="w-5 h-5" />
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
        </div>

        {/* Posts Grid */}
        <div className="p-4">
          {displayPosts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-[#8b8585] text-lg mb-4">
                {activeTab === "videos" 
                  ? "Nenhum vídeo publicado ainda" 
                  : activeTab === "images"
                  ? "Nenhuma imagem publicada ainda"
                  : "Nenhum post publicado ainda"}
              </p>
              {user?.userType === 'creator' && (
                <Button
                  onClick={() => setIsCreatePostModalOpen(true)}
                  className="bg-[#e71d36] hover:bg-[#c41a2f] text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Criar primeiro post
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {displayPosts.map((post) => (
                <div
                  key={post.id}
                  className="relative aspect-square bg-gray-200 rounded-lg overflow-hidden group"
                  data-testid={`post-${post.id}`}
                >
                  {post.mediaUrls && post.mediaUrls.length > 0 ? (
                    <img
                      src={post.mediaUrls[0]}
                      alt={post.title}
                      className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => handleViewPost(post)}
                    />
                  ) : (
                    <div 
                      className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-400 to-pink-400 cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => handleViewPost(post)}
                    >
                      <p className="text-white text-center p-2 text-sm line-clamp-3">
                        {post.title}
                      </p>
                    </div>
                  )}
                  
                  {post.mediaUrls && post.mediaUrls.some((url: string) => url.match(/\.(mp4|webm|ogg|mov)$/i)) && (
                    <div className="absolute top-2 right-2">
                      <PlayIcon className="w-4 h-4 text-white drop-shadow-lg" />
                    </div>
                  )}

                  {/* Management options */}
                  {user?.userType === 'creator' && (
                    <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="secondary"
                            size="icon"
                            className="h-8 w-8 bg-white/90 hover:bg-white"
                          >
                            <MoreVerticalIcon className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => handleViewPost(post)}>
                            <GridIcon className="mr-2 h-4 w-4" />
                            Visualizar
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDeleteClick(post.id)}
                            className="text-red-600"
                          >
                            <Trash2Icon className="mr-2 h-4 w-4" />
                            Deletar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )}

                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2">
                    <div className="flex items-center space-x-2 text-xs">
                      <span>❤️ {post.likesCount || 0}</span>
                      <span>💬 {post.commentsCount || 0}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="flex w-full items-center justify-center gap-[30px] px-[5px] py-2.5 fixed bottom-0 left-0 bg-white rounded-[30px_30px_0px_0px] overflow-hidden shadow-[3px_4px_4px_#00000040]">
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

        <Link href="/notifications">
          <Button variant="ghost" size="icon" className="p-0" data-testid="nav-notifications">
            <BellIcon className="w-[43px] h-[43px] text-[#5d5b5b]" />
          </Button>
        </Link>

        <Button variant="ghost" size="icon" className="p-0" data-testid="nav-profile">
          <UserIcon className="w-[50px] h-[49px] text-[#e71d36]" />
        </Button>
      </div>

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={isCreatePostModalOpen}
        onClose={() => setIsCreatePostModalOpen(false)}
      />

      {/* View Post Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedPost?.title}</DialogTitle>
            <DialogDescription>
              {selectedPost?.isExclusive && (
                <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full mr-2">
                  Conteúdo Exclusivo
                </span>
              )}
              {selectedPost?.tags?.map((tag: string) => (
                <span key={tag} className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full mr-1">
                  #{tag}
                </span>
              ))}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {selectedPost?.mediaUrls && selectedPost.mediaUrls.length > 0 && (
              <div className="space-y-2">
                {selectedPost.mediaUrls.map((url: string, index: number) => (
                  <div key={index} className="rounded-lg overflow-hidden">
                    {url.match(/\.(mp4|webm|ogg|mov)$/i) ? (
                      <video src={url} controls className="w-full" />
                    ) : (
                      <img src={url} alt={`Mídia ${index + 1}`} className="w-full" />
                    )}
                  </div>
                ))}
              </div>
            )}
            <p className="text-sm text-gray-700">{selectedPost?.content}</p>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>❤️ {selectedPost?.likesCount || 0} curtidas</span>
              <span>💬 {selectedPost?.commentsCount || 0} comentários</span>
              <span>👁️ {selectedPost?.viewsCount || 0} visualizações</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja deletar este post? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting ? "Deletando..." : "Deletar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
