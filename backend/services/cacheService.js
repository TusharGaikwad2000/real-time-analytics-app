const cache = new Map();
const TTL = 30 * 1000; // 30 seconds

const get = (key) => {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiry) {
    cache.delete(key);
    return null;
  }
  return entry.value;
};

const set = (key, value) => {
  cache.set(key, {
    value,
    expiry: Date.now() + TTL
  });
};

const invalidate = (platform) => {
  // Invalidate any cache keys that contain this platform
  for (const key of cache.keys()) {
    if (key.includes(platform)) {
      cache.delete(key);
    }
  }
};

module.exports = {
  get,
  set,
  invalidate
};
