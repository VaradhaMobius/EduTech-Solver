import type { Question } from "@/lib/types";

/**
 * Seed question bank for CBSE Class 12 Mathematics.
 * Prompts and solutions use LaTeX inside $...$ / $$...$$.
 */
export const QUESTIONS: Question[] = [
  {
    id: "rf-01",
    chapterId: "relations-functions",
    marks: 3,
    difficulty: "medium",
    prompt:
      "Show that the relation $R$ in the set $A = \\{1, 2, 3, 4, 5\\}$ given by $R = \\{(a,b) : |a-b| \\text{ is even}\\}$ is an equivalence relation.",
    finalAnswer:
      "R is reflexive, symmetric and transitive, hence an equivalence relation.",
    solution: `**Reflexive:** For any $a \\in A$, $|a-a|=0$ which is even. So $(a,a)\\in R$.

**Symmetric:** If $(a,b)\\in R$, then $|a-b|$ is even $\\Rightarrow$ $|b-a|$ is even $\\Rightarrow$ $(b,a)\\in R$.

**Transitive:** If $(a,b),(b,c)\\in R$, then $a-b$ and $b-c$ are both even integers, so $a-c=(a-b)+(b-c)$ is even $\\Rightarrow$ $(a,c)\\in R$.

Hence $R$ is an equivalence relation.`,
    tags: ["equivalence", "relations"],
  },
  {
    id: "rf-02",
    chapterId: "relations-functions",
    marks: 4,
    difficulty: "medium",
    prompt:
      "Let $f: \\mathbb{R} \\to \\mathbb{R}$ be defined as $f(x)=3x$. Choose the correct option: $f$ is (a) one-one onto (b) many-one onto (c) one-one into (d) many-one into. Justify.",
    finalAnswer: "f is one-one onto (option a).",
    solution: `**One-one:** $f(x_1)=f(x_2)\\Rightarrow 3x_1=3x_2\\Rightarrow x_1=x_2$.

**Onto:** For any $y\\in\\mathbb{R}$, take $x=y/3\\in\\mathbb{R}$. Then $f(x)=y$.

So $f$ is one-one onto. **Answer: (a).**`,
    tags: ["functions", "one-one", "onto"],
  },
  {
    id: "it-01",
    chapterId: "inverse-trig",
    marks: 2,
    difficulty: "easy",
    prompt: "Find the principal value of $\\sin^{-1}\\!\\left(-\\dfrac{1}{2}\\right)$.",
    finalAnswer: "$-\\pi/6$",
    solution: `We know $\\sin(\\pi/6)=1/2$ and the range of $\\sin^{-1}$ is $[-\\pi/2,\\pi/2]$.

Since $-1/2<0$, the principal value is $-\\pi/6$.

$$\\sin^{-1}\\!\\left(-\\frac{1}{2}\\right)=-\\frac{\\pi}{6}.$$`,
    tags: ["principal-value"],
  },
  {
    id: "it-02",
    chapterId: "inverse-trig",
    marks: 3,
    difficulty: "medium",
    prompt: "Prove that $\\tan^{-1} x + \\tan^{-1} y = \\tan^{-1}\\!\\left(\\dfrac{x+y}{1-xy}\\right)$, when $xy<1$.",
    finalAnswer:
      "Identity holds for xy<1 using tan(A+B) formula.",
    solution: `Let $\\tan^{-1}x=A$ and $\\tan^{-1}y=B$, so $\\tan A=x$, $\\tan B=y$, and $A,B\\in(-\\pi/2,\\pi/2)$.

$$\\tan(A+B)=\\frac{\\tan A+\\tan B}{1-\\tan A\\tan B}=\\frac{x+y}{1-xy}.$$

When $xy<1$, $A+B\\in(-\\pi/2,\\pi/2)$, so
$$A+B=\\tan^{-1}\\!\\left(\\frac{x+y}{1-xy}\\right).$$`,
    tags: ["identity"],
  },
  {
    id: "mx-01",
    chapterId: "matrices",
    marks: 3,
    difficulty: "easy",
    prompt:
      "If $A=\\begin{bmatrix}1&2\\\\3&4\\end{bmatrix}$, find $A+A'$ and show that it is a symmetric matrix.",
    finalAnswer:
      "$A+A'=\\begin{bmatrix}2&5\\\\5&8\\end{bmatrix}$, which equals its transpose.",
    solution: `$$A'=\\begin{bmatrix}1&3\\\\2&4\\end{bmatrix}$$

$$A+A'=\\begin{bmatrix}1+1&2+3\\\\3+2&4+4\\end{bmatrix}=\\begin{bmatrix}2&5\\\\5&8\\end{bmatrix}$$

$$(A+A')'=\\begin{bmatrix}2&5\\\\5&8\\end{bmatrix}=A+A'.$$

Hence $A+A'$ is symmetric.`,
    tags: ["symmetric", "transpose"],
  },
  {
    id: "mx-02",
    chapterId: "matrices",
    marks: 4,
    difficulty: "medium",
    prompt:
      "Find the inverse of $A=\\begin{bmatrix}2&-1\\\\-1&2\\end{bmatrix}$ by elementary row operations.",
    finalAnswer: "$A^{-1}=\\dfrac{1}{3}\\begin{bmatrix}2&1\\\\1&2\\end{bmatrix}$",
    solution: `Write $[A|I]=\\left[\\begin{array}{cc|cc}2&-1&1&0\\\\-1&2&0&1\\end{array}\\right]$.

$R_1\\to R_1/2$: $\\left[\\begin{array}{cc|cc}1&-1/2&1/2&0\\\\-1&2&0&1\\end{array}\\right]$

$R_2\\to R_2+R_1$: $\\left[\\begin{array}{cc|cc}1&-1/2&1/2&0\\\\0&3/2&1/2&1\\end{array}\\right]$

$R_2\\to (2/3)R_2$: $\\left[\\begin{array}{cc|cc}1&-1/2&1/2&0\\\\0&1&1/3&2/3\\end{array}\\right]$

$R_1\\to R_1+(1/2)R_2$: $\\left[\\begin{array}{cc|cc}1&0&2/3&1/3\\\\0&1&1/3&2/3\\end{array}\\right]$

$$A^{-1}=\\begin{bmatrix}2/3&1/3\\\\1/3&2/3\\end{bmatrix}=\\frac{1}{3}\\begin{bmatrix}2&1\\\\1&2\\end{bmatrix}.$$`,
    tags: ["inverse", "elementary-ops"],
  },
  {
    id: "dt-01",
    chapterId: "determinants",
    marks: 3,
    difficulty: "medium",
    prompt:
      "Using properties of determinants, prove that $$\\begin{vmatrix}x&x+y&x+2y\\\\x+2y&x&x+y\\\\x+y&x+2y&x\\end{vmatrix}=9y^2(x+y).$$",
    finalAnswer: "Determinant equals $9y^2(x+y)$.",
    solution: `Operate $C_1\\to C_1+C_2+C_3$:
$$\\begin{vmatrix}3(x+y)&x+y&x+2y\\\\3(x+y)&x&x+y\\\\3(x+y)&x+2y&x\\end{vmatrix}=3(x+y)\\begin{vmatrix}1&x+y&x+2y\\\\1&x&x+y\\\\1&x+2y&x\\end{vmatrix}.$$

$R_2\\to R_2-R_1$, $R_3\\to R_3-R_1$:
$$3(x+y)\\begin{vmatrix}1&x+y&x+2y\\\\0&-y&-y\\\\0&y&-2y\\end{vmatrix}=3(x+y)\\cdot(2y^2+y^2)=9y^2(x+y).$$`,
    tags: ["properties"],
  },
  {
    id: "cd-01",
    chapterId: "continuity-differentiability",
    marks: 3,
    difficulty: "medium",
    prompt:
      "Find $\\dfrac{dy}{dx}$ if $y=\\sin^{-1}\\!\\left(\\dfrac{2x}{1+x^2}\\right)$, $-1\\le x\\le 1$.",
    finalAnswer: "$\\dfrac{dy}{dx}=\\dfrac{2}{1+x^2}$ for $-1<x<1$ (with care at endpoints).",
    solution: `Let $x=\\tan\\theta$, $\\theta\\in[-\\pi/4,\\pi/4]$ for $x\\in[-1,1]$.

Then $\\dfrac{2x}{1+x^2}=\\sin 2\\theta$, so $y=2\\theta=2\\tan^{-1}x$ (in this range).

$$\\frac{dy}{dx}=\\frac{2}{1+x^2}.$$`,
    tags: ["differentiation", "inverse-trig"],
  },
  {
    id: "cd-02",
    chapterId: "continuity-differentiability",
    marks: 4,
    difficulty: "hard",
    prompt:
      "If $x=a(\\theta-\\sin\\theta)$ and $y=a(1-\\cos\\theta)$, find $\\dfrac{dy}{dx}$ at $\\theta=\\dfrac{\\pi}{3}$.",
    finalAnswer: "$\\sqrt{3}$",
    solution: `$$\\frac{dx}{d\\theta}=a(1-\\cos\\theta),\\quad \\frac{dy}{d\\theta}=a\\sin\\theta.$$

$$\\frac{dy}{dx}=\\frac{\\sin\\theta}{1-\\cos\\theta}.$$

At $\\theta=\\pi/3$:
$$\\frac{dy}{dx}=\\frac{\\sqrt{3}/2}{1-1/2}=\\sqrt{3}.$$`,
    tags: ["parametric"],
  },
  {
    id: "ad-01",
    chapterId: "application-derivatives",
    marks: 5,
    difficulty: "hard",
    prompt:
      "A wire of length $28$ m is to be cut into two pieces. One piece is bent into a square and the other into a circle. What should be the length of the two pieces so that the combined area is minimum?",
    finalAnswer:
      "Square side length piece: $112/(\\pi+4)$ m; circle piece: $28\\pi/(\\pi+4)$ m.",
    solution: `Let circle piece have length $x$. Then square piece has length $28-x$.

Radius $r=x/(2\\pi)$, square side $s=(28-x)/4$.

$$A=\\pi r^2+s^2=\\frac{x^2}{4\\pi}+\\frac{(28-x)^2}{16}.$$

$$A'=\\frac{x}{2\\pi}-\\frac{28-x}{8}=0\\Rightarrow \\frac{x}{\\pi}=\\frac{28-x}{4}\\Rightarrow x=\\frac{28\\pi}{\\pi+4}.$$

Square piece: $28-x=\\dfrac{112}{\\pi+4}$.

Second derivative test confirms a minimum.`,
    tags: ["maxima-minima"],
  },
  {
    id: "ad-02",
    chapterId: "application-derivatives",
    marks: 3,
    difficulty: "medium",
    prompt:
      "Find the intervals in which $f(x)=2x^3-9x^2+12x-5$ is (a) strictly increasing (b) strictly decreasing.",
    finalAnswer:
      "Increasing on $(-\\infty,1]\\cup[2,\\infty)$; decreasing on $[1,2]$.",
    solution: `$$f'(x)=6x^2-18x+12=6(x^2-3x+2)=6(x-1)(x-2).$$

$f'(x)\\ge 0$ for $x\\le 1$ or $x\\ge 2$; $f'(x)\\le 0$ for $1\\le x\\le 2$.

**(a)** strictly increasing on $(-\\infty,1]$ and $[2,\\infty)$  
**(b)** strictly decreasing on $[1,2]$.`,
    tags: ["increasing-decreasing"],
  },
  {
    id: "in-01",
    chapterId: "integrals",
    marks: 3,
    difficulty: "medium",
    prompt: "Evaluate $\\displaystyle\\int \\frac{x}{(x+1)(x+2)}\\,dx$.",
    finalAnswer: "$\\log\\left|\\dfrac{(x+2)^2}{x+1}\\right|+C$ (or equivalent).",
    solution: `Partial fractions: $\\dfrac{x}{(x+1)(x+2)}=\\dfrac{A}{x+1}+\\dfrac{B}{x+2}$.

$x=A(x+2)+B(x+1)$.

At $x=-1$: $-1=A\\Rightarrow A=-1$.  
At $x=-2$: $-2=-B\\Rightarrow B=2$.

$$\\int\\left(\\frac{-1}{x+1}+\\frac{2}{x+2}\\right)dx=-\\log|x+1|+2\\log|x+2|+C=\\log\\left|\\frac{(x+2)^2}{x+1}\\right|+C.$$

(Equivalent forms accepted.)`,
    tags: ["partial-fractions"],
  },
  {
    id: "in-02",
    chapterId: "integrals",
    marks: 4,
    difficulty: "medium",
    prompt: "Evaluate $\\displaystyle\\int_0^{\\pi/2}\\sin^2 x\\,dx$.",
    finalAnswer: "$\\pi/4$",
    solution: `Use $\\sin^2 x=\\dfrac{1-\\cos 2x}{2}$:

$$\\int_0^{\\pi/2}\\sin^2 x\\,dx=\\int_0^{\\pi/2}\\frac{1-\\cos 2x}{2}\\,dx=\\left[\\frac{x}{2}-\\frac{\\sin 2x}{4}\\right]_0^{\\pi/2}=\\frac{\\pi}{4}.$$`,
    tags: ["definite", "trig"],
  },
  {
    id: "ai-01",
    chapterId: "application-integrals",
    marks: 4,
    difficulty: "medium",
    prompt:
      "Find the area of the region bounded by $y^2=4x$ and $x^2=4y$.",
    finalAnswer: "$\\dfrac{16}{3}$ square units",
    solution: `Parabolas: $y^2=4x$ and $x^2=4y$. Intersection: from $x=y^2/4$ into $x^2=4y$:
$(y^2/4)^2=4y\\Rightarrow y^4=64y\\Rightarrow y(y^3-64)=0\\Rightarrow y=0,4$.

Points $(0,0)$ and $(4,4)$.

$$A=\\int_0^4\\left(\\sqrt{4x}-\\frac{x^2}{4}\\right)dx=\\int_0^4\\left(2\\sqrt{x}-\\frac{x^2}{4}\\right)dx=\\left[\\frac{4}{3}x^{3/2}-\\frac{x^3}{12}\\right]_0^4=\\frac{32}{3}-\\frac{16}{3}=\\frac{16}{3}.$$`,
    tags: ["area"],
  },
  {
    id: "de-01",
    chapterId: "differential-equations",
    marks: 4,
    difficulty: "medium",
    prompt:
      "Solve the differential equation $\\dfrac{dy}{dx}+\\dfrac{y}{x}=x^2$, $x>0$.",
    finalAnswer: "$y=\\dfrac{x^3}{4}+\\dfrac{C}{x}$",
    solution: `Linear DE: $\\dfrac{dy}{dx}+P y=Q$ with $P=1/x$, $Q=x^2$.

Integrating factor: $e^{\\int dx/x}=x$ ($x>0$).

$$\\frac{d}{dx}(yx)=x^3\\Rightarrow yx=\\frac{x^4}{4}+C\\Rightarrow y=\\frac{x^3}{4}+\\frac{C}{x}.$$`,
    tags: ["linear-de"],
  },
  {
    id: "de-02",
    chapterId: "differential-equations",
    marks: 3,
    difficulty: "easy",
    prompt:
      "Find the order and degree of the differential equation $\\left(\\dfrac{d^2y}{dx^2}\\right)^3+\\left(\\dfrac{dy}{dx}\\right)^2+\\sin y=0$.",
    finalAnswer: "Order 2, degree 3.",
    solution: `Highest order derivative present is $\\dfrac{d^2y}{dx^2}$, so **order = 2**.

It appears with power $3$, and the equation is polynomial in derivatives, so **degree = 3**.`,
    tags: ["order-degree"],
  },
  {
    id: "va-01",
    chapterId: "vector-algebra",
    marks: 3,
    difficulty: "medium",
    prompt:
      "Find the projection of $\\vec{a}=2\\hat{i}+3\\hat{j}+2\\hat{k}$ on $\\vec{b}=\\hat{i}+2\\hat{j}+\\hat{k}$.",
    finalAnswer: "$\\dfrac{10}{\\sqrt{6}}$",
    solution: `Projection of $\\vec{a}$ on $\\vec{b}$ is $\\dfrac{\\vec{a}\\cdot\\vec{b}}{|\\vec{b}|}$.

$$\\vec{a}\\cdot\\vec{b}=2+6+2=10,\\quad |\\vec{b}|=\\sqrt{1+4+1}=\\sqrt{6}.$$

Projection $=\\dfrac{10}{\\sqrt{6}}$.`,
    tags: ["projection", "dot-product"],
  },
  {
    id: "va-02",
    chapterId: "vector-algebra",
    marks: 4,
    difficulty: "medium",
    prompt:
      "Find the area of the parallelogram whose adjacent sides are $\\vec{a}=\\hat{i}+2\\hat{j}+3\\hat{k}$ and $\\vec{b}=3\\hat{i}-2\\hat{j}+\\hat{k}$.",
    finalAnswer: "$8\\sqrt{3}$",
    solution: `$$\\vec{a}\\times\\vec{b}=\\begin{vmatrix}\\hat{i}&\\hat{j}&\\hat{k}\\\\1&2&3\\\\3&-2&1\\end{vmatrix}=\\hat{i}(2+6)-\\hat{j}(1-9)+\\hat{k}(-2-6)=8\\hat{i}+8\\hat{j}-8\\hat{k}.$$

$$|\\vec{a}\\times\\vec{b}|=\\sqrt{64+64+64}=8\\sqrt{3}.$$

Area $=8\\sqrt{3}$.`,
    tags: ["cross-product", "area"],
  },
  {
    id: "3d-01",
    chapterId: "three-d-geometry",
    marks: 4,
    difficulty: "medium",
    prompt:
      "Find the shortest distance between the lines $$\\frac{x-1}{2}=\\frac{y-2}{3}=\\frac{z-3}{4}$$ and $$\\frac{x-2}{3}=\\frac{y-4}{4}=\\frac{z-5}{5}.$$",
    finalAnswer: "$\\dfrac{1}{\\sqrt{6}}$",
    solution: `Lines: $\\vec{r}=\\vec{a}_1+\\lambda\\vec{b}_1$, $\\vec{r}=\\vec{a}_2+\\mu\\vec{b}_2$ with
$\\vec{a}_1=\\langle1,2,3\\rangle$, $\\vec{b}_1=\\langle2,3,4\\rangle$, $\\vec{a}_2=\\langle2,4,5\\rangle$, $\\vec{b}_2=\\langle3,4,5\\rangle$.

$$d=\\left|\\frac{(\\vec{a}_2-\\vec{a}_1)\\cdot(\\vec{b}_1\\times\\vec{b}_2)}{|\\vec{b}_1\\times\\vec{b}_2|}\\right|.$$

$\\vec{a}_2-\\vec{a}_1=\\langle1,2,2\\rangle$.

$\\vec{b}_1\\times\\vec{b}_2=\\langle-1,2,-1\\rangle$, magnitude $\\sqrt{6}$.

Dot product: $-1+4-2=1$. So $d=1/\\sqrt{6}$.`,
    tags: ["shortest-distance"],
  },
  {
    id: "lp-01",
    chapterId: "linear-programming",
    marks: 5,
    difficulty: "medium",
    prompt:
      "Maximise $Z=3x+4y$ subject to $x+y\\le 4$, $x\\ge 0$, $y\\ge 0$ and $x\\le 2$. Find the maximum value of $Z$.",
    finalAnswer: "Maximum $Z=16$ at $(0,4)$.",
    solution: `Feasible region vertices: $(0,0)$, $(2,0)$, $(2,2)$, $(0,4)$.

$Z(0,0)=0$, $Z(2,0)=6$, $Z(2,2)=14$, $Z(0,4)=16$.

**Maximum $Z=16$ at $(0,4)$.**`,
    tags: ["graphical", "maximise"],
  },
  {
    id: "pr-01",
    chapterId: "probability",
    marks: 3,
    difficulty: "medium",
    prompt:
      "A die is thrown. If $E$ is the event ‘the number appearing is a multiple of 3’ and $F$ is ‘the number is even’, find $P(E|F)$.",
    finalAnswer: "$1/3$",
    solution: `Sample space $S=\\{1,2,3,4,5,6\\}$.

$E=\\{3,6\\}$, $F=\\{2,4,6\\}$, $E\\cap F=\\{6\\}$.

$$P(E|F)=\\frac{P(E\\cap F)}{P(F)}=\\frac{1/6}{3/6}=\\frac{1}{3}.$$`,
    tags: ["conditional"],
  },
  {
    id: "pr-02",
    chapterId: "probability",
    marks: 5,
    difficulty: "hard",
    prompt:
      "Bag $A$ and $B$ throw a pair of dice alternately. $A$ wins if he throws a sum of $6$ before $B$ throws a sum of $7$, and $B$ wins if he throws a sum of $7$ before $A$ throws a sum of $6$. If $A$ begins, find the probability that $A$ wins.",
    finalAnswer: "$30/61$",
    solution: `P(sum 6) $=5/36$, P(sum 7) $=6/36=1/6$.

$A$ can win on 1st throw, or both fail then $A$ succeeds, etc.

$$P(A)=\\frac{5}{36}+\\left(1-\\frac{5}{36}\\right)\\left(1-\\frac{6}{36}\\right)\\frac{5}{36}+\\cdots$$

$$=\\frac{5/36}{1-\\left(\\frac{31}{36}\\right)\\left(\\frac{30}{36}\\right)}=\\frac{5/36}{1-930/1296}=\\frac{5/36}{366/1296}=\\frac{5\\cdot 36}{366}=\\frac{30}{61}.$$`,
    tags: ["infinite-series", "dice"],
  },
];

export function getQuestionById(id: string): Question | undefined {
  return QUESTIONS.find((q) => q.id === id);
}

export function getQuestionsByChapter(chapterId: string): Question[] {
  return QUESTIONS.filter((q) => q.chapterId === chapterId);
}
