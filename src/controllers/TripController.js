import PointController from './PointController';
import TripEventsComponent from '../components/trip-events';
import TripDayEventsComponent from '../components/trip-day-events';
import TripInfoComponent from '../components/trip-info';
import TripSortComponent from '../components/trip-sort';
import TripDaysComponent from '../components/trip-days';
import TripDayComponent from '../components/trip-day';
import NoPointsComponent from '../components/no-points';
import {
  SORT_EVENTS,
  SortType,
  Mode as PointControllerMode,
  ActionTypes,
} from '../const';
import { render, remove, RenderPosition } from '../utils/render';

const EpmtyPoint = {
  id: '',
  type: 'bus',
  destination: {
    name: '',
    description: '',
    pictures: [],
  },
  date_from: new Date().toISOString(),
  date_to: new Date().toISOString(),
  base_price: 0,
  offers: [],
  is_favorite: false,
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

  #creatingPoint;

  #creatingButtonComponent;

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

    this.#creatingPoint = null;
    this.#creatingButtonComponent = null;

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
    this.#tripInfoComponent = new TripInfoComponent(this.#points.length > 0 ? this.#points : [EpmtyPoint]);

    const tripMainContainer = document.querySelector('.trip-main');
    render(tripMainContainer, this.#tripInfoComponent, RenderPosition.AFTERBEGIN);
    render(this.#container.getElement(), this.#eventsComponent, RenderPosition.AFTERBEGIN);

    if (this.#points.length === 0) {
      render(this.#eventsComponent.getElement(), this.#noPointsComponent, RenderPosition.BEFOREEND);
      return;
    }

    const groupedPoints = this.#pointsModel.getGroupedPoints();

    groupedPoints.map((pointsByDay, idx) => this.#renderDay(this.#tripDaysComponent.getElement(), pointsByDay, idx, SortType.EVENT));

    render(this.#eventsComponent.getElement(), this.#tripSortComponent, RenderPosition.BEFOREEND);
    render(this.#eventsComponent.getElement(), this.#tripDaysComponent, RenderPosition.BEFOREEND);

    this.#tripSortComponent.setSortTypeChangeHandler((sortType, sortDirection) => {
      const currentSortedPoints = this.#pointsModel.getSortedPoints(sortType, sortDirection);
      const sortedGroupedPoints = this.#pointsModel.getGroupedPoints(currentSortedPoints);

      this.#tripDaysComponent.getElement().innerHTML = '';
      sortedGroupedPoints.map((pointsByDay, idx) => this.#renderDay(this.#tripDaysComponent.getElement(), pointsByDay, idx, sortType));
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

  createPoint(component) {
    if (this.#creatingPoint) {
      return;
    }

    if (this.#points.length === 0) {
      this.#eventsComponent = new TripEventsComponent();
      render(this.#container.getElement(), this.#eventsComponent, RenderPosition.AFTERBEGIN);
    }

    this.#creatingButtonComponent = component;
    this.#creatingButtonComponent.disabled = true;

    this.#creatingPoint = new PointController(this.#eventsComponent.getElement(), this.#onDataChange, this.#onViewChange);
    this.#creatingPoint.render(EpmtyPoint, this.#offers, this.#destinations, PointControllerMode.ADDING);
  }

  #onDataChange = (pointController, oldPoint, newPoint, mode, action) => {
    if (action === ActionTypes.DELETE) {
      const isDeleted = this.#pointsModel.removePoint(oldPoint.id);

      if (isDeleted) {
        this.#updatePoints();
      }
    } else if (action === ActionTypes.SAVE) {
      if (mode === PointControllerMode.ADDING) {
        const isAdded = this.#pointsModel.addPoint(newPoint);

        if (isAdded) {
          this.#creatingPoint = null;
          this.#creatingButtonComponent.disabled = false;
          this.#updatePoints();
        }
      } else {
        const isUpdated = this.#pointsModel.updatePoint(oldPoint.id, newPoint);

        if (isUpdated) {
          this.#updatePoints();
        }
      }
    } else if (action === ActionTypes.SET) {
      const isUpdated = this.#pointsModel.updatePoint(oldPoint.id, newPoint);

      if (isUpdated) {
        pointController.render(newPoint, this.#offers, this.#destinations, mode);
      }
    } else if (action === ActionTypes.TOGGLE) {
      if (mode === PointControllerMode.ADDING) {
        this.#creatingPoint = null;
        this.#creatingButtonComponent.disabled = false;
      } else {
        pointController.render(newPoint, this.#offers, this.#destinations, mode);
      }
    }
  };

  #onViewChange = () => {
    this.#showedPointControllers.forEach((pointController) => pointController.setDefaultView());
  };

  #onFilterChange = () => {
    this.#updatePoints();
  };
}
