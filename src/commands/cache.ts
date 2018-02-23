import { registerCommand } from "../command-registry";

interface CacheAddOptions {
  cacheName?: string;
  urls?: string[];
}

interface CacheDeleteOptions {
  cacheName?: string;
  deleteWholeCache?: boolean;
  urls?: string[];
}

async function cacheAdd(opts: CacheAddOptions | undefined) {
  if (!opts) {
    throw new Error("Options not provided");
  }

  if (!opts.cacheName) {
    throw new Error("Cache name not provided");
  }
  if (!opts.urls) {
    throw new Error("Cache URLs not provided");
  }
  let cache = await caches.open(opts.cacheName);
  return cache.addAll(opts.urls);
}

async function cacheDelete(opts: CacheDeleteOptions | undefined) {
  if (!opts) {
    throw new Error("Options not provided");
  }

  if (opts.urls && opts.deleteWholeCache === true) {
    throw new Error("Cannot specify both urls and deleteWholeCache options");
  }

  if (!opts.cacheName) {
    throw new Error("Cache name not provided");
  }

  if (opts.deleteWholeCache === true) {
    return caches.delete(opts.cacheName);
  } else if (!opts.urls) {
    throw new Error("Must provide URLs if not using deleteWholeCache");
  }

  let cache = await caches.open(opts.cacheName);

  let promises = opts.urls.map(url => cache.delete(url));

  return Promise.all(promises);
}

export function setup() {
  registerCommand("cache.add", cacheAdd);
  registerCommand("cache.delete", cacheDelete);
}
