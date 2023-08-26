import { createElement } from '../utils/utils';

const createTripDaysTemplate = () => {
  return (
    `<ul class="trip-days">
    </ul>
    `);
};

export default class TripDays {
  #element = null;

  constructor() {
    this.#element = null;
  }

  getTemplate() {
    return createTripDaysTemplate();
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
