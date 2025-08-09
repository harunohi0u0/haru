// Service Worker 파일 (sw.js)
const CACHE_NAME = 'trading-journal-app-cache-v1';
const urlsToCache = [
    './', // 앱의 루트 URL
    './index.html',
    './manifest.json',
    'https://cdn.tailwindcss.com',
    'https://cdn.jsdelivr.net/npm/chart.js',
    // Firebase SDK는 CDN에서 직접 로드되므로 여기에 캐시하지 않습니다.
    // 만약 자체 호스팅한다면 여기에 추가해야 합니다.
    // 아이콘 이미지 경로도 여기에 추가 (예: './icons/icon-192x192.png', './icons/icon-512x512.png')
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Service Worker: 캐싱할 파일 추가 완료');
                return cache.addAll(urlsToCache);
            })
            .catch(error => {
                console.error('Service Worker: 캐싱 실패', error);
            })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // 캐시에 요청과 일치하는 응답이 있으면 캐시된 응답 반환
                if (response) {
                    return response;
                }
                // 캐시에 없으면 네트워크로 요청
                return fetch(event.request);
            })
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Service Worker: 오래된 캐시 삭제', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
