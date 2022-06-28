import Layout from "./Layout";
import { useRouter } from "next/router";
import type { EndResults } from "../types/game";

const FinalResults = ({ finalResults }: { finalResults: EndResults }) => {
    const { push } = useRouter();

    return (
        <Layout className="space-y-5">
            <h1 className="text-5xl text-left">Brainteasers</h1>

            {finalResults.maxScorers.length > 0 ? (
                <>
                    <h2 className="text-2xl font-medium">
                        Winner
                        {finalResults.maxScorers.length !== 1 ? "s" : ""}
                    </h2>

                    <div className="py-0 space-y-4">
                        {finalResults.maxScorers.map(
                            ({ name, score }, index) => (
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
                                </div>
                            ),
                        )}
                    </div>
                </>
            ) : (
                ""
            )}

            <h2 className="text-2xl font-medium">
                {finalResults.maxScorers.length > 0 ? "Other " : ""}
                Players
            </h2>
            <div className="py-0 space-y-4">
                {finalResults.finalScores
                    .sort(
                        ({ score: scoreA }, { score: scoreB }) =>
                            scoreB - scoreA,
                    )
                    .map(({ name, score }, index) => (
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
    );
};

export default FinalResults;
