import AbstractComponent from './abstract-component';

const createAddPointButtonTemplate = () => {
  return (
    `<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">New event</button>
    `);
};

export default class AddPointButton extends AbstractComponent {
  getTemplate() {
    return createAddPointButtonTemplate();
  }

  setAddButtonClickHandler = (handler) => {
    this.getElement().addEventListener('click', handler);
  };
}
