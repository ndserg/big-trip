import { createElement } from '../utils/utils';

const createTripEventsTemplate = () => {
  return (
    `<section class="trip-events">
      <h2 class="visually-hidden">Trip events</h2>
    </section>
    `);
};

export default class TripEvents {
  #element = null;

  constructor() {
    this.#element = null;
  }

  getTemplate() {
    return createTripEventsTemplate();
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
