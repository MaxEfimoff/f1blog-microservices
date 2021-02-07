import { createApp } from 'vue';
import Dashboard from './components/Dashboard';

// Mount function to start up the app
const mountDashboardApp = (el) => {
  const app = createApp(Dashboard);

  // This app function is totally unrelated to our
  // mount function we are into. This is Vue's own function.
  app.mount(el);
};

// If we are in development and in isolation,
// call mount immediately
if (process.env.NODE_ENV === 'development') {
  const devRoot = document.querySelector('#_dashboard-dev-root');

  if (devRoot) {
    mountDashboardApp(devRoot);
  }
}

// We are running through container
// and we should export the mount function
export { mountDashboardApp };
