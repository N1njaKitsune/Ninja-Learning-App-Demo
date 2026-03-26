// Ninja Learning — Service Worker
// Caches app files for offline use

const CACHE_NAME = 'ninja-learning-v2';

const CACHED_FILES = [
  '/Ninja-Learning-App-Demo/',
  '/Ninja-Learning-App-Demo/index.html',
  '/Ninja-Learning-App-Demo/NinjaLearning_Instructor.html',
  '/Ninja-Learning-App-Demo/NinjaLearning_Parent.html',
  '/Ninja-Learning-App-Demo/NinjaLearning_Student.html',
  '/Ninja-Learning-App-Demo/manifest.json'
];

// Install: cache all core files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(CACHED_FILES)).catch(() => {})
  );
  self.skipWaiting();
});

// Activate: clear old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))
    )
  );
  self.clients.claim();
});

// Fetch: serve from cache, fall back to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request).then(response => {
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      });
    }).catch(() => caches.match('/Ninja-Learning-App-Demo/'))
  );
});
