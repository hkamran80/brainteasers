import Layout from './Layout';
import { classNames } from '@hkamran/utility-web';
import { useState } from 'react';
import type { QA } from "../types/game";

const QuestionScreen = ({
    qa,
    selectAnswer,
}: {
    qa: QA;
    selectAnswer: (answer: string) => void;
}) => {
    const [answered, setAnswered] = useState<boolean>(false);

    return (
        <Layout width="max-w-5xl">
            <div className="space-y-2">
                <span className="uppercase tracking-widest font-light">
                    {qa.category}
                </span>
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
