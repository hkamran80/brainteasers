import "../styles/globals.css";
import type { AppProps } from "next/app";
import { createContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import Layout from "../components/Layout";

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

    return (
        <>
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
