import { getUser } from "@/libs/db/auth";
import { dbConnect } from "@/libs/db/connect";
import { getJoinedGroups, joinGroup } from "@/libs/db/group";
import type { NextApiRequest, NextApiResponse } from "next";

const POST = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const { uid, password } = req.body;
        await dbConnect();
        const token = req.headers.authorization && req.headers.authorization.slice(7);
        
        if(!token) return res.status(403).json({error: "Not Authorized" });
        const user = await getUser(token);
        
        if(!user) return res.status(403).json({error: "Not Authorized" });
        const group = await joinGroup(user._id, uid, password);

        return res.status(200).json({ group });
    } catch (error) {
        return res.status(500).json({error: (error as Error).message});
    }
}

const GET = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        await dbConnect();
        const token = req.headers.authorization && req.headers.authorization.slice(7);
        
        if(!token) return res.status(403).json({error: "Not Authorized" });
        const user = await getUser(token);
        
        if(!user) return res.status(403).json({error: "Not Authorized" });
        const groups = await getJoinedGroups(user._id);
        return res.status(200).json({ groups });
    } catch (error) {
        return res.status(500).json({error: (error as Error).message});
    }
}

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse,
  ) {
      if(req.method == 'POST') return POST(req, res);
      if(req.method == 'GET') return GET(req, res);
      else res.status(404).json({error: 'Invalid Method'});
  }
  