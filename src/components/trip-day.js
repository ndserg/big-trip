import { createElement } from '../utils/utils';
import { MONTHS } from '../const';

const createTripDayTemplate = (day, idx) => {
  const formatDay = day.split('.').reverse().join('-');
  const currentDate = new Date(formatDay);
  const dayNumber = currentDate.getDate();
  const month = MONTHS[currentDate.getMonth()];

  return (
    `<li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">${idx + 1}</span>
        <time class="day__date" datetime="${formatDay}">${month} ${dayNumber}</time>
      </div>


    </li>
    `);
};

export default class TripDay {
  #element = null;

  #day = null;

  #idx = null;

  constructor(day, idx) {
    this.#element = null;
    this.#day = day;
    this.#idx = idx;
  }

  getTemplate() {
    return createTripDayTemplate(this.#day, this.#idx);
  }

  getElement() {
    if (!this.#element) {
      this.#element = createElement(this.getTemplate());
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
