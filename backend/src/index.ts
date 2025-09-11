import express, { Request, Response } from "express";
import cors from "cors";
import {generate, uploadFolderS3} from "./helper";
import simpleGit from "simple-git";
import Redis from "ioredis";

const app = express();
const PORT = 3000;
const git = simpleGit();
const redis = new Redis();

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

  try {
    await uploadFolderS3(`cloned_repo/${idd}`, `${idd}`);
  } catch (err) {
    console.log('error: ', err);
    return res.status(500).json({error: "folder upload failed"})
  }
  
  try {await pushToQueue("my-queue", idd)}
  catch (err) {
    console.log("error in /repo", err);
    throw err;
  }

  res.send({"repoUrl": repoUrl, "idd": idd});
});

const pushToQueue = async (queuename: string, idd: string) => {
  try {
    const result = await redis.rpush(queuename, idd);
    console.log(`pushed idd ${idd} to queue. queue length: ${result}`)
    return result
  } catch (err) {
    console.log("error pushing to queue: ", err);
    throw err
  }
}

app.get('/repo/status', (req: Request, res: Response) => {
  const status = "no" //status logic
  res.send({"upload_status": status})
})

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
