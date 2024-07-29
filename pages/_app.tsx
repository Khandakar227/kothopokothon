import { userUserLoaded, useUser } from "@/hooks/useUser";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";

import { io } from "socket.io-client";
import { useSocket } from "@/hooks/useSocket";

export default function App({ Component, pageProps }: AppProps) {
  const [_, setUser] = useUser();
  const [__, setLoaded] = userUserLoaded();
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useSocket();

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('http://localhost:3000/api/user', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(response => response.json())
    .then(response => {
      setUser(response.user);
    })
    .catch(err => console.error(err))
    .finally(() => setLoaded(true));
  }, [])

  useEffect(() => {
    setSocket(io({ auth: { token: localStorage.getItem('token') } }) );
  }, [])
  useEffect(() => {
      if (!socket) return;
      if (socket.connected) {
          onConnect();
      }

      function onConnect() {
          if (!socket) return;
          setIsConnected(true);
      }
      function onDisconnect() {
          setIsConnected(false);
      }
      socket.on("connect", onConnect);
      socket.on("disconnect", onDisconnect);
      return () => {
          socket.off("connect", onConnect);
          socket.off("disconnect", onDisconnect);
      };
  }, [socket]);

  
  return <Component {...pageProps} />;
}
