
import Redis from 'ioredis';

const redis = new Redis();

const processQueue = async () => {
    while (1) {
        const repo_id = await redis.blpop("my-queue",2);
        console.log("report id:", repo_id);
    }
}

processQueue();
