import { S3Client, ListObjectsV2Command, GetObjectCommand } from '@aws-sdk/client-s3';
import { pipeline } from 'stream/promises';
import { mkdir } from 'fs/promises';
import { Readable } from 'stream';

const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
  }
});

const downloadDirectoryWithStreaming = async (bucketName: string, prefix: string, localDir: string) => {
  
  const listCommand = new ListObjectsV2Command({
    Bucket: bucketName,
    Prefix: prefix
  });
  
  const response = await s3Client.send(listCommand);
  
  for (const object of response.Contents || []) {
    const key = object.Key || '';
    const localPath = `${localDir}/${key.replace(prefix, '')}`;
    
    await mkdir(path.dirname(localPath), { recursive: true });
    
    const getCommand = new GetObjectCommand({
      Bucket: bucketName,
      Key: key
    });
    
    const getResponse = await s3Client.send(getCommand);
    
    await pipeline(
      getResponse.Body as Readable,
      fs.createWriteStream(localPath)
    );
    
    console.log(`Downloaded: ${key}`);
  }
}

export {downloadDirectoryWithStreaming};