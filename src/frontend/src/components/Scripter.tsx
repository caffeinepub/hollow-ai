import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Loader2, Code2, Trash2, Copy, Check } from 'lucide-react';
import { useScriptGeneration } from '../hooks/useScriptGeneration';

export function Scripter() {
  const [input, setInput] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { messages, isGenerating, generateScript, clearHistory } = useScriptGeneration();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleGenerate = async () => {
    if (!input.trim() || isGenerating) return;

    const requestText = input.trim();
    setInput('');

    await generateScript(requestText);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  const handleCopyCode = async (code: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedId(messageId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
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
              <Code2 className="h-5 w-5 text-primary" />
              Scripter
            </h2>
            <p className="text-sm text-muted-foreground">
              Describe what you want to script and AI will generate code for you
            </p>
          </div>
          {messages.length > 0 && (
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
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <Code2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-2">
                Tell me what script you need
              </p>
              <p className="text-sm text-muted-foreground">
                Examples: "Create a React counter component", "Write a Python data processor", "Build a form validator"
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                {message.type === 'user' ? (
                  <Card className="p-4 max-w-[80%] bg-primary text-primary-foreground">
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <p className="text-xs mt-2 opacity-70">
                      {formatTimestamp(message.timestamp)}
                    </p>
                  </Card>
                ) : (
                  <Card className="p-0 max-w-[90%] bg-card overflow-hidden">
                    <div className="p-4 border-b border-border flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Code2 className="h-4 w-4 text-primary" />
                        <span className="text-xs font-semibold text-primary">
                          Generated Script
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopyCode(message.content, message.id)}
                        className="h-8 gap-2"
                      >
                        {copiedId === message.id ? (
                          <>
                            <Check className="h-4 w-4" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4" />
                            Copy
                          </>
                        )}
                      </Button>
                    </div>
                    <div className="bg-black/50 p-4 overflow-x-auto">
                      <pre className="text-sm text-green-400 font-mono">
                        <code>{message.content}</code>
                      </pre>
                    </div>
                    <div className="px-4 py-2 bg-muted/30">
                      <p className="text-xs text-muted-foreground">
                        {formatTimestamp(message.timestamp)}
                      </p>
                    </div>
                  </Card>
                )}
              </div>
            ))
          )}
          {isGenerating && (
            <div className="flex justify-start">
              <Card className="p-4 max-w-[80%] bg-card">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  <span className="text-sm text-muted-foreground">Generating script...</span>
                </div>
              </Card>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="border-t border-border p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe the script you want... (e.g., 'Create a React form component with validation')"
              className="min-h-[80px] max-h-[200px] resize-none"
              disabled={isGenerating}
            />
            <Button
              onClick={handleGenerate}
              disabled={!input.trim() || isGenerating}
              size="icon"
              className="h-[80px] w-[80px] shrink-0"
            >
              {isGenerating ? (
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
