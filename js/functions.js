function checkStringLength( str, length ) {
  return str.length <= length;
}

console.log('--- checkStringLength tests ---');
console.log(checkStringLength('проверяемая строка', 20)); // true
// Длина строки ровно 18 символов
console.log(checkStringLength('проверяемая строка', 18)); // true
// Строка длиннее 10 символов
console.log(checkStringLength('проверяемая строка', 10)); // false

function isPalindrome(str) {
  str = str.toLowerCase().replaceAll(' ', '');
  const reversedStr = str.split('').reverse().join('');
  return str === reversedStr;
}

console.log('\n--- isPalindrome tests ---');
// Строка является палиндромом
console.log(isPalindrome('топот')); // true
// Несмотря на разный регистр, тоже палиндром
console.log(isPalindrome('ДовОд')); // true
// Это не палиндром
console.log(isPalindrome('Кекс')); // false
// Это палиндром
console.log(isPalindrome('Лёша на полке клопа нашёл ')); // true

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

console.log('\n--- getNumbers tests ---');
console.log(getNumbers('2023 год')); // 2023
console.log(getNumbers('ECMAScript 2022')); // 2022
console.log(getNumbers('1 кефир, 0.5 батона')); // 105
console.log(getNumbers('агент 007')); // 7
console.log(getNumbers('а я томат')); // NaN
console.log(getNumbers(2023)); // 2023
console.log(getNumbers(-1)); // 1
console.log(getNumbers(1.5)); // 15
