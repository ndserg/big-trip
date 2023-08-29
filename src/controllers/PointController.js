import TripEventComponen from '../components/trip-event';
import EventFormComponent from '../components/event-form';
import {
  render,
  replace,
  RenderPosition,
} from '../utils/render';

export const Mode = {
  DEFAULT: 'default',
  EDIT: 'edit',
};

export default class TripController {
  #container = null;

  #pointComponent;

  #editDayComponent;

  #onDataChange;

  #onViewChange;

  #mode;

  constructor(container, onDataChange, onViewChange) {
    this.#container = container;

    this.#mode = Mode.DEFAULT;
    this.#pointComponent = null;
    this.#editDayComponent = null;

    this.#onDataChange = onDataChange;
    this.#onViewChange = onViewChange;
  }

  render(point, offers, destinations, mode) {
    const oldPointComponent = this.#pointComponent;
    const oldEditDayComponent = this.#editDayComponent;
    this.#mode = mode;

    this.#pointComponent = new TripEventComponen(point);
    this.#editDayComponent = new EventFormComponent(point, offers, destinations, Mode.EDIT);

    this.#pointComponent.setRollupButtonClickHandler(() => {
      this.#replaceEventToEditForm();
    });

    this.#editDayComponent.setRollupButtonClickHandler((evt) => {
      evt.preventDefault();
      const btn = evt.target;

      switch (true) {
        case btn.classList.contains('event__save-btn'):
          this.#replaceEditFormToEvent();
          break;
        case btn.classList.contains('event__reset-btn'):
          this.#replaceEditFormToEvent();
          break;
        case btn.classList.contains('event__rollup-btn'):
          this.#replaceEditFormToEvent();
          break;
        case btn.closest('label')?.classList.contains('event__favorite-btn'):
          this.#onDataChange(this, point, { ...point, is_favorite: !point.is_favorite }, this.#mode);
          break;
        default:
        // do nothing
      }
    });

    switch (mode) {
      case Mode.DEFAULT:
        if (oldPointComponent && oldEditDayComponent) {
          replace(this.#pointComponent, oldPointComponent);
          replace(this.#editDayComponent, oldEditDayComponent);
        } else {
          render(this.#container, this.#pointComponent, RenderPosition.BEFOREEND);
        }
        break;
      case Mode.EDIT:
        if (oldPointComponent && oldEditDayComponent) {
          replace(this.#pointComponent, oldPointComponent);
          replace(this.#editDayComponent, oldEditDayComponent);
        } else {
          render(this.#container, this.#editDayComponent, RenderPosition.BEFOREEND);
        }
        break;
      default:
      // do nothig
    }
  }

  setDefaultView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#replaceEditFormToEvent();
    }
  }

  #replaceEditFormToEvent() {
    this.#editDayComponent.reset();

    if (document.contains(this.#editDayComponent.getElement())) {
      replace(this.#pointComponent, this.#editDayComponent);
    }

    this.#mode = Mode.DEFAULT;
  }

  #replaceEventToEditForm() {
    this.#onViewChange();
    replace(this.#editDayComponent, this.#pointComponent);
    this.#mode = Mode.EDIT;
  }
}
