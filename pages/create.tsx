import { classNames } from "@hkamran/utility-web";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import Checkbox from "../components/Checkbox";
import Layout from "../components/Layout";

import categories from "../data/categories.json";
import { SocketContext } from "./_app";

const CreateGame: NextPage = () => {
    const [checkedCategories, setCheckedCategories] = useState<boolean[]>(
        Array.from({ length: Object.keys(categories).length }, () => false),
    );
    const [reload, setReload] = useState<boolean>(false);
    const [maxScore, setMaxScore] = useState<number>(0);

    const socket = useContext(SocketContext);
    const { push } = useRouter();

    if (socket) {
        socket.once("gameCreated", (gameRoomId: string) =>
            push({ pathname: `${gameRoomId}` }),
        );
    }

    return (
        <Layout>
            <div className="text-left space-y-1">
                <h1 className="text-5xl">Brainteasers</h1>
                <h2 className="text-2xl">Create Game</h2>
            </div>

            <div className="space-y-3">
                {Object.entries(categories).map(([category], index) => (
                    <Checkbox
                        key={index}
                        label={category}
                        state={checkedCategories[index]}
                        setState={(value) => {
                            const newCheckedCategories = checkedCategories;
                            newCheckedCategories[index] = value;

                            setCheckedCategories(newCheckedCategories);
                            setReload(!reload);
                        }}
                    />
                ))}
            </div>

            <div className="bg-indigo-500 text-white w-full p-4 rounded-lg flex flex-col space-y-1">
                <span className="text-xs uppercase tracking-widest font-light">
                    Maximum Score
                </span>

                <input
                    type="number"
                    placeholder="Set a max score"
                    className="bg-indigo-500 text-white placeholder:text-gray-300 focus:outline-offset-2 focus:outline-sky-500"
                    value={maxScore}
                    onChange={(e) => setMaxScore(Number(e.target.value))}
                    step={100}
                />

                <span className="text-xs font-light">
                    100 points per correct question. No points stripped for
                    incorrect answers. Set to 0 for no maximum score.
                </span>
            </div>

            <button
                type="button"
                className="bg-sky-500 disabled:bg-gray-500 text-white p-4 rounded-lg text-center w-full"
                disabled={
                    checkedCategories.filter((category) => category !== false)
                        .length === 0 || maxScore < 0
                }
                onClick={() => {
                    const categoryIds = Object.values(categories);

                    socket?.emit(
                        "createGame",
                        checkedCategories
                            .map((value, index) => (value ? index : false))
                            .filter((category) => category !== false)
                            .map(
                                (categoryIndex) =>
                                    categoryIds[categoryIndex as number][0],
                            ),
                        maxScore,
                    );
                }}
            >
                Create Game
            </button>
        </Layout>
    );
};

export default CreateGame;
