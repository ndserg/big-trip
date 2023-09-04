import AbstractComponent from './abstract-component';

const createTripFilterTemplate = ({ name, checked }) => {
  const isChecked = checked ? 'checked' : '';

  return (
    `<div class="trip-filters__filter">
      <input id="filter-${name}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${name}" ${isChecked}>
      <label class="trip-filters__filter-label" for="filter-${name}" data-filter-type="${name}">${name}</label>
    </div>
  `);
};

const createTripFiltersTemplate = (filterTypes) => {
  const filters = filterTypes.map((filter) => createTripFilterTemplate(filter)).join('\n');

  return (
    `<div>
      <h2 class="visually-hidden">Filter events</h2>
      <form class="trip-filters" action="#" method="get">
        ${filters}
        <button class="visually-hidden" type="submit">Accept filter</button>
      </form>
    </div>
  `);
};

export default class TripFilters extends AbstractComponent {
  #filters = [];

  constructor(filters) {
    super();

    this.#filters = filters;
  }

  getTemplate() {
    return createTripFiltersTemplate(this.#filters);
  }

  setFilterChangeHandler(handler) {
    this.getElement().addEventListener('click', (evt) => {
      evt.preventDefault();

      if (evt.target.tagName === 'LABEL') {
        handler(evt.target.dataset.filterType);
      }
    });
  }
}
