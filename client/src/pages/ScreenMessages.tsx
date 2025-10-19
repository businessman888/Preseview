import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search } from "lucide-react";
import { Link } from "wouter";
import { UserLayout } from "@/components/user/UserLayout";
import { User as UserType, Message } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Conversation {
  otherUser: UserType;
  lastMessage: Message;
  unreadCount: number;
}

export const ScreenMessages = (): JSX.Element => {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: conversations = [], isLoading } = useQuery<Conversation[]>({
    queryKey: ["/api/messages/conversations"],
  });

  const filteredConversations = conversations.filter(conv =>
    conv.otherUser.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.otherUser.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <UserLayout>
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-black">
      <header className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b dark:border-gray-800 px-4 py-3">
        <div className="flex items-center gap-4 max-w-2xl mx-auto">
          <Link href="/">
            <Button variant="ghost" size="icon" data-testid="button-back">
              <ArrowLeft className="w-6 h-6" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">Mensagens</h1>
        </div>
      </header>

      <div className="max-w-2xl mx-auto w-full p-4">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Buscar conversas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            data-testid="input-search-conversations"
          />
        </div>

        <div className="space-y-1">
          {isLoading ? (
            [...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-4 bg-white dark:bg-gray-900 rounded-lg">
                <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 animate-pulse" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse" />
                </div>
              </div>
            ))
          ) : filteredConversations.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">
                {searchQuery ? "Nenhuma conversa encontrada" : "Nenhuma mensagem ainda"}
              </p>
            </div>
          ) : (
            filteredConversations.map((conversation) => (
              <Link key={conversation.otherUser.id} href={`/messages/${conversation.otherUser.id}`}>
                <div
                  className={`flex items-center gap-3 p-4 bg-white dark:bg-gray-900 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                    conversation.unreadCount > 0 ? "border-l-4 border-pink-500" : ""
                  }`}
                  data-testid={`conversation-${conversation.otherUser.id}`}
                >
                  <Avatar>
                    <AvatarImage src={conversation.otherUser.profileImage || undefined} />
                    <AvatarFallback>
                      {conversation.otherUser.displayName[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                        {conversation.otherUser.displayName}
                      </h3>
                      <span className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(conversation.lastMessage.createdAt), {
                          addSuffix: true,
                          locale: ptBR,
                        })}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p
                        className={`text-sm truncate ${
                          conversation.unreadCount > 0
                            ? "font-semibold text-gray-900 dark:text-white"
                            : "text-gray-500"
                        }`}
                      >
                        {conversation.lastMessage.content}
                      </p>
                      {conversation.unreadCount > 0 && (
                        <span className="ml-2 bg-pink-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
                          {conversation.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
      </div>
    </UserLayout>
  );
};
