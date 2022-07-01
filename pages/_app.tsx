import "../styles/globals.css";
import type { AppProps } from "next/app";
import { createContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import Layout from "../components/Layout";
import { useRouter } from "next/router";
import Script from "next/script";
import useDarkMode from "use-dark-mode";
import { Moon, Sun } from "react-feather";

export const SocketContext = createContext<Socket | null>(null);

function Website({ Component, pageProps }: AppProps) {
    const [socket, setSocket] = useState<Socket>();

    useEffect(() => {
        const socketInitializer = async () => {
            const socket = io(process.env.NEXT_PUBLIC_SOCKET_SERVER as string);

            socket.on("connect", () => {
                console.log("Socket connected!", socket.id);
            });

            setSocket(socket);
        };

        socketInitializer();
    }, []);

    const { value: darkModeValue, toggle: toggleDarkMode } = useDarkMode(
        false,
        {
            classNameDark: "dark",
            classNameLight: "light",
            element:
                typeof window !== "undefined"
                    ? document.documentElement
                    : undefined,
        },
    );

    return (
        <>
            {process.env.NODE_ENV === "development" ||
            typeof window === "undefined" ? (
                ""
            ) : (
                <Script
                    async
                    defer
                    data-website-id="62279a82-47a7-46fe-aef5-ad522da274ea"
                    src="https://umami.unisontech.org/umami.js"
                />
            )}

            <div className="absolute top-8 right-8">
                <button
                    type="button"
                    onClick={() => {
                        console.debug("Toggling", darkModeValue);
                        toggleDarkMode();
                        console.debug("Toggled", darkModeValue);
                    }}
                >
                    {darkModeValue ? <Sun size={20} /> : <Moon size={20} />}
                </button>
            </div>

            {socket ? (
                <SocketContext.Provider value={socket}>
                    <Component {...pageProps} />
                </SocketContext.Provider>
            ) : (
                <Layout>
                    <div className="text-left space-y-1">
                        <h1 className="text-5xl">Brainteasers</h1>
                        <h2 className="text-2xl">Connecting to server...</h2>
                    </div>
                </Layout>
            )}
        </>
    );
}

export default Website;
