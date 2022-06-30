import Layout from "../../components/Layout";
import { SocketContext } from "../_app";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import type { NextPage } from "next";
import { classNames } from "@hkamran/utility-web";
import WaitingRoom from "../../components/WaitingRoom";
import QuestionScreen from "../../components/QuestionScreen";
import type { PlayerScore, QA, Results } from "../../types/game";
import FinalResults from "../../components/FinalResults";
import QuestionResults from "../../components/QuestionResults";
import Head from "next/head";

const Game: NextPage = () => {
    const [joinedGame, setJoinedGame] = useState<boolean>(false);
    const [gameStarted, setGameStarted] = useState<boolean>(false);
    const [showQuestion, setShowQuestion] = useState<boolean>(true);
    const [gameCategories, setGameCategories] = useState<string[]>([]);
    const [players, setPlayers] = useState<string[]>([]);
    const [maxScore, setMaxScore] = useState<number>(0);
    const [autoAdvance, setAutoAdvance] = useState<boolean>(false);
    const [timeLimit, setTimeLimit] = useState<boolean>(false);

    const [qa, setQA] = useState<{
        category: string;
        question: string;
        answers: string[];
    }>();
    const [answer, setAnswer] = useState<string | null>("");
    const [timeoutUsed, setTimeoutUsed] = useState<boolean>(false);
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
        if (id && !joinedGame) {
            socket?.emit("checkUsername");
            socket?.emit("joinGame", id);
            setJoinedGame(true);
        }

        socket?.once("gameError", () => {
            push("/");
        });

        socket?.once("usernameError", () => push("/"));

        socket?.on(
            "joinSuccessful",
            (
                categories: string[],
                maxScore: number,
                autoAdvance: boolean,
                players: {
                    [friendlyName: string]: number;
                },
            ) => {
                setGameCategories(categories);
                setMaxScore(maxScore);
                setPlayers(Object.keys(players));
                setAutoAdvance(autoAdvance);
            },
        );

        socket?.on("question", (qa: QA) => {
            if (!gameStarted) {
                setGameStarted(true);
            }

            setShowQuestion(true);
            setAnswer("");
            setQA(qa);
            setTimeoutUsed(false);
        });

        socket?.on("questionOver", () => {
            console.debug("Question over!");

            if ((answer === "" || answer === null) && !timeoutUsed) {
                setTimeoutUsed(true);
                setAnswer(null);
                socket?.emit("answer", id, null);
                console.debug("Answer set to `null`");
            }
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
    }, [answer, gameStarted, id, joinedGame, push, socket, timeoutUsed]);

    return (
        <>
            <Head>
                {/* TODO: Store username globally */}
                <title>Game | Brainteasers</title>
            </Head>

            {!gameStarted && !finalResults ? (
                <WaitingRoom
                    id={id as string}
                    gameCategories={gameCategories}
                    maxScore={maxScore}
                    players={players}
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
                        <FinalResults finalResults={finalResults} />
                    ) : (
                        <>
                            {showQuestion ? (
                                <QuestionScreen
                                    qa={qa as QA}
                                    timeLimit={timeLimit}
                                    selectAnswer={(answer) => {
                                        setAnswer(answer);
                                        socket?.emit("answer", id, answer);
                                    }}
                                />
                            ) : (
                                <QuestionResults
                                    results={results}
                                    answer={answer}
                                    category={qa?.category as string}
                                    maxScore={maxScore}
                                    autoAdvance={autoAdvance}
                                    nextQuestion={() =>
                                        socket?.emit("nextQuestion", id)
                                    }
                                    endGame={() =>
                                        confirm(
                                            "Are you sure you want to end this game?",
                                        )
                                            ? socket?.emit("endGame", id)
                                            : null
                                    }
                                />
                            )}
                        </>
                    )}
                </>
            )}
        </>
    );
};

export default Game;
