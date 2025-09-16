
import Redis from "ioredis";

const publisher = new Redis();

publisher.subscribe("cloneId", "hello from vercel");
