import AbstractComponent from './abstract-component';
import { MONTHS } from '../const';

const createTripDayTemplate = (day, idx, isShowDayInfo) => {
  const formatDay = day.toLocaleDateString().split('.').reverse().join('-');
  const currentDate = new Date(formatDay);
  const dayNumber = currentDate.getDate();
  const month = MONTHS[currentDate.getMonth()];

  const dayInfo = isShowDayInfo ? `<span class="day__counter">${idx + 1}</span>
    <time class="day__date" datetime="${formatDay}">${month} ${dayNumber}</time>`
    : '';

  return (
    `<li class="trip-days__item  day">
      <div class="day__info">
        ${dayInfo}
      </div>


    </li>
    `);
};

export default class TripDay extends AbstractComponent {
  #day = null;

  #idx = null;

  #isShowDayInfo;

  constructor(day, idx, isShowDayInfo) {
    super();

    this.#day = day;
    this.#idx = idx;
    this.#isShowDayInfo = isShowDayInfo;
  }

  getTemplate() {
    return createTripDayTemplate(this.#day, this.#idx, this.#isShowDayInfo);
  }
}
