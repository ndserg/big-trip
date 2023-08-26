import AbstractComponent from './abstract-component';

const createTripTabItemTemplate = (name, idx) => {
  const isActive = idx === 0 ? 'trip-tabs__btn--active' : '';

  return (`<a class="trip-tabs__btn  ${isActive}" href="#">${name}</a>`);
};

const createTripTabsTemplate = (tabs) => {
  const tripTabs = tabs.map((tabName, idx) => createTripTabItemTemplate(tabName, idx)).join('\n');

  return (
    `<div>
      <h2 class="visually-hidden">Switch trip view</h2>
      <nav class="trip-controls__trip-tabs  trip-tabs">
        ${tripTabs}
      </nav>
    </div>
  `);
};

export default class TripTabs extends AbstractComponent {
  #tabs = null;

  constructor(TABS) {
    super();

    this.#tabs = TABS;
  }

  getTemplate() {
    return createTripTabsTemplate(this.#tabs);
  }
}
