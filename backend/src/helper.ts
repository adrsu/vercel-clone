import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import * as fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

const cred =  {
    "accessKeyId": process.env.AWS_ACCESS_KEY || '',
    "secretAccessKey": process.env.AWS_SECRET_ACCESS_KEY || ''
}

const shouldSkipFile = (filePath: string): boolean => {
   const skipPatterns = [
       '.git',
       'node_modules',
       '.env',
       '.DS_Store',
       'Thumbs.db',
       '*.log',
       '.gitignore'
   ];
   
   return skipPatterns.some(pattern => 
       filePath.includes(pattern) || 
       filePath.startsWith('.git/')
   );
}

const uploadFolderS3 = async (folderPath: string, s3KeyPrefix: string) => {
    const files = fs.readdirSync(folderPath, {recursive:true});

    for (const file of files) {
        const fullPath = path.join(folderPath, file.toString());
        
        // Skip .git files and directories
        if (shouldSkipFile(file.toString())) {
            continue;
        }

        const stats = fs.statSync(fullPath);
        if (stats.isFile()) {
            try {
                // Maintain folder structure in S3 key
                const relativePath = path.relative(folderPath, fullPath);
                const s3Key = `${s3KeyPrefix}/${relativePath.replace(/\\/g, '/')}`;
               
               await uploadFileS3(fullPath, s3Key);
            } catch (err) {
                console.log('error folder upload: ', err);
                throw err;
            }    
        }

        
    }
}

const uploadFileS3 = async (filePath: string, filename: string) => {
    let s3client = new S3Client({region: "us-east-1", credentials: cred});

    const fileParams = {
        Bucket: 'vercel-clone-s3bucket',
        Key: filename,
        Body: fs.createReadStream(filePath)
    }

    try {
        const command = new PutObjectCommand(fileParams);
        const response = await s3client.send(command);
        // console.log('file uploaded: ', response);
    } catch (err) {
        console.log('error: ', err);
        throw err;
    }
}

const generate = () => {
    const dict = "abcdefghijklmnopqrstuvwxyz1234567890";

    const n = dict.length
    let idd = ""
    for (let i=0; i<5; i++) {
        let idx = Math.floor(Math.random()*n)
        idd += dict.charAt(idx);
    }
    
    return idd
}

export {generate, uploadFolderS3};