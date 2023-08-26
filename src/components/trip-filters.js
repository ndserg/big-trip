import { createElement } from '../utils/utils';

const createTripFilterTemplate = (name, idx) => {
  const isChecked = idx === 0 ? 'checked' : '';

  return (
    `<div class="trip-filters__filter">
      <input id="filter-${name}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${name}" ${isChecked}>
      <label class="trip-filters__filter-label" for="filter-${name}">${name}</label>
    </div>
  `);
};

const createTripFiltersTemplate = (filterTypes) => {
  const filters = filterTypes.map((filter, idx) => createTripFilterTemplate(filter, idx)).join('\n');

  return (
    `<h2 class="visually-hidden">Filter events</h2>
    <form class="trip-filters" action="#" method="get">
      ${filters}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>
  `);
};

export default class TripFilters {
  #element = null;

  #filterTypes = null;

  constructor(FLITER_TYPES) {
    this.#element = null;
    this.#filterTypes = FLITER_TYPES;
  }

  getTemplate() {
    return createTripFiltersTemplate(this.#filterTypes);
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
