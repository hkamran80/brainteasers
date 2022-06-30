import Layout from "./Layout";
import { classNames } from "@hkamran/utility-web";
import { useEffect, useState } from "react";
import type { QA } from "../types/game";

const QuestionScreen = ({
    qa,
    timeLimit,
    selectAnswer,
}: {
    qa: QA;
    timeLimit: boolean;
    selectAnswer: (answer: string) => void;
}) => {
    const [answered, setAnswered] = useState<boolean>(false);
    const [timeRemaining, setTimeRemaining] = useState<number>(7);

    useEffect(() => {
        if (timeLimit) {
            const timeInterval = setInterval(() => {
                if (timeRemaining <= 0) {
                    clearInterval(timeInterval);
                } else {
                    setTimeRemaining(timeRemaining - 1);
                }
            }, 1000);
        }
    }, [timeLimit, timeRemaining]);

    return (
        <Layout width="max-w-5xl">
            <div className="space-y-2">
                <div className="flex flex-row">
                    <span className="flex-1 uppercase tracking-widest font-light">
                        {qa.category}
                    </span>

                    {timeLimit ? <span>{timeRemaining}</span> : ""}
                </div>

                <h1 className="text-4xl font-bold">{qa.question}</h1>
            </div>

            <div className="space-y-2">
                {qa.answers.map((answer, index) => (
                    <button
                        key={index}
                        type="button"
                        className={classNames(
                            "text-white p-4 rounded-lg text-left w-full",
                            !answered
                                ? "bg-sky-500 hover:bg-sky-700 transition-colors duration-150 ease-in-out"
                                : "bg-gray-500",
                        )}
                        disabled={answered}
                        onClick={() => {
                            setAnswered(true);
                            selectAnswer(answer);
                        }}
                    >
                        {answer}
                    </button>
                ))}
            </div>
        </Layout>
    );
};

export default QuestionScreen;
