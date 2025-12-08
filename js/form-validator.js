import { resetEffects } from './effects.js';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('#upload-select-image');
  const hashtagInput = form.querySelector('.text__hashtags');
  const commentInput = form.querySelector('.text__description');
  const uploadInput = document.querySelector('#upload-file');
  const uploadOverlay = form.querySelector('.img-upload__overlay');
  const cancelButton = form.querySelector('#upload-cancel');

  const pristine = new Pristine(form, {
    classTo: 'img-upload__field-wrapper',
    errorTextParent: 'img-upload__field-wrapper',
    errorTextClass: 'img-upload__error'
  });

  const validateHashtags = (value) => {
    if (!value.trim()) {
      return true;
    }

    const hashtags = value.trim().split(/\s+/);

    if (hashtags.length > 5) {
      return false;
    }

    for (const hashtag of hashtags) {
      if (hashtag === '#') {
        return false;
      }

      if (hashtag.length > 20) {
        return false;
      }

      if (!/^#[A-Za-zА-Яа-яЁё0-9]+$/.test(hashtag)) {
        return false;
      }
    }

    const lowerCaseHashtags = hashtags.map((tag) => tag.toLowerCase());
    const uniqueHashtags = new Set(lowerCaseHashtags);

    return uniqueHashtags.size === hashtags.length;
  };

  const validateComment = (value) => value.length <= 140;


  pristine.addValidator(hashtagInput, validateHashtags, 'Некорректные хэш-теги');
  pristine.addValidator(commentInput, validateComment, 'Длина комментария не должна превышать 140 символов');

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
    const isValid = pristine.validate();

    if (!isValid) {
      evt.preventDefault();
    }
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
