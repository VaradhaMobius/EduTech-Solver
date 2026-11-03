export type ChapterId =
  | "relations-functions"
  | "inverse-trig"
  | "matrices"
  | "determinants"
  | "continuity-differentiability"
  | "application-derivatives"
  | "integrals"
  | "application-integrals"
  | "differential-equations"
  | "vector-algebra"
  | "three-d-geometry"
  | "linear-programming"
  | "probability";

export interface Chapter {
  id: ChapterId;
  name: string;
  shortName: string;
  description: string;
}

export type Difficulty = "easy" | "medium" | "hard";
export type Marks = 2 | 3 | 4 | 5 | 6;

export interface Question {
  id: string;
  chapterId: ChapterId;
  marks: Marks;
  difficulty: Difficulty;
  /** Display prompt; may include LaTeX delimited by $...$ or $$...$$ */
  prompt: string;
  /** Plain-text / LaTeX final expected answer for grading context */
  finalAnswer: string;
  /** Worked solution the student can reveal */
  solution: string;
  /** Short tags for filtering */
  tags: string[];
}

export type SubmissionMode = "canvas" | "photo";

export interface GradeRequest {
  questionId: string;
  imageDataUrl: string;
  mode: SubmissionMode;
}

export interface GradeResult {
  isCorrect: boolean;
  confidence: number;
  score: number;
  maxScore: number;
  transcription: string;
  feedback: string;
  stepNotes: string[];
  usedMockGrader: boolean;
}
