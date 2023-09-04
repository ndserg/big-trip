import TripFiltersComponent from '../components/trip-filters';
import { FilterType } from '../const';

import {
  render,
  replace,
  remove,
  RenderPosition,
} from '../utils/render';

export default class FilterController {
  #container = null;

  #pointsModel;

  #filtersComponent;

  constructor(container, pointsModel) {
    this.#container = container;
    this.#pointsModel = pointsModel;

    this.#filtersComponent = null;
  }

  render() {
    const filters = Object.values(FilterType).map((filter) => {
      return {
        name: filter,
        checked: filter === this.#pointsModel.getActiveFilter(),
      };
    });

    const oldComponent = this.#filtersComponent;

    this.#filtersComponent = new TripFiltersComponent(filters);
    this.#filtersComponent.setFilterChangeHandler(this.#onFilterChange);
    this.#pointsModel.setFilterChangeHandler(this.#onDataChange);

    if (oldComponent) {
      replace(this.#filtersComponent, oldComponent);
      remove(oldComponent);
    } else {
      render(this.#container, this.#filtersComponent, RenderPosition.BEFOREEND);
    }
  }

  #onFilterChange = (filterType) => {
    if (this.#pointsModel.getActiveFilter() === filterType) {
      return;
    }

    this.#pointsModel.setFilter(filterType);
  };

  #onDataChange = () => {
    this.render();
  };
}
