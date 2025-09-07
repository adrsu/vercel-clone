import express, { Request, Response } from "express";
import cors from "cors";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get("/repo", (req: Request, res: Response) => {
  const { repoUrl } = req.body;

  if (!repoUrl) {
    console.log("repo url not found: ", repoUrl);
  }

  res.send(`repo url received: ${repoUrl}`);
  
});

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
