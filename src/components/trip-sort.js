import AbstractSmartComponent from './abstract-smart-component';
import { SortDirections, SortType } from '../const';

const toggleDirection = (direction) => {
  let newDirection = '';

  if (direction === SortDirections.INCREASE) {
    newDirection = SortDirections.DECREASE;
  } else {
    newDirection = SortDirections.INCREASE;
  }

  return newDirection;
};

const createTripSortItemTemplate = (name, sortType, sortDirection) => {
  const isTypeEvent = name === 'event';
  const isChecked = sortType === name ? 'checked' : '';

  const activeButtonClass = isChecked ? ' trip-sort__btn--active' : '';
  const buttonDirectionClass = isTypeEvent ? '' : ` trip-sort__btn--by-${sortDirection}`;
  const isCheckedButtonIcon = isChecked ? 'style="display:initial"' : '';

  const tripSortDirectionIcon = isTypeEvent ? '' : `
    <svg class="trip-sort__direction-icon" ${isCheckedButtonIcon} width="8" height="10" viewBox="0 0 8 10">
      <path d="M2.888 4.852V9.694H5.588V4.852L7.91 5.068L4.238 0.00999987L0.548 5.068L2.888 4.852Z"/>
    </svg>`;

  return (
    `<div class="trip-sort__item  trip-sort__item--event">
      <input id="sort-${name}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${name}" ${isChecked}>
      <label class="trip-sort__btn${activeButtonClass}${buttonDirectionClass}" for="sort-${name}" data-sort-event="${name}" data-sort-direction="${sortDirection}">${name} ${tripSortDirectionIcon}</label>
    </div>
    `);
};

const createTripSortTemplate = (sortEvents, sortType, sortDirection) => {
  const tripSortItems = sortEvents.map((sortEvent) => createTripSortItemTemplate(sortEvent, sortType, sortDirection)).join('\n');

  return (
    `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      <span class="trip-sort__item  trip-sort__item--day">Day</span>
        ${tripSortItems}
      <span class="trip-sort__item  trip-sort__item--offers">Offers</span>
    </form>
  `);
};

export default class extends AbstractSmartComponent {
  #sortEvents = null;

  #currenSortType;

  #currentSortDirection;

  #sortTypeChangeHandler;

  constructor(SORT_EVENTS) {
    super();

    this.#sortEvents = SORT_EVENTS;
    this.#currenSortType = SortType.EVENT;
    this.#currentSortDirection = SortDirections.INCREASE;

    this.#sortTypeChangeHandler = null;
  }

  getTemplate() {
    return createTripSortTemplate(this.#sortEvents, this.#currenSortType, this.#currentSortDirection);
  }

  recoveryListeners() {
    this.setSortTypeChangeHandler(this.#sortTypeChangeHandler);
  }

  rerender() {
    super.rerender();
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

      if (this.#currenSortType !== sortEvent) {
        this.#currentSortDirection = SortDirections.INCREASE;
      } else {
        this.#currentSortDirection = toggleDirection(sortDirection);
      }

      this.#currenSortType = sortEvent;
      element.dataset.sortDirection = this.#currentSortDirection;

      this.#sortTypeChangeHandler = handler;

      handler(this.#currenSortType, this.#currentSortDirection);

      this.rerender();
    });
  }
}
