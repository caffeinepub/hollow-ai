import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calculator, Loader2, CheckCircle2, GraduationCap, Lightbulb, MessageSquare, Send } from 'lucide-react';
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
    <div className="space-y-4 sm:space-y-6">
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
            </>
          )}
        </CardContent>
      </Card>

      {!homeworkHelperMode && solution && (
        <Card className="border-primary/20 shadow-glow animate-fade-in">
          <CardHeader>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                Solution
              </CardTitle>
              <div className="flex items-center gap-2 flex-wrap">
                {teacherMode && (
                  <Badge variant="secondary" className="gap-1 text-xs">
                    <GraduationCap className="h-3 w-3" />
                    Teacher Mode
                  </Badge>
                )}
                <Badge variant="outline" className="text-xs">{solution.difficulty} Grade</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 sm:p-4 bg-muted rounded-lg">
              <p className="text-xs sm:text-sm text-muted-foreground mb-1">Expression:</p>
              <p className="text-xl sm:text-2xl font-semibold font-display break-all">{solution.expression}</p>
            </div>

            <div className="p-3 sm:p-4 bg-primary/10 rounded-lg border border-primary/20">
              <p className="text-xs sm:text-sm text-muted-foreground mb-1">Answer:</p>
              <p className="text-2xl sm:text-3xl font-bold font-display text-primary break-all">{solution.result}</p>
            </div>

            {solution.conceptExplanations.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs sm:text-sm font-semibold text-foreground flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-accent" />
                  Key Concepts:
                </p>
                <div className="space-y-2">
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
              </div>
            )}

            <div className="space-y-2">
              <p className="text-xs sm:text-sm font-semibold text-foreground">Step-by-step solution:</p>
              <ol className="space-y-2">
                {solution.steps.map((step, index) => (
                  <li key={index} className="flex gap-2 sm:gap-3">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary text-xs sm:text-sm font-semibold shrink-0">
                      {index + 1}
                    </span>
                    <span className="text-xs sm:text-sm text-foreground pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="bg-accent/5 border-accent/20">
        <CardHeader>
          <CardTitle className="text-sm sm:text-base">Quick Examples</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {[
              '10^10',
              'sqrt(144)',
              'log(100)',
              'sin(45)',
              '(2^5 + 3) * sqrt(16)',
              'ln(2.718)',
              'cos(60)',
              'cbrt(27)'
            ].map((example) => (
              <Button
                key={example}
                variant="outline"
                size="sm"
                onClick={() => homeworkHelperMode ? setHomeworkQuestion(example) : setExpression(example)}
                className="font-mono text-[10px] sm:text-xs min-h-[44px]"
              >
                {example}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Helper function to extract math expression from natural language
function extractMathExpression(question: string): string {
  // Remove common question words and phrases
  let expr = question
    .toLowerCase()
    .replace(/what is|solve|calculate|find|compute|evaluate/gi, '')
    .replace(/the answer to|the result of|the value of/gi, '')
    .replace(/\?/g, '')
    .trim();

  // Convert common natural language patterns to math expressions
  expr = expr
    .replace(/(\d+)\s*to\s*the\s*power\s*of\s*(\d+)/gi, '$1^$2')
    .replace(/(\d+)\s*raised\s*to\s*(\d+)/gi, '$1^$2')
    .replace(/square\s*root\s*of\s*(\d+)/gi, 'sqrt($1)')
    .replace(/cube\s*root\s*of\s*(\d+)/gi, 'cbrt($1)')
    .replace(/log\s*of\s*(\d+)/gi, 'log($1)')
    .replace(/natural\s*log\s*of\s*(\d+)/gi, 'ln($1)')
    .replace(/sine\s*of\s*(\d+)/gi, 'sin($1)')
    .replace(/cosine\s*of\s*(\d+)/gi, 'cos($1)')
    .replace(/tangent\s*of\s*(\d+)/gi, 'tan($1)');

  // If no math expression found, return the original trimmed input
  return expr || question.trim();
}

function evaluateMathExpression(expr: string): number {
  // Tokenize and parse the expression
  const tokens = tokenize(expr);
  const result = parseExpression(tokens);
  
  if (typeof result !== 'number' || !isFinite(result)) {
    throw new Error('Invalid result');
  }
  
  return Math.round(result * 1000000) / 1000000; // Round to 6 decimal places
}

function tokenize(expr: string): string[] {
  // Remove whitespace
  expr = expr.replace(/\s+/g, '');
  
  const tokens: string[] = [];
  let i = 0;
  
  while (i < expr.length) {
    const char = expr[i];
    
    // Numbers (including decimals)
    if (/[0-9.]/.test(char)) {
      let num = '';
      while (i < expr.length && /[0-9.]/.test(expr[i])) {
        num += expr[i];
        i++;
      }
      tokens.push(num);
      continue;
    }
    
    // Function names
    if (/[a-z]/i.test(char)) {
      let func = '';
      while (i < expr.length && /[a-z]/i.test(expr[i])) {
        func += expr[i];
        i++;
      }
      tokens.push(func);
      continue;
    }
    
    // Operators and parentheses
    if ('+-*/^()'.includes(char)) {
      tokens.push(char);
      i++;
      continue;
    }
    
    // Unknown character
    throw new Error(`Invalid character: ${char}`);
  }
  
  return tokens;
}

function parseExpression(tokens: string[]): number {
  let index = 0;
  
  function peek(): string | undefined {
    return tokens[index];
  }
  
  function consume(): string {
    return tokens[index++];
  }
  
  function parseNumber(): number {
    const token = consume();
    const num = parseFloat(token);
    if (isNaN(num)) {
      throw new Error(`Expected number, got: ${token}`);
    }
    return num;
  }
  
  function parsePrimary(): number {
    const token = peek();
    
    if (!token) {
      throw new Error('Unexpected end of expression');
    }
    
    // Parentheses
    if (token === '(') {
      consume();
      const result = parseAddSub();
      if (consume() !== ')') {
        throw new Error('Expected closing parenthesis');
      }
      return result;
    }
    
    // Functions
    if (/[a-z]/i.test(token)) {
      const func = consume();
      
      if (peek() !== '(') {
        throw new Error(`Expected '(' after function ${func}`);
      }
      consume(); // (
      
      const arg = parseAddSub();
      
      if (consume() !== ')') {
        throw new Error('Expected closing parenthesis');
      }
      
      return evaluateFunction(func, arg);
    }
    
    // Numbers
    if (/[0-9.]/.test(token)) {
      return parseNumber();
    }
    
    // Unary minus
    if (token === '-') {
      consume();
      return -parsePrimary();
    }
    
    // Unary plus
    if (token === '+') {
      consume();
      return parsePrimary();
    }
    
    throw new Error(`Unexpected token: ${token}`);
  }
  
  function parsePower(): number {
    let left = parsePrimary();
    
    while (peek() === '^') {
      consume();
      const right = parsePrimary();
      left = Math.pow(left, right);
    }
    
    return left;
  }
  
  function parseMulDiv(): number {
    let left = parsePower();
    
    while (peek() === '*' || peek() === '/') {
      const op = consume();
      const right = parsePower();
      
      if (op === '*') {
        left = left * right;
      } else {
        if (right === 0) {
          throw new Error('Division by zero');
        }
        left = left / right;
      }
    }
    
    return left;
  }
  
  function parseAddSub(): number {
    let left = parseMulDiv();
    
    while (peek() === '+' || peek() === '-') {
      const op = consume();
      const right = parseMulDiv();
      
      if (op === '+') {
        left = left + right;
      } else {
        left = left - right;
      }
    }
    
    return left;
  }
  
  const result = parseAddSub();
  
  if (index < tokens.length) {
    throw new Error(`Unexpected token: ${tokens[index]}`);
  }
  
  return result;
}

function evaluateFunction(func: string, arg: number): number {
  const funcLower = func.toLowerCase();
  
  switch (funcLower) {
    // Square root
    case 'sqrt':
      if (arg < 0) {
        throw new Error('Cannot take square root of negative number');
      }
      return Math.sqrt(arg);
    
    // Cube root
    case 'cbrt':
      return Math.cbrt(arg);
    
    // Logarithms
    case 'log':
      if (arg <= 0) {
        throw new Error('Logarithm argument must be positive');
      }
      return Math.log10(arg);
    
    case 'ln':
      if (arg <= 0) {
        throw new Error('Natural logarithm argument must be positive');
      }
      return Math.log(arg);
    
    // Trigonometric functions (degrees)
    case 'sin':
      return Math.sin(arg * Math.PI / 180);
    
    case 'cos':
      return Math.cos(arg * Math.PI / 180);
    
    case 'tan':
      return Math.tan(arg * Math.PI / 180);
    
    // Inverse trigonometric functions (return degrees)
    case 'asin':
    case 'arcsin':
      if (arg < -1 || arg > 1) {
        throw new Error('Arcsine argument must be between -1 and 1');
      }
      return Math.asin(arg) * 180 / Math.PI;
    
    case 'acos':
    case 'arccos':
      if (arg < -1 || arg > 1) {
        throw new Error('Arccosine argument must be between -1 and 1');
      }
      return Math.acos(arg) * 180 / Math.PI;
    
    case 'atan':
    case 'arctan':
      return Math.atan(arg) * 180 / Math.PI;
    
    // Hyperbolic functions
    case 'sinh':
      return Math.sinh(arg);
    
    case 'cosh':
      return Math.cosh(arg);
    
    case 'tanh':
      return Math.tanh(arg);
    
    // Absolute value
    case 'abs':
      return Math.abs(arg);
    
    default:
      throw new Error(`Unknown function: ${func}`);
  }
}

function generateConceptExplanations(expression: string, difficulty: DifficultyLevel): ConceptExplanation[] {
  const explanations: ConceptExplanation[] = [];
  const exprLower = expression.toLowerCase();
  
  // Detect operations and provide concept explanations
  if (expression.includes('^')) {
    if (difficulty === 'K-2' || difficulty === '3-5') {
      explanations.push({
        concept: 'Exponents (Powers)',
        explanation: 'An exponent tells us how many times to multiply a number by itself. For example, 2³ means 2 × 2 × 2 = 8. The small number on top (the exponent) tells us how many times to use the base number in multiplication.'
      });
    } else if (difficulty === '6-8') {
      explanations.push({
        concept: 'Exponents',
        explanation: 'An exponent represents repeated multiplication. In aⁿ, "a" is the base and "n" is the exponent. This means multiply "a" by itself "n" times. Exponents help us write very large or very small numbers more easily.'
      });
    } else {
      explanations.push({
        concept: 'Exponentiation',
        explanation: 'Exponentiation is a mathematical operation where a base number is raised to a power. Key properties include: a⁰ = 1, a¹ = a, aᵐ × aⁿ = aᵐ⁺ⁿ, and (aᵐ)ⁿ = aᵐⁿ. This operation is fundamental in algebra, calculus, and many real-world applications like compound interest and exponential growth.'
      });
    }
  }
  
  if (exprLower.includes('sqrt')) {
    if (difficulty === 'K-2' || difficulty === '3-5') {
      explanations.push({
        concept: 'Square Root',
        explanation: 'A square root asks: "What number times itself equals this number?" For example, the square root of 16 is 4, because 4 × 4 = 16. We use the symbol √ to show square root.'
      });
    } else if (difficulty === '6-8') {
      explanations.push({
        concept: 'Square Root',
        explanation: 'The square root (√) is the inverse operation of squaring. If x² = y, then √y = x. Square roots are used to find side lengths of squares, solve quadratic equations, and calculate distances using the Pythagorean theorem.'
      });
    } else {
      explanations.push({
        concept: 'Square Root Function',
        explanation: 'The square root function √x = x^(1/2) returns the principal (non-negative) root. It\'s the inverse of the squaring function. Square roots appear in the quadratic formula, distance calculations, standard deviation, and many physics formulas involving energy and motion.'
      });
    }
  }
  
  if (exprLower.includes('cbrt')) {
    if (difficulty === 'K-2' || difficulty === '3-5') {
      explanations.push({
        concept: 'Cube Root',
        explanation: 'A cube root asks: "What number times itself three times equals this number?" For example, the cube root of 27 is 3, because 3 × 3 × 3 = 27.'
      });
    } else {
      explanations.push({
        concept: 'Cube Root',
        explanation: 'The cube root ∛x is the inverse of cubing. If x³ = y, then ∛y = x. Unlike square roots, cube roots can be negative. Cube roots are used in volume calculations and solving cubic equations.'
      });
    }
  }
  
  if (exprLower.includes('log')) {
    if (difficulty === '6-8') {
      explanations.push({
        concept: 'Logarithm',
        explanation: 'A logarithm asks: "What power do we need to raise 10 to get this number?" For example, log(100) = 2 because 10² = 100. Logarithms help us work with very large numbers.'
      });
    } else {
      explanations.push({
        concept: 'Logarithm (Base 10)',
        explanation: 'The logarithm log(x) is the inverse of exponentiation with base 10. If 10ʸ = x, then log(x) = y. Logarithms are used in science to measure pH, earthquake magnitude (Richter scale), and sound intensity (decibels).'
      });
    }
  }
  
  if (exprLower.includes('ln')) {
    if (difficulty === '9-10' || difficulty === '11-12') {
      explanations.push({
        concept: 'Natural Logarithm',
        explanation: 'The natural logarithm ln(x) uses the special number e (≈2.718) as its base. If eʸ = x, then ln(x) = y. Natural logarithms appear in calculus, compound interest calculations, exponential growth/decay, and many physics formulas.'
      });
    }
  }
  
  if (exprLower.includes('sin') || exprLower.includes('cos') || exprLower.includes('tan')) {
    if (difficulty === '6-8') {
      explanations.push({
        concept: 'Trigonometry',
        explanation: 'Trigonometric functions (sine, cosine, tangent) relate angles to the sides of right triangles. They help us find missing sides and angles in triangles and are used in navigation, construction, and physics.'
      });
    } else {
      explanations.push({
        concept: 'Trigonometric Functions',
        explanation: 'Sine, cosine, and tangent are fundamental trigonometric functions. In a right triangle: sin(θ) = opposite/hypotenuse, cos(θ) = adjacent/hypotenuse, tan(θ) = opposite/adjacent. These functions are periodic and appear in wave phenomena, circular motion, and oscillations.'
      });
    }
  }
  
  return explanations;
}

function generateSteps(expression: string, result: number, difficulty: DifficultyLevel, teacherMode: boolean): string[] {
  const steps: string[] = [];
  const exprLower = expression.toLowerCase();
  
  // Add initial step
  steps.push(`Start with the expression: ${expression}`);
  
  // Detect and explain operations
  if (expression.includes('^')) {
    const match = expression.match(/(\d+)\^(\d+)/);
    if (match) {
      const base = match[1];
      const exp = match[2];
      if (teacherMode) {
        steps.push(`This is an exponent problem. We need to multiply ${base} by itself ${exp} times.`);
      }
      steps.push(`Calculate ${base}^${exp} = ${Math.pow(Number(base), Number(exp))}`);
    }
  }
  
  if (exprLower.includes('sqrt')) {
    const match = expression.match(/sqrt\((\d+)\)/i);
    if (match) {
      const num = match[1];
      if (teacherMode) {
        steps.push(`Find the square root of ${num}. This means: what number times itself equals ${num}?`);
      }
      steps.push(`√${num} = ${Math.sqrt(Number(num))}`);
    }
  }
  
  if (exprLower.includes('cbrt')) {
    const match = expression.match(/cbrt\((\d+)\)/i);
    if (match) {
      const num = match[1];
      if (teacherMode) {
        steps.push(`Find the cube root of ${num}. This means: what number times itself three times equals ${num}?`);
      }
      steps.push(`∛${num} = ${Math.cbrt(Number(num))}`);
    }
  }
  
  if (exprLower.includes('log')) {
    const match = expression.match(/log\((\d+)\)/i);
    if (match) {
      const num = match[1];
      if (teacherMode) {
        steps.push(`Find log base 10 of ${num}. This means: 10 to what power equals ${num}?`);
      }
      steps.push(`log(${num}) = ${Math.log10(Number(num))}`);
    }
  }
  
  if (exprLower.includes('ln')) {
    const match = expression.match(/ln\((\d+\.?\d*)\)/i);
    if (match) {
      const num = match[1];
      if (teacherMode) {
        steps.push(`Find the natural logarithm of ${num}. This uses base e (≈2.718).`);
      }
      steps.push(`ln(${num}) = ${Math.log(Number(num))}`);
    }
  }
  
  if (exprLower.includes('sin') || exprLower.includes('cos') || exprLower.includes('tan')) {
    if (teacherMode) {
      steps.push(`Evaluate the trigonometric function. The angle is in degrees.`);
    }
  }
  
  // Add final result
  steps.push(`Final answer: ${result}`);
  
  return steps;
}
