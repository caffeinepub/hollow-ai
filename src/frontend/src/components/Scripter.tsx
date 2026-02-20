import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Loader2, Code2, Copy, Check } from 'lucide-react';
import { useScriptGeneration } from '../hooks/useScriptGeneration';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export function Scripter() {
  const [input, setInput] = useState('');
  const { messages, generateScript, isGenerating } = useScriptGeneration();
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleSend = () => {
    if (input.trim()) {
      generateScript(input);
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const copyToClipboard = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    toast.success('Code copied to clipboard!');
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="border-b border-border p-3 sm:p-4">
        <div className="flex items-center gap-2">
          <Code2 className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          <h2 className="text-base sm:text-lg font-semibold text-foreground">Script Generator</h2>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Describe what you want to build and get code snippets
        </p>
      </div>

      <ScrollArea className="flex-1 p-3 sm:p-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-2 p-4">
              <Code2 className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mx-auto" />
              <p className="text-xs sm:text-sm text-muted-foreground">
                Describe your coding task to get started
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {messages.map((message, index) => (
              <div
                key={message.id}
                className={cn(
                  'flex',
                  message.type === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                <div
                  className={cn(
                    'max-w-[85%] sm:max-w-[80%] rounded-lg p-2 sm:p-3',
                    message.type === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  )}
                >
                  {message.type === 'user' ? (
                    <p className="text-xs sm:text-sm break-words">{message.content}</p>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[10px] sm:text-xs font-semibold text-muted-foreground">
                          Generated Code
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(message.content, index)}
                          className="h-6 sm:h-7 px-2 min-h-[44px] sm:min-h-0"
                        >
                          {copiedIndex === index ? (
                            <>
                              <Check className="h-3 w-3 mr-1" />
                              <span className="text-[10px] sm:text-xs">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-3 w-3 mr-1" />
                              <span className="text-[10px] sm:text-xs">Copy</span>
                            </>
                          )}
                        </Button>
                      </div>
                      <pre className="bg-black/50 p-2 sm:p-3 rounded overflow-x-auto">
                        <code className="text-[10px] sm:text-xs text-green-400 font-mono break-all whitespace-pre-wrap">
                          {message.content}
                        </code>
                      </pre>
                    </div>
                  )}
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
            placeholder="e.g., Create a React button component with hover effects..."
            className="min-h-[44px] max-h-32 resize-none text-sm sm:text-base"
            rows={2}
          />
          <Button
            onClick={handleSend}
            disabled={isGenerating || !input.trim()}
            size="icon"
            className="shrink-0 min-h-[44px] min-w-[44px]"
          >
            {isGenerating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
        <p className="text-[10px] sm:text-xs text-muted-foreground mt-2">
          Press Enter to generate, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
