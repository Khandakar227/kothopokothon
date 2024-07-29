import { getUser } from "@/libs/db/auth";
import { dbConnect } from "@/libs/db/connect";
import type { NextApiRequest, NextApiResponse } from "next";

const GET = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      await dbConnect();
      const token = req.headers.authorization && req.headers.authorization.slice(7);
      if(!token) return res.status(403).json({error: "Not Authorized" });
      const user = await getUser(token);
      return res.status(200).json({ message: 'Ok', user });
    } catch (error) {
      console.log(error);
      return res.status(403).json({error: (error as Error).message});
    }
  }
  

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
    if(req.method == 'GET') return GET(req, res);
    else res.status(404).json({error: 'Invalid Method'});
}
