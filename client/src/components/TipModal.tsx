import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@shared/schema";
import { Gift, X, ChevronDown, Lock, Shield } from "lucide-react";
import { SiPix, SiGooglepay } from "react-icons/si";
import { CreditCard } from "lucide-react";

interface TipModalProps {
  isOpen: boolean;
  onClose: () => void;
  creator: User;
  onSuccess?: () => void;
}

const PRESET_AMOUNTS = [30, 60, 150, 300, 600];

export function TipModal({ isOpen, onClose, creator, onSuccess }: TipModalProps) {
  const [step, setStep] = useState<"amount" | "payment">("amount");
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"pix" | "googlepay" | "card">("pix");
  const [paymentData, setPaymentData] = useState({
    firstName: "",
    lastName: "",
    cpf: "",
  });

  const currentAmount = selectedAmount || parseFloat(customAmount) || 0;
  const total = currentAmount;

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount("");
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    setSelectedAmount(null);
  };

  const handleContinue = () => {
    if (currentAmount >= 17 && currentAmount <= 2751.15) {
      setStep("payment");
    }
  };

  const handleConfirm = () => {
    onSuccess?.();
    handleClose();
  };

  const handleClose = () => {
    setStep("amount");
    setSelectedAmount(null);
    setCustomAmount("");
    setPaymentMethod("pix");
    setPaymentData({ firstName: "", lastName: "", cpf: "" });
    onClose();
  };

  if (step === "amount") {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="bg-[#1a1a1a] text-white border-gray-800 max-w-md" data-testid="dialog-tip-amount">
          <button
            onClick={handleClose}
            className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 transition-opacity"
            data-testid="button-close-tip"
          >
            <X className="h-4 w-4" />
          </button>
          
          <DialogHeader>
            <DialogTitle className="text-white text-xl flex items-center gap-2">
              <Gift className="w-5 h-5 text-green-500" />
              Enviar Presente
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div className="flex items-center gap-3 p-3 bg-[#2a2a2a] rounded-lg">
              <Avatar className="w-12 h-12">
                <AvatarImage src={creator.profileImage || undefined} />
                <AvatarFallback>{creator.displayName[0]?.toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-semibold text-white">{creator.displayName}</p>
                <p className="text-sm text-gray-400">@{creator.username}</p>
              </div>
              <ChevronDown className="w-5 h-5 text-gray-400" />
            </div>

            <div className="grid grid-cols-5 gap-2">
              {PRESET_AMOUNTS.map((amount) => (
                <Button
                  key={amount}
                  onClick={() => handleAmountSelect(amount)}
                  className={`h-12 rounded-lg font-semibold ${
                    selectedAmount === amount
                      ? "bg-white text-black hover:bg-white"
                      : "bg-[#2a2a2a] text-white hover:bg-[#3a3a3a] border border-gray-700"
                  }`}
                  data-testid={`button-preset-${amount}`}
                >
                  R${amount}
                </Button>
              ))}
            </div>

            <div>
              <Label className="text-white text-base mb-2 block">Valor customizado</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white text-lg">R$</span>
                <Input
                  type="number"
                  placeholder="60"
                  value={customAmount}
                  onChange={(e) => handleCustomAmountChange(e.target.value)}
                  className="bg-[#2a2a2a] border-gray-700 text-white pl-12 h-14 text-2xl"
                  data-testid="input-custom-amount"
                />
              </div>
              <p className="text-sm text-gray-400 mt-2">
                A gorjeta deve ser entre R$17.00 e R$2751.15
              </p>
            </div>

            <Button
              onClick={handleContinue}
              disabled={currentAmount < 17 || currentAmount > 2751.15}
              className="w-full h-12 bg-white text-black hover:bg-gray-100 font-semibold text-base"
              data-testid="button-continue-tip"
            >
              Confirmar Gorjeta
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-[#1a1a1a] text-white border-gray-800 max-w-md" data-testid="dialog-tip-payment">
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 transition-opacity"
          data-testid="button-close-payment"
        >
          <X className="h-4 w-4" />
        </button>
        
        <DialogHeader>
          <DialogTitle className="text-white text-xl flex items-center gap-2">
            <Gift className="w-5 h-5 text-green-500" />
            Enviar presente
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="flex items-center gap-3 p-3 bg-[#2a2a2a] rounded-lg">
            <Avatar className="w-12 h-12">
              <AvatarImage src={creator.profileImage || undefined} />
              <AvatarFallback>{creator.displayName[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-sm text-gray-400">Dar gorjeta à publicação</p>
              <ChevronDown className="w-4 h-4 text-gray-400 inline ml-1" />
            </div>
          </div>

          <div className="flex items-center justify-between py-2">
            <span className="text-white font-medium">Total a pagar</span>
            <span className="text-white text-xl font-bold">R${total.toFixed(2)}</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <Button
              onClick={() => setPaymentMethod("pix")}
              className={`h-14 flex items-center justify-center gap-2 ${
                paymentMethod === "pix"
                  ? "bg-white text-black hover:bg-white border-2 border-white"
                  : "bg-[#2a2a2a] text-white hover:bg-[#3a3a3a] border border-gray-700"
              }`}
              data-testid="button-payment-pix"
            >
              <SiPix className="w-5 h-5 text-[#32BCAD]" />
              <span className="font-semibold">PIX</span>
            </Button>
            <Button
              onClick={() => setPaymentMethod("googlepay")}
              className={`h-14 flex items-center justify-center gap-2 ${
                paymentMethod === "googlepay"
                  ? "bg-white text-black hover:bg-white border-2 border-white"
                  : "bg-[#2a2a2a] text-white hover:bg-[#3a3a3a] border border-gray-700"
              }`}
              data-testid="button-payment-googlepay"
            >
              <SiGooglepay className="w-5 h-5" />
              <span className="font-semibold">Pay</span>
            </Button>
            <Button
              onClick={() => setPaymentMethod("card")}
              className={`h-14 flex items-center justify-center gap-2 ${
                paymentMethod === "card"
                  ? "bg-white text-black hover:bg-white border-2 border-white"
                  : "bg-[#2a2a2a] text-white hover:bg-[#3a3a3a] border border-gray-700"
              }`}
              data-testid="button-payment-card"
            >
              <CreditCard className="w-5 h-5" />
              <span className="font-semibold">Cartão</span>
            </Button>
          </div>

          <div className="space-y-3">
            <Label className="text-white">Conta</Label>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Input
                  placeholder="Primeiro nome"
                  value={paymentData.firstName}
                  onChange={(e) => setPaymentData({ ...paymentData, firstName: e.target.value })}
                  className="bg-[#2a2a2a] border-gray-700 text-white h-12"
                  data-testid="input-first-name"
                />
              </div>
              <div>
                <Input
                  placeholder="Apelido"
                  value={paymentData.lastName}
                  onChange={(e) => setPaymentData({ ...paymentData, lastName: e.target.value })}
                  className="bg-[#2a2a2a] border-gray-700 text-white h-12"
                  data-testid="input-last-name"
                />
              </div>
            </div>

            <Input
              placeholder="CPF"
              value={paymentData.cpf}
              onChange={(e) => setPaymentData({ ...paymentData, cpf: e.target.value })}
              className="bg-[#2a2a2a] border-gray-700 text-white h-12"
              data-testid="input-cpf"
            />
          </div>

          <Button
            onClick={handleConfirm}
            className="w-full h-12 bg-white text-black hover:bg-gray-100 font-semibold text-base"
            data-testid="button-confirm-payment"
          >
            Confirmar
          </Button>

          <p className="text-xs text-gray-400 text-center">
            Ao continuar aceitas os Termos e Condições da Fanvue. A cobrança aparecerá no extrato como "FANVUE".
          </p>

          <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Shield className="w-3 h-3" />
              <span>PCI Compliant</span>
            </div>
            <div className="flex items-center gap-1">
              <Lock className="w-3 h-3" />
              <span>SSL Encrypted</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
