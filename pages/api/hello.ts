import { NextApiRequest, NextApiResponse } from "next";

interface Data {
  name: string;
}

export default (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { name = "John Doe" } = req.query as any;
  res.statusCode = 200;
  res.json({ name });
};
