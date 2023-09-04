import PointController, { Mode as PointControllerMode } from './PointController';
import TripEventsComponent from '../components/trip-events';
import TripDayEventsComponent from '../components/trip-day-events';
import TripInfoComponent from '../components/trip-info';
import TripSortComponent, { SortType, SortDirections } from '../components/trip-sort';
import TripDaysComponent from '../components/trip-days';
import TripDayComponent from '../components/trip-day';
import NoPointsComponent from '../components/no-points';
import { SORT_EVENTS } from '../const';
import { getGroupedPoints } from '../utils/common';
import { render, remove, RenderPosition } from '../utils/render';

export const getSortedPoints = (points, sortType, sortDirection) => {
  let sortedPoints = [];

  switch (sortType) {
    case SortType.TIME:
      if (sortDirection === SortDirections.DECREASE) {
        sortedPoints.push(points.slice().sort((a, b) => new Date(b.date_from) - new Date(a.date_from)));
      } else {
        sortedPoints.push(points.slice().sort((a, b) => new Date(a.date_from) - new Date(b.date_from)));
      }
      break;
    case SortType.PRICE:
      if (sortDirection === SortDirections.DECREASE) {
        sortedPoints.push(points.slice().sort((a, b) => b.base_price - a.base_price));
      } else {
        sortedPoints.push(points.slice().sort((a, b) => a.base_price - b.base_price));
      }
      break;
    default:
      sortedPoints = getGroupedPoints(points);
      break;
  }

  return sortedPoints;
};

export default class TripController {
  #container = null;

  #pointsModel;

  #points;

  #offers;

  #destinations;

  #tripInfoComponent;

  #eventsComponent = null;

  #tripDaysComponent = null;

  #noPointsComponent = null;

  #tripSortComponent = null;

  #showedPointControllers;

  #showedDaysComponents;

  #showedTripDayEventsComponents;

  constructor(container, pointsModel) {
    this.#container = container;
    this.#pointsModel = pointsModel;

    this.#points = [];
    this.#offers = [];
    this.#destinations = [];

    this.#showedPointControllers = [];
    this.#showedDaysComponents = [];
    this.#showedTripDayEventsComponents = [];

    this.#tripInfoComponent = null;
    this.#eventsComponent = null;
    this.#tripDaysComponent = null;
    this.#noPointsComponent = null;
    this.#tripSortComponent = null;

    this.#pointsModel.setFilterChangeHandler(this.#onFilterChange);
  }

  render() {
    if (this.#eventsComponent) {
      remove(this.#tripInfoComponent);
      remove(this.#eventsComponent);
      remove(this.#tripDaysComponent);
      remove(this.#noPointsComponent);
      remove(this.#tripSortComponent);
    }

    this.#points = this.#pointsModel.getFilteredPoints();
    this.#offers = this.#pointsModel.offers;
    this.#destinations = this.#pointsModel.destinations;

    this.#eventsComponent = new TripEventsComponent();
    this.#tripDaysComponent = new TripDaysComponent();
    this.#noPointsComponent = new NoPointsComponent();
    this.#tripSortComponent = new TripSortComponent(SORT_EVENTS);
    this.#tripInfoComponent = new TripInfoComponent(this.#points);

    if (this.#points.length === 0) {
      render(this.#container.getElement(), this.#noPointsComponent, RenderPosition.AFTERBEGIN);
      return;
    }

    const tripMainContainer = document.querySelector('.trip-main');
    const groupedPoints = getGroupedPoints(this.#points);

    groupedPoints.map((pointsByDay, idx) => this.#renderDay(this.#tripDaysComponent.getElement(), pointsByDay, idx, SortType.EVENT));

    render(tripMainContainer, this.#tripInfoComponent, RenderPosition.AFTERBEGIN);
    render(this.#container.getElement(), this.#eventsComponent, RenderPosition.AFTERBEGIN);
    render(this.#eventsComponent.getElement(), this.#tripSortComponent, RenderPosition.BEFOREEND);
    render(this.#eventsComponent.getElement(), this.#tripDaysComponent, RenderPosition.BEFOREEND);

    this.#tripSortComponent.setSortTypeChangeHandler((sortType, sortDirection) => {
      const sortedPoints = getSortedPoints(this.#points, sortType, sortDirection);
      this.#tripDaysComponent.getElement().innerHTML = '';
      sortedPoints.map((pointsByDay, idx) => this.#renderDay(this.#tripDaysComponent.getElement(), pointsByDay, idx, sortType));
    });
  }

  #renderDay(tripDaysListElement, pointsByDay, idx, sortType) {
    const isShowDayInfo = sortType === SortType.EVENT;
    const date = new Date(pointsByDay[0].date_from);
    const dayComponent = new TripDayComponent(date, idx, isShowDayInfo);
    const tripDayEventsComponent = new TripDayEventsComponent();

    this.#showedDaysComponents.push(dayComponent);
    this.#showedTripDayEventsComponents.push(tripDayEventsComponent);

    render(tripDaysListElement, dayComponent, RenderPosition.BEFOREEND);
    pointsByDay.forEach((point) => {
      const pointController = new PointController(tripDayEventsComponent.getElement(), this.#onDataChange, this.#onViewChange);
      this.#showedPointControllers.push(pointController);
      pointController.render(point, this.#offers, this.#destinations, PointControllerMode.DEFAULT);
    });

    render(dayComponent.getElement(), tripDayEventsComponent, RenderPosition.BEFOREEND);
  }

  #removePoints() {
    this.#showedPointControllers.forEach((pointController) => pointController.destroy());
    this.#showedDaysComponents.forEach((dayComponent) => dayComponent.removeElement());
    this.#showedTripDayEventsComponents.forEach((tripDayEventsComponent) => tripDayEventsComponent.removeElement());
    this.#showedPointControllers = [];
  }

  #updatePoints() {
    this.#removePoints();
    this.render();
  }

  #onDataChange = (pointController, oldPoint, newPoint, mode) => {
    const isSuccess = this.#pointsModel.updatePoint(oldPoint.id, newPoint);

    if (isSuccess) {
      pointController.render(newPoint, this.#offers, this.#destinations, mode);
    }
  };

  #onViewChange = () => {
    this.#showedPointControllers.forEach((pointController) => pointController.setDefaultView());
  };

  #onFilterChange = () => {
    this.#updatePoints();
  };
}
