export interface Question {
  id: number;
  text: string;
  options: { id: string; text: string; image?: string; matrix?: string[] }[];
  correctOptionId: string;
  explanation: string;
  category: 'Pattern' | 'Numeric' | 'Verbal' | 'Logic' | 'Math';
  domain: 'Pattern' | 'Numeric' | 'Verbal' | 'Logic' | 'Math';
  difficulty: number;   // b-parameter: -3.0 to +3.0 (z-score scale)
  discrimination: number; // a-parameter: 0.5 to 2.5
  sequence?: string;
  image?: string;
  matrix?: string[]; // Array of 8 or 9 strings (SVG paths or identifiers)
  originalDifficulty: 1 | 2 | 3 | 4 | 5;
}

export const QUESTIONS: Question[] = [
  // Pattern Recognition
  {
    id: 1,
    text: "Which shape logically follows the sequence? [Circle, Square, Triangle, Circle, Square, ...]",
    options: [
      { id: 'a', text: "Triangle" },
      { id: 'b', text: "Hexagon" },
      { id: 'c', text: "Pentagon" },
      { id: 'd', text: "Star" }
    ],
    correctOptionId: "a",
    explanation: "The sequence repeats every three shapes: Circle, Square, Triangle.",
    category: "Pattern",
    domain: "Pattern",
    difficulty: -2.0,
    discrimination: 1.2,
    originalDifficulty: 1
  },
  {
    id: 2,
    text: "Select the missing piece from the grid below.",
    options: [
      { id: 'a', text: "Option A" },
      { id: 'b', text: "Option B" },
      { id: 'c', text: "Option C" },
      { id: 'd', text: "Option D" }
    ],
    correctOptionId: "c",
    explanation: "The patterns in the rows follow a rotation rule of 90 degrees clockwise.",
    category: "Pattern",
    domain: "Pattern",
    difficulty: 0.0,
    discrimination: 1.2,
    originalDifficulty: 3
  },
  // Numerical Reasoning
  {
    id: 3,
    text: "Complete the series:",
    sequence: "2, 4, 8, 16, 32, ?",
    options: [
      { id: 'a', text: "48" },
      { id: 'b', text: "64" },
      { id: 'c', text: "128" },
      { id: 'd', text: "256" }
    ],
    correctOptionId: "b",
    explanation: "Each number is multiplied by 2 to get the next number in the sequence.",
    category: "Numeric",
    domain: "Numeric",
    difficulty: -2.0,
    discrimination: 1.2,
    originalDifficulty: 1
  },
  {
    id: 4,
    text: "What is the next number in the series?",
    sequence: "1, 1, 2, 3, 5, 8, 13, ?",
    options: [
      { id: 'a', text: "18" },
      { id: 'b', text: "20" },
      { id: 'c', text: "21" },
      { id: 'd', text: "25" }
    ],
    correctOptionId: "c",
    explanation: "This is the Fibonacci sequence where each number is the sum of the two preceding ones.",
    category: "Numeric",
    domain: "Numeric",
    difficulty: -1.0,
    discrimination: 1.2,
    originalDifficulty: 2
  },
  // Verbal Intelligence
  {
    id: 5,
    text: "Doctor is to Hospital as Teacher is to ...",
    options: [
      { id: 'a', text: "Office" },
      { id: 'b', text: "School" },
      { id: 'c', text: "Library" },
      { id: 'd', text: "Market" }
    ],
    correctOptionId: "b",
    explanation: "A doctor works in a hospital, and a teacher works in a school.",
    category: "Verbal",
    domain: "Verbal",
    difficulty: -2.0,
    discrimination: 1.2,
    originalDifficulty: 1
  },
  {
    id: 6,
    text: "Which word is the odd one out?",
    options: [
      { id: 'a', text: "Apple" },
      { id: 'b', text: "Banana" },
      { id: 'c', text: "Carrot" },
      { id: 'd', text: "Grape" }
    ],
    correctOptionId: "c",
    explanation: "Apple, Banana, and Grape are fruits, while Carrot is a vegetable.",
    category: "Verbal",
    domain: "Verbal",
    difficulty: -1.0,
    discrimination: 1.2,
    originalDifficulty: 2
  },
  // Logical Deduction
  {
    id: 7,
    text: "If all Bloops are Razzies and all Razzies are Lazzies, then all Bloops are definitely Lazzies.",
    options: [
      { id: 'a', text: "True" },
      { id: 'b', text: "False" },
      { id: 'c', text: "Cannot be determined" },
      { id: 'd', text: "None of the above" }
    ],
    correctOptionId: "a",
    explanation: "This is a transitive logical relationship: If A=B and B=C, then A=C.",
    category: "Logic",
    domain: "Logic",
    difficulty: -1.0,
    discrimination: 1.2,
    originalDifficulty: 2
  },
  {
    id: 8,
    text: "Some A are B. All B are C. Therefore, some A are definitely C.",
    options: [
      { id: 'a', text: "True" },
      { id: 'b', text: "False" },
      { id: 'c', text: "Cannot be determined" },
      { id: 'd', text: "None of the above" }
    ],
    correctOptionId: "a",
    explanation: "Since some A are B and all B are C, those specific A that are B must also be C.",
    category: "Logic",
    domain: "Logic",
    difficulty: 0.0,
    discrimination: 1.2,
    originalDifficulty: 3
  },
  // Applied Mathematics
  {
    id: 9,
    text: "A train travels at 60 mph. How far does it travel in 2.5 hours?",
    options: [
      { id: 'a', text: "120 miles" },
      { id: 'b', text: "140 miles" },
      { id: 'c', text: "150 miles" },
      { id: 'd', text: "160 miles" }
    ],
    correctOptionId: "c",
    explanation: "Distance = Speed × Time. 60 × 2.5 = 150.",
    category: "Math",
    domain: "Math",
    difficulty: -1.0,
    discrimination: 1.2,
    originalDifficulty: 2
  },
  {
    id: 10,
    text: "If a shirt costs $20 after a 20% discount, what was the original price?",
    options: [
      { id: 'a', text: "$24" },
      { id: 'b', text: "$25" },
      { id: 'c', text: "$26" },
      { id: 'd', text: "$30" }
    ],
    correctOptionId: "b",
    explanation: "Let original price be X. 0.8X = 20. X = 20 / 0.8 = 25.",
    category: "Math",
    domain: "Math",
    difficulty: 0.0,
    discrimination: 1.2,
    originalDifficulty: 3
  },
  {
    id: 11,
    text: "Find the missing number:",
    sequence: "100, 90, 81, 73, ?",
    options: [
      { id: 'a', text: "66" },
      { id: 'b', text: "65" },
      { id: 'c', text: "64" },
      { id: 'd', text: "63" }
    ],
    correctOptionId: "a",
    explanation: "The difference decreases by 1 each time: 100-10=90, 90-9=81, 81-8=73, 73-7=66.",
    category: "Numeric",
    domain: "Numeric",
    difficulty: 0.0,
    discrimination: 1.2,
    originalDifficulty: 3
  },
  {
    id: 12,
    text: "Which of the following is the opposite of 'Stingy'?",
    options: [
      { id: 'a', text: "Greedy" },
      { id: 'b', text: "Generous" },
      { id: 'c', text: "Frugal" },
      { id: 'd', text: "Mean" }
    ],
    correctOptionId: "b",
    explanation: "Stingy means unwilling to give or spend; Generous means showing a readiness to give more of something.",
    category: "Verbal",
    domain: "Verbal",
    difficulty: -1.0,
    discrimination: 1.2,
    originalDifficulty: 2
  },
  {
    id: 13,
    text: "Complete the analogy: Book is to Chapter as Building is to ...",
    options: [
      { id: 'a', text: "Brick" },
      { id: 'b', text: "Floor" },
      { id: 'c', text: "Window" },
      { id: 'd', text: "Door" }
    ],
    correctOptionId: "b",
    explanation: "A book is composed of chapters; a building is composed of floors.",
    category: "Verbal",
    domain: "Verbal",
    difficulty: -1.0,
    discrimination: 1.2,
    originalDifficulty: 2
  },
  {
    id: 14,
    text: "If you rotate the shape 180 degrees, which one matches?",
    options: [
      { id: 'a', text: "Option A" },
      { id: 'b', text: "Option B" },
      { id: 'c', text: "Option C" },
      { id: 'd', text: "Option D" }
    ],
    correctOptionId: "b",
    explanation: "A 180-degree rotation flips the shape both vertically and horizontally.",
    category: "Pattern",
    domain: "Pattern",
    difficulty: -1.0,
    discrimination: 1.2,
    originalDifficulty: 2
  },
  {
    id: 15,
    text: "What is the next number:",
    sequence: "3, 6, 12, 24, ?",
    options: [
      { id: 'a', text: "36" },
      { id: 'b', text: "48" },
      { id: 'c', text: "60" },
      { id: 'd', text: "72" }
    ],
    correctOptionId: "b",
    explanation: "The sequence doubles each time.",
    category: "Numeric",
    domain: "Numeric",
    difficulty: -2.0,
    discrimination: 1.2,
    originalDifficulty: 1
  },
  {
    id: 16,
    text: "All cats are mammals. Fluffy is a cat. Therefore, Fluffy is a mammal.",
    options: [
      { id: 'a', text: "True" },
      { id: 'b', text: "False" },
      { id: 'c', text: "Cannot be determined" },
      { id: 'd', text: "None of the above" }
    ],
    correctOptionId: "a",
    explanation: "Standard categorical syllogism.",
    category: "Logic",
    domain: "Logic",
    difficulty: -2.0,
    discrimination: 1.2,
    originalDifficulty: 1
  },
  {
    id: 17,
    text: "If 5 machines take 5 minutes to make 5 widgets, how long would it take 100 machines to make 100 widgets?",
    options: [
      { id: 'a', text: "1 minute" },
      { id: 'b', text: "5 minutes" },
      { id: 'c', text: "20 minutes" },
      { id: 'd', text: "100 minutes" }
    ],
    correctOptionId: "b",
    explanation: "Each machine takes 5 minutes to make 1 widget. So 100 machines working simultaneously will take 5 minutes to make 100 widgets.",
    category: "Math",
    domain: "Math",
    difficulty: 1.0,
    discrimination: 1.2,
    originalDifficulty: 4
  },
  {
    id: 18,
    text: "Which number should replace the question mark?",
    sequence: "7, 10, 16, 28, 52, ?",
    options: [
      { id: 'a', text: "88" },
      { id: 'b', text: "96" },
      { id: 'c', text: "100" },
      { id: 'd', text: "104" }
    ],
    correctOptionId: "c",
    explanation: "The difference doubles each time: 3, 6, 12, 24, 48. 52 + 48 = 100.",
    category: "Numeric",
    domain: "Numeric",
    difficulty: 1.0,
    discrimination: 1.2,
    originalDifficulty: 4
  },
  {
    id: 19,
    text: "Identify the pattern and select the missing shape.",
    options: [
      { id: 'a', text: "Option A" },
      { id: 'b', text: "Option B" },
      { id: 'c', text: "Option C" },
      { id: 'd', text: "Option D" }
    ],
    correctOptionId: "d",
    explanation: "The shapes move clockwise around the square frame.",
    category: "Pattern",
    domain: "Pattern",
    difficulty: 1.0,
    discrimination: 1.2,
    originalDifficulty: 4
  },
  {
    id: 20,
    text: "If 3x + 7 = 22, what is the value of x?",
    options: [
      { id: 'a', text: "3" },
      { id: 'b', text: "4" },
      { id: 'c', text: "5" },
      { id: 'd', text: "6" }
    ],
    correctOptionId: "c",
    explanation: "3x = 22 - 7 = 15. x = 15 / 3 = 5.",
    category: "Math",
    domain: "Math",
    difficulty: -1.0,
    discrimination: 1.2,
    originalDifficulty: 2
  },
  {
    id: 21,
    domain: 'Pattern',
    text: 'Complete the pattern matrix by selecting the correct missing cell.',
    matrix: [
      '1,3,7,9', '2,4,6,8', '1,3,7,9',
      '2,4,6,8', '1,3,7,9', '2,4,6,8',
      '1,3,7,9', '2,4,6,8', '?'
    ],
    options: [
      { id: 'a', text: '1,3,7,9' },
      { id: 'b', text: '2,4,6,8' },
      { id: 'c', text: '5' },
      { id: 'd', text: '1,2,3,4,5,6,7,8,9' }
    ],
    correctOptionId: 'a',
    explanation: 'The pattern alternates between the corners (1,3,7,9) and the edges (2,4,6,8) in each row and column.',
    category: 'Pattern',
    difficulty: 0.2,
    discrimination: 1.5,
    originalDifficulty: 2
  },
  {
    id: 22,
    domain: 'Pattern',
    text: 'Identify the missing element in the 3x3 grid.',
    matrix: [
      '1', '1,2', '1,2,3',
      '4', '4,5', '4,5,6',
      '7', '7,8', '?'
    ],
    options: [
      { id: 'a', text: '7,8,9' },
      { id: 'b', text: '9' },
      { id: 'c', text: '1,4,7' },
      { id: 'd', text: '7,8' }
    ],
    correctOptionId: 'a',
    explanation: 'Each row adds one dot to the sequence starting from the first element of that row.',
    category: 'Pattern',
    difficulty: -0.5,
    discrimination: 1.2,
    originalDifficulty: 1
  },
  {
    id: 23,
    domain: 'Pattern',
    text: 'Which cell completes the logical sequence in the matrix?',
    matrix: [
      '1,2,3', '4,5,6', '7,8,9',
      '1,4,7', '2,5,8', '3,6,9',
      '1,5,9', '3,5,7', '?'
    ],
    options: [
      { id: 'a', text: '5' },
      { id: 'b', text: '1,2,3,4,5,6,7,8,9' },
      { id: 'c', text: '2,4,6,8' },
      { id: 'd', text: '1,3,7,9' }
    ],
    correctOptionId: 'a',
    explanation: 'The first row shows horizontal lines, the second row shows vertical lines, and the third row shows diagonals. The intersection of the diagonals is the center dot (5).',
    category: 'Pattern',
    difficulty: 0.8,
    discrimination: 1.8,
    originalDifficulty: 4
  },
  {
    id: 24,
    domain: 'Verbal',
    text: 'BREAD is to FLOUR as BRICK is to...',
    options: [
      { id: 'a', text: 'Wall' },
      { id: 'b', text: 'Clay' },
      { id: 'c', text: 'House' },
      { id: 'd', text: 'Kiln' }
    ],
    correctOptionId: 'b',
    explanation: 'Bread is made from flour, and bricks are made from clay.',
    category: 'Verbal',
    difficulty: -1.5,
    discrimination: 1.2,
    originalDifficulty: 1
  },
  {
    id: 25,
    domain: 'Numeric',
    text: 'What is the next number in the sequence: 1, 4, 9, 16, 25, ...?',
    options: [
      { id: 'a', text: '30' },
      { id: 'b', text: '34' },
      { id: 'c', text: '36' },
      { id: 'd', text: '40' }
    ],
    correctOptionId: 'c',
    explanation: 'The sequence consists of squares of consecutive integers (1², 2², 3², 4², 5², 6²).',
    category: 'Numeric',
    difficulty: 1.0,
    discrimination: 1.5,
    originalDifficulty: 4
  },
  {
    id: 26,
    domain: 'Logic',
    text: 'If all bloops are razzies and all razzies are lurgies, are all bloops lurgies?',
    options: [
      { id: 'a', text: 'Yes' },
      { id: 'b', text: 'No' },
      { id: 'c', text: 'Cannot be determined' },
      { id: 'd', text: 'None of the above' }
    ],
    correctOptionId: 'a',
    explanation: 'This is a transitive relation: if A=B and B=C, then A=C.',
    category: 'Logic',
    difficulty: -0.5,
    discrimination: 1.2,
    originalDifficulty: 2
  },
  {
    id: 27,
    domain: 'Pattern',
    text: 'Which shape completes the pattern?',
    options: [
      { id: 'a', text: 'Option A' },
      { id: 'b', text: 'Option B' },
      { id: 'c', text: 'Option C' },
      { id: 'd', text: 'Option D' }
    ],
    correctOptionId: 'b',
    explanation: 'The pattern follows a 90-degree clockwise rotation.',
    category: 'Pattern',
    difficulty: 0.0,
    discrimination: 1.2,
    originalDifficulty: 3
  },
  {
    id: 28,
    domain: 'Verbal',
    text: 'Which word is the odd one out?',
    options: [
      { id: 'a', text: 'Apple' },
      { id: 'b', text: 'Banana' },
      { id: 'c', text: 'Carrot' },
      { id: 'd', text: 'Date' }
    ],
    correctOptionId: 'c',
    explanation: 'Apple, banana, and date are fruits, while carrot is a vegetable.',
    category: 'Verbal',
    difficulty: -0.5,
    discrimination: 1.2,
    originalDifficulty: 3
  },
  {
    id: 29,
    domain: 'Numeric',
    text: 'If 3x + 5 = 20, what is x?',
    options: [
      { id: 'a', text: '3' },
      { id: 'b', text: '4' },
      { id: 'c', text: '5' },
      { id: 'd', text: '6' }
    ],
    correctOptionId: 'c',
    explanation: '3x = 15, so x = 5.',
    category: 'Numeric',
    difficulty: -1.0,
    discrimination: 1.2,
    originalDifficulty: 2
  },
  {
    id: 30,
    domain: 'Logic',
    text: 'Which of the following must be true if some A are B and all B are C?',
    options: [
      { id: 'a', text: 'All A are C' },
      { id: 'b', text: 'Some A are C' },
      { id: 'c', text: 'No A are C' },
      { id: 'd', text: 'Some C are not A' }
    ],
    correctOptionId: 'b',
    explanation: 'Since some A are B and all B are C, those A that are B must also be C.',
    category: 'Logic',
    difficulty: 1.0,
    discrimination: 1.5,
    originalDifficulty: 4
  },
  {
    id: 31,
    domain: 'Pattern',
    text: 'Which figure is the mirror image of the given shape?',
    options: [
      { id: 'a', text: 'Option A' },
      { id: 'b', text: 'Option B' },
      { id: 'c', text: 'Option C' },
      { id: 'd', text: 'Option D' }
    ],
    correctOptionId: 'c',
    explanation: 'Figure C is the horizontal reflection of the original shape.',
    category: 'Pattern',
    difficulty: -2.0,
    discrimination: 1.2,
    originalDifficulty: 1
  },
  {
    id: 32,
    domain: 'Verbal',
    text: 'What is the synonym of "EPHEMERAL"?',
    options: [
      { id: 'a', text: 'Eternal' },
      { id: 'b', text: 'Transient' },
      { id: 'c', text: 'Substantial' },
      { id: 'd', text: 'Constant' }
    ],
    correctOptionId: 'b',
    explanation: 'Ephemeral means lasting for a very short time, which is synonymous with transient.',
    category: 'Verbal',
    difficulty: 2.0,
    discrimination: 1.8,
    originalDifficulty: 5
  },
  {
    id: 33,
    domain: 'Numeric',
    text: 'What is 15% of 200?',
    options: [
      { id: 'a', text: '20' },
      { id: 'b', text: '25' },
      { id: 'c', text: '30' },
      { id: 'd', text: '35' }
    ],
    correctOptionId: 'c',
    explanation: '0.15 * 200 = 30.',
    category: 'Numeric',
    difficulty: -1.0,
    discrimination: 1.2,
    originalDifficulty: 2
  }
];
