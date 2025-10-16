import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCreateOffer, getOfferTypeLabel, getTargetAudienceLabel } from "@/hooks/use-promotions";
import { toast } from "@/hooks/use-toast";
import { 
  Gift, 
  Percent, 
  Settings, 
  Eye, 
  Calendar,
  Users,
  Bell
} from "lucide-react";

interface CreateOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateOfferModal({ isOpen, onClose }: CreateOfferModalProps) {
  const createOfferMutation = useCreateOffer();
  
  // Tab 1: Tipo de Oferta
  const [offerType, setOfferType] = useState<"trial" | "discount">("trial");
  const [trialDays, setTrialDays] = useState<string>("7");
  const [discountPercent, setDiscountPercent] = useState<string>("");
  const [discountDurationMonths, setDiscountDurationMonths] = useState<string>("");
  
  // Tab 2: Configurações
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [targetAudience, setTargetAudience] = useState<"new" | "existing" | "all">("new");
  const [notifyFollowers, setNotifyFollowers] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

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

    // Validações específicas por tipo
    if (offerType === "trial") {
      const days = parseInt(trialDays);
      if (![3, 7, 14, 30].includes(days)) {
        toast({
          title: "Dias de teste inválidos",
          description: "Selecione 3, 7, 14 ou 30 dias.",
          variant: "destructive",
        });
        return;
      }
    } else if (offerType === "discount") {
      const discount = parseFloat(discountPercent);
      const duration = parseInt(discountDurationMonths);
      
      if (isNaN(discount) || discount < 5 || discount > 70) {
        toast({
          title: "Desconto inválido",
          description: "O desconto deve estar entre 5% e 70%.",
          variant: "destructive",
        });
        return;
      }
      
      if (isNaN(duration) || duration < 1 || duration > 12) {
        toast({
          title: "Duração inválida",
          description: "A duração deve estar entre 1 e 12 meses.",
          variant: "destructive",
        });
        return;
      }
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

    try {
      await createOfferMutation.mutateAsync({
        title: title.trim(),
        description: description.trim() || null,
        offerType,
        trialDays: offerType === "trial" ? parseInt(trialDays) : null,
        discountPercent: offerType === "discount" ? parseFloat(discountPercent) : null,
        discountDurationMonths: offerType === "discount" ? parseInt(discountDurationMonths) : null,
        targetAudience,
        notifyFollowers,
        isActive: true,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null
      });
      
      toast({
        title: "Oferta criada!",
        description: "A oferta promocional foi criada com sucesso.",
      });
      
      handleClose();
    } catch (error) {
      toast({
        title: "Erro ao criar oferta",
        description: "Não foi possível criar a oferta promocional.",
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    setOfferType("trial");
    setTrialDays("7");
    setDiscountPercent("");
    setDiscountDurationMonths("");
    setTitle("");
    setDescription("");
    setTargetAudience("new");
    setNotifyFollowers(false);
    setStartDate("");
    setEndDate("");
    onClose();
  };

  const getOfferDetails = () => {
    if (offerType === "trial") {
      return `${trialDays} dias grátis`;
    } else {
      return `${discountPercent}% de desconto por ${discountDurationMonths} ${discountDurationMonths === "1" ? "mês" : "meses"}`;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5" />
            Criar Oferta Promocional
          </DialogTitle>
          <DialogDescription>
            Crie uma oferta especial para atrair novos assinantes ou recompensar os existentes.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="type" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="type" className="flex items-center gap-2">
              <Gift className="h-4 w-4" />
              Tipo
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Configurações
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Resumo
            </TabsTrigger>
          </TabsList>
          
          <form onSubmit={handleSubmit}>
            <TabsContent value="type" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label className="text-base font-medium">Tipo de Oferta</Label>
                  <RadioGroup value={offerType} onValueChange={(value) => setOfferType(value as "trial" | "discount")} className="mt-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="trial" id="trial" />
                      <Label htmlFor="trial" className="flex items-center gap-2">
                        <Gift className="h-4 w-4 text-blue-500" />
                        Teste Gratuito
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="discount" id="discount" />
                      <Label htmlFor="discount" className="flex items-center gap-2">
                        <Percent className="h-4 w-4 text-purple-500" />
                        Desconto
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
                
                {offerType === "trial" && (
                  <div className="space-y-2">
                    <Label htmlFor="trial-days">Dias de teste gratuito</Label>
                    <Select value={trialDays} onValueChange={setTrialDays}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione os dias" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3 dias</SelectItem>
                        <SelectItem value="7">7 dias</SelectItem>
                        <SelectItem value="14">14 dias</SelectItem>
                        <SelectItem value="30">30 dias</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                {offerType === "discount" && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="discount-percent">Desconto (%)</Label>
                      <div className="relative">
                        <Input
                          id="discount-percent"
                          type="number"
                          step="0.1"
                          min="5"
                          max="70"
                          placeholder="30"
                          value={discountPercent}
                          onChange={(e) => setDiscountPercent(e.target.value)}
                          className="pr-8"
                        />
                        <Percent className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="discount-duration">Duração (meses)</Label>
                      <Select value={discountDurationMonths} onValueChange={setDiscountDurationMonths}>
                        <SelectTrigger>
                          <SelectValue placeholder="Meses" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                            <SelectItem key={month} value={month.toString()}>
                              {month} {month === 1 ? "mês" : "meses"}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="settings" className="space-y-4">
              <div className="space-y-4">
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
            </TabsContent>
            
            <TabsContent value="preview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Preview da Oferta
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      {offerType === "trial" ? (
                        <Gift className="h-4 w-4 text-blue-500" />
                      ) : (
                        <Percent className="h-4 w-4 text-purple-500" />
                      )}
                      <span className="font-medium">
                        {getOfferTypeLabel(offerType)}
                      </span>
                    </div>
                    
                    {title && (
                      <div>
                        <h3 className="font-semibold text-lg">{title}</h3>
                        {description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {description}
                          </p>
                        )}
                      </div>
                    )}
                    
                    <div className="text-sm">
                      <p><strong>Detalhes:</strong> {getOfferDetails()}</p>
                      <p><strong>Público-alvo:</strong> {getTargetAudienceLabel(targetAudience)}</p>
                      <p><strong>Notificação:</strong> {notifyFollowers ? "Sim" : "Não"}</p>
                      {startDate && (
                        <p><strong>Início:</strong> {new Date(startDate).toLocaleDateString('pt-BR')}</p>
                      )}
                      {endDate && (
                        <p><strong>Fim:</strong> {new Date(endDate).toLocaleDateString('pt-BR')}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={createOfferMutation.isPending || !title.trim() || title.length < 3}
              >
                {createOfferMutation.isPending ? "Criando..." : "Criar Oferta"}
              </Button>
            </DialogFooter>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
