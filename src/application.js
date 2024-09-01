import schema from './validators.js';
import initView from './view.js';
import i18next from 'i18next';
import ru from './locales/ru.js';
import rssFeeds from './api/rss.js';
import checkUpdates from './api/timeRss.js';

const app = () => {
  i18next.init({
    lng: 'ru',
    resources: {
      ru: {
        translation: ru,
      },
    },
  }).then(() => {
    const state = {
      form: {
        isValid: false,
        error: null,
      },
      feeds: [],
      posts: [],
    };
    
    const watchedState = initView(state);
    const element = document.querySelector('form');

    element.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const url = formData.get('url').trim();
      const rssSchema = schema(state.feeds.map((feed) => feed.url));
      
      rssSchema.validate(url, { abortEarly: false })
        .then((validatedUrl) => rssFeeds(validatedUrl))
        .then((feedData) => {
          const { title, description, posts } = feedData;
          const newFeed = { title, description, url };
          watchedState.feeds.push(newFeed);
          watchedState.posts.push(...posts.map(post => ({ ...post, isRead: false })));
          watchedState.form.isValid = true;
          watchedState.form.error = null;
        })
        .catch((error) => {
          const translatedErrors = error.errors ? error.errors.map((err) => i18next.t(err.key)) : [error.message];
          watchedState.form.isValid = false;
          watchedState.form.error = translatedErrors[0];
        });
    });

    document.addEventListener('click', (event) => {
      if (event.target.matches('.posts a')) {
        const postId = event.target.getAttribute('data-id');
        const post = state.posts.find(p => p.id === postId);
        if (post && !post.isRead) {
          post.isRead = true;
          watchedState.posts = [...state.posts];
        }
      }
    });

    checkUpdates(state, watchedState);
  }).catch((err) => {
    console.error('Ошибка инициализации i18next:', err);
  });
};

export default app;