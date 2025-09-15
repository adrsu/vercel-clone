import { S3Client, ListObjectsV2Command, GetObjectCommand } from '@aws-sdk/client-s3';
import { pipeline } from 'stream/promises';
import { mkdir } from 'fs/promises';
import { Readable } from 'stream';
import { execa } from 'execa';
import { stdout } from 'process';

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

const buildUploadToS3 = async (bucketName: string) => {
  console.log("pathhh", path.resolve('.'))

  const projectRoot = process.cwd();
  const repoPath = path.join(projectRoot, 'dist', 'downloads', bucketName);
  console.log("repo path", repoPath);

  await execa('npm', ['install'], {
    cwd: repoPath,
    stdout: 'inherit'
  })

  await execa('npm', ['run', 'build'], {
    cwd: repoPath,
    stdout: 'inherit'
  })

  

}

export {downloadDirectoryWithStreaming, buildUploadToS3};