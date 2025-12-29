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
  const previewImage = document.querySelector('.img-upload__preview img');
  const effectsPreviews = document.querySelectorAll('.effects__preview');

  const FILE_TYPES = ['jpg', 'jpeg', 'png'];

  const pristine = new Pristine(form, {
    classTo: 'img-upload__field-wrapper',
    errorClass: 'img-upload__field-wrapper--invalid',
    successClass: 'img-upload__field-wrapper--valid',
    errorTextParent: 'img-upload__field-wrapper',
    errorTextTag: 'div',
    errorTextClass: 'img-upload__error'
  });

  function closeForm() {
    uploadOverlay.classList.add('hidden');
    document.body.classList.remove('modal-open');

    form.reset();
    pristine.reset();
    uploadInput.value = '';
    resetEffects();

    document.removeEventListener('keydown', onDocumentKeydown);
    cancelButton.removeEventListener('click', closeForm);
    form.removeEventListener('submit', onFormSubmit);

    previewImage.src = 'img/upload-default-image.jpg';
    effectsPreviews.forEach((preview) => {
      preview.style.backgroundImage = '';
    });
  }

  function onDocumentKeydown(evt) {
    if (evt.key === 'Escape') {
      if (evt.target === hashtagInput || evt.target === commentInput) {
        return;
      }
      evt.preventDefault();
      closeForm();
    }
  }

  function loadImage() {
    const file = uploadInput.files[0];
    if (!file) {
      return;
    }

    const fileName = file.name.toLowerCase();
    const matches = FILE_TYPES.some((type) => fileName.endsWith(type));

    if (!matches) {
      return;
    }

    const reader = new FileReader();

    reader.addEventListener('load', () => {
      previewImage.src = reader.result;
      effectsPreviews.forEach((preview) => {
        preview.style.backgroundImage = `url(${reader.result})`;
      });
    });

    reader.readAsDataURL(file);
  }

  function openForm() {
    loadImage();
    uploadOverlay.classList.remove('hidden');
    document.body.classList.add('modal-open');
    document.addEventListener('keydown', onDocumentKeydown);
    cancelButton.addEventListener('click', closeForm);
    form.addEventListener('submit', onFormSubmit);
  }

  function showMessage(templateId) {
    const template = document.querySelector(`#${templateId}`);
    const messageElement = template.content.querySelector(`.${templateId}`).cloneNode(true);
    document.body.appendChild(messageElement);

    function onMessageKeydown(evt) {
      if (evt.key === 'Escape') {
        closeMessage();
      }
    }

    function onDocumentClick(evt) {
      if (!evt.target.closest(`.${templateId}__inner`)) {
        closeMessage();
      }
    }

    function closeMessage() {
      messageElement.remove();
      document.removeEventListener('keydown', onMessageKeydown);
      document.removeEventListener('click', onDocumentClick);
    }

    const closeButton = messageElement.querySelector(`.${templateId}__button`);
    closeButton.addEventListener('click', closeMessage);
    document.addEventListener('keydown', onMessageKeydown);
    document.addEventListener('click', onDocumentClick);
  }

  function validateHashtagCount(value) {
    if (!value.trim()) {return true;}
    const hashtags = value.trim().split(/\s+/);
    return hashtags.length <= 5;
  }

  function validateHashtagFormat(value) {
    if (!value.trim()) {return true;}
    const hashtags = value.trim().split(/\s+/);

    for (const hashtag of hashtags) {
      if (hashtag === '#') {return false;}
      if (hashtag.length > 20) {return false;}
      if (!/^#[A-Za-zА-Яа-яЁё0-9]+$/.test(hashtag)) {return false;}
    }
    return true;
  }

  function validateHashtagUnique(value) {
    if (!value.trim()) {return true;}
    const hashtags = value.trim().split(/\s+/);
    const lowerCaseHashtags = hashtags.map((tag) => tag.toLowerCase());
    const uniqueHashtags = new Set(lowerCaseHashtags);
    return uniqueHashtags.size === hashtags.length;
  }

  function validateComment(value) {
    return value.length <= 140;
  }

  function blockSubmitButton() {
    submitButton.disabled = true;
    submitButton.textContent = 'Отправляю...';
  }

  function unblockSubmitButton() {
    submitButton.disabled = false;
    submitButton.textContent = 'Опубликовать';
  }

  function onFormSubmit(evt) {
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
  }

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

  hashtagInput.addEventListener('input', () => {
    pristine.validate();
  });

  commentInput.addEventListener('input', () => {
    pristine.validate();
  });

  uploadInput.addEventListener('change', openForm);
});
