import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Send, Loader2, Trash2, Languages } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { cn } from '@/lib/utils';

export function TranslatorChat() {
  const [input, setInput] = useState('');
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('es');
  
  const { translations, translate, isTranslating, clearHistory } = useTranslation();

  const handleTranslate = () => {
    if (input.trim()) {
      translate(input, sourceLang, targetLang);
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleTranslate();
    }
  };

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ru', name: 'Russian' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
    { code: 'zh', name: 'Chinese' },
  ];

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="border-b border-border p-3 sm:p-4 space-y-3 sm:space-y-4">
        <div className="flex items-center gap-2">
          <Languages className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          <h2 className="text-base sm:text-lg font-semibold text-foreground">Translator</h2>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
          <Select value={sourceLang} onValueChange={setSourceLang}>
            <SelectTrigger className="w-full sm:flex-1 min-h-[44px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  {lang.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <span className="text-muted-foreground text-sm self-center">→</span>
          
          <Select value={targetLang} onValueChange={setTargetLang}>
            <SelectTrigger className="w-full sm:flex-1 min-h-[44px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  {lang.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {translations.length > 0 && (
            <Button
              variant="outline"
              size="icon"
              onClick={clearHistory}
              className="min-h-[44px] min-w-[44px] self-center"
              title="Clear history"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <ScrollArea className="flex-1 p-3 sm:p-4">
        {translations.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-2 p-4">
              <Languages className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mx-auto" />
              <p className="text-xs sm:text-sm text-muted-foreground">
                Enter text below to translate
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {translations.map((translation, index) => (
              <div key={index} className="space-y-2 sm:space-y-3">
                <div className="flex justify-end">
                  <div className="max-w-[85%] sm:max-w-[80%] bg-primary text-primary-foreground rounded-lg p-2 sm:p-3">
                    <p className="text-xs sm:text-sm break-words">{translation.sourceText}</p>
                    <p className="text-[10px] sm:text-xs opacity-70 mt-1">
                      {languages.find(l => l.code === translation.sourceLanguage)?.name}
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-start">
                  <div className="max-w-[85%] sm:max-w-[80%] bg-muted rounded-lg p-2 sm:p-3">
                    <p className="text-xs sm:text-sm text-foreground break-words">{translation.translatedText}</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
                      {languages.find(l => l.code === translation.targetLanguage)?.name}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      <div className="border-t border-border p-3 sm:p-4">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type text to translate..."
            className="min-h-[44px] max-h-32 resize-none text-sm sm:text-base"
            rows={2}
          />
          <Button
            onClick={handleTranslate}
            disabled={isTranslating || !input.trim()}
            size="icon"
            className="shrink-0 min-h-[44px] min-w-[44px]"
          >
            {isTranslating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
        <p className="text-[10px] sm:text-xs text-muted-foreground mt-2">
          Press Enter to translate, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
