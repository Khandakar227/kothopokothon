import { atom, useAtom } from 'jotai';

type User = {
    name:string,
    _id: string,
    createdAt: Date
}

const userAtom = atom<User | null>(null);
const userLoadedAtom = atom(false);

export const useUser = () => useAtom(userAtom);
export const userUserLoaded = () => useAtom(userLoadedAtom);