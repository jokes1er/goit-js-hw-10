import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const refs = {
  inputEl: document.querySelector('#datetime-picker'),
  startBtnEl: document.querySelector('[data-start]'),
  daysEl: document.querySelector('[data-days]'),
  hoursEl: document.querySelector('[data-hours]'),
  minutesEl: document.querySelector('[data-minutes]'),
  secondsEl: document.querySelector('[data-seconds]'),
};

refs.startBtnEl.disabled = true;

let userSelectedDate;

function showErrorToast() {
  iziToast.show({
    title: 'Error',
    message: '❌ Please choose a date in the future',
    color: 'red',
    position: 'topRight',
    timeout: 1500,
    progressBar: true,
    close: false,
  });
}
function showSuccesToast() {
  iziToast.show({
    title: 'Succes',
    message: '✅ The time is over',
    color: 'green',
    position: 'topRight',
    timeout: 1500,
    progressBar: true,
    close: false,
  });
}

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    userSelectedDate = selectedDates[0];
    if (userSelectedDate < new Date()) {
      showErrorToast();
      refs.startBtnEl.disabled = true;
    } else {
      refs.startBtnEl.disabled = false;
    }
  },
};

flatpickr(refs.inputEl, options);

function onStartBtnClick() {
  if (userSelectedDate < new Date()) {
    showErrorToast();
  } else {
    refs.startBtnEl.disabled = false;
  }

  const timer = setInterval(() => {
    const currentDate = new Date();
    const dateDifference = userSelectedDate - currentDate;
    refs.inputEl.disabled = true;
    refs.startBtnEl.disabled = true;

    if (dateDifference <= 0) {
      clearInterval(timer);
      updateClock(0, 0, 0, 0);
      refs.inputEl.disabled = false;
      showSuccesToast();
      return;
    }

    const { days, hours, minutes, seconds } = convertMs(dateDifference);
    updateClock(days, hours, minutes, seconds);
  }, 1000);
}

refs.startBtnEl.addEventListener('click', onStartBtnClick);

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);

  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function updateClock(days, hours, minutes, seconds) {
  refs.daysEl.textContent = addLeadingZero(days);
  refs.hoursEl.textContent = addLeadingZero(hours);
  refs.minutesEl.textContent = addLeadingZero(minutes);
  refs.secondsEl.textContent = addLeadingZero(seconds);
}
