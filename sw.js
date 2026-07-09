'use strict';

/*
 * Service Worker tự dọn và tự hủy.
 * Mục đích:
 * - Xóa cache index.html cũ có iframe.
 * - Ngừng điều khiển trang GitHub Pages.
 * - Buộc APK nhận index.html mới chuyển hướng trực tiếp.
 */

const OLD_CACHE_PREFIX = 'nhan-don-moi-evn-spc-pwa-';

self.addEventListener('install', function () {
  self.skipWaiting();
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    (async function () {
      try {
        // Xóa toàn bộ cache PWA cũ.
        const cacheNames = await caches.keys();

        await Promise.all(
          cacheNames
            .filter(function (cacheName) {
              return cacheName.startsWith(OLD_CACHE_PREFIX);
            })
            .map(function (cacheName) {
              return caches.delete(cacheName);
            })
        );

        // Gỡ đăng ký Service Worker này.
        await self.registration.unregister();

        // Tải lại các cửa sổ đang mở để nhận index.html mới.
        const clientList = await self.clients.matchAll({
          type: 'window',
          includeUncontrolled: true
        });

        clientList.forEach(function (client) {
          client.navigate(client.url);
        });
      } catch (error) {
        console.error('Không thể dọn Service Worker cũ:', error);
      }
    })()
  );
});

/*
 * Không chặn request.
 * Tất cả request tiếp tục chạy trực tiếp qua mạng.
 */
self.addEventListener('fetch', function () {
  // Không dùng event.respondWith().
});
