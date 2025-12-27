const GET_URL = 'https://29.javascript.htmlacademy.pro/kekstagram/data';
const POST_URL = 'https://29.javascript.htmlacademy.pro/kekstagram';

const getData = () => fetch(GET_URL)
  .then((response) => {
    if (!response.ok) {
      throw new Error('Ошибка загрузки данных');
    }
    return response.json();
  });

const sendData = (formData) => fetch(POST_URL, {
  method: 'POST',
  body: formData,
})
  .then((response) => {
    if (!response.ok) {
      throw new Error('Ошибка отправки');
    }
    return response.json();
  });

export { getData, sendData };
