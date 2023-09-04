import { FilterType } from '../const';
import getFilteredPoints from '../utils/filters';

export default class PointsModel {
  #points;

  #offers;

  #destinations;

  #activeFilterType;

  #handlers;

  constructor() {
    this.#points = [];
    this.#offers = [];
    this.#destinations = [];
    this.#activeFilterType = FilterType.EVERYTHING;

    this.#handlers = {
      filterChange: new Set(),
      dataChange: new Set(),
    };
  }

  getFilteredPoints() {
    return getFilteredPoints(this.points, this.getActiveFilter());
  }

  get points() {
    return this.#points;
  }

  set points(points) {
    this.#points = points;
  }

  get offers() {
    return this.#offers;
  }

  set offers(offers) {
    this.#offers = offers;
  }

  get destinations() {
    return this.#destinations;
  }

  set destinations(destinations) {
    this.#destinations = destinations;
  }

  updatePoint(id, newPoint) {
    const index = this.#points.findIndex((point) => point.id === id);

    if (index === -1) {
      return;
    }

    this.#points = [].concat(this.#points.slice(0, index), newPoint, this.#points.slice(index + 1));

    this.#callHandlers('dataChange');

    return true;
  }

  setFilter(filterType) {
    this.#activeFilterType = filterType;
    this.#callHandlers('filterChange');
  }

  getActiveFilter() {
    return this.#activeFilterType;
  }

  setDataChangeHandler(handler) {
    this.#handlers.dataChange.add(handler);
  }

  setFilterChangeHandler(handler) {
    this.#handlers.filterChange.add(handler);
  }

  #callHandlers(handlersName) {
    this.#handlers[handlersName].forEach((handler) => handler());
  }
}
