import cors from 'cors';
import express, { Request, Response } from "express";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    // const { host } = req.body;
    const host = req.hostname;
    const idd = host.split(".")[0]
    console.log("host", host);
    console.log("iddd", idd);
    res.send({"iddd": idd, "urll":host})

});

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
});


// Start-Process notepad "C:\Windows\System32\drivers\etc\hosts" -Verb RunAs