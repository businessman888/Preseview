import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { Notification, User as UserType } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface NotificationWithUser extends Notification {
  triggeredByUser?: UserType;
}

export const ScreenNotifications = (): JSX.Element => {
  const { data: notifications = [], isLoading } = useQuery<NotificationWithUser[]>({
    queryKey: ["/api/notifications"],
  });

  const followers = notifications.filter(n => n.type === "follow");
  const subscriptions = notifications.filter(n => n.type === "subscription");
  const likes = notifications.filter(n => n.type === "like");
  const comments = notifications.filter(n => n.type === "comment");
  const tips = notifications.filter(n => n.type === "tip");

  const NotificationItem = ({ notification }: { notification: NotificationWithUser }) => (
    <div
      className={`flex items-start gap-3 p-4 border-b dark:border-gray-800 ${
        !notification.isRead ? "bg-pink-50 dark:bg-pink-950/20" : ""
      }`}
      data-testid={`notification-${notification.id}`}
    >
      <Avatar>
        <AvatarImage src={notification.triggeredByUser?.profileImage || undefined} />
        <AvatarFallback>
          {notification.triggeredByUser?.displayName[0]?.toUpperCase() || "?"}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <p className="text-sm">
          <span className="font-semibold">{notification.triggeredByUser?.displayName || "Alguém"}</span>
          {" "}
          <span className="text-gray-600 dark:text-gray-400">{notification.message}</span>
        </p>
        <p className="text-xs text-gray-500 mt-1">
          {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true, locale: ptBR })}
        </p>
      </div>
      {!notification.isRead && (
        <div className="w-2 h-2 bg-pink-500 rounded-full mt-2" />
      )}
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-black">
      <header className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b dark:border-gray-800 px-4 py-3">
        <div className="flex items-center gap-4 max-w-2xl mx-auto">
          <Link href="/">
            <Button variant="ghost" size="icon" data-testid="button-back">
              <ArrowLeft className="w-6 h-6" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">Notificações</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto w-full">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
            <TabsTrigger value="all" className="rounded-none border-b-2 data-[state=active]:border-pink-500" data-testid="tab-all">
              Todas
            </TabsTrigger>
            <TabsTrigger value="followers" className="rounded-none border-b-2 data-[state=active]:border-pink-500" data-testid="tab-followers">
              Seguidores ({followers.length})
            </TabsTrigger>
            <TabsTrigger value="subscriptions" className="rounded-none border-b-2 data-[state=active]:border-pink-500" data-testid="tab-subscriptions">
              Assinantes ({subscriptions.length})
            </TabsTrigger>
            <TabsTrigger value="likes" className="rounded-none border-b-2 data-[state=active]:border-pink-500" data-testid="tab-likes">
              Curtidas ({likes.length})
            </TabsTrigger>
            <TabsTrigger value="comments" className="rounded-none border-b-2 data-[state=active]:border-pink-500" data-testid="tab-comments">
              Comentários ({comments.length})
            </TabsTrigger>
            <TabsTrigger value="tips" className="rounded-none border-b-2 data-[state=active]:border-pink-500" data-testid="tab-tips">
              Presentes ({tips.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-0">
            {isLoading ? (
              <div className="space-y-1">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 border-b dark:border-gray-800">
                    <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse" />
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4 animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            ) : notifications.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">Nenhuma notificação ainda</p>
              </div>
            ) : (
              notifications.map(notification => (
                <NotificationItem key={notification.id} notification={notification} />
              ))
            )}
          </TabsContent>

          <TabsContent value="followers" className="mt-0">
            {followers.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">Nenhum novo seguidor</p>
              </div>
            ) : (
              followers.map(notification => (
                <NotificationItem key={notification.id} notification={notification} />
              ))
            )}
          </TabsContent>

          <TabsContent value="subscriptions" className="mt-0">
            {subscriptions.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">Nenhum novo assinante</p>
              </div>
            ) : (
              subscriptions.map(notification => (
                <NotificationItem key={notification.id} notification={notification} />
              ))
            )}
          </TabsContent>

          <TabsContent value="likes" className="mt-0">
            {likes.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">Nenhuma curtida ainda</p>
              </div>
            ) : (
              likes.map(notification => (
                <NotificationItem key={notification.id} notification={notification} />
              ))
            )}
          </TabsContent>

          <TabsContent value="comments" className="mt-0">
            {comments.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">Nenhum comentário ainda</p>
              </div>
            ) : (
              comments.map(notification => (
                <NotificationItem key={notification.id} notification={notification} />
              ))
            )}
          </TabsContent>

          <TabsContent value="tips" className="mt-0">
            {tips.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">Nenhum presente recebido</p>
              </div>
            ) : (
              tips.map(notification => (
                <NotificationItem key={notification.id} notification={notification} />
              ))
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};
