const NodeCache = require('node-cache')

class Cache {
  constructor (ttlSeconds) {
    this.cache = new NodeCache({
      stdTTL: ttlSeconds,
      checkperiod: ttlSeconds * 0.2,
      useClones: false
    })
  }

  get (key, store, overwrite = false) {
    const value = this.cache.get(key)
    if (value && !overwrite) {
      return value
    }
    if (!value && !store) {
        return false
    }
    this.cache.set(key, store)
    return store
  }

  flush () {
    this.cache.flushAll()
  }
}

module.exports = Cache
