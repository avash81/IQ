import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import * as Sentry from "@sentry/react";
import ReactGA from "react-ga4";
import { onCLS, onINP, onLCP, onFCP, onTTFB, Metric } from 'web-vitals';
import App from './App.tsx';
import ErrorBoundary from './components/ErrorBoundary.tsx';
import './index.css';

// Initialize Sentry
if (import.meta.env.VITE_SENTRY_DSN) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration(),
    ],
    tracesSampleRate: 0.1,
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 0,
    environment: import.meta.env.MODE,
    enabled: import.meta.env.PROD,
    beforeSend(event) {
      if (event.exception?.values?.[0]?.type === 'TypeError' &&
          event.exception.values[0].value?.includes('fetch')) {
        return null;
      }
      return event;
    },
    initialScope: {
      tags: { component: 'iqtest-pro' },
    },
  });
}

// Initialize GA4
if (import.meta.env.VITE_GA_ID && import.meta.env.PROD) {
  ReactGA.initialize(import.meta.env.VITE_GA_ID);
}

console.log('Client-side initialization starting...');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <HelmetProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </HelmetProvider>
    </ErrorBoundary>
  </StrictMode>,
);

console.log('Client-side render called.');

function sendToAnalytics(metric: Metric) {
  if (!import.meta.env.PROD) return;
  const body = JSON.stringify({
    name: metric.name,
    value: metric.value,
    id: metric.id,
    page: window.location.pathname,
  });
  
  if (navigator.sendBeacon) {
    navigator.sendBeacon('/api/vitals', body);
  } else {
    fetch('/api/vitals', { body, method: 'POST', keepalive: true }).catch(() => {});
  }
}

onCLS(sendToAnalytics);
onINP(sendToAnalytics);
onLCP(sendToAnalytics);
onFCP(sendToAnalytics);
onTTFB(sendToAnalytics);

