import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Send, Loader2, Languages, Trash2 } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { cn } from '@/lib/utils';

const LANGUAGES = [
  'English',
  'Spanish',
  'French',
  'German',
  'Chinese',
  'Japanese',
  'Arabic',
  'Italian',
  'Portuguese',
  'Russian',
  'Korean',
  'Hindi',
];

export function TranslatorChat() {
  const [input, setInput] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState('English');
  const [targetLanguage, setTargetLanguage] = useState('Spanish');
  const { translations, isTranslating, translate, clearHistory } = useTranslation();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [translations]);

  const handleTranslate = async () => {
    if (!input.trim() || isTranslating) return;

    const textToTranslate = input.trim();
    setInput('');

    await translate(textToTranslate, sourceLanguage, targetLanguage);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleTranslate();
    }
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="h-full flex flex-col">
      <div className="border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Languages className="h-5 w-5 text-primary" />
              Translator
            </h2>
            <p className="text-sm text-muted-foreground">
              Translate text between different languages
            </p>
          </div>
          {translations.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearHistory}
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Clear History
            </Button>
          )}
        </div>
      </div>

      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="max-w-3xl mx-auto space-y-4">
          {translations.length === 0 ? (
            <div className="text-center py-12">
              <Languages className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                Enter text below to start translating
              </p>
            </div>
          ) : (
            translations.map((translation) => (
              <div key={translation.id} className="space-y-2">
                <div className="flex justify-end">
                  <Card className="p-4 max-w-[80%] bg-primary text-primary-foreground">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-semibold opacity-90">
                        {translation.sourceLanguage}
                      </span>
                    </div>
                    <p className="text-sm whitespace-pre-wrap">{translation.sourceText}</p>
                    <p className="text-xs mt-2 opacity-70">
                      {formatTimestamp(translation.timestamp)}
                    </p>
                  </Card>
                </div>

                <div className="flex justify-start">
                  <Card className="p-4 max-w-[80%] bg-card">
                    <div className="flex items-center gap-2 mb-2">
                      <Languages className="h-4 w-4 text-primary" />
                      <span className="text-xs font-semibold text-primary">
                        {translation.targetLanguage}
                      </span>
                    </div>
                    <p className="text-sm whitespace-pre-wrap">{translation.translatedText}</p>
                    <p className="text-xs mt-2 text-muted-foreground">
                      {formatTimestamp(translation.timestamp)}
                    </p>
                  </Card>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      <div className="border-t border-border p-4">
        <div className="max-w-3xl mx-auto space-y-3">
          <div className="flex gap-3 items-center">
            <div className="flex-1 space-y-1">
              <label className="text-xs font-medium text-muted-foreground">From</label>
              <Select value={sourceLanguage} onValueChange={setSourceLanguage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map((lang) => (
                    <SelectItem key={lang} value={lang}>
                      {lang}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="pt-5">
              <Languages className="h-5 w-5 text-muted-foreground" />
            </div>

            <div className="flex-1 space-y-1">
              <label className="text-xs font-medium text-muted-foreground">To</label>
              <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map((lang) => (
                    <SelectItem key={lang} value={lang}>
                      {lang}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type text to translate..."
              className="min-h-[60px] max-h-[200px] resize-none"
              disabled={isTranslating}
            />
            <Button
              onClick={handleTranslate}
              disabled={!input.trim() || isTranslating}
              size="icon"
              className="h-[60px] w-[60px] shrink-0"
            >
              {isTranslating ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
