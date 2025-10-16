import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  MessageSquare, 
  Gift, 
  TrendingUp,
  Calendar,
  Target
} from 'lucide-react';
import { useSubscriberLists } from '@/hooks/use-lists';
import { SmartListsTab } from './SmartListsTab';
import { CustomListsTab } from './CustomListsTab';
import { CreateListModal } from './CreateListModal';

interface ListsOverviewProps {
  onCreateOffer: (listId: number) => void;
}

export function ListsOverview({ onCreateOffer }: ListsOverviewProps) {
  const [activeTab, setActiveTab] = useState('custom');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const { data: allLists = [] } = useSubscriberLists();
  const customLists = allLists.filter(list => list.listType === 'custom');
  const smartLists = allLists.filter(list => list.listType === 'smart');

  // Calculate stats
  const totalMembers = allLists.reduce((sum, list) => sum + list.memberCount, 0);
  const activeLists = allLists.filter(list => list.isActive).length;
  const totalLists = allLists.length;

  // Recent activity (mock data for now)
  const recentActivity = [
    {
      id: 1,
      type: 'message_sent',
      listName: 'VIP Members',
      memberCount: 150,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    },
    {
      id: 2,
      type: 'list_created',
      listName: 'Engajados',
      memberCount: 75,
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    },
    {
      id: 3,
      type: 'offer_created',
      listName: 'Novos Assinantes',
      memberCount: 25,
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'message_sent':
        return <MessageSquare className="h-4 w-4 text-blue-600" />;
      case 'list_created':
        return <Users className="h-4 w-4 text-green-600" />;
      case 'offer_created':
        return <Gift className="h-4 w-4 text-purple-600" />;
      default:
        return <Target className="h-4 w-4 text-gray-600" />;
    }
  };

  const getActivityText = (type: string, listName: string, memberCount: number) => {
    switch (type) {
      case 'message_sent':
        return `Mensagem enviada para "${listName}" (${memberCount} membros)`;
      case 'list_created':
        return `Lista "${listName}" criada com ${memberCount} membros`;
      case 'offer_created':
        return `Oferta criada para "${listName}" (${memberCount} membros)`;
      default:
        return `Atividade em "${listName}"`;
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) {
      return 'Agora mesmo';
    } else if (diffHours < 24) {
      return `${diffHours}h atrás`;
    } else if (diffDays < 7) {
      return `${diffDays}d atrás`;
    } else {
      return timestamp.toLocaleDateString('pt-BR');
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {totalMembers}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Total de Membros
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <Target className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {totalLists}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Listas Criadas
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {activeLists}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Listas Ativas
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
              <Calendar className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {customLists.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Listas Personalizadas
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lists Tabs */}
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="custom" className="flex items-center gap-2">
                <span>Personalizadas</span>
                <Badge variant="secondary" className="text-xs">
                  {customLists.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="smart" className="flex items-center gap-2">
                <span>Inteligentes</span>
                <Badge variant="secondary" className="text-xs">
                  {smartLists.length}
                </Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="custom" className="mt-6">
              <CustomListsTab onCreateOffer={onCreateOffer} />
            </TabsContent>

            <TabsContent value="smart" className="mt-6">
              <SmartListsTab 
                onViewMembers={(listId, filters) => {
                  console.log('View smart list members:', listId, filters);
                }}
                onSendMessage={(listId, filters) => {
                  console.log('Send message to smart list:', listId, filters);
                }}
                onCreateOffer={(listId, filters) => {
                  console.log('Create offer for smart list:', listId, filters);
                  onCreateOffer(parseInt(listId));
                }}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              Ações Rápidas
            </h3>
            <div className="space-y-2">
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => setShowCreateModal(true)}
              >
                <Users className="h-4 w-4 mr-2" />
                Nova Lista Personalizada
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => setActiveTab('smart')}
              >
                <Target className="h-4 w-4 mr-2" />
                Ver Listas Inteligentes
              </Button>
            </div>
          </Card>

          {/* Recent Activity */}
          <Card className="p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              Atividade Recente
            </h3>
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  {getActivityIcon(activity.type)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 dark:text-white">
                      {getActivityText(activity.type, activity.listName, activity.memberCount)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatTimestamp(activity.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Tips */}
          <Card className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
              💡 Dicas
            </h3>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <p>• Use listas inteligentes para segmentação automática</p>
              <p>• Crie listas personalizadas para campanhas específicas</p>
              <p>• Envie mensagens em massa para engajar sua audiência</p>
              <p>• Crie ofertas exclusivas para diferentes segmentos</p>
            </div>
          </Card>
        </div>
      </div>

      {/* Create List Modal */}
      <CreateListModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => {
          setShowCreateModal(false);
          // Refresh data would happen automatically via React Query
        }}
      />
    </div>
  );
}
