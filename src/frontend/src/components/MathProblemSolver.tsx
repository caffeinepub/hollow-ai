import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calculator, Loader2, CheckCircle2, GraduationCap, Lightbulb } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

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

export function MathProblemSolver() {
  const [expression, setExpression] = useState('');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('6-8');
  const [teacherMode, setTeacherMode] = useState(false);
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
          <div className="flex items-center gap-3 p-3 bg-accent/10 rounded-lg border border-accent/20">
            <GraduationCap className="h-5 w-5 text-accent" />
            <div className="flex items-center gap-2 flex-1">
              <Switch
                id="teacher-mode"
                checked={teacherMode}
                onCheckedChange={setTeacherMode}
              />
              <Label htmlFor="teacher-mode" className="cursor-pointer font-medium">
                Teacher Mode
              </Label>
            </div>
            <Badge variant="outline" className="text-xs">
              {teacherMode ? 'Detailed explanations' : 'Standard mode'}
            </Badge>
          </div>

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
              <div className="flex items-center gap-2">
                {teacherMode && (
                  <Badge variant="secondary" className="gap-1">
                    <GraduationCap className="h-3 w-3" />
                    Teacher Mode
                  </Badge>
                )}
                <Badge variant="outline">{solution.difficulty} Grade</Badge>
              </div>
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

            {solution.conceptExplanations.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-accent" />
                  Key Concepts:
                </p>
                <div className="space-y-2">
                  {solution.conceptExplanations.map((concept, index) => (
                    <div
                      key={index}
                      className="p-3 bg-accent/10 border border-accent/20 rounded-lg"
                    >
                      <p className="text-sm font-semibold text-accent mb-1">{concept.concept}</p>
                      <p className="text-sm text-foreground/90">{concept.explanation}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

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
        explanation: 'The cube root ∛x = x^(1/3) finds the number that when multiplied by itself three times gives x. Unlike square roots, cube roots can be negative (e.g., ∛(-8) = -2). Cube roots are used in volume calculations and solving cubic equations.'
      });
    }
  }
  
  if (exprLower.includes('log')) {
    if (difficulty === '6-8') {
      explanations.push({
        concept: 'Logarithm',
        explanation: 'A logarithm answers the question: "What power do we raise 10 to, to get this number?" For example, log(100) = 2 because 10² = 100. Logarithms help us work with very large numbers and are used in science to measure things like earthquakes and sound.'
      });
    } else {
      explanations.push({
        concept: 'Logarithm (Base 10)',
        explanation: 'The logarithm log(x) asks "10 to what power equals x?" It\'s the inverse of exponentiation: if 10ʸ = x, then log(x) = y. Logarithms compress large ranges of values and are essential in measuring pH, decibels, earthquake magnitude (Richter scale), and analyzing exponential growth.'
      });
    }
  }
  
  if (exprLower.includes('ln')) {
    if (difficulty === '6-8') {
      explanations.push({
        concept: 'Natural Logarithm',
        explanation: 'The natural logarithm (ln) is similar to log, but uses a special number called "e" (about 2.718) instead of 10. It\'s used a lot in science and mathematics, especially when things grow or decay naturally over time.'
      });
    } else {
      explanations.push({
        concept: 'Natural Logarithm',
        explanation: 'The natural logarithm ln(x) uses base e ≈ 2.71828 (Euler\'s number). It\'s the inverse of eˣ. Natural logarithms appear naturally in calculus, continuous compound interest, radioactive decay, population growth, and many differential equations. The derivative of ln(x) is 1/x, making it fundamental in integration.'
      });
    }
  }
  
  if (/sin|cos|tan/i.test(expression) && !/asin|acos|atan/i.test(expression)) {
    if (difficulty === '6-8') {
      explanations.push({
        concept: 'Trigonometric Functions',
        explanation: 'Trigonometric functions (sine, cosine, tangent) relate angles to the sides of right triangles. They help us find missing sides or angles in triangles and are used in navigation, construction, and understanding waves and circles.'
      });
    } else {
      explanations.push({
        concept: 'Trigonometry',
        explanation: 'Trigonometric functions relate angles to ratios in right triangles. In a right triangle: sin(θ) = opposite/hypotenuse, cos(θ) = adjacent/hypotenuse, tan(θ) = opposite/adjacent. On the unit circle, these represent coordinates and slopes. Trig functions model periodic phenomena like sound waves, light, tides, and circular motion.'
      });
    }
  }
  
  if (/asin|acos|atan|arcsin|arccos|arctan/i.test(expression)) {
    if (difficulty === '9-10' || difficulty === '11-12') {
      explanations.push({
        concept: 'Inverse Trigonometric Functions',
        explanation: 'Inverse trig functions (arcsin, arccos, arctan) work backwards from regular trig functions. They take a ratio and return the angle. For example, if sin(30°) = 0.5, then arcsin(0.5) = 30°. These are essential for finding angles when you know the sides of a triangle.'
      });
    }
  }
  
  // Add explanation about order of operations for complex expressions
  if ((expression.match(/[+\-*/^()]/g) || []).length > 2) {
    if (difficulty === '3-5' || difficulty === '6-8') {
      explanations.push({
        concept: 'Order of Operations (PEMDAS)',
        explanation: 'We follow the order of operations to ensure everyone solves problems the same way. PEMDAS stands for: Parentheses first, then Exponents, then Multiplication and Division (left to right), and finally Addition and Subtraction (left to right). This order is like a set of rules everyone agrees to follow.'
      });
    } else if (difficulty === '9-10' || difficulty === '11-12') {
      explanations.push({
        concept: 'Order of Operations',
        explanation: 'Mathematical expressions are evaluated following a strict hierarchy: Parentheses (innermost first), Exponents (right to left), Multiplication and Division (left to right, equal precedence), Addition and Subtraction (left to right, equal precedence). This convention ensures unambiguous interpretation of mathematical notation across all contexts.'
      });
    }
  }
  
  return explanations;
}

