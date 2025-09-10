
import Redis from 'ioredis';

const redis = new Redis();

redis.on('connect', () => {
    redis.set("greetings", "hello from redis");

    redis.get("greetings", (err, res) => {
        if (err) console.log("error", err);
        else console.log("from redis: ", res);
    });
});