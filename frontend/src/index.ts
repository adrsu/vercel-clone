import { downloadDirectoryWithStreaming, buildUploadToS3 } from './aws';

const Redis = require('ioredis');
const redis = new Redis();

const processQueue = async () => {
    // while (1) {
    //     const result = await redis.blpop("my-queue",5);
    //     if (result) {
    //         try {
    //             const bucketName = result?.[1] || null
    //             await downloadDirectoryWithStreaming('vercel-clone-s3bucket', bucketName, `./dist/downloads/${bucketName}`);
    //             await buildUploadToS3(bucketName);
    //         } catch (err) {
    //             console.log("bucket: ", result?.[1])
    //             console.log("error downloading: ", err);
    //         }
    //     }
        
    //     console.log("repository:", result);
        
    // }
    try {
        console.log("building", await buildUploadToS3('ypsbm'));
    } catch (err) {
        console.log("errr0r", err);
    }
}



processQueue();
