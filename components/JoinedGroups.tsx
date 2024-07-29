import Link from "next/link";
import { useEffect, useState } from "react"

export default function JoinedGroups() {
    const [groups, setGroups] = useState([] as { _id:string, name: string, createdAt: string, uid: string }[]);

    useEffect(() => {
        const options = {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          };
          
          fetch('/api/join', options)
            .then(response => response.json())
            .then(response => {
                console.log(response)
                if(response.error) { alert(response.error);return; }
                setGroups(response.groups);
            })
            .catch(err => console.error(err));
    }, [])

    return (
        <div className="p-4">
            <div className="shadow rounded-md p-4 bg-white">
                <h1 className="text-2xl font-semibold">Joined Groups</h1>
                <hr className="my-4" />
                <div className="p-4 flex justify-start items-center gap-4">
                    {
                        groups.map(group =>
                            <div className="shadow rounded-md p-4 bg-white" key={group._id}>
                                <Link href={`/group/${group._id}`} className="hover:underline font-semibold text-xl">{group.name}</Link>
                                <p>UID: {group.uid}</p>
                                <p className="text-xs text-gray-400">{group._id}</p>
                            </div>)
                    }
                </div>
            </div>
        </div>
    )
}
