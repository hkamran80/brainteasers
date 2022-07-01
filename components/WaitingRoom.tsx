import Layout from "./Layout";
import categories from "../data/categories.json";

const names = Object.keys(categories);

const WaitingRoom = ({
    id,
    gameCategories,
    maxScore,
    players,
    nextQuestion,
    deleteGame,
}: {
    id: string;
    gameCategories: string[];
    maxScore: number;
    players: string[];
    nextQuestion: () => void;
    deleteGame: () => void;
}) => {
    return (
        <Layout className="space-y-5">
            <h1 className="text-5xl text-left">Brainteasers</h1>

            <div className="space-y-2">
                <h2 className="text-2xl font-medium">Join Code</h2>
                <button
                    type="button"
                    className="font-bold"
                    onClick={() => navigator.clipboard.writeText(id as string)}
                >
                    {id}
                </button>
            </div>

            <h2 className="text-2xl font-medium">Categories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {Object.values(categories)
                    .map((ids, index) => {
                        return { id: ids[0], index };
                    })
                    .filter(({ id }) => gameCategories.indexOf(id) !== -1)
                    .map(({ index }) => names[index])
                    .map((name, index) => (
                        <div
                            key={index}
                            className="bg-indigo-500 dark:bg-indigo-700 text-white w-full px-4 py-2 rounded-lg"
                        >
                            {name}
                        </div>
                    ))}
            </div>

            <div className="space-y-2">
                <h2 className="text-2xl font-medium">
                    Maximum Number of Correct Questions
                </h2>
                <p>
                    {maxScore === 0
                        ? "No maximum number of correct questions set. The game will continue until a player stops it."
                        : `${(maxScore / 100)
                              .toString()
                              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")} questions`}
                </p>
            </div>

            <h2 className="text-2xl font-medium">Players</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {players.map((name, index) => (
                    <div
                        key={index}
                        className="bg-indigo-500 dark:bg-indigo-700 text-white w-full px-4 py-2 rounded-lg"
                    >
                        {name}
                    </div>
                ))}
            </div>

            <button
                type="button"
                className="bg-sky-500 disabled:bg-gray-500 text-white p-4 rounded-lg text-center w-full"
                disabled={Object.keys(players).length < 2}
                onClick={nextQuestion}
            >
                Start Game
            </button>

            <button
                type="button"
                className="bg-red-500 text-white p-4 rounded-lg text-center w-full"
                onClick={deleteGame}
            >
                Delete Game
            </button>
        </Layout>
    );
};

export default WaitingRoom;
