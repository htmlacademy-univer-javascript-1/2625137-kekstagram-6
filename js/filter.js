import { renderGallery } from './gallery.js';

const filtersContainer = document.querySelector('.img-filters');
const filtersForm = filtersContainer.querySelector('.img-filters__form');
const filterButtons = filtersForm.querySelectorAll('.img-filters__button');

const showFilters = () => {
  filtersContainer.classList.remove('img-filters--inactive');
};

const debounce = (callback, timeoutDelay = 500) => {
  let timeoutId;
  return (...rest) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback.apply(this, rest), timeoutDelay);
  };
};

const filterDefault = (pictures) => pictures;

const filterRandom = (pictures) => {
  const shuffled = [...pictures].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 10);
};

const filterDiscussed = (pictures) => [...pictures].sort((a, b) => b.comments.length - a.comments.length);

const initFilters = (pictures) => {
  showFilters();

  let activeFilter = 'filter-default';

  const applyFilter = (filterType) => {
    let filteredPictures;

    switch (filterType) {
      case 'filter-random':
        filteredPictures = filterRandom(pictures);
        break;
      case 'filter-discussed':
        filteredPictures = filterDiscussed(pictures);
        break;
      default:
        filteredPictures = filterDefault(pictures);
    }

    filterButtons.forEach((button) => {
      button.classList.remove('img-filters__button--active');
      if (button.id === filterType) {
        button.classList.add('img-filters__button--active');
      }
    });

    renderGallery(filteredPictures);
  };

  const debouncedApplyFilter = debounce(applyFilter, 500);

  filterButtons.forEach((button) => {
    button.addEventListener('click', (evt) => {
      evt.preventDefault();
      const selectedFilter = evt.target.id;
      if (selectedFilter !== activeFilter) {
        activeFilter = selectedFilter;
        debouncedApplyFilter(activeFilter);
      }
    });
  });

  applyFilter('filter-default');
};

export { initFilters };
