import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUpdateOffer, getOfferTypeLabel, getTargetAudienceLabel } from "@/hooks/use-promotions";
import { toast } from "@/hooks/use-toast";
import { 
  Gift, 
  Percent, 
  Settings, 
  Eye, 
  Users,
  Bell
} from "lucide-react";
import type { PromotionalOffer } from "@shared/schema";

interface EditOfferModalProps {
  offer: PromotionalOffer;
  isOpen: boolean;
  onClose: () => void;
}

export function EditOfferModal({ offer, isOpen, onClose }: EditOfferModalProps) {
  const updateOfferMutation = useUpdateOffer();
  
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [targetAudience, setTargetAudience] = useState<"new" | "existing" | "all">("new");
  const [notifyFollowers, setNotifyFollowers] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  useEffect(() => {
    if (offer) {
      setTitle(offer.title);
      setDescription(offer.description || "");
      setTargetAudience(offer.targetAudience as "new" | "existing" | "all");
      setNotifyFollowers(offer.notifyFollowers);
      setStartDate(offer.startDate ? new Date(offer.startDate).toISOString().split('T')[0] : "");
      setEndDate(offer.endDate ? new Date(offer.endDate).toISOString().split('T')[0] : "");
    }
  }, [offer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações básicas
    if (!title.trim() || title.length < 3) {
      toast({
        title: "Título inválido",
        description: "O título deve ter pelo menos 3 caracteres.",
        variant: "destructive",
      });
      return;
    }

    // Validar datas
    if (startDate && endDate && new Date(startDate) >= new Date(endDate)) {
      toast({
        title: "Datas inválidas",
        description: "A data de fim deve ser posterior à data de início.",
        variant: "destructive",
      });
      return;
    }

    // Verificar se houve mudanças
    const hasChanges = (
      title.trim() !== offer.title ||
      description.trim() !== (offer.description || "") ||
      targetAudience !== offer.targetAudience ||
      notifyFollowers !== offer.notifyFollowers ||
      startDate !== (offer.startDate ? new Date(offer.startDate).toISOString().split('T')[0] : "") ||
      endDate !== (offer.endDate ? new Date(offer.endDate).toISOString().split('T')[0] : "")
    );

    if (!hasChanges) {
      toast({
        title: "Nenhuma alteração",
        description: "Não foram feitas alterações na oferta.",
        variant: "destructive",
      });
      return;
    }

    try {
      await updateOfferMutation.mutateAsync({
        id: offer.id,
        data: {
          title: title.trim(),
          description: description.trim() || null,
          targetAudience,
          notifyFollowers,
          startDate: startDate ? new Date(startDate) : null,
          endDate: endDate ? new Date(endDate) : null
        }
      });
      
      toast({
        title: "Oferta atualizada!",
        description: "A oferta promocional foi atualizada com sucesso.",
      });
      
      handleClose();
    } catch (error) {
      toast({
        title: "Erro ao atualizar oferta",
        description: "Não foi possível atualizar a oferta promocional.",
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    if (offer) {
      setTitle(offer.title);
      setDescription(offer.description || "");
      setTargetAudience(offer.targetAudience as "new" | "existing" | "all");
      setNotifyFollowers(offer.notifyFollowers);
      setStartDate(offer.startDate ? new Date(offer.startDate).toISOString().split('T')[0] : "");
      setEndDate(offer.endDate ? new Date(offer.endDate).toISOString().split('T')[0] : "");
    }
    onClose();
  };

  const getOfferDetails = () => {
    if (offer.offerType === "trial") {
      return `${offer.trialDays} dias grátis`;
    } else {
      return `${offer.discountPercent}% de desconto por ${offer.discountDurationMonths} ${offer.discountDurationMonths === 1 ? "mês" : "meses"}`;
    }
  };

  const hasChanges = offer && (
    title.trim() !== offer.title ||
    description.trim() !== (offer.description || "") ||
    targetAudience !== offer.targetAudience ||
    notifyFollowers !== offer.notifyFollowers ||
    startDate !== (offer.startDate ? new Date(offer.startDate).toISOString().split('T')[0] : "") ||
    endDate !== (offer.endDate ? new Date(offer.endDate).toISOString().split('T')[0] : "")
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Editar Oferta Promocional
          </DialogTitle>
          <DialogDescription>
            Edite as configurações da sua oferta promocional. O tipo de oferta não pode ser alterado.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  {offer.offerType === "trial" ? (
                    <Gift className="h-4 w-4 text-blue-500" />
                  ) : (
                    <Percent className="h-4 w-4 text-purple-500" />
                  )}
                  {getOfferTypeLabel(offer.offerType)} - {getOfferDetails()}
                </CardTitle>
              </CardHeader>
            </Card>
            
            <div className="space-y-2">
              <Label htmlFor="title">Título da oferta</Label>
              <Input
                id="title"
                placeholder="Ex: Teste Grátis de 7 dias"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Mínimo 3 caracteres
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Descrição (opcional)</Label>
              <Textarea
                id="description"
                placeholder="Descreva os benefícios da oferta..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="target-audience">Público-alvo</Label>
              <Select value={targetAudience} onValueChange={(value) => setTargetAudience(value as "new" | "existing" | "all")}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o público-alvo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Novos assinantes
                    </div>
                  </SelectItem>
                  <SelectItem value="existing">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Assinantes existentes
                    </div>
                  </SelectItem>
                  <SelectItem value="all">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Todos
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  Notificar seguidores
                </Label>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Enviar notificação quando a oferta for criada
                </p>
              </div>
              <Switch
                checked={notifyFollowers}
                onCheckedChange={setNotifyFollowers}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-date">Data de início (opcional)</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-date">Data de fim (opcional)</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          {hasChanges && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                <div className="text-sm text-blue-700 dark:text-blue-300">
                  <p className="font-medium">Alterações detectadas</p>
                  <p className="text-xs mt-1">
                    A oferta será atualizada com as novas configurações.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={updateOfferMutation.isPending || !hasChanges}
            >
              {updateOfferMutation.isPending ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
