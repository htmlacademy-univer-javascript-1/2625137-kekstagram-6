import { isEscapeKey } from './utils.js';

const COMMENTS_PER_PORTION = 5;

const bigPictureElement = document.querySelector('.big-picture');
const commentCountElement = bigPictureElement.querySelector('.social__comment-count');
const commentListElement = bigPictureElement.querySelector('.social__comments');
const commentsLoaderElement = bigPictureElement.querySelector('.comments-loader');
const bodyElement = document.querySelector('body');
const cancelButtonElement = bigPictureElement.querySelector('.big-picture__cancel');
const commentElement = document.querySelector('#comment').content.querySelector('.social__comment');

let currentComments = [];
let commentsShown = 0;

function onDocumentKeydown(evt) {
  if (isEscapeKey(evt)) {
    evt.preventDefault();
    closeBigPicture();
  }
}

function onCommentsLoaderClick() {
  renderComments();
}

function onCancelButtonClick() {
  closeBigPicture();
}

function createComment(data) {
  const comment = commentElement.cloneNode(true);

  comment.querySelector('.social__picture').src = data.avatar;
  comment.querySelector('.social__picture').alt = data.name;
  comment.querySelector('.social__text').textContent = data.message;

  return comment;
}

function renderComments() {
  const commentsToShow = currentComments.slice(commentsShown, commentsShown + COMMENTS_PER_PORTION);
  const fragment = document.createDocumentFragment();

  commentsToShow.forEach((item) => {
    const comment = createComment(item);
    fragment.append(comment);
  });

  commentListElement.append(fragment);
  commentsShown += commentsToShow.length;

  commentCountElement.innerHTML = `${commentsShown} из <span class="comments-count">${currentComments.length}</span> комментариев`;

  const existingShownCount = commentCountElement.querySelector('.social__comment-shown-count');
  const existingTotalCount = commentCountElement.querySelector('.social__comment-total-count');

  if (!existingShownCount) {
    const shownSpan = document.createElement('span');
    shownSpan.className = 'social__comment-shown-count';
    shownSpan.textContent = commentsShown;
    commentCountElement.innerHTML = '';
    commentCountElement.appendChild(shownSpan);
    commentCountElement.appendChild(document.createTextNode(' из '));
  }

  if (!existingTotalCount) {
    const totalSpan = document.createElement('span');
    totalSpan.className = 'social__comment-total-count';
    totalSpan.textContent = currentComments.length;
    if (commentCountElement.childNodes.length >= 3) {
      commentCountElement.replaceChild(totalSpan, commentCountElement.childNodes[2]);
    } else {
      commentCountElement.appendChild(totalSpan);
    }
    commentCountElement.appendChild(document.createTextNode(' комментариев'));
  } else {
    existingTotalCount.textContent = currentComments.length;
  }

  if (commentsShown >= currentComments.length) {
    commentsLoaderElement.classList.add('hidden');
  } else {
    commentsLoaderElement.classList.remove('hidden');
  }
}

function renderPictureDetails(data) {
  bigPictureElement.querySelector('.big-picture__img img').src = data.url;
  bigPictureElement.querySelector('.big-picture__img img').alt = data.description;
  bigPictureElement.querySelector('.likes-count').textContent = data.likes;
  bigPictureElement.querySelector('.social__caption').textContent = data.description;
}

function closeBigPicture() {
  bigPictureElement.classList.add('hidden');
  bodyElement.classList.remove('modal-open');
  document.removeEventListener('keydown', onDocumentKeydown);
  commentsLoaderElement.removeEventListener('click', onCommentsLoaderClick);
  currentComments = [];
  commentsShown = 0;
}

function showBigPicture(data) {
  bigPictureElement.classList.remove('hidden');
  bodyElement.classList.add('modal-open');

  commentCountElement.classList.remove('hidden');
  commentsLoaderElement.classList.remove('hidden');

  document.addEventListener('keydown', onDocumentKeydown);
  commentsLoaderElement.addEventListener('click', onCommentsLoaderClick);

  renderPictureDetails(data);

  currentComments = data.comments;
  commentsShown = 0;
  commentListElement.innerHTML = '';

  renderComments();
}

cancelButtonElement.addEventListener('click', onCancelButtonClick);

export { showBigPicture };
