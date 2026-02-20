import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calculator, Loader2, CheckCircle2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type DifficultyLevel = 'K-2' | '3-5' | '6-8' | '9-10' | '11-12';

interface MathSolution {
  expression: string;
  result: string;
  steps: string[];
  difficulty: DifficultyLevel;
}

export function MathProblemSolver() {
  const [expression, setExpression] = useState('');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('6-8');
  const [solution, setSolution] = useState<MathSolution | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const solveProblem = async () => {
    if (!expression.trim()) return;

    setIsLoading(true);
    setError(null);
    setSolution(null);

    try {
      // Client-side math evaluation
      const result = evaluateMathExpression(expression);
      const steps = generateSteps(expression, result, difficulty);

      setSolution({
        expression,
        result: result.toString(),
        steps,
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-primary" />
            Math Problem Solver
          </CardTitle>
          <CardDescription>
            Enter a math expression and select your grade level for step-by-step solutions. Supports basic arithmetic, exponents, roots, logarithms, and trigonometry.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={expression}
              onChange={(e) => setExpression(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="e.g., 10^10, sqrt(144), log(100), sin(30)"
              className="flex-1"
            />
            <Select value={difficulty} onValueChange={(v) => setDifficulty(v as DifficultyLevel)}>
              <SelectTrigger className="w-32">
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
            <Button onClick={solveProblem} disabled={isLoading || !expression.trim()}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Solve'
              )}
            </Button>
          </div>

          {error && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {solution && (
        <Card className="border-primary/20 shadow-glow animate-fade-in">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                Solution
              </CardTitle>
              <Badge variant="outline">{solution.difficulty} Grade</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Expression:</p>
              <p className="text-2xl font-semibold font-display">{solution.expression}</p>
            </div>

            <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
              <p className="text-sm text-muted-foreground mb-1">Answer:</p>
              <p className="text-3xl font-bold font-display text-primary">{solution.result}</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-semibold text-foreground">Step-by-step solution:</p>
              <ol className="space-y-2">
                {solution.steps.map((step, index) => (
                  <li key={index} className="flex gap-3">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary text-sm font-semibold shrink-0">
                      {index + 1}
                    </span>
                    <span className="text-sm text-foreground pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="bg-accent/5 border-accent/20">
        <CardHeader>
          <CardTitle className="text-base">Quick Examples</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
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
                onClick={() => setExpression(example)}
                className="font-mono text-xs"
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

function generateSteps(expression: string, result: number, difficulty: DifficultyLevel): string[] {
  const steps: string[] = [];
  const exprLower = expression.toLowerCase();
  
  // Detect operation type
  const hasExponent = expression.includes('^');
  const hasSqrt = exprLower.includes('sqrt');
  const hasCbrt = exprLower.includes('cbrt');
  const hasLog = exprLower.includes('log');
  const hasLn = exprLower.includes('ln');
  const hasTrig = /sin|cos|tan|asin|acos|atan/i.test(expression);
  const hasComplex = (expression.match(/[+\-*/^()]/g) || []).length > 2;
  
  // Generate appropriate steps based on difficulty and operation type
  if (difficulty === 'K-2') {
    steps.push(`Look at the problem: ${expression}`);
    if (hasExponent) {
      steps.push(`This uses powers - multiplying a number by itself`);
    } else if (hasSqrt) {
      steps.push(`This finds what number times itself equals the number inside`);
    }
    steps.push(`Calculate the answer`);
    steps.push(`The answer is ${result}`);
  } else if (difficulty === '3-5') {
    steps.push(`Write down the expression: ${expression}`);
    
    if (hasExponent) {
      steps.push(`Exponents mean repeated multiplication (e.g., 2^3 = 2 × 2 × 2)`);
    } else if (hasSqrt) {
      steps.push(`Square root finds a number that when multiplied by itself gives the original number`);
    }
    
    steps.push(`Follow the order of operations (PEMDAS)`);
    steps.push(`Calculate step by step`);
    steps.push(`Final answer: ${result}`);
  } else if (difficulty === '6-8') {
    steps.push(`Given expression: ${expression}`);
    
    if (hasExponent) {
      const match = expression.match(/(\d+)\^(\d+)/);
      if (match) {
        steps.push(`Exponent ${match[1]}^${match[2]} means ${match[1]} multiplied by itself ${match[2]} times`);
      } else {
        steps.push(`Evaluate exponents using the power rule: a^b = a × a × ... (b times)`);
      }
    } else if (hasSqrt) {
      steps.push(`Square root (√) is the inverse operation of squaring a number`);
      steps.push(`Find the number that when squared equals the value under the radical`);
    } else if (hasCbrt) {
      steps.push(`Cube root (∛) finds the number that when cubed equals the original value`);
    } else if (hasLog) {
      steps.push(`Logarithm (log) asks: "10 to what power equals this number?"`);
    } else if (hasTrig) {
      steps.push(`Trigonometric functions relate angles to ratios in right triangles`);
    }
    
    if (hasComplex) {
      steps.push(`Apply order of operations: Parentheses, Exponents, Multiplication/Division, Addition/Subtraction`);
      steps.push(`Work from innermost parentheses outward`);
    }
    
    steps.push(`Simplify each operation in order`);
    steps.push(`Solution: ${result}`);
  } else {
    // 9-12 grade level
    steps.push(`Given expression: ${expression}`);
    
    if (hasExponent) {
      steps.push(`Apply exponentiation: For a^b, multiply base 'a' by itself 'b' times`);
      steps.push(`Properties: a^m × a^n = a^(m+n), (a^m)^n = a^(mn), a^0 = 1`);
    } else if (hasSqrt) {
      steps.push(`Square root operation: √x = x^(1/2), the principal (positive) root`);
      steps.push(`Verify: (√x)² = x`);
    } else if (hasCbrt) {
      steps.push(`Cube root operation: ∛x = x^(1/3)`);
      steps.push(`Unlike square roots, cube roots can be negative`);
    } else if (hasLog) {
      steps.push(`Logarithm base 10: log(x) asks "10^? = x"`);
      steps.push(`Inverse relationship: 10^(log(x)) = x and log(10^x) = x`);
      steps.push(`Properties: log(ab) = log(a) + log(b), log(a/b) = log(a) - log(b)`);
    } else if (hasLn) {
      steps.push(`Natural logarithm: ln(x) uses base e ≈ 2.718`);
      steps.push(`Inverse relationship: e^(ln(x)) = x and ln(e^x) = x`);
    } else if (hasTrig) {
      if (exprLower.includes('sin')) {
        steps.push(`Sine function: sin(θ) = opposite/hypotenuse in a right triangle`);
        steps.push(`On the unit circle, sin(θ) is the y-coordinate`);
      } else if (exprLower.includes('cos')) {
        steps.push(`Cosine function: cos(θ) = adjacent/hypotenuse in a right triangle`);
        steps.push(`On the unit circle, cos(θ) is the x-coordinate`);
      } else if (exprLower.includes('tan')) {
        steps.push(`Tangent function: tan(θ) = opposite/adjacent = sin(θ)/cos(θ)`);
      }
      steps.push(`Angle is measured in degrees`);
    }
    
    if (hasComplex) {
      steps.push(`Apply order of operations (PEMDAS): Parentheses → Exponents → Multiplication/Division → Addition/Subtraction`);
      steps.push(`Evaluate nested functions from innermost to outermost`);
    }
    
    steps.push(`Perform the calculation with proper precision`);
    steps.push(`Verify the result satisfies the original expression`);
    steps.push(`Final solution: ${result}`);
  }
  
  return steps;
}
