import { NextApiRequest, NextApiResponse } from "next";
import { createHash } from 'crypto';
import { getUser } from "@/libs/db/auth";

async function POST(req:NextApiRequest, res:NextApiResponse) {
    try {
        const token = req.headers.authorization && req.headers.authorization.slice(7);
        if(!token) return res.status(403).json({error: "Not Authorized" });
        
        const user = await getUser(token);
        if(!user) return res.status(403).json({error: "Not Authorized" });
        
        const { password, groupId } = req.body;
        const key = password + groupId;

        const privateKey = createHash('sha256').update(key + process.env.E2E_KEY).digest('hex');
        privateKey.padEnd(32, '0');
        
        return res.status(200).json({ key: privateKey.slice(0, 32) });
    } catch (error) {
        res.status(500).json({error: (error as Error).message});
    }
}


export default function handler( req: NextApiRequest, res: NextApiResponse ) {
      if(req.method == 'POST') return POST(req, res);
      else res.status(404).json({error: 'Invalid Method'});
  }
  