// Ellie's Bichon Frise Sanctuary — Service Worker
// Handles Web Push notifications

self.addEventListener("install", (event) => {
    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    event.waitUntil(clients.claim());
});

self.addEventListener("push", (event) => {
    if (!event.data) return;

    let data;
    try {
        data = event.data.json();
    } catch {
        data = { title: "Ellie's Sanctuary", body: event.data.text() };
    }

    const options = {
        body: data.body ?? "You have a new notification",
        icon: data.icon ?? "/icon-192.png",
        badge: data.badge ?? "/icon-192.png",
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1,
            url: data.url ?? "/dashboard",
        },
        actions: [
            { action: "explore", title: "View", icon: "/icon-192.png" },
            { action: "close", title: "Close", icon: "/icon-192.png" },
        ],
    };

    event.waitUntil(
        self.registration.showNotification(data.title ?? "Ellie's Sanctuary", options)
    );
});

self.addEventListener("notificationclick", (event) => {
    event.notification.close();

    if (event.action === "close") return;

    const url = event.notification.data?.url ?? "/dashboard";

    event.waitUntil(
        clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
            for (const client of clientList) {
                if (client.url.includes(self.location.origin) && "focus" in client) {
                    client.navigate(url);
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow(url);
            }
        })
    );
});
