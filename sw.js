const CACHE_PREFIX = 'nhan-don-moi-evn-spc-';
const CACHE = CACHE_PREFIX + 'fast-pro-v5';
const BASE = new URL('./', self.location).pathname;
const ASSETS = [
  BASE + 'manifest.webmanifest',
  BASE + 'evn_logo.png',
  BASE + 'icon-192.png',
  BASE + 'icon-512.png',
  BASE + 'icon-192-any.png',
  BASE + 'icon-512-any.png',
  BASE + 'icon-192-maskable.png',
  BASE + 'icon-512-maskable.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(ASSETS))
      .catch(() => null)
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.map(key => key.startsWith(CACHE_PREFIX) && key !== CACHE ? caches.delete(key) : null)))
      .then(() => self.clients.claim())
  );
});

// Không chặn navigation/fetch để tránh giữ file cũ và tránh làm app mở chậm.
