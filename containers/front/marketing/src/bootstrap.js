import { createApp } from 'vue';
import Marketing from './components/Marketing.vue';

// Mount function to start up the app
const mount = (el) => {
  const app = createApp(Marketing);

  // This app function is totally unrelated to our
  // mount function we are into. This is Vue's own function.
  app.mount(el);
};

// If we are in development and in isolation,
// call mount immediately
if (process.env.NODE_ENV === 'development') {
  const devRoot = document.querySelector('#_marketing-dev-root');

  if (devRoot) {
    mount(devRoot);
  }
}

// We are running through container
// and we should export the mount function
export { mount };
