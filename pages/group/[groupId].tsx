import Navbar from "@/components/Navbar";
import { useSocket } from "@/hooks/useSocket";
import { useUser } from "@/hooks/useUser";
import { toDateTimeFormat } from "@/libs";
import { Inter } from "next/font/google";
import Head from "next/head";
import { useRouter } from "next/router";
import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react"

const inter = Inter({ subsets: ["latin"] });

type Chat = { groupId: string, username: string, userId: string, message: string, _id: string, createdAt:string };

export default function Group() {
    const buttonRef = useRef({} as HTMLButtonElement);
    const router = useRouter();
    const [group, setGroup] = useState<{_id: string, name: string, uid:string, ceatedAt:string}>();
    const [socket, ] = useSocket();
    const [user, _] = useUser();
    const [chats, setChats] = useState([] as Chat[]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const groupId = router.query.groupId;
        if (!groupId) return;
        fetch(`/api/group?id=${groupId}`)
            .then(response => response.json())
            .then(response => {
                console.log(response);
                if(response.error) return alert(response.error);
                setGroup(response);
            })
            .catch(err => console.error(err));

        fetch(`/api/chats?groupId=${groupId}`, { headers: { Authorization: `Bearer ${token}` } })
            .then(res => res.json())
            .then(data => {
                setChats(data.chats || [])
            })
            .catch(err => console.log(err))
    }, [router.query.groupId])

    useEffect(() => {
        if(!socket || !group?._id) return;
        socket.emit('join-group', {groupId: router.query.groupId}) 
        socket.on('message', onMessage);

        return () => {
            socket.off('message', onMessage);
        }  
    }, [socket, group])

    function onMessage(data:any) {
        setChats((prev) => [...prev, data]);
        setTimeout(() => {
            if(document.body.scrollHeight - Math.ceil(window.scrollY + window.innerHeight) <= 250) window.scrollTo(0, document.body.scrollHeight);
        }, 300)
    }

    function onSendMessage(e:FormEvent) {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(e.target as HTMLFormElement));
        if (!(data.message as string).trim()) return;
        if(!socket) return alert("Something went wrong. Try reloading.");
        socket.emit('message', {groupId: router.query.groupId, ...data});
        (e.target as HTMLFormElement).reset();
    }

    function handleKeypress(e:KeyboardEvent) {
        if(e.key == 'Enter' && !e.shiftKey) {
            e.preventDefault();
            buttonRef.current.click();
        }
    }
    return (
        <>
        <Head>
            <title> {group?.name ? (group?.name + " - ") : ""} Group - Kothopokothon </title>
            <link rel="shortcut icon" href="favicon.png" type="image/png" />
        </Head>
        <div className={"min-h-screen " + inter.className}>
            <Navbar />
            <div className="pt-12 px-4 min-h-full">
                {
                    group && (
                        <>
                            <h1 className="text-xl font-bold">{group?.name}</h1>
                            <p className="text-sm text-gray-600">UID: {group?.uid}</p>
                            <hr />
                            <div className="min-h-screen">
                                {
                                    chats.map(chat =>
                                    <div className={`flex items-center ${chat.userId == user?._id ? "justify-end pl-8" : "pr-8"} w-full p-4`} key={chat._id}>
                                        <div className={`w-fit py-1 px-2 shadow rounded ${chat.userId == user?._id ? "bg-gray-400" : "bg-white"}`}>
                                            <p className={`text-xs pb-1 font-semibold ${chat.userId == user?._id ? 'text-end' : ''}`}>{chat.username}</p>
                                            <p className="whitespace-pre-wrap">{chat.message}</p>
                                            <p className={`text-[9px] text-gray-800 ${chat.userId == user?._id ? 'text-end' : ''}`}>{toDateTimeFormat(chat.createdAt)}</p>
                                        </div>
                                    </div>
                                    )
                                }
                            </div>
                            <form onSubmit={onSendMessage} className="sticky bottom-0 flex items-center gap-4">
                                <textarea onKeyDown={handleKeypress} name="message" id="message" className="min-h-14 max-h-20 border w-full shadow rounded-md outline-none px-4 py-2 resize-y"></textarea>
                                <button ref={buttonRef} className="my-4 px-4 py-2 bg-gray-950 rounded-md text-white">Send</button>
                            </form>
                        </>

                    )
                }
            </div>
        </div>
        </>
    )
}
