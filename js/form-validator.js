import { resetEffects } from './effects.js';
import { sendData } from './api.js';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('#upload-select-image');

  if (!form) {
    return;
  }

  const hashtagInput = form.querySelector('.text__hashtags');
  const commentInput = form.querySelector('.text__description');
  const uploadInput = document.querySelector('#upload-file');
  const uploadOverlay = form.querySelector('.img-upload__overlay');
  const cancelButton = form.querySelector('#upload-cancel');
  const submitButton = form.querySelector('#upload-submit');

  const pristine = new Pristine(form, {
    classTo: 'img-upload__field-wrapper',
    errorClass: 'img-upload__field-wrapper--invalid',
    successClass: 'img-upload__field-wrapper--valid',
    errorTextParent: 'img-upload__field-wrapper',
    errorTextTag: 'div',
    errorTextClass: 'img-upload__error'
  });

  const validateHashtagCount = (value) => {
    if (!value.trim()) return true;
    const hashtags = value.trim().split(/\s+/);
    return hashtags.length <= 5;
  };

  const validateHashtagFormat = (value) => {
    if (!value.trim()) return true;
    const hashtags = value.trim().split(/\s+/);

    for (const hashtag of hashtags) {
      if (hashtag === '#') return false;
      if (hashtag.length > 20) return false;
      if (!/^#[A-Za-zА-Яа-яЁё0-9]+$/.test(hashtag)) return false;
    }
    return true;
  };

  const validateHashtagUnique = (value) => {
    if (!value.trim()) return true;
    const hashtags = value.trim().split(/\s+/);
    const lowerCaseHashtags = hashtags.map((tag) => tag.toLowerCase());
    const uniqueHashtags = new Set(lowerCaseHashtags);
    return uniqueHashtags.size === hashtags.length;
  };

  const validateComment = (value) => value.length <= 140;

  pristine.addValidator(
    hashtagInput,
    validateHashtagCount,
    'Максимум 5 хэш-тегов',
    2,
    false
  );

  pristine.addValidator(
    hashtagInput,
    validateHashtagFormat,
    'Хэш-тег должен начинаться с # и содержать только буквы и цифры (длина до 20 символов)',
    1,
    false
  );

  pristine.addValidator(
    hashtagInput,
    validateHashtagUnique,
    'Хэш-теги не должны повторяться',
    3,
    false
  );

  pristine.addValidator(
    commentInput,
    validateComment,
    'Длина комментария не должна превышать 140 символов',
    1,
    false
  );

  const showMessage = (templateId) => {
    const template = document.querySelector(`#${templateId}`);
    const messageElement = template.content.querySelector(`.${templateId}`).cloneNode(true);
    document.body.appendChild(messageElement);

    const closeMessage = () => {
      messageElement.remove();
      document.removeEventListener('keydown', onMessageKeydown);
      document.removeEventListener('click', onDocumentClick);
    };

    const onMessageKeydown = (evt) => {
      if (evt.key === 'Escape') {
        closeMessage();
      }
    };

    const onDocumentClick = (evt) => {
      if (!evt.target.closest(`.${templateId}__inner`)) {
        closeMessage();
      }
    };

    const closeButton = messageElement.querySelector(`.${templateId}__button`);
    closeButton.addEventListener('click', closeMessage);
    document.addEventListener('keydown', onMessageKeydown);
    document.addEventListener('click', onDocumentClick);
  };

  const blockSubmitButton = () => {
    submitButton.disabled = true;
    submitButton.textContent = 'Отправляю...';
  };

  const unblockSubmitButton = () => {
    submitButton.disabled = false;
    submitButton.textContent = 'Опубликовать';
  };

  const onDocumentKeydown = (evt) => {
    if (evt.key === 'Escape') {
      if (evt.target === hashtagInput || evt.target === commentInput) {
        return;
      }
      evt.preventDefault();
      closeForm();
    }
  };

  const onFormSubmit = (evt) => {
    evt.preventDefault();

    const isValid = pristine.validate();
    if (!isValid) {
      return;
    }

    blockSubmitButton();
    const formData = new FormData(form);

    sendData(formData)
      .then(() => {
        closeForm();
        showMessage('success');
      })
      .catch(() => {
        showMessage('error');
      })
      .finally(() => {
        unblockSubmitButton();
      });
  };

  const closeForm = () => {
    uploadOverlay.classList.add('hidden');
    document.body.classList.remove('modal-open');

    form.reset();
    pristine.reset();
    uploadInput.value = '';
    resetEffects();

    document.removeEventListener('keydown', onDocumentKeydown);
    cancelButton.removeEventListener('click', closeForm);
    form.removeEventListener('submit', onFormSubmit);
  };

  const openForm = () => {
    uploadOverlay.classList.remove('hidden');
    document.body.classList.add('modal-open');
    document.addEventListener('keydown', onDocumentKeydown);
    cancelButton.addEventListener('click', closeForm);
    form.addEventListener('submit', onFormSubmit);
  };

  hashtagInput.addEventListener('input', () => {
    pristine.validate();
  });

  commentInput.addEventListener('input', () => {
    pristine.validate();
  });

  uploadInput.addEventListener('change', openForm);
});
