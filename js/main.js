import { getData } from './api.js';
import { initFilters } from './filter.js';
import { showAlert } from './utils.js';
import './form-validator.js';
import './effects.js';

getData()
  .then((pictures) => {
    initFilters(pictures);
  })
  .catch(() => {
    showAlert('Не удалось загрузить фотографии. Попробуйте обновить страницу.');
  });
