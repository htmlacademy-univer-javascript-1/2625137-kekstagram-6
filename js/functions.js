function checkStringLength( str, length ) {
  return str.length <= length;
}

function isPalindrome(str) {
  str = str.toLowerCase().replaceAll(' ', '');
  const reversedStr = str.split('').reverse().join('');
  return str === reversedStr;
}

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


function isMeetingValid(startWork, endWork, startMeeting, meetingDuration) {
  const timeToMinutes = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const startWorkMinutes = timeToMinutes(startWork);
  const endWorkMinutes = timeToMinutes(endWork);
  const startMeetingMinutes = timeToMinutes(startMeeting);
  const endMeetingMinutes = startMeetingMinutes + meetingDuration;

  return startMeetingMinutes >= startWorkMinutes && endMeetingMinutes <= endWorkMinutes;
}

console.log(isMeetingValid('08:00', '17:30', '14:00', 90)); // true
console.log(isMeetingValid('8:0', '10:0', '8:0', 120));     // true
console.log(isMeetingValid('08:00', '14:30', '14:00', 90)); // false
console.log(isMeetingValid('14:00', '17:30', '08:0', 90));  // false
console.log(isMeetingValid('8:00', '17:30', '08:00', 900)); // false
