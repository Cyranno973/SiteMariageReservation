import {environment} from "./environments/environment";

importScripts('https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.2/firebase-messaging.js');

firebase.initializeApp(environment);
const messaging = firebase.messaging();

self.addEventListener('push', (event) => {
  const options = {
    body: event.data.text(),
    // autres options de notification
  };
  event.waitUntil(
    self.registration.showNotification('Nouvelle notification', options)
  );
});
