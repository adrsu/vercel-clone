import express, { Request, Response } from "express";
import cors from "cors";
import generate from "./helper";
import simpleGit from "simple-git";

const app = express();
const PORT = 3000;
const git = simpleGit();

app.use(cors());
app.use(express.json());

app.get("/repo", async (req: Request, res: Response) => {
  const { repoUrl } = req.body;

  if (!repoUrl) {
    console.log("repo url not found: ", repoUrl);
    return res.status(400).json({error: "repo url required"})
  }

  let idd = generate()

  try {
    await git.clone(repoUrl, `cloned_repo/${idd}`);
  } catch (err) {
    console.log('error: ', err);
    return res.status(500).json({error: "clone failed"})
  }
  
  res.send({"repoUrl": repoUrl, "idd": idd});
});

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
