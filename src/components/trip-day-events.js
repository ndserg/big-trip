import { createElement } from '../utils/utils';

const createDayEventsTemplate = () => {
  return (
    `<ul class="trip-events__list">

    </ul>
    `);
};

export default class TripDayEvents {
  #element = null;

  constructor() {
    this.#element = null;
  }

  getTemplate() {
    return createDayEventsTemplate();
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
