import { login } from "@/libs/db/auth";
import { dbConnect } from "@/libs/db/connect";
import type { NextApiRequest, NextApiResponse } from "next";

const POST = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const { name, password } = req.body;
      await dbConnect();
      const data = await login(name, password);
  
      res.status(200).json({ message: 'Logged in successfully', data });
    } catch (error) {
      console.log(error);
      res.status(500).json({error: (error as Error).message});
    }
  }
  

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
    if(req.method == 'POST') POST(req, res);
    else res.status(404).json({error: 'Invalid Method'});
}
