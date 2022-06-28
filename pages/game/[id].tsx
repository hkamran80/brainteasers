import Layout from "../../components/Layout";
import { SocketContext } from "../_app";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import type { NextPage } from "next";
import { classNames } from "@hkamran/utility-web";
import WaitingRoom from "../../components/WaitingRoom";
import QuestionScreen from "../../components/QuestionScreen";
import type { PlayerScore, QA, Results } from "../../types/game";

const Game: NextPage = () => {
    const [gameStarted, setGameStarted] = useState<boolean>(false);
    const [showQuestion, setShowQuestion] = useState<boolean>(true);
    const [gameCategories, setGameCategories] = useState<string[]>([]);
    const [players, setPlayers] = useState<{
        [friendlyName: string]: number;
    }>({});
    const [maxScore, setMaxScore] = useState<number>(0);

    const [qa, setQA] = useState<{
        category: string;
        question: string;
        answers: string[];
    }>();
    const [answer, setAnswer] = useState<string>("");
    const [results, setResults] = useState<Results>({
        question: "",
        correctAnswer: "",
        scoreUpdates: [],
    });

    const [finalResults, setFinalResults] = useState<{
        finalScores: PlayerScore[];
        maxScorers: PlayerScore[];
    }>();

    const { query, push } = useRouter();
    const { id } = query;

    const socket = useContext(SocketContext);

    useEffect(() => {
        if (id) {
            socket?.emit("joinGame", id);
        }

        socket?.once("gameError", () => {
            push("/");
        });

        socket?.on(
            "joinSuccessful",
            (
                categories: string[],
                maxScore: number,
                players: {
                    [friendlyName: string]: number;
                },
            ) => {
                setGameCategories(categories);
                setMaxScore(maxScore);
                setPlayers(players);
            },
        );

        socket?.on("question", (qa: QA) => {
            if (!gameStarted) {
                setGameStarted(true);
            }

            setShowQuestion(true);
            setAnswer("");
            setQA(qa);
        });

        socket?.on("results", (question, correctAnswer, scoreUpdates) => {
            setShowQuestion(false);
            setResults({ question, correctAnswer, scoreUpdates });
        });

        socket?.on(
            "gameOver",
            (finalScores: PlayerScore[], maxScorers: PlayerScore[]) => {
                const maxScorerNames = maxScorers.map(({ name }) => name);
                const newFinalScores = finalScores.filter(
                    ({ name }) => maxScorerNames.indexOf(name) === -1,
                );

                setFinalResults({ finalScores: newFinalScores, maxScorers });
            },
        );
    }, [gameStarted, id, push, socket]);

    return (
        <>
            {!gameStarted && !finalResults ? (
                <WaitingRoom
                    id={id as string}
                    gameCategories={gameCategories}
                    maxScore={maxScore}
                    players={Object.keys(players)}
                    nextQuestion={() => socket?.emit("nextQuestion", id)}
                    deleteGame={() =>
                        confirm("Are you sure you want to delete this game?")
                            ? socket?.emit("endGame", id as string)
                            : null
                    }
                />
            ) : (
                <>
                    {finalResults ? (
                        <Layout className="space-y-5">
                            <h1 className="text-5xl text-left">Brainteasers</h1>

                            {finalResults.maxScorers.length > 0 ? (
                                <>
                                    <h2 className="text-2xl font-medium">
                                        Winner
                                        {finalResults.maxScorers.length !== 1
                                            ? "s"
                                            : ""}
                                    </h2>

                                    <div className="py-0 space-y-4">
                                        {finalResults.maxScorers.map(
                                            ({ name, score }, index) => (
                                                <div
                                                    key={index}
                                                    className="bg-indigo-500 text-white w-full p-4 flex flex-row items-center rounded-lg"
                                                >
                                                    <div className="flex-1">
                                                        <p className="font-medium">
                                                            {name}
                                                        </p>
                                                        <p className="text-xs uppercase tracking-widest font-light">
                                                            {score} points
                                                        </p>
                                                    </div>
                                                </div>
                                            ),
                                        )}
                                    </div>
                                </>
                            ) : (
                                ""
                            )}

                            <h2 className="text-2xl font-medium">
                                {finalResults.maxScorers.length > 0
                                    ? "Other "
                                    : ""}
                                Players
                            </h2>
                            <div className="py-0 space-y-4">
                                {finalResults.finalScores
                                    .sort(
                                        (
                                            { score: scoreA },
                                            { score: scoreB },
                                        ) => scoreB - scoreA,
                                    )
                                    .map(({ name, score }, index) => (
                                        <div
                                            key={index}
                                            className="bg-indigo-500 text-white w-full p-4 flex flex-row items-center rounded-lg"
                                        >
                                            <div className="flex-1">
                                                <p className="font-medium">
                                                    {name}
                                                </p>
                                                <p className="text-xs uppercase tracking-widest font-light">
                                                    {score} points
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                            </div>

                            <button
                                type="button"
                                className="bg-sky-500 text-white p-4 rounded-lg text-center w-full"
                                onClick={() => push("/")}
                            >
                                Return Home
                            </button>
                        </Layout>
                    ) : (
                        <>
                            {showQuestion ? (
                                // <Layout width="max-w-5xl">
                                //     <div className="space-y-2">
                                //         <span className="uppercase tracking-widest font-light">
                                //             {qa?.category}
                                //         </span>
                                //         <h1 className="text-4xl font-bold">
                                //             {qa?.question}
                                //         </h1>
                                //     </div>

                                //     <div className="space-y-2">
                                //         {qa?.answers.map((answer, index) => (
                                //             <button
                                //                 key={index}
                                //                 type="button"
                                //                 className={classNames(
                                //                     "text-white p-4 rounded-lg text-left w-full",
                                //                     !answered
                                //                         ? "bg-sky-500 hover:bg-sky-700 transition-colors duration-150 ease-in-out"
                                //                         : "bg-gray-500",
                                //                 )}
                                //                 disabled={answered}
                                //                 onClick={() => {
                                //                     setAnswered(true);
                                //                     setAnswer(answer);
                                //                     socket?.emit(
                                //                         "answer",
                                //                         id,
                                //                         answer,
                                //                     );
                                //                 }}
                                //             >
                                //                 {answer}
                                //             </button>
                                //         ))}
                                //     </div>
                                // </Layout>
                                <QuestionScreen
                                    qa={qa as QA}
                                    selectAnswer={(answer) => {
                                        setAnswer(answer);
                                        socket?.emit("answer", id, answer);
                                    }}
                                />
                            ) : (
                                <Layout className="space-y-5">
                                    <h1 className="text-5xl text-left">
                                        Brainteasers
                                    </h1>

                                    <p className="text-2xl font-medium">
                                        {results.question}
                                    </p>

                                    <div className="space-y-2">
                                        <p className="text-2xl">
                                            Answer:{" "}
                                            <span className="font-bold">
                                                {results.correctAnswer}
                                            </span>
                                        </p>

                                        <p className="text-2xl">
                                            You answered:{" "}
                                            <span
                                                className={classNames(
                                                    "font-bold",
                                                    answer ===
                                                        results.correctAnswer
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
                                            (
                                                { name, score, difference },
                                                index,
                                            ) => (
                                                <div
                                                    key={index}
                                                    className="bg-indigo-500 text-white w-full p-4 flex flex-row items-center rounded-lg"
                                                >
                                                    <div className="flex-1">
                                                        <p className="font-medium">
                                                            {name}
                                                        </p>
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
                                        onClick={() =>
                                            socket?.emit("nextQuestion", id)
                                        }
                                    >
                                        Next Question
                                    </button>

                                    <button
                                        type="button"
                                        className="bg-red-500 text-white p-4 rounded-lg text-center w-full"
                                        onClick={() =>
                                            confirm(
                                                "Are you sure you want to end this game?",
                                            )
                                                ? socket?.emit("endGame", id)
                                                : null
                                        }
                                    >
                                        End Game
                                    </button>
                                </Layout>
                            )}
                        </>
                    )}
                </>
            )}
        </>
    );
};

export default Game;
