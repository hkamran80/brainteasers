import { classNames } from "@hkamran/utility-web";
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { X } from "react-feather";
import Layout from "../components/Layout";
import TextLink from "../components/TextLink";
import { SocketContext } from "./_app";

const Home: NextPage = () => {
    const [username, setUsername] = useState<string>("");
    const [gameId, setGameId] = useState<string>("");
    const [joiningGame, setJoiningGame] = useState<boolean>(false);

    const socket = useContext(SocketContext);
    const { push } = useRouter();

    return (
        <>
            <Head>
                <title>Brainteasers</title>
            </Head>

            <Layout>
                <h1 className="text-5xl text-center">Brainteasers</h1>

                <div className="space-y-5">
                    <div className="bg-indigo-500 text-white w-full p-4 rounded-lg flex flex-col space-y-1">
                        <span className="text-xs uppercase tracking-widest font-light">
                            Username
                        </span>

                        <input
                            type="text"
                            placeholder="Choose a username"
                            className="bg-indigo-500 text-white placeholder:text-gray-300 focus:outline-offset-2 focus:outline-sky-500"
                            value={username}
                            onChange={(e) => {
                                setUsername(e.target.value);
                                socket?.emit("setUsername", e.target.value);
                            }}
                        />
                    </div>

                    <div
                        className={classNames(
                            !joiningGame ? "hidden" : "",
                            "bg-indigo-500 text-white w-full p-4 rounded-lg flex flex-col space-y-1",
                        )}
                    >
                        <div className="flex flex-row">
                            <span className="flex-1 text-xs uppercase tracking-widest font-light">
                                Game ID
                            </span>

                            <button
                                type="button"
                                onClick={() => setJoiningGame(false)}
                            >
                                <X size={16} />
                            </button>
                        </div>

                        <input
                            type="text"
                            placeholder="Enter the game ID"
                            className="bg-indigo-500 text-white placeholder:text-gray-300 focus:outline-offset-2 focus:outline-sky-500"
                            value={gameId}
                            onChange={(e) => setGameId(e.target.value)}
                            maxLength={5}
                        />
                    </div>

                    <div
                        className={classNames(
                            "text-center",
                            !joiningGame
                                ? "grid grid-cols-1 md:grid-cols-2 gap-4"
                                : "",
                        )}
                    >
                        <TextLink
                            href={username ? "/create" : "/#"}
                            className={classNames(
                                "text-white p-4 rounded-lg",
                                joiningGame ? "hidden" : "",
                                !username ? "bg-gray-500" : "bg-sky-500",
                            )}
                        >
                            Create Game
                        </TextLink>

                        <button
                            className="bg-sky-500 disabled:bg-gray-500 text-white p-4 rounded-lg w-full"
                            disabled={joiningGame && !gameId && !username}
                            onClick={() => {
                                if (!joiningGame) {
                                    setJoiningGame(true);
                                } else {
                                    push(`/game/${gameId}`);
                                }
                            }}
                        >
                            Join Game
                        </button>
                    </div>
                </div>
            </Layout>
        </>
    );
};

export default Home;
