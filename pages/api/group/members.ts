import { getUser } from "@/libs/db/auth";
import { dbConnect } from "@/libs/db/connect";
import { getMembers } from "@/libs/db/group";
import type { NextApiRequest, NextApiResponse } from "next";

const POST = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
     return res.status(201).json({message: ''});
    } catch (error) {
      console.log(error);
      return res.status(500).json({error: (error as Error).message});
    }
  }
  
const GET = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const {id} = req.query;
        await dbConnect();
        if(!id) return res.status(500).json({error: "Id missing"});

        const token = req.headers.authorization && req.headers.authorization.slice(7);
        if(!token) return res.status(403).json({error: "Not Authorized" });
        const user = await getUser(token);
        if(!user) return res.status(403).json({error: "Not Authorized" });
        const users = await getMembers(id as string);
        return res.status(200).json({users})
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: (error as Error).message});
    }
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
    if(req.method == 'POST') return POST(req, res);
    else if(req.method == 'GET') return GET(req, res);
    else res.status(404).json({error: 'Invalid Method'});
}
