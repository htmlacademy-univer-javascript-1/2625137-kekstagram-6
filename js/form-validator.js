import { resetEffects } from './effects.js';
import { sendData } from './api.js';
import { isEscapeKey } from './utils.js';
import {
  HASHTAG_REGEX,
  MAX_HASHTAG_COUNT,
  MAX_HASHTAG_LENGTH,
  MAX_COMMENT_LENGTH
} from './constants.js';

const form = document.querySelector('#upload-select-image');
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
  errorTextClass: 'pristine-error'
});

const validateHashtagCount = (value) => {
  const hashtags = value.trim().split(/\s+/).filter(Boolean);
  return hashtags.length <= MAX_HASHTAG_COUNT;
};

const validateHashtagFormat = (value) => {
  const hashtags = value.trim().split(/\s+/).filter(Boolean);

  for (const hashtag of hashtags) {
    if (hashtag === '#') {
      return false;
    }
    if (hashtag.length > MAX_HASHTAG_LENGTH) {
      return false;
    }
    if (!HASHTAG_REGEX.test(hashtag)) {
      return false;
    }
  }
  return true;
};

const validateHashtagUnique = (value) => {
  const hashtags = value.trim().split(/\s+/).filter(Boolean);
  const lowerCaseHashtags = hashtags.map((tag) => tag.toLowerCase());
  const uniqueHashtags = new Set(lowerCaseHashtags);
  return uniqueHashtags.size === hashtags.length;
};

const validateComment = (value) => value.length <= MAX_COMMENT_LENGTH;

const blockSubmitButton = () => {
  submitButton.disabled = true;
  submitButton.textContent = 'Отправляю...';
};

const unblockSubmitButton = () => {
  submitButton.disabled = false;
  submitButton.textContent = 'Опубликовать';
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

const onDocumentKeydown = (evt) => {
  if (isEscapeKey(evt)) {
    if (evt.target === hashtagInput || evt.target === commentInput) {
      return;
    }
    evt.preventDefault();
    closeForm();
  }
};

const openForm = () => {
  uploadOverlay.classList.remove('hidden');
  document.body.classList.add('modal-open');

  const file = uploadInput.files[0];
  if (file) {
    const imageUrl = URL.createObjectURL(file);
    const previewImage = document.querySelector('.img-upload__preview img');
    const effectPreviews = document.querySelectorAll('.effects__preview');

    previewImage.src = imageUrl;
    effectPreviews.forEach((preview) => {
      preview.style.backgroundImage = `url(${imageUrl})`;
    });
  }

  document.addEventListener('keydown', onDocumentKeydown);
  cancelButton.addEventListener('click', closeForm);
  form.addEventListener('submit', onFormSubmit);
};

const showMessage = (type) => {
  const template = document.querySelector(`#${type}`);
  const messageElement = template.content.querySelector(`.${type}`).cloneNode(true);
  document.body.appendChild(messageElement);

  const onMessageKeydown = (evt) => {
    if (isEscapeKey(evt)) {
      closeMessage();
    }
  };

  const onDocumentClick = (evt) => {
    if (!evt.target.closest(`.${type}__inner`)) {
      closeMessage();
    }
  };

  const closeMessage = () => {
    messageElement.remove();
    document.removeEventListener('keydown', onMessageKeydown);
    document.removeEventListener('click', onDocumentClick);
  };

  const closeButton = messageElement.querySelector(`.${type}__button`);
  closeButton.addEventListener('click', closeMessage);
  document.addEventListener('keydown', onMessageKeydown);
  document.addEventListener('click', onDocumentClick);
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

pristine.addValidator(
  hashtagInput,
  validateHashtagCount,
  `Максимум ${MAX_HASHTAG_COUNT} хэш-тегов`,
  2,
  false
);

pristine.addValidator(
  hashtagInput,
  validateHashtagFormat,
  `Хэш-тег должен начинаться с # и содержать только буквы и цифры (длина до ${MAX_HASHTAG_LENGTH} символов)`,
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
  `Длина комментария не должна превышать ${MAX_COMMENT_LENGTH} символов`,
  1,
  false
);

hashtagInput.addEventListener('input', () => {
  pristine.validate();
});

commentInput.addEventListener('input', () => {
  pristine.validate();
});

uploadInput.addEventListener('change', openForm);
