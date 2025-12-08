const SCALE_STEP = 25;
const SCALE_MIN = 25;
const SCALE_MAX = 100;
const SCALE_DEFAULT = 100;

const EFFECTS = {
  none: { min: 0, max: 100, step: 1, unit: '', filter: 'none' },
  chrome: { min: 0, max: 1, step: 0.1, unit: '', filter: 'grayscale' },
  sepia: { min: 0, max: 1, step: 0.1, unit: '', filter: 'sepia' },
  marvin: { min: 0, max: 100, step: 1, unit: '%', filter: 'invert' },
  phobos: { min: 0, max: 3, step: 0.1, unit: 'px', filter: 'blur' },
  heat: { min: 1, max: 3, step: 0.1, unit: '', filter: 'brightness' }
};

const scaleControl = document.querySelector('.scale__control--value');
const scaleSmaller = document.querySelector('.scale__control--smaller');
const scaleBigger = document.querySelector('.scale__control--bigger');
const previewImage = document.querySelector('.img-upload__preview img');
const effectLevelContainer = document.querySelector('.img-upload__effect-level');
const effectLevelSlider = document.querySelector('.effect-level__slider');
const effectLevelValue = document.querySelector('.effect-level__value');
const effectsList = document.querySelector('.effects__list');

let currentScale = SCALE_DEFAULT;
let currentEffect = 'none';

const updateScale = () => {
  scaleControl.value = `${currentScale}%`;
  previewImage.style.transform = `scale(${currentScale / 100})`;
};

scaleSmaller.addEventListener('click', () => {
  currentScale = Math.max(currentScale - SCALE_STEP, SCALE_MIN);
  updateScale();
});

scaleBigger.addEventListener('click', () => {
  currentScale = Math.min(currentScale + SCALE_STEP, SCALE_MAX);
  updateScale();
});

noUiSlider.create(effectLevelSlider, {
  range: { min: 0, max: 100 },
  start: 100,
  step: 1,
  connect: 'lower',
});

effectLevelSlider.noUiSlider.on('update', (values) => {
  const value = values[0];
  effectLevelValue.value = value;

  if (currentEffect !== 'none') {
    const effect = EFFECTS[currentEffect];
    previewImage.style.filter = `${effect.filter}(${value}${effect.unit})`;
  }
});

effectsList.addEventListener('change', (evt) => {
  if (evt.target.matches('input[type="radio"]')) {
    currentEffect = evt.target.value;

    if (currentEffect === 'none') {
      effectLevelContainer.classList.add('hidden');
      previewImage.style.filter = 'none';
      effectLevelSlider.noUiSlider.set(100);
    } else {
      effectLevelContainer.classList.remove('hidden');
      const effect = EFFECTS[currentEffect];
      effectLevelSlider.noUiSlider.updateOptions({
        range: { min: effect.min, max: effect.max },
        start: effect.max,
        step: effect.step
      });
    }
  }
});

const resetEffects = () => {
  currentScale = SCALE_DEFAULT;
  currentEffect = 'none';

  updateScale();

  const originalEffect = document.querySelector('#effect-none');
  if (originalEffect) {
    originalEffect.checked = true;
  }

  effectLevelContainer.classList.add('hidden');
  previewImage.style.filter = 'none';

  if (effectLevelSlider.noUiSlider) {
    effectLevelSlider.noUiSlider.updateOptions({
      range: { min: 0, max: 100 },
      start: 100,
      step: 1
    });
  }
};

updateScale();
effectLevelContainer.classList.add('hidden');

export { resetEffects };
