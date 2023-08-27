import AbstractComponent from './abstract-component';

export const SortType = {
  EVENT: 'event',
  TIME: 'time',
  PRICE: 'price',
};

export const SortDirections = {
  INCREASE: 'increase',
  DECREASE: 'decrease',
};

const toggleDirection = (direction) => {
  let newDirection = '';

  if (direction === SortDirections.INCREASE) {
    newDirection = SortDirections.DECREASE;
  } else {
    newDirection = SortDirections.INCREASE;
  }

  return newDirection;
};

const createTripSortItemTemplate = (name, idx) => {
  const isTypeEvent = name === 'event';
  const isChecked = idx === 1 ? 'checked' : '';

  const activeButtonClass = isChecked ? ' trip-sort__btn--active' : '';
  const buttonDirectionClass = isTypeEvent ? '' : ' trip-sort__btn--by-increase';
  const isCheckedButtonIcon = isChecked ? 'style="display:initial"' : '';

  const tripSortDirectionIcon = isTypeEvent ? '' : `
    <svg class="trip-sort__direction-icon" ${isCheckedButtonIcon} width="8" height="10" viewBox="0 0 8 10">
      <path d="M2.888 4.852V9.694H5.588V4.852L7.91 5.068L4.238 0.00999987L0.548 5.068L2.888 4.852Z"/>
    </svg>`;

  return (
    `<div class="trip-sort__item  trip-sort__item--event">
      <input id="sort-${name}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${name}" ${isChecked}>
      <label class="trip-sort__btn${activeButtonClass}${buttonDirectionClass}" for="sort-${name}" data-sort-event="${name}" data-sort-direction="${SortDirections.INCREASE}">${name} ${tripSortDirectionIcon}</label>
    </div>
    `);
};

const createTripSortTemplate = (sortEvents) => {
  const tripSortItems = sortEvents.map((sortEvent, idx) => createTripSortItemTemplate(sortEvent, idx)).join('\n');

  return (
    `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      <span class="trip-sort__item  trip-sort__item--day">Day</span>
        ${tripSortItems}
      <span class="trip-sort__item  trip-sort__item--offers">Offers</span>
    </form>
  `);
};

export default class extends AbstractComponent {
  #sortEvents = null;

  #currenSortType;

  #currentSortDirection;

  constructor(SORT_EVENTS) {
    super();

    this.#sortEvents = SORT_EVENTS;
    this.#currenSortType = SortType.EVENT;
    this.#currentSortDirection = SortDirections.INCREASE;
  }

  getTemplate() {
    return createTripSortTemplate(this.#sortEvents);
  }

  setSortTypeChangeHandler(handler) {
    this.getElement().addEventListener('click', (evt) => {
      evt.preventDefault();

      if (evt.target.tagName !== 'LABEL') {
        return;
      }

      const element = evt.target;
      const { sortEvent, sortDirection } = element.dataset;

      if (this.#currenSortType === sortEvent && this.#currenSortType === SortType.EVENT) {
        return;
      }

      this.#currenSortType = sortEvent;
      this.#currentSortDirection = toggleDirection(sortDirection);
      element.dataset.sortDirection = this.#currentSortDirection;

      handler(this.#currenSortType, this.#currentSortDirection);
    });
  }
}
