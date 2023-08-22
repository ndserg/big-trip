import { FLITER_TYPES } from '../const';

const createTripFilterTemplate = (name, idx) => {
  const isChecked = idx === 0 ? 'checked' : '';

  return (
    `<div class="trip-filters__filter">
      <input id="filter-${name}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${name}" ${isChecked}>
      <label class="trip-filters__filter-label" for="filter-${name}">${name}</label>
    </div>
  `);
};

export const createTripFiltersTemplate = () => {
  const filters = FLITER_TYPES.map((filter, idx) => createTripFilterTemplate(filter, idx)).join('\n');

  return (
    `<h2 class="visually-hidden">Filter events</h2>
    <form class="trip-filters" action="#" method="get">
      ${filters}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>
  `);
};
