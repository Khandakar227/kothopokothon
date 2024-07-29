import { atom, useAtom } from 'jotai';
import { Socket } from 'socket.io-client';

const socketAtom = atom<Socket>();
export const useSocket = () => useAtom(socketAtom);
