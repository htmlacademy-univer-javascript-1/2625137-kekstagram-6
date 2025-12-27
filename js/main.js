import { getData } from './api.js';
import { renderGallery } from './gallery.js';
import './form-validator.js';
import './effects.js';

getData()
  .then((pictures) => {
    renderGallery(pictures);
  })
  .catch(() => {
    alert('Не удалось загрузить фотографии. Попробуйте обновить страницу.');
  });
