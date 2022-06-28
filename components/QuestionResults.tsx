import { classNames } from "@hkamran/utility-web";
import type { Results } from "../types/game";
import Layout from "./Layout";

const QuestionResults = ({
    results,
    answer,
    nextQuestion,
    endGame,
}: {
    results: Results;
    answer: string;
    nextQuestion: () => void;
    endGame: () => void;
}) => {
    return (
        <Layout className="space-y-5">
            <h1 className="text-5xl text-left">Brainteasers</h1>

            <p className="text-2xl font-medium">{results.question}</p>

            <div className="space-y-2">
                <p className="text-2xl">
                    Answer:{" "}
                    <span className="font-bold">{results.correctAnswer}</span>
                </p>

                <p className="text-2xl">
                    You answered:{" "}
                    <span
                        className={classNames(
                            "font-bold",
                            answer === results.correctAnswer
                                ? "text-green-500"
                                : "text-red-500",
                        )}
                    >
                        {answer}
                    </span>
                </p>
            </div>

            <div className="py-10 space-y-4">
                {results.scoreUpdates.map(
                    ({ name, score, difference }, index) => (
                        <div
                            key={index}
                            className="bg-indigo-500 text-white w-full p-4 flex flex-row items-center rounded-lg"
                        >
                            <div className="flex-1">
                                <p className="font-medium">{name}</p>
                                <p className="text-xs uppercase tracking-widest font-light">
                                    {score} points
                                </p>
                            </div>

                            {difference !== 0 ? (
                                <p className="text-sm uppercase tracking-widest font-light">
                                    +{difference} points
                                </p>
                            ) : (
                                ""
                            )}
                        </div>
                    ),
                )}
            </div>

            <button
                type="button"
                className="bg-sky-500 text-white p-4 rounded-lg text-center w-full"
                onClick={nextQuestion}
            >
                Next Question
            </button>

            <button
                type="button"
                className="bg-red-500 text-white p-4 rounded-lg text-center w-full"
                onClick={endGame}
            >
                End Game
            </button>
        </Layout>
    );
};

export default QuestionResults;
