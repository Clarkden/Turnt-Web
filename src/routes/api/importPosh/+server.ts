import axios from "axios";

export const GET = async (req: Request, res: Response) => {
  try {
    const res = await axios.get("https://turnt-server.fly.dev/getPosh");
    return new Response(JSON.stringify(res.data));
  } catch (error: any) {
    return new Error(error.message);
  }
};
