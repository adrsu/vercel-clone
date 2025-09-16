import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import cors from 'cors';
import express, { Request, Response } from "express";
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const PORT = 3001;

app.use(cors());    
app.use(express.json());

const s3Client = new S3Client({
    region: process.env.AWS_REGION || "us-east-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
    }
});

const handleS3Request = async (req: Request, res: Response, requestedPath: string) => {
    const id = req.hostname.split(".")[0];
    
    console.log("Project ID:", id);
    console.log("Requested path:", requestedPath);
    console.log("S3 Key:", `${id}/dist${requestedPath}`);
    
    const getCommand = new GetObjectCommand({
        Bucket: 'vercel-clone-s3bucket',
        Key: `${id}/dist${requestedPath}`
    });
    
    const getResponse = await s3Client.send(getCommand);
    
    const content = await getResponse.Body?.transformToString();
    
    const contentType = requestedPath.endsWith('html')? 'text/html': requestedPath.endsWith('css')? 'text/css': requestedPath.endsWith('js')? 'application/javascript': 'text/plain';
    res.set('Content-Type', contentType);
    
    res.send(content);
}

app.get('/', async (req: Request, res: Response) => {
    await handleS3Request(req, res, '/index.html');
});

app.get('/assets/:filename', async (req: Request, res: Response) => {
    const filename = req.params.filename;
    await handleS3Request(req, res, `/assets/${filename}`);
});

app.get('/:filename.:ext', async (req: Request, res: Response) => {
    const filename = req.params.filename;
    const ext = req.params.ext;
    await handleS3Request(req, res, `/${filename}.${ext}`);
});

app.get('/:path', async (req: Request, res: Response) => {
    const path = req.params.path;
    await handleS3Request(req, res, `/${path}`);
})

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
});


// Start-Process notepad "C:\Windows\System32\drivers\etc\hosts" -Verb RunAs