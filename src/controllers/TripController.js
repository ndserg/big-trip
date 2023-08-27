import TripEventsComponent from '../components/trip-events';
import TripDayEventsComponent from '../components/trip-day-events';
import TripEventComponent from '../components/trip-event';
import TripInfoComponent from '../components/trip-info';
import TripSortComponent, { SortType, SortDirections } from '../components/trip-sort';
import TripDaysComponent from '../components/trip-days';
import TripDayComponent from '../components/trip-day';
import EventFormComponent from '../components/event-form';
import NoPointsComponent from '../components/no-points';
import { SORT_EVENTS } from '../const';
import {
  getGroupedPoints,
  render,
  remove,
  replace,
  RenderPosition,
} from '../utils/utils';

const renderEvent = (dayElement, events, offers, destinations) => {
  const eventComponent = new TripEventComponent(events);
  const editDayComponent = new EventFormComponent(offers, destinations, 'edit');

  render(dayElement, eventComponent, RenderPosition.BEFOREEND);

  eventComponent.setClickHandler(() => {
    replace(dayElement, editDayComponent.getElement(), eventComponent.getElement());
  });

  editDayComponent.setClickHandler((evt) => {
    evt.preventDefault();

    if (evt.target.classList.contains('event__save-btn') || evt.target.classList.contains('event__reset-btn') || evt.target.classList.contains('event__rollup-btn')) {
      replace(dayElement, eventComponent.getElement(), editDayComponent.getElement());
    }
  });
};

const renderDay = (tripDaysListElement, pointsByDay, idx, offers, destinations, sortType) => {
  const isShowDayInfo = sortType === SortType.EVENT;
  const date = new Date(pointsByDay[0].date_from);
  const dayComponent = new TripDayComponent(date, idx, isShowDayInfo);
  const tripDayEventsComponent = new TripDayEventsComponent();

  render(tripDaysListElement, dayComponent, RenderPosition.BEFOREEND);

  pointsByDay.forEach((event) => {
    renderEvent(tripDayEventsComponent.getElement(), event, offers, destinations);
  });

  render(dayComponent.getElement(), tripDayEventsComponent, RenderPosition.BEFOREEND);
};

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

  #eventsComponent = null;

  #tripDaysComponent = null;

  #noPointsComponent = null;

  #tripSortComponent = null;

  constructor(container) {
    this.#container = container;

    this.#eventsComponent = new TripEventsComponent();
    this.#tripDaysComponent = new TripDaysComponent();
    this.#noPointsComponent = new NoPointsComponent();
    this.#tripSortComponent = new TripSortComponent(SORT_EVENTS);
  }

  render({ points, offers, destinations }) {
    if (points.length === 0) {
      render(this.#container.getElement(), this.#noPointsComponent, RenderPosition.AFTERBEGIN);
      return;
    }

    const tripMainContainer = document.querySelector('.trip-main');
    const groupedPoints = getGroupedPoints(points);

    groupedPoints.map((pointsByDay, idx) => renderDay(this.#tripDaysComponent.getElement(), pointsByDay, idx, offers, destinations, SortType.EVENT));

    remove(this.#container.getElement().querySelector('.trip-events__msg'));

    render(tripMainContainer, new TripInfoComponent(points), RenderPosition.AFTERBEGIN);
    render(this.#container.getElement(), this.#eventsComponent, RenderPosition.AFTERBEGIN);
    render(this.#eventsComponent.getElement(), this.#tripSortComponent, RenderPosition.BEFOREEND);
    render(this.#eventsComponent.getElement(), this.#tripDaysComponent, RenderPosition.BEFOREEND);

    this.#tripSortComponent.setSortTypeChangeHandler((sortType, sortDirection) => {
      const sortedPoints = getSortedPoints(points, sortType, sortDirection);
      this.#tripDaysComponent.getElement().innerHTML = '';
      sortedPoints.map((pointsByDay, idx) => renderDay(this.#tripDaysComponent.getElement(), pointsByDay, idx, offers, destinations, sortType));
    });
  }
}
