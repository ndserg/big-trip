import AbstractComponent from './abstract-component';

const createDayEventsTemplate = () => {
  return (
    `<ul class="trip-events__list">
    </ul>
    `);
};

export default class TripDayEvents extends AbstractComponent {
  getTemplate() {
    return createDayEventsTemplate();
  }
}
