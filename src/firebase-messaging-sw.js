importScripts('https://www.gstatic.com/firebasejs/9.0.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.2/firebase-messaging-compat.js');

const firebaseConfig = {
  projectId: 'andrestella-d7d47',
  appId: '1:502171773189:web:13d44e9d0e23ac4a7cef6c',
  storageBucket: 'andrestella-d7d47.appspot.com',
  locationId: 'europe-west',
  apiKey: 'AIzaSyBYu7lccooxvETyxcsE_34E9o96Ciynqdg',
  authDomain: 'andrestella-d7d47.firebaseapp.com',
  messagingSenderId: '502171773189',
  measurementId: 'G-3CRV6E0GST',
};

firebase.initializeApp(firebaseConfig);
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
