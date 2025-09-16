
import Redis from 'ioredis';

const subscriber = new Redis();

subscriber.subscribe("cloneId", (err, res) => {
    if (err) console.log("error", err);
    else console.log("from publisher: ", res);
});