import { SORT_EVENTS } from '../const';

const createTripSortItemTemplate = (name, idx) => {
  const isChecked = idx === 0 ? 'checked' : '';
  const tripSortDirectionIcon = name === 'event' ? '' : `
    <svg class="trip-sort__direction-icon" width="8" height="10" viewBox="0 0 8 10">
      <path d="M2.888 4.852V9.694H5.588V4.852L7.91 5.068L4.238 0.00999987L0.548 5.068L2.888 4.852Z"/>
    </svg>`;

  return (
    `<div class="trip-sort__item  trip-sort__item--event">
      <input id="sort-${name}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${name}" ${isChecked}>
      <label class="trip-sort__btn" for="sort-${name}">${name}</label>
      ${tripSortDirectionIcon}
    </div>
    `);
};

export const createTripSortTemplate = () => {
  const tripSortItems = SORT_EVENTS.map((sortEvent, idx) => createTripSortItemTemplate(sortEvent, idx)).join('\n');

  return (
    `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      <span class="trip-sort__item  trip-sort__item--day">Day</span>
        ${tripSortItems}
      <span class="trip-sort__item  trip-sort__item--offers">Offers</span>
    </form>
  `);
};
