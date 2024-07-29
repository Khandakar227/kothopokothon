import { useEffect, useState } from "react"

export default function MembersInfo({groupId, show, close}:{groupId:string, show:boolean, close:()=>void}) {
  const [members, setMembers] = useState([] as { _id: string, name: string }[]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const options = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };  
    fetch(`/api/group/members?id=${groupId}`, options)
      .then(response => response.json())
      .then(response => {
        setMembers(response.users || []);
      })
      .catch(err => console.error(err));
  }, [groupId])
  return (
    <dialog className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 h-screen w-screen flex justify-center items-center" open={show}>
      <div className="bg-white rounded shadow p-4 min-w-56">
        <p className="text-lg font-semibold border-b pb-2">Members</p>
        <ul>
        {
          members.map((member, i) => <li key={member._id} className="border-b py-2 w-full">{i+1}. {member.name}</li>)
        }
        </ul>
        <div className="text-end w-full pt-4"><button onClick={close} className="px-2 py-1 rounded bg-black text-white">Close</button></div>
      </div>
    </dialog>
  )
}
