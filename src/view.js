import onChange from 'on-change';
import i18next from 'i18next';

export default (state) => {
  const formElement = document.querySelector('form');
  const inputElement = document.querySelector('input[name="url"]');
  const feedbackElement = document.querySelector('.feedback');

  const renderError = (error) => {
    if (error) {
      inputElement.classList.add('is-invalid');
      feedbackElement.textContent = error;
      feedbackElement.style.color = 'red';
    } else {
      inputElement.classList.remove('is-invalid');
      feedbackElement.textContent = i18next.t('success');
      feedbackElement.style.color = 'green';
    }
  };

  const renderFormValid = () => {
    if (state.form.isValid) {
      inputElement.value = '';
      inputElement.focus();
      formElement.reset();
    }
  };

  return onChange(state, (path, value) => {
    if (path === 'form.error') {
      renderError(value);
    }
    if (path === 'form.isValid') {
      renderFormValid();
    }
  });
};
