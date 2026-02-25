const CACHE_NAME = 'mono-finance-v1';
const ASSETS = [
  './',
  './index.html',
  './styles.css',
  './js/app.js',
  './js/state.js',
  './js/components.js',
  './js/modules/calendar.js',
  './js/modules/chart.js',
  './js/modules/finance.js',
  './js/modules/sidebar.js',
  './js/modules/streak.js',
  './js/modules/actions.js',
  './js/modules/background.js',
  './js/modules/customCharts.js',
  './js/components/Header.js',
  './js/components/Sidebar.js',
  './js/components/TitleSection.js',
  './js/components/MoneyPowerCard.js',
  './js/components/FinancialInputCard.js',
  './js/components/CalendarCard.js',
  './js/components/AssetsView.js',
  './js/components/ChartsView.js',
  './js/components/WealthView.js',
  './js/components/ActionsView.js',
  './js/components/AuthView.js',
  './js/modules/auth.js',
  './avatar-miguel.png',
  './Solitary Cabin on Hill.png',
  './Serene Landscape Scene.png',
  './Majestic Mountain Scene.png',
  './Urban Serenity Scene.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});