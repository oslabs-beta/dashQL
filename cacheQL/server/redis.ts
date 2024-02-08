const redis = require('redis').createClient({
  password: 'tqVEk7pRA8dgdiwUjOGzCvTJjfK2YFMt',
  socket: {
    host: 'redis-12168.c321.us-east-1-2.ec2.cloud.redislabs.com',
    port: 12168,
  },
});

(async () => {
  console.log('connecting to redis client');
  redis.on('error', (error: string) => console.error(`Ups : ${error}`));
  await redis.connect();
})();

module.exports = redis;
