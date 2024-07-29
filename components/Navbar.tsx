import { userUserLoaded, useUser } from "@/hooks/useUser";
import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
    const [user, _] = useUser();
    const [loaded, setLoaded] = userUserLoaded();

    return (
        <div className="px-4 py-1 bg-gray-950 shadow flex justify-between items-center">
            <Link href={user ? "/dashboard" : "/"} className="w-fit flex justify-center items-center gap-4">
                <Image src={'/logo.svg'} alt="Navbar Logo" width={240} height={100} />
            </Link>

            {
                !loaded ? <span className="text-xs">Loading</span>
                :
                user ? <button className="rounded-full bg-slate-50 shadow h-8 w-8">{user.name[0]}</button> : ""
            }
        </div>
    )
}
