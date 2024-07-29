import Navbar from "@/components/Navbar";
import Head from "next/head";
import { Inter } from "next/font/google";
import CreatedGroups from "@/components/CreatedGroups";
import JoinedGroups from "@/components/JoinedGroups";

const inter = Inter({ subsets: ["latin"] });

export default function Dashboard() {

    function joinGroup() {
        const uid = prompt("Group UID:");
        if(!uid) return;
        const password = prompt("Password");
        if(!password) alert('Password must not be empty.');
        else {
            const options = { method: 'POST',
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({uid, password})
              };
              
              fetch('/api/join', options)
                .then(response => response.json())
                .then(response => {
                    console.log(response)
                    window.location.reload();
                })
                .catch(err => console.error(err));
        }
    }

    function createGroup() {
        const groupName = prompt("Group Name:");
        if(!groupName) return;
        const password = prompt("Password");
        if(!password) alert('Password must not be empty.');
        else {
            const options = { method: 'POST',
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({name:groupName, password})
              };
              
              fetch('/api/group', options)
                .then(response => response.json())
                .then(response => {
                    console.log(response)
                    window.location.reload();
                })
                .catch(err => console.error(err));
        }
    }

    return (
        <>
            <Head>
                <title> Dashboard - Kothopokothon </title>
                <link rel="shortcut icon" href="favicon.png" type="image/png" />
            </Head>
            <div className={"min-h-screen " + inter.className}>
                <Navbar />
                <div className="py-12 px-4 min-h-full">
                    <div className="flex flex-wrap justify-end gap-4 items-center">
                        <button onClick={createGroup} className="px-4 py-2 rounded-md border border-zinc-900 shadow hover:bg-zinc-900 hover:text-white">Create a Group</button>
                        <button onClick={joinGroup} className="px-4 py-2 rounded-md border border-zinc-900 shadow hover:bg-zinc-900 hover:text-white">Join a Group</button>
                    </div>
                    <CreatedGroups/>
                    <JoinedGroups/>
                </div>
            </div>
        </>
    );
}