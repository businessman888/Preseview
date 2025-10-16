import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  Bold, 
  Italic, 
  Smile, 
  Image as ImageIcon, 
  Type,
  Link as LinkIcon
} from "lucide-react";

interface MessageFormatToolbarProps {
  onInsertText: (text: string) => void;
  onInsertEmoji: (emoji: string) => void;
}

export function MessageFormatToolbar({ onInsertText, onInsertEmoji }: MessageFormatToolbarProps) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const commonEmojis = [
    "😊", "😍", "😂", "🥰", "😎", "🤔", "👍", "❤️", "🎉", "🔥",
    "✨", "💯", "🚀", "💪", "🌟", "🎊", "👏", "🙌", "💖", "😘"
  ];

  const handleBold = () => {
    onInsertText("**texto em negrito**");
  };

  const handleItalic = () => {
    onInsertText("*texto em itálico*");
  };

  const handleEmoji = (emoji: string) => {
    onInsertEmoji(emoji);
    setShowEmojiPicker(false);
  };

  const handleLink = () => {
    onInsertText("[texto do link](https://exemplo.com)");
  };

  const handleLineBreak = () => {
    onInsertText("\n");
  };

  return (
    <TooltipProvider>
      <div className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        {/* Formatação de texto */}
        <div className="flex items-center space-x-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBold}
                className="h-8 w-8 p-0"
              >
                <Bold className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Negrito (**texto**)</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleItalic}
                className="h-8 w-8 p-0"
              >
                <Italic className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Itálico (*texto*)</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLink}
                className="h-8 w-8 p-0"
              >
                <LinkIcon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Link</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLineBreak}
                className="h-8 w-8 p-0"
              >
                <Type className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Quebra de linha</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Emoji picker */}
        <div className="relative">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="h-8 w-8 p-0"
              >
                <Smile className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Emojis</p>
            </TooltipContent>
          </Tooltip>

          {showEmojiPicker && (
            <div className="absolute top-10 left-0 z-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3">
              <div className="grid grid-cols-5 gap-1">
                {commonEmojis.map((emoji) => (
                  <Button
                    key={emoji}
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEmoji(emoji)}
                    className="h-8 w-8 p-0 text-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    {emoji}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Mídia */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              disabled
            >
              <ImageIcon className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Anexar mídia (em breve)</p>
          </TooltipContent>
        </Tooltip>
      </div>

      {/* Overlay para fechar emoji picker */}
      {showEmojiPicker && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setShowEmojiPicker(false)}
        />
      )}
    </TooltipProvider>
  );
}
