import { createElement } from '../utils/utils';

const createTripTabItemTemplate = (name, idx) => {
  const isActive = idx === 0 ? 'trip-tabs__btn--active' : '';

  return (`<a class="trip-tabs__btn  ${isActive}" href="#">${name}</a>`);
};

const createTripTabsTemplate = (tabs) => {
  const tripTabs = tabs.map((tabName, idx) => createTripTabItemTemplate(tabName, idx)).join('\n');

  return (
    `<h2 class="visually-hidden">Switch trip view</h2>
    <nav class="trip-controls__trip-tabs  trip-tabs">
      ${tripTabs}
    </nav>
  `);
};

export default class TripTabs {
  #element = null;

  #tabs = null;

  constructor(TABS) {
    this.#element = null;
    this.#tabs = TABS;
  }

  getTemplate() {
    return createTripTabsTemplate(this.#tabs);
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
