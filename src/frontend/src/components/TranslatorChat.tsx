import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Languages, ArrowRight, Loader2, Trash2, X } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { ScrollArea } from '@/components/ui/scroll-area';

const LANGUAGES = [
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
  { code: 'ar', name: 'Arabic' },
  { code: 'hi', name: 'Hindi' },
];

export function TranslatorChat() {
  const navigate = useNavigate();
  const [sourceText, setSourceText] = useState('');
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('es');
  
  const { translate, isTranslating, translations, clearHistory } = useTranslation();

  const handleTranslate = () => {
    if (sourceText.trim()) {
      translate(sourceText, sourceLang, targetLang);
      setSourceText('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleTranslate();
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 relative">
      {/* Close Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => navigate({ to: '/' })}
        className="absolute top-0 right-0 z-10 h-10 w-10 rounded-full hover:bg-destructive/10 hover:text-destructive"
        aria-label="Close and return to main menu"
      >
        <X className="h-5 w-5" />
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Languages className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            Translator
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Translate text between multiple languages instantly
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Language Selection */}
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
            <Select value={sourceLang} onValueChange={setSourceLang}>
              <SelectTrigger className="w-full sm:flex-1 min-h-[44px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <ArrowRight className="h-5 w-5 text-muted-foreground shrink-0 rotate-90 sm:rotate-0" />
            
            <Select value={targetLang} onValueChange={setTargetLang}>
              <SelectTrigger className="w-full sm:flex-1 min-h-[44px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Translation History */}
          {translations.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs sm:text-sm font-semibold text-foreground">Translation History</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearHistory}
                  className="h-8 text-xs min-h-[44px] sm:min-h-0"
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Clear
                </Button>
              </div>
              
              <ScrollArea className="h-[300px] sm:h-[400px] w-full rounded-lg border border-border p-3 sm:p-4">
                <div className="space-y-3 sm:space-y-4">
                  {translations.map((item) => (
                    <div key={item.id} className="space-y-2 pb-3 sm:pb-4 border-b border-border last:border-0">
                      <div className="p-2 sm:p-3 bg-muted rounded-lg">
                        <p className="text-[10px] sm:text-xs text-muted-foreground mb-1">
                          {LANGUAGES.find(l => l.code === item.sourceLanguage)?.name}
                        </p>
                        <p className="text-xs sm:text-sm text-foreground">{item.sourceText}</p>
                      </div>
                      
                      <div className="flex justify-center">
                        <ArrowRight className="h-4 w-4 text-primary" />
                      </div>
                      
                      <div className="p-2 sm:p-3 bg-primary/10 border border-primary/20 rounded-lg">
                        <p className="text-[10px] sm:text-xs text-muted-foreground mb-1">
                          {LANGUAGES.find(l => l.code === item.targetLanguage)?.name}
                        </p>
                        <p className="text-xs sm:text-sm font-medium text-foreground">{item.translatedText}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}

          {/* Input Area */}
          <div className="space-y-2">
            <Textarea
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter text to translate..."
              className="min-h-[100px] sm:min-h-[120px] text-sm sm:text-base resize-none"
            />
            
            <Button
              onClick={handleTranslate}
              disabled={isTranslating || !sourceText.trim()}
              className="w-full min-h-[44px]"
            >
              {isTranslating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Translating...
                </>
              ) : (
                <>
                  <Languages className="h-4 w-4 mr-2" />
                  Translate
                </>
              )}
            </Button>
            
            <p className="text-[10px] sm:text-xs text-muted-foreground text-center">
              Press Enter to translate, Shift+Enter for new line
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
