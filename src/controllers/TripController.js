import TripEventsComponent from '../components/trip-events';
import TripDayEventsComponent from '../components/trip-day-events';
import TripEventComponent from '../components/trip-event';
import TripInfoComponent from '../components/trip-info';
import TripSortComponent from '../components/trip-sort';
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

const renderDay = (tripDaysListElement, day, events, idx, offers, destinations) => {
  const dayComponent = new TripDayComponent(day, idx);
  const tripDayEventsComponent = new TripDayEventsComponent();

  render(tripDaysListElement, dayComponent, RenderPosition.BEFOREEND);

  events.forEach((event) => {
    renderEvent(tripDayEventsComponent.getElement(), event, offers, destinations);
  });

  render(dayComponent.getElement(), tripDayEventsComponent, RenderPosition.BEFOREEND);
};

export default class TripController {
  #container = null;

  #eventsComponent = null;

  #tripDaysComponent = null;

  #noPointsComponent = null;

  constructor(container) {
    this.#container = container;

    this.#eventsComponent = new TripEventsComponent();
    this.#tripDaysComponent = new TripDaysComponent();
    this.#noPointsComponent = new NoPointsComponent();
  }

  render({ points, offers, destinations }) {
    if (points.length === 0) {
      render(this.#container.getElement(), this.#noPointsComponent, RenderPosition.AFTERBEGIN);
      return;
    }

    const tripMainContainer = document.querySelector('.trip-main');
    const groupedPoints = getGroupedPoints(points);
    Object.keys(groupedPoints).map((day, idx) => renderDay(this.#tripDaysComponent.getElement(), day, groupedPoints[day], idx, offers, destinations));

    remove(this.#container.getElement().querySelector('.trip-events__msg'));

    render(tripMainContainer, new TripInfoComponent(points), RenderPosition.AFTERBEGIN);
    render(this.#container.getElement(), this.#eventsComponent, RenderPosition.AFTERBEGIN);
    render(this.#eventsComponent.getElement(), new TripSortComponent(SORT_EVENTS), RenderPosition.BEFOREEND);
    render(this.#eventsComponent.getElement(), this.#tripDaysComponent, RenderPosition.BEFOREEND);
  }
}
