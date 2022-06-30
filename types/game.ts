export type QA = {
    category: string;
    question: string;
    answers: string[];
};

export type PlayerScore = { name: string; score: number };

export type Results = {
    question: string;
    correctAnswer: string;
    scoreUpdates: {
        name: string;
        score: number;
        difference: number;
    }[];
};

export type EndResults = {
    finalScores: PlayerScore[];
    maxScorers: PlayerScore[];
};
