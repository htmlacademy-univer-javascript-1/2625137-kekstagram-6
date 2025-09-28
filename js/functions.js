function checkStringLength( str, length ) {
  return length(str) <= length;
}

// Cтрока короче 20 символов
checkStringLength('проверяемая строка', 20); // true
// Длина строки ровно 18 символов
checkStringLength('проверяемая строка', 18); // true
// Строка длиннее 10 символов
checkStringLength('проверяемая строка', 10); // false

function isPalindrome(str) {
  str = str.toLowerCase();
  str = str.replace(' ', '');
  const reversedStr = str.split('').reverse().join('');
  return str === reversedStr;
}

// Строка является палиндромом
isPalindrome('топот'); // true
// Несмотря на разный регистр, тоже палиндром
isPalindrome('ДовОд'); // true
// Это не палиндром
isPalindrome('Кекс');  // false
// Это палиндром
isPalindrome('Лёша на полке клопа нашёл '); // true

function getNumbers(value) {
  const str = String(value);
  let result = '';

  for (let i = 0; i < str.length; i++) {
    const char = parseInt(str[i], 10);
    if (!isNaN(char)) {
      result += char;
    }
  }

  if (result === '') {
    return NaN;
  }

  return parseInt(result, 10);
}

getNumbers('2023 год');            // 2023
getNumbers('ECMAScript 2022');     // 2022
getNumbers('1 кефир, 0.5 батона'); // 105
getNumbers('агент 007');           // 7
getNumbers('а я томат');           // NaN
getNumbers(2023); // 2023
getNumbers(-1);   // 1
getNumbers(1.5);  // 15
