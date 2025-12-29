import { renderThumbnails } from './thumbnail.js';
import { showBigPicture } from './big-picture.js';

const container = document.querySelector('.pictures');
let currentPictures = [];

const removeThumbnails = () => {
  const thumbnails = container.querySelectorAll('.picture');
  thumbnails.forEach((thumbnail) => thumbnail.remove());
};

const renderGallery = (pictures) => {
  currentPictures = pictures;
  removeThumbnails();
  renderThumbnails(pictures, container);
};

container.addEventListener('click', (evt) => {
  const thumbnail = evt.target.closest('[data-thumbnail-id]');
  if (!thumbnail) {
    return;
  }

  evt.preventDefault();
  const picture = currentPictures.find(
    (item) => item.id === +thumbnail.dataset.thumbnailId
  );
  showBigPicture(picture);
});

export { renderGallery };
