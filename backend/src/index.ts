import express, { Request, Response } from "express";
import cors from "cors";
import generate from "./helper";
import simpleGit from "simple-git";

const app = express();
const PORT = 3000;
const git = simpleGit();

app.use(cors());
app.use(express.json());

app.get("/repo", (req: Request, res: Response) => {
  const { repoUrl } = req.body;

  if (!repoUrl) {
    console.log("repo url not found: ", repoUrl);
  }

  let idd = generate()
  console.log(__dirname)
  // git.clone(repoUrl, `out/${idd}`)
  

  res.send({"repoUrl": repoUrl, "idd": idd});
  
});

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
