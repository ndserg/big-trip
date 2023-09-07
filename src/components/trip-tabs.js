import AbstractSmartComponent from './abstract-smart-component';

const createTripTabItemTemplate = (name, activeTab) => {
  const isActive = name === activeTab ? 'trip-tabs__btn--active' : '';

  return (`<a class="trip-tabs__btn  ${isActive}" href="#">${name}</a>`);
};

const createTripTabsTemplate = (tabs, activeTab) => {
  const tripTabs = Object.values(tabs).map((tabName) => createTripTabItemTemplate(tabName, activeTab)).join('\n');

  return (
    `<div>
      <h2 class="visually-hidden">Switch trip view</h2>
      <nav class="trip-controls__trip-tabs trip-tabs">
        ${tripTabs}
      </nav>
    </div>
  `);
};

export default class TripTabs extends AbstractSmartComponent {
  #tabs = null;
  #activeTab = null;

  #tabsChangeHandler = null;

  constructor(Tabs, activeTab) {
    super();

    this.#tabs = Tabs;
    this.#activeTab = activeTab;
  }

  getTemplate() {
    return createTripTabsTemplate(this.#tabs, this.#activeTab);
  }

  set activeTab(tab) {
    this.#activeTab = tab;
    this.rerender();
  }

  recoveryListeners() {
    this.setTabsChangeHandler(this.#tabsChangeHandler);
  }

  rerender() {
    super.rerender();
  }

  setTabsChangeHandler(handler) {
    this.getElement().addEventListener('click', (evt) => {
      evt.preventDefault();

      if (evt.target.tagName === 'A') {
        handler(evt.target.textContent);
      }

      this.#tabsChangeHandler = handler;

      this.rerender();
    });
  }
}
