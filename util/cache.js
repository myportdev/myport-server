import Redis from "ioredis";
const redis = new Redis({
    host: "52.79.99.126",
    port: 6379,
    password: "myport1234",
});

export default redis;
