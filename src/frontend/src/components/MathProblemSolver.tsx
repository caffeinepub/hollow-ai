import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calculator, Loader2, CheckCircle2, GraduationCap, Lightbulb, MessageSquare, Send, X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';

type DifficultyLevel = 'K-2' | '3-5' | '6-8' | '9-10' | '11-12';

interface MathSolution {
  expression: string;
  result: string;
  steps: string[];
  conceptExplanations: ConceptExplanation[];
  difficulty: DifficultyLevel;
}

interface ConceptExplanation {
  concept: string;
  explanation: string;
}

interface HomeworkMessage {
  id: string;
  question: string;
  solution: MathSolution | null;
  timestamp: number;
}

export function MathProblemSolver() {
  const navigate = useNavigate();
  const [expression, setExpression] = useState('');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('6-8');
  const [homeworkHelperMode, setHomeworkHelperMode] = useState(false);
  const [teacherMode, setTeacherMode] = useState(false);
  const [solution, setSolution] = useState<MathSolution | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Homework helper state
  const [homeworkQuestion, setHomeworkQuestion] = useState('');
  const [homeworkHistory, setHomeworkHistory] = useState<HomeworkMessage[]>([]);
  const [isProcessingHomework, setIsProcessingHomework] = useState(false);

  const solveProblem = async () => {
    if (!expression.trim()) return;

    setIsLoading(true);
    setError(null);
    setSolution(null);

    try {
      // Client-side math evaluation
      const result = evaluateMathExpression(expression);
      const steps = generateSteps(expression, result, difficulty, teacherMode);
      const conceptExplanations = teacherMode ? generateConceptExplanations(expression, difficulty) : [];

      setSolution({
        expression,
        result: result.toString(),
        steps,
        conceptExplanations,
        difficulty,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unable to solve this expression. Please check your input and try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      solveProblem();
    }
  };

  const submitHomeworkQuestion = async () => {
    if (!homeworkQuestion.trim()) return;

    setIsProcessingHomework(true);
    const messageId = Date.now().toString();
    
    try {
      // Extract math expression from the homework question
      const mathExpression = extractMathExpression(homeworkQuestion);
      
      // Solve the problem
      const result = evaluateMathExpression(mathExpression);
      const steps = generateSteps(mathExpression, result, difficulty, teacherMode);
      const conceptExplanations = teacherMode ? generateConceptExplanations(mathExpression, difficulty) : [];

      const homeworkSolution: MathSolution = {
        expression: mathExpression,
        result: result.toString(),
        steps,
        conceptExplanations,
        difficulty,
      };

      // Add to history
      const newMessage: HomeworkMessage = {
        id: messageId,
        question: homeworkQuestion,
        solution: homeworkSolution,
        timestamp: Date.now(),
      };

      setHomeworkHistory(prev => [...prev, newMessage]);
      setHomeworkQuestion('');
    } catch (err) {
      // Add error message to history
      const newMessage: HomeworkMessage = {
        id: messageId,
        question: homeworkQuestion,
        solution: null,
        timestamp: Date.now(),
      };
      setHomeworkHistory(prev => [...prev, newMessage]);
      setHomeworkQuestion('');
    } finally {
      setIsProcessingHomework(false);
    }
  };

  const handleHomeworkKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submitHomeworkQuestion();
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
            <Calculator className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            Math Problem Solver
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Enter a math expression and select your grade level for step-by-step solutions. Supports basic arithmetic, exponents, roots, logarithms, and trigonometry.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Homework Helper Mode Toggle */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 p-3 bg-secondary/10 rounded-lg border border-secondary/20">
            <MessageSquare className="h-5 w-5 text-secondary shrink-0" />
            <div className="flex items-center gap-2 flex-1">
              <Switch
                id="homework-helper-mode"
                checked={homeworkHelperMode}
                onCheckedChange={setHomeworkHelperMode}
                className="min-h-[44px]"
              />
              <Label htmlFor="homework-helper-mode" className="cursor-pointer font-medium text-sm">
                Homework Helper Mode
              </Label>
            </div>
            <Badge variant="outline" className="text-xs">
              {homeworkHelperMode ? 'Chat interface active' : 'Standard input'}
            </Badge>
          </div>

          {/* Teacher Mode Toggle */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 p-3 bg-accent/10 rounded-lg border border-accent/20">
            <GraduationCap className="h-5 w-5 text-accent shrink-0" />
            <div className="flex items-center gap-2 flex-1">
              <Switch
                id="teacher-mode"
                checked={teacherMode}
                onCheckedChange={setTeacherMode}
                className="min-h-[44px]"
              />
              <Label htmlFor="teacher-mode" className="cursor-pointer font-medium text-sm">
                Teacher Mode
              </Label>
            </div>
            <Badge variant="outline" className="text-xs">
              {teacherMode ? 'Detailed explanations' : 'Standard mode'}
            </Badge>
          </div>

          {/* Homework Helper Chat Interface */}
          {homeworkHelperMode ? (
            <div className="space-y-4">
              {/* Chat History */}
              {homeworkHistory.length > 0 && (
                <ScrollArea className="h-[400px] w-full rounded-lg border border-border p-4">
                  <div className="space-y-4">
                    {homeworkHistory.map((message) => (
                      <div key={message.id} className="space-y-3">
                        {/* User Question */}
                        <div className="flex justify-end">
                          <div className="max-w-[80%] p-3 bg-primary/20 rounded-lg">
                            <p className="text-sm text-foreground">{message.question}</p>
                          </div>
                        </div>

                        {/* AI Solution */}
                        {message.solution ? (
                          <div className="flex justify-start">
                            <div className="max-w-[80%] space-y-3">
                              <div className="p-3 bg-muted rounded-lg">
                                <p className="text-xs text-muted-foreground mb-1">Expression:</p>
                                <p className="text-lg font-semibold font-display">{message.solution.expression}</p>
                              </div>

                              <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                                <p className="text-xs text-muted-foreground mb-1">Answer:</p>
                                <p className="text-xl font-bold font-display text-primary">{message.solution.result}</p>
                              </div>

                              {message.solution.conceptExplanations.length > 0 && (
                                <div className="space-y-2">
                                  <p className="text-xs font-semibold text-foreground flex items-center gap-2">
                                    <Lightbulb className="h-3 w-3 text-accent" />
                                    Key Concepts:
                                  </p>
                                  {message.solution.conceptExplanations.map((concept, index) => (
                                    <div
                                      key={index}
                                      className="p-2 bg-accent/10 border border-accent/20 rounded-lg"
                                    >
                                      <p className="text-xs font-semibold text-accent mb-1">{concept.concept}</p>
                                      <p className="text-xs text-foreground/90">{concept.explanation}</p>
                                    </div>
                                  ))}
                                </div>
                              )}

                              <div className="space-y-2">
                                <p className="text-xs font-semibold text-foreground">Steps:</p>
                                <ol className="space-y-1">
                                  {message.solution.steps.map((step, index) => (
                                    <li key={index} className="flex gap-2">
                                      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/20 text-primary text-xs font-semibold shrink-0">
                                        {index + 1}
                                      </span>
                                      <span className="text-xs text-foreground pt-0.5">{step}</span>
                                    </li>
                                  ))}
                                </ol>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="flex justify-start">
                            <div className="max-w-[80%] p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                              <p className="text-xs text-destructive">Unable to solve this problem. Please check the math expression and try again.</p>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}

              {/* Grade Level Selector */}
              <Select value={difficulty} onValueChange={(v) => setDifficulty(v as DifficultyLevel)}>
                <SelectTrigger className="w-full sm:w-48 min-h-[44px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="K-2">K-2 Grade</SelectItem>
                  <SelectItem value="3-5">3-5 Grade</SelectItem>
                  <SelectItem value="6-8">6-8 Grade</SelectItem>
                  <SelectItem value="9-10">9-10 Grade</SelectItem>
                  <SelectItem value="11-12">11-12 Grade</SelectItem>
                </SelectContent>
              </Select>

              {/* Homework Input */}
              <div className="flex gap-2">
                <Textarea
                  value={homeworkQuestion}
                  onChange={(e) => setHomeworkQuestion(e.target.value)}
                  onKeyDown={handleHomeworkKeyDown}
                  placeholder="Type your homework question here... (e.g., 'What is 10 to the power of 10?' or 'Solve sqrt(144)')"
                  className="flex-1 min-h-[80px] text-sm sm:text-base resize-none"
                />
                <Button 
                  onClick={submitHomeworkQuestion} 
                  disabled={isProcessingHomework || !homeworkQuestion.trim()} 
                  className="min-h-[44px] self-end"
                  size="icon"
                >
                  {isProcessingHomework ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          ) : (
            /* Standard Math Solver Interface */
            <>
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  value={expression}
                  onChange={(e) => setExpression(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="e.g., 10^10, sqrt(144), log(100), sin(30)"
                  className="flex-1 min-h-[44px] text-sm sm:text-base"
                />
                <Select value={difficulty} onValueChange={(v) => setDifficulty(v as DifficultyLevel)}>
                  <SelectTrigger className="w-full sm:w-32 min-h-[44px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="K-2">K-2</SelectItem>
                    <SelectItem value="3-5">3-5</SelectItem>
                    <SelectItem value="6-8">6-8</SelectItem>
                    <SelectItem value="9-10">9-10</SelectItem>
                    <SelectItem value="11-12">11-12</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={solveProblem} disabled={isLoading || !expression.trim()} className="min-h-[44px] w-full sm:w-auto">
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    'Solve'
                  )}
                </Button>
              </div>

              {error && (
                <div className="p-3 sm:p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <p className="text-xs sm:text-sm text-destructive">{error}</p>
                </div>
              )}

              {solution && (
                <div className="space-y-3 sm:space-y-4">
                  <div className="p-3 sm:p-4 bg-primary/10 border border-primary/20 rounded-lg">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <p className="text-xs text-muted-foreground">Result:</p>
                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                    </div>
                    <p className="text-2xl sm:text-3xl font-bold font-display text-primary break-all">{solution.result}</p>
                  </div>

                  {solution.conceptExplanations.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs sm:text-sm font-semibold text-foreground flex items-center gap-2">
                        <Lightbulb className="h-4 w-4 text-accent" />
                        Key Concepts:
                      </p>
                      {solution.conceptExplanations.map((concept, index) => (
                        <div
                          key={index}
                          className="p-3 bg-accent/10 border border-accent/20 rounded-lg"
                        >
                          <p className="text-xs sm:text-sm font-semibold text-accent mb-1">{concept.concept}</p>
                          <p className="text-xs sm:text-sm text-foreground/90">{concept.explanation}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="space-y-2">
                    <p className="text-xs sm:text-sm font-semibold text-foreground">Step-by-step solution:</p>
                    <ol className="space-y-2">
                      {solution.steps.map((step, index) => (
                        <li key={index} className="flex gap-2 sm:gap-3">
                          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-semibold shrink-0">
                            {index + 1}
                          </span>
                          <span className="text-xs sm:text-sm text-foreground pt-0.5">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Helper functions
function evaluateMathExpression(expr: string): number {
  const sanitized = expr.replace(/\s/g, '');
  
  const powerPattern = /(\d+\.?\d*)\^(\d+\.?\d*)/g;
  let processed = sanitized.replace(powerPattern, 'Math.pow($1,$2)');
  
  processed = processed.replace(/sqrt\(([^)]+)\)/g, 'Math.sqrt($1)');
  processed = processed.replace(/log\(([^)]+)\)/g, 'Math.log10($1)');
  processed = processed.replace(/ln\(([^)]+)\)/g, 'Math.log($1)');
  processed = processed.replace(/sin\(([^)]+)\)/g, 'Math.sin($1*Math.PI/180)');
  processed = processed.replace(/cos\(([^)]+)\)/g, 'Math.cos($1*Math.PI/180)');
  processed = processed.replace(/tan\(([^)]+)\)/g, 'Math.tan($1*Math.PI/180)');
  
  try {
    const result = Function(`"use strict"; return (${processed})`)();
    if (typeof result !== 'number' || !isFinite(result)) {
      throw new Error('Invalid result');
    }
    return Math.round(result * 1000000) / 1000000;
  } catch (error) {
    throw new Error('Invalid mathematical expression');
  }
}

function generateSteps(expr: string, result: number, difficulty: DifficultyLevel, teacherMode: boolean): string[] {
  const steps: string[] = [];
  
  if (expr.includes('^')) {
    const [base, exponent] = expr.split('^').map(s => s.trim());
    steps.push(`Identify the base (${base}) and exponent (${exponent})`);
    if (teacherMode) {
      steps.push(`This means we multiply ${base} by itself ${exponent} times`);
    }
    steps.push(`Calculate ${base}^${exponent} = ${result}`);
  } else if (expr.includes('sqrt')) {
    const match = expr.match(/sqrt\(([^)]+)\)/);
    if (match) {
      const value = match[1];
      steps.push(`Find the square root of ${value}`);
      if (teacherMode) {
        steps.push(`Ask: what number multiplied by itself equals ${value}?`);
      }
      steps.push(`√${value} = ${result}`);
    }
  } else if (expr.includes('log')) {
    const match = expr.match(/log\(([^)]+)\)/);
    if (match) {
      const value = match[1];
      steps.push(`Calculate the logarithm base 10 of ${value}`);
      if (teacherMode) {
        steps.push(`This asks: 10 to what power equals ${value}?`);
      }
      steps.push(`log(${value}) = ${result}`);
    }
  } else if (expr.match(/sin|cos|tan/)) {
    steps.push(`Convert angle to radians if needed`);
    steps.push(`Apply the trigonometric function`);
    steps.push(`Result = ${result}`);
  } else {
    steps.push(`Evaluate the expression: ${expr}`);
    steps.push(`Result = ${result}`);
  }
  
  return steps;
}

function generateConceptExplanations(expr: string, difficulty: DifficultyLevel): ConceptExplanation[] {
  const explanations: ConceptExplanation[] = [];
  
  if (expr.includes('^')) {
    explanations.push({
      concept: 'Exponents',
      explanation: 'An exponent tells us how many times to multiply a number by itself. For example, 2^3 means 2 × 2 × 2 = 8.',
    });
  }
  
  if (expr.includes('sqrt')) {
    explanations.push({
      concept: 'Square Roots',
      explanation: 'The square root of a number is a value that, when multiplied by itself, gives the original number. For example, √16 = 4 because 4 × 4 = 16.',
    });
  }
  
  if (expr.includes('log')) {
    explanations.push({
      concept: 'Logarithms',
      explanation: 'A logarithm answers the question: "To what power must we raise the base to get this number?" For example, log(100) = 2 because 10^2 = 100.',
    });
  }
  
  if (expr.match(/sin|cos|tan/)) {
    explanations.push({
      concept: 'Trigonometry',
      explanation: 'Trigonometric functions relate angles to the ratios of sides in right triangles. They are fundamental in geometry and physics.',
    });
  }
  
  return explanations;
}

function extractMathExpression(question: string): string {
  const lowerQuestion = question.toLowerCase();
  
  const powerMatch = question.match(/(\d+)\s*(?:to the power of|raised to|power)\s*(\d+)/i);
  if (powerMatch) {
    return `${powerMatch[1]}^${powerMatch[2]}`;
  }
  
  const sqrtMatch = question.match(/(?:square root of|sqrt of|sqrt)\s*\(?(\d+)\)?/i);
  if (sqrtMatch) {
    return `sqrt(${sqrtMatch[1]})`;
  }
  
  const logMatch = question.match(/(?:log of|log)\s*\(?(\d+)\)?/i);
  if (logMatch) {
    return `log(${logMatch[1]})`;
  }
  
  const mathExprMatch = question.match(/[\d+\-*/^().sqrt()log()sin()cos()tan()]+/);
  if (mathExprMatch) {
    return mathExprMatch[0];
  }
  
  throw new Error('Could not extract a math expression from the question');
}
