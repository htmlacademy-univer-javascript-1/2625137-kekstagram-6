import { renderThumbnails } from './thumbnail.js';
import { showBigPicture } from './big-picture.js';

const container = document.querySelector('.pictures');
let currentPictures = [];

function removeThumbnails() {
  const thumbnails = container.querySelectorAll('.picture');
  thumbnails.forEach((thumbnail) => {
    thumbnail.remove();
  });
}

function renderGallery(pictures) {
  currentPictures = pictures;
  removeThumbnails();
  renderThumbnails(pictures, container);
}

function onContainerClick(evt) {
  const thumbnail = evt.target.closest('[data-thumbnail-id]');
  if (!thumbnail) {
    return;
  }

  evt.preventDefault();
  const picture = currentPictures.find(
    (item) => item.id === +thumbnail.dataset.thumbnailId
  );
  showBigPicture(picture);
}

container.addEventListener('click', onContainerClick);

export { renderGallery };
