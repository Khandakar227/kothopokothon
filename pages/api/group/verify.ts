import { getUser } from "@/libs/db/auth";
import { dbConnect } from "@/libs/db/connect";
import { checkGroupPass } from "@/libs/db/group";
import type { NextApiRequest, NextApiResponse } from "next";

const POST = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const { password } = req.body;
      const { id } = req.query;
      
      await dbConnect();
      const token = req.headers.authorization && req.headers.authorization.slice(7);
      if(!token) return res.status(403).json({error: "Not Authorized" });
      
      const check = await checkGroupPass(id as string, password);
      if(check) return res.status(200).json({message: 'Correct'});
      return res.status(400).json({error: 'Incorrect Password'});
      
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
      else res.status(404).json({error: 'Invalid Method'});
  }
  