function generateSteps(expression: string, result: number, difficulty: DifficultyLevel, teacherMode: boolean): string[] {
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
  
  // Generate appropriate steps based on difficulty, operation type, and teacher mode
  if (difficulty === 'K-2') {
    steps.push(`Look at the problem: ${expression}`);
    
    if (teacherMode) {
      if (hasExponent) {
        steps.push(`This uses powers - it means we multiply a number by itself several times. This is a shortcut for repeated multiplication!`);
      } else if (hasSqrt) {
        steps.push(`This finds what number times itself equals the number inside. We're looking for a special number that makes a perfect square!`);
      } else {
        steps.push(`Let's break this down into simple steps we can understand`);
      }
      steps.push(`We'll work through this carefully, one step at a time`);
    } else {
      if (hasExponent) {
        steps.push(`This uses powers - multiplying a number by itself`);
      } else if (hasSqrt) {
        steps.push(`This finds what number times itself equals the number inside`);
      }
    }
    
    steps.push(`Calculate the answer`);
    steps.push(`The answer is ${result}`);
  } else if (difficulty === '3-5') {
    steps.push(`Write down the expression: ${expression}`);
    
    if (teacherMode) {
      if (hasExponent) {
        const match = expression.match(/(\d+)\^(\d+)/);
        if (match) {
          steps.push(`Exponents mean repeated multiplication. When we see ${match[1]}^${match[2]}, we multiply ${match[1]} by itself ${match[2]} times. This is much easier than writing out ${match[1]} × ${match[1]} × ... many times!`);
        } else {
          steps.push(`Exponents mean repeated multiplication (e.g., 2³ = 2 × 2 × 2). We use exponents because they make it easier to write and work with numbers that are multiplied many times.`);
        }
      } else if (hasSqrt) {
        steps.push(`Square root finds a number that when multiplied by itself gives the original number. Think of it as asking: "What number makes a perfect square with this area?"`);
      }
      
      steps.push(`Follow the order of operations (PEMDAS) - this ensures everyone solves the problem the same way and gets the same answer`);
      steps.push(`Calculate step by step, checking our work as we go`);
    } else {
      if (hasExponent) {
        steps.push(`Exponents mean repeated multiplication (e.g., 2³ = 2 × 2 × 2)`);
      } else if (hasSqrt) {
        steps.push(`Square root finds a number that when multiplied by itself gives the original number`);
      }
      
      steps.push(`Follow the order of operations (PEMDAS)`);
      steps.push(`Calculate step by step`);
    }
    
    steps.push(`Final answer: ${result}`);
  } else if (difficulty === '6-8') {
    steps.push(`Given expression: ${expression}`);
    
    if (teacherMode) {
      if (hasExponent) {
        const match = expression.match(/(\d+)\^(\d+)/);
        if (match) {
          steps.push(`Exponent ${match[1]}^${match[2]} means ${match[1]} multiplied by itself ${match[2]} times. We evaluate exponents first (after parentheses) because they represent a more "powerful" operation than multiplication or addition.`);
        } else {
          steps.push(`Evaluate exponents using the power rule: a^b means multiply 'a' by itself 'b' times. Exponents grow very quickly - that's why they're useful for representing large numbers compactly!`);
        }
      } else if (hasSqrt) {
        steps.push(`Square root (√) is the inverse operation of squaring a number. When we square a number, we multiply it by itself. The square root asks: "What number was squared to get this result?"`);
        steps.push(`Find the number that when squared equals the value under the radical. We're essentially working backwards from squaring.`);
      } else if (hasCbrt) {
        steps.push(`Cube root (∛) finds the number that when cubed (multiplied by itself three times) equals the original value. This is like asking: "What's the side length of a cube with this volume?"`);
      } else if (hasLog) {
        steps.push(`Logarithm (log) asks: "10 to what power equals this number?" It's the inverse of raising 10 to a power. Logarithms help us work with very large numbers by converting multiplication into addition.`);
      } else if (hasTrig) {
        steps.push(`Trigonometric functions relate angles to ratios in right triangles. These ratios stay the same for any size triangle with the same angle - that's what makes them so useful!`);
      }
      
      if (hasComplex) {
        steps.push(`Apply order of operations: Parentheses, Exponents, Multiplication/Division, Addition/Subtraction. This order exists because some operations are more "binding" than others - we need to do the stronger operations first.`);
        steps.push(`Work from innermost parentheses outward, evaluating each operation in the correct order`);
      }
      
      steps.push(`Simplify each operation in order, keeping track of our intermediate results`);
    } else {
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
    }
    
    steps.push(`Solution: ${result}`);
  } else {
    // 9-12 grade level
    steps.push(`Given expression: ${expression}`);
    
    if (teacherMode) {
      if (hasExponent) {
        steps.push(`Apply exponentiation: For a^b, multiply base 'a' by itself 'b' times. This operation has important algebraic properties that make it fundamental to higher mathematics.`);
        steps.push(`Key properties to remember: a^m × a^n = a^(m+n) (we add exponents when multiplying same bases), (a^m)^n = a^(mn) (we multiply exponents when raising a power to a power), and a^0 = 1 (any non-zero number to the zero power equals 1).`);
      } else if (hasSqrt) {
        steps.push(`Square root operation: √x = x^(1/2), representing the principal (positive) root. The square root function is the inverse of the squaring function, which is why they "undo" each other.`);
        steps.push(`Verify the relationship: (√x)² = x. This inverse relationship is fundamental to solving quadratic equations and understanding function composition.`);
      } else if (hasCbrt) {
        steps.push(`Cube root operation: ∛x = x^(1/3). This is one of the family of nth root functions.`);
        steps.push(`Unlike square roots, cube roots can be negative because a negative number cubed remains negative. This makes the cube root function defined for all real numbers.`);
      } else if (hasLog) {
        steps.push(`Logarithm base 10: log(x) asks "10 to what power equals x?" This transforms exponential relationships into linear ones, which are easier to analyze.`);
        steps.push(`Inverse relationship: 10^(log(x)) = x and log(10^x) = x. These identities show that logarithm and exponentiation are inverse functions.`);
        steps.push(`Important properties: log(ab) = log(a) + log(b) (multiplication becomes addition), log(a/b) = log(a) - log(b) (division becomes subtraction). These properties make logarithms powerful tools for simplifying complex calculations.`);
      } else if (hasLn) {
        steps.push(`Natural logarithm: ln(x) uses base e ≈ 2.718 (Euler's number). The natural logarithm appears naturally in calculus because the derivative of e^x is itself.`);
        steps.push(`Inverse relationship: e^(ln(x)) = x and ln(e^x) = x. The natural logarithm is the inverse function of the natural exponential function.`);
      } else if (hasTrig) {
        if (exprLower.includes('sin')) {
          steps.push(`Sine function: sin(θ) = opposite/hypotenuse in a right triangle. This ratio remains constant for a given angle regardless of triangle size.`);
          steps.push(`On the unit circle, sin(θ) represents the y-coordinate of the point at angle θ. This geometric interpretation connects trigonometry to coordinate geometry.`);
        } else if (exprLower.includes('cos')) {
          steps.push(`Cosine function: cos(θ) = adjacent/hypotenuse in a right triangle. Like sine, this ratio is constant for a given angle.`);
          steps.push(`On the unit circle, cos(θ) represents the x-coordinate of the point at angle θ. Together with sine, it parameterizes circular motion.`);
        } else if (exprLower.includes('tan')) {
          steps.push(`Tangent function: tan(θ) = opposite/adjacent = sin(θ)/cos(θ). Tangent represents the slope of the line from the origin at angle θ.`);
        }
        steps.push(`Angle is measured in degrees. (Note: In calculus, we typically use radians, where 180° = π radians.)`);
      }
      
      if (hasComplex) {
        steps.push(`Apply order of operations (PEMDAS): Parentheses → Exponents → Multiplication/Division → Addition/Subtraction. This hierarchy ensures unambiguous evaluation of expressions.`);
        steps.push(`Evaluate nested functions from innermost to outermost, maintaining precision throughout the calculation to minimize rounding errors.`);
      }
      
      steps.push(`Perform the calculation with proper precision, being mindful of significant figures and rounding only at the final step.`);
      steps.push(`Verify the result satisfies the original expression by checking if substituting our answer back makes sense mathematically.`);
    } else {
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
    }
    
    steps.push(`Final solution: ${result}`);
  }
  
  return steps;
}
