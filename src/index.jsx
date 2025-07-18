import 'core-js/stable';
import 'regenerator-runtime/runtime';
import {
  APP_INIT_ERROR,
  APP_READY,
  initialize,
  mergeConfig,
  subscribe,
  getConfig,
} from '@edx/frontend-platform';
import {
  AppProvider,
  ErrorPage,
} from '@edx/frontend-platform/react';
import React from 'react';
import ReactDOM from 'react-dom';
import Header from '@edx/frontend-component-header';
import FooterSlot from '@openedx/frontend-slot-footer';
import messages from './i18n';
import configureStore from './data/configureStore';
import './index.scss';
import Head from './head/Head';

// Компонент для отображения "В разработке"
const InProgressMessage = () => (
  <div className="container-fluid">
    <div className="row align-items-center justify-content-center" style={{ minHeight: '50vh' }}>
      <div className="col-12 text-center">
        <h2>В разработке</h2>
      </div>
    </div>
  </div>
);

subscribe(APP_READY, () => {
  const store = configureStore();
  const config = getConfig();

  ReactDOM.render(
    <AppProvider store={store}>
      <Head />
      <main id="main">
        {config.ENABLE_SKILLS_BUILDER_PROFILE === 'true' ? <AppRoutes /> : <InProgressMessage />}
      </main>
    </AppProvider>,
    document.getElementById('root'),
  );
});

subscribe(APP_INIT_ERROR, (error) => {
  ReactDOM.render(<ErrorPage message={error.message} />, document.getElementById('root'));
});

initialize({
  messages,
  hydrateAuthenticatedUser: true,
  handlers: {
    config: () => {
      mergeConfig({
        COLLECT_YEAR_OF_BIRTH: process.env.COLLECT_YEAR_OF_BIRTH,
        ENABLE_SKILLS_BUILDER_PROFILE: process.env.ENABLE_SKILLS_BUILDER_PROFILE,
      }, 'App loadConfig override handler');
    },
  },
});