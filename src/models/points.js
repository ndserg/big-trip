import { FilterType, SortDirections, SortType } from '../const';

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
    const sortedPoints = this.getSortedPoints(this.#points);

    switch (this.#activeFilterType) {
      case FilterType.EVERYTHING:
        return sortedPoints;
      case FilterType.FUTURE:
        return sortedPoints.filter((point) => new Date(point.date_from) > new Date());
      case FilterType.PAST:
        return sortedPoints.filter((point) => new Date(point.date_to) < new Date());
      default:
        return sortedPoints;
    }
  }

  getGroupedPoints(points) {
    const allPoints = points || this.getFilteredPoints();
    let dayIdx = 0;
    let currentDate = '';
    const groupedPoints = [];

    allPoints.forEach((point) => {
      const currentPointDate = new Date(point.date_from);

      if (currentPointDate.toLocaleDateString() === currentDate) {
        groupedPoints[dayIdx - 1].push(point);
      } else {
        currentDate = currentPointDate.toLocaleDateString();
        groupedPoints.push([point]);
        dayIdx += 1;
      }
    });

    return groupedPoints;
  }

  getSortedPoints(sortType, sortDirection) {
    let sortedPoints = [];

    switch (sortType) {
      case SortType.TIME:
        if (sortDirection === SortDirections.DECREASE) {
          sortedPoints = this.#points.slice().sort((a, b) => new Date(b.date_from) - new Date(a.date_from));
        } else {
          sortedPoints = this.#points.slice().sort((a, b) => new Date(a.date_from) - new Date(b.date_from));
        }
        break;
      case SortType.PRICE:
        if (sortDirection === SortDirections.DECREASE) {
          sortedPoints = this.#points.slice().sort((a, b) => b.base_price - a.base_price);
        } else {
          sortedPoints = this.#points.slice().sort((a, b) => a.base_price - b.base_price);
        }
        break;
      default:
        sortedPoints = this.#points.slice().sort((a, b) => new Date(a.date_from) - new Date(b.date_from));
        break;
    }

    return sortedPoints;
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

  removePoint(id) {
    const index = this.#points.findIndex((point) => point.id === id);

    if (index === -1) {
      return;
    }

    this.#points = [].concat(this.#points.slice(0, index), this.#points.slice(index + 1));

    this.#callHandlers('dataChange');

    return true;
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

  addPoint(point) {
    this.#points = [].concat(point, this.#points);
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
