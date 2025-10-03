import React, { createContext, useContext, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

const API_URL = process.env.EXPO_PUBLIC_API_SERVER;

const SocketContext = createContext<Socket | null>(null);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        socketRef.current = io(API_URL);
        return () => {
            socketRef.current?.disconnect();
        };
    }, []);

    return (
        <SocketContext.Provider value={socketRef.current}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => useContext(SocketContext);