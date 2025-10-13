import {getRandomNumber} from './util.js';

const NAMES = [
  'Иван',
  'Хуан Себастьян',
  'Мария',
  'Кристоф',
  'Виктор',
  'Юлия',
  'Люпита',
  'Вашингтон',
];

const TEXT = `Всё отлично!
В целом всё неплохо. Но не всё.
Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.
Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.
Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.
Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!`;

const randomNameIndex = getRandomNumber(0, NAMES.length - 1);

const generateMessage = function(text){

  const CLEANED_TEXT = text.replace(/\n/g, '');
  const allSentences = CLEANED_TEXT.match(/[^.?!]+[.?!]+/g);

  const numSentences = getRandomNumber(1, 2);
  const maxIndex = allSentences.length - 1;
  let message = '';

  if (numSentences === 1) {
    const randomIndex = getRandomNumber(0, maxIndex);
    message = allSentences[randomIndex];
  } else {
    let firstIndex = getRandomNumber(0, maxIndex);
    let secondIndex = getRandomNumber(0, maxIndex);


    while (secondIndex === firstIndex) {
      secondIndex = getRandomNumber(0, maxIndex);
    }

    message = allSentences[firstIndex] + ' ' + allSentences[secondIndex];
  }
  return message;
};

let commentIdCounter = 0;

const createComment = function(){
  commentIdCounter += 1;
  const newId = commentIdCounter;

  return {
    id: newId,
    avatar: `img/avatar-${getRandomNumber(1, 6)}.svg`,
    message: generateMessage(TEXT),
    name: NAMES[randomNameIndex],
  };
};

const generateComments = function(){

  const COMMENTS = [];
  const MAX_COUNT = getRandomNumber(0, 30);

  for (let i = 0; i < MAX_COUNT; i++) {
    const newComment = createComment();
    COMMENTS.push(newComment);
  }

  return COMMENTS;
};

const createObject = function(){
  const ID = getRandomNumber(1, 25);

  return {
    id: ID,
    url: `photos/${ID}.jpg`,
    description: `Описание фотографии №${ID}`,
    likes: getRandomNumber(15, 200),
    comments: generateComments(),
  };
};

const generateObjects = function(){

  let objects = [];

  for (let i = 0; i < 25; i++) {
    const newObject = createObject();
    objects.push(newObject);
  }

  return objects;
};

export { generateObjects };
