const redis = require('redis').createClient({
  //password: 'tqVEk7pRA8dgdiwUjOGzCvTJjfK2YFMt',
  socket: {
    host: '127.0.0.1',
    port: 6379,
  },
});

(async () => {
  console.log('connecting to redis client');
  redis.on('error', (error: string) => console.error(`Ups : ${error}`));
  await redis.connect();
})();

// module.exports = redis;
export default redis;
