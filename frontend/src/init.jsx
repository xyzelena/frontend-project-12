import { Provider } from 'react-redux';

import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import filter from 'leo-profanity';

import 'bootstrap/dist/css/bootstrap.min.css';

import store from './store/index.js';

import initSocket from './socket.js';

import SocketContext from './contexts/SocketContext.js';

import FilterBadWordsContext from './contexts/FilterBadWordsContext.js';

import App from './components/App/App.jsx';

import resources from './locales/index.js';

const init = async () => {
  const defaultLng = 'ru';

  const i18n = i18next.createInstance();

  await i18n
    // передаем экземпляр i18n в react-i18next,
    // который сделает его доступным для всех компонентов через context API
    .use(initReactI18next)

    .use(LanguageDetector) // с помощью плагина определяем язык пользователя в браузере

    .init({
      fallbackLng: defaultLng, // если переводы на языке пользователя недоступны, то будет использоваться язык, указанный в этом поле
      debug: false,
      resources,
      interpolation: {
        escapeValue: false, // экранирование уже есть в React, поэтому отключаем
      },
    });

  const socket = initSocket();

  filter.loadDictionary(defaultLng);

  return (
    <Provider store={store}>
      <SocketContext.Provider value={socket}>
        <FilterBadWordsContext.Provider value={filter}>
          <App />
        </FilterBadWordsContext.Provider>
      </SocketContext.Provider>
    </Provider>
  );
};

export default init;
