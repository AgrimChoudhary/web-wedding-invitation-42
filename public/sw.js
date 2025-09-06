// Service Worker for Image Caching and Performance
const CACHE_NAME = 'wedding-images-v1';
const IMAGE_CACHE_NAME = 'wedding-images-cache-v1';

// Cache critical images immediately
const CRITICAL_IMAGES = [
  '/lovable-uploads/photo1.jpg',
  '/lovable-uploads/photo2.jpg',
  '/images/bride-family-placeholder.jpg',
  '/images/groom-family-placeholder.jpg'
];

// Install event - cache critical resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(CACHE_NAME).then((cache) => {
        return cache.addAll([
          '/',
          '/invitation'
        ]);
      }),
      caches.open(IMAGE_CACHE_NAME).then((cache) => {
        return cache.addAll(CRITICAL_IMAGES);
      })
    ])
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== IMAGE_CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - implement smart caching strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle image requests
  if (request.destination === 'image' || 
      url.pathname.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
    event.respondWith(handleImageRequest(request));
    return;
  }

  // Handle other requests with network-first strategy
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Cache successful responses
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Fallback to cache
        return caches.match(request);
      })
  );
});

// Smart image caching strategy
async function handleImageRequest(request) {
  const url = new URL(request.url);
  const cache = await caches.open(IMAGE_CACHE_NAME);
  
  // Check if image is already cached
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    // Serve from cache, but also update in background for next time
    fetch(request).then((response) => {
      if (response.status === 200) {
        cache.put(request, response.clone());
      }
    }).catch(() => {
      // Ignore network errors for background updates
    });
    
    return cachedResponse;
  }

  try {
    // Fetch from network
    const response = await fetch(request);
    
    if (response.status === 200) {
      // Cache the response
      await cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    // Network failed, try to serve a fallback
    if (url.pathname.includes('placeholder')) {
      // Return a basic placeholder for failed placeholder images
      return new Response(
        '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="#f3f4f6"/><text x="200" y="150" text-anchor="middle" fill="#6b7280">Image</text></svg>',
        {
          headers: {
            'Content-Type': 'image/svg+xml',
            'Cache-Control': 'public, max-age=86400'
          }
        }
      );
    }
    
    throw error;
  }
}

// Background sync for image preloading
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'PRELOAD_IMAGES') {
    const { images } = event.data;
    preloadImages(images);
  }
});

async function preloadImages(imageUrls) {
  const cache = await caches.open(IMAGE_CACHE_NAME);
  
  for (const url of imageUrls) {
    try {
      const response = await fetch(url);
      if (response.status === 200) {
        await cache.put(url, response);
      }
    } catch (error) {
      console.log(`Failed to preload image: ${url}`);
    }
  }
}