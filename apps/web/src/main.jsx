/* eslint-disable react-refresh/only-export-components */
import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import 'swiper/css';
import 'swiper/css/pagination';
import './index.css'
import App from './App.jsx'
import { queryClient } from './lib/queryClient'
import { useAuthStore } from './stores/authStore'

if (import.meta.env.DEV) {
  window.__authStore = useAuthStore;
}

function Root() {
  useEffect(() => {
    const unsubscribe = useAuthStore.getState().subscribe();
    return unsubscribe;
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
