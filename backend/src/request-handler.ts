import cors from 'cors';
import express, { Request, Response } from "express";

const app = express();
const PORT = 3001;

app.use(cors);

app.get('/', (req: Request, res: Response) => {
    // route logic
});

app.listen(PORT, () => {
    console.log('server running on port 3001');
});