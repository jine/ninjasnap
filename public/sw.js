// Service Worker for NinjaSnap - Performance & Caching
const CACHE_NAME = 'ninjasnap-v1.0.0';
const STATIC_CACHE = 'ninjasnap-static-v1.0.0';
const SCREENSHOT_CACHE = 'ninjasnap-screenshots-v1.0.0';

// Assets to cache immediately
const STATIC_ASSETS = ['/', '/favicon.ico', '/ninja-favicon.svg'];

// Cache strategies
const CACHE_STRATEGIES = {
  CACHE_FIRST: 'cache-first',
  NETWORK_FIRST: 'network-first',
  STALE_WHILE_REVALIDATE: 'stale-while-revalidate',
};

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');

  event.waitUntil(
    (async () => {
      const cache = await caches.open(STATIC_CACHE);
      await cache.addAll(STATIC_ASSETS);
      console.log('Service Worker: Static assets cached');

      // Skip waiting to activate immediately
      self.skipWaiting();
    })(),
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');

  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames
          .filter((name) => name !== STATIC_CACHE && name !== SCREENSHOT_CACHE)
          .map((name) => caches.delete(name)),
      );

      console.log('Service Worker: Old caches cleaned up');
      // Take control of all clients immediately
      self.clients.claim();
    })(),
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle different types of requests
  if (request.method !== 'GET') return;

  // Cache static assets with cache-first strategy
  if (STATIC_ASSETS.some((asset) => url.pathname === asset)) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  // Cache screenshot images with network-first strategy (always try fresh)
  if (url.pathname.startsWith('/screenshots/')) {
    event.respondWith(networkFirst(request, SCREENSHOT_CACHE));
    return;
  }

  // For API requests, use network-first
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Default: stale-while-revalidate for other requests
  event.respondWith(staleWhileRevalidate(request));
});

// Cache-first strategy (for static assets)
async function cacheFirst(request, cacheName = STATIC_CACHE) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.error('Cache-first strategy failed:', error);
    // Return offline fallback if available
    return (
      caches.match('/fallback.html') || new Response('Offline', { status: 503 })
    );
  }
}

// Network-first strategy (for dynamic content)
async function networkFirst(request, cacheName = CACHE_NAME) {
  try {
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.log('Network request failed, trying cache:', error);

    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Return offline fallback
    return new Response('Offline', {
      status: 503,
      statusText: 'Service Unavailable',
      headers: { 'Content-Type': 'text/plain' },
    });
  }
}

// Stale-while-revalidate strategy
async function staleWhileRevalidate(request, cacheName = CACHE_NAME) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);

  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  });

  // Return cached version immediately if available, otherwise wait for network
  return cachedResponse || fetchPromise;
}

// Handle messages from the main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
