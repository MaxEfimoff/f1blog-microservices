import mongoose from 'mongoose';
import { createClient, RedisClient, Multi } from 'redis';
import { promisifyAll } from 'bluebird';

const client = createClient(6379, process.env.REDIS_HOST);
const exec = mongoose.Query.prototype.exec;

promisifyAll(RedisClient.prototype);
promisifyAll(Multi.prototype);

declare module 'redis' {
  export interface RedisClient extends NodeJS.EventEmitter {
    setAsync(key: string, value: string): Promise<void>;
    getAsync(key: string): Promise<string>;
  }
}

declare module 'mongoose' {
  interface DocumentQuery<
    T,
    DocType extends import('mongoose').Document,
    QueryHelpers = {}
  > {
    mongooseCollection: {
      name: any;
    };
    cache(): DocumentQuery<T[], Document> & QueryHelpers;
    useCache: boolean;
    // hashKey: string;
  }
}

mongoose.Query.prototype.cache = function () {
  this.useCache = true;
  // this.hashKey = options.key;

  return this;
};

mongoose.Query.prototype.exec = async function (...args: any) {
  if (!this.useCache) {
    return exec.apply(this, args);
  }
  console.log('Im about to run a query');

  const key = JSON.stringify(
    Object.assign({}, this.getQuery(), {
      collection: this.mongooseCollection.name,
    })
  );

  // See if we have a value for 'key' in redis
  const cashedValue = await client.getAsync(key);

  if (cashedValue) {
    const doc = JSON.parse(cashedValue);

    return Array.isArray(doc)
      ? doc.map((d) => new this.model(d))
      : new this.model(doc);
  }

  const result = await exec.apply(this, args);

  client.set(key, JSON.stringify(result), 'EX', 10);

  return result;
};
