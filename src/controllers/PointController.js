import TripEventComponen from '../components/trip-event';
import EventFormComponent from '../components/event-form';
import { Mode, ActionTypes } from '../const';
import {
  render,
  replace,
  remove,
  RenderPosition,
} from '../utils/render';

const SHAKE_ANIMATION_TIMEOUT = 600;

export default class PointController {
  #container = null;
  #onDataChange = null;
  #onViewChange = null;

  #mode = Mode.DEFAULT;
  #pointComponent = null;
  #editDayComponent = null;

  constructor(container, onDataChange, onViewChange) {
    this.#container = container;

    this.#onDataChange = onDataChange;
    this.#onViewChange = onViewChange;
  }

  render(point, offers, destinations, mode) {
    const oldPointComponent = this.#pointComponent;
    const oldEditDayComponent = this.#editDayComponent;
    this.#mode = mode;
    const formMode = this.#mode === Mode.ADDING ? Mode.ADDING : Mode.EDIT;

    this.#pointComponent = new TripEventComponen(point, offers, destinations);
    this.#editDayComponent = new EventFormComponent(point, offers, destinations, formMode);

    this.#pointComponent.setRollupButtonClickHandler(() => {
      this.#replaceEventToEditForm();
    });

    this.#editDayComponent.setButtonsClickHandler((evt) => {
      evt.preventDefault();
      const btn = evt.target;

      switch (true) {
        case btn.classList.contains('event__save-btn'):
          if (!this.#validate()) {
            this.shake();
            return;
          }

          this.#onDataChange(this, point, this.#editDayComponent.getData(), this.#mode, ActionTypes.SAVE);
          this.#replaceEditFormToEvent();
          break;
        case btn.classList.contains('event__reset-btn'):
          if (this.#mode === Mode.ADDING) {
            this.destroy();
            this.#onDataChange(this, null, null, this.#mode, ActionTypes.TOGGLE);
            this.#editDayComponent.destroyFlatpickr();
          } else {
            this.#onDataChange(this, point, null, this.#mode, ActionTypes.DELETE);
            this.#replaceEditFormToEvent();
          }
          break;
        case btn.classList.contains('event__rollup-btn'):
          this.#mode = Mode.EDIT;
          this.#onDataChange(this, point, point, this.#mode, ActionTypes.TOGGLE);
          this.#replaceEditFormToEvent();
          break;
        case btn.closest('label')?.classList.contains('event__favorite-btn'):
          this.#onDataChange(this, point, { ...point, is_favorite: !point.is_favorite }, this.#mode, ActionTypes.SET);
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
          this.#editDayComponent.applyFlatpickr();
        } else {
          render(this.#container, this.#editDayComponent, RenderPosition.BEFOREEND);
        }
        break;
      case Mode.ADDING:
        if (oldPointComponent && oldEditDayComponent) {
          remove(oldPointComponent);
          remove(oldEditDayComponent);
        } else {
          render(this.#container, this.#editDayComponent, RenderPosition.AFTERBEGIN);
          this.#editDayComponent.applyFlatpickr();
        }
        break;
      default:
      // do nothig
    }
  }

  #validate() {
    const point = this.#editDayComponent.getData();

    let isValid = true;

    if (!point.type || !point.destination.name || !point.base_price || !point.date_from || !point.date_to) {
      isValid = false;
    }

    return isValid;
  }

  setDefaultView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#replaceEditFormToEvent();
    }
  }

  destroy() {
    remove(this.#pointComponent);
    remove(this.#editDayComponent);
  }

  #replaceEditFormToEvent() {
    this.#editDayComponent.reset();

    if (document.contains(this.#editDayComponent.getElement())) {
      this.#editDayComponent.destroyFlatpickr();
      replace(this.#pointComponent, this.#editDayComponent);
    }

    this.#mode = Mode.DEFAULT;
  }

  #replaceEventToEditForm() {
    this.#onViewChange();
    this.#mode = Mode.EDIT;

    replace(this.#editDayComponent, this.#pointComponent);
    this.#editDayComponent.applyFlatpickr();
  }

  shake() {
    const form = this.#editDayComponent.getElement();
    const point = this.#pointComponent.getElement();

    form.style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
    point.style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
    form.style.border = `${2}px solid red`;
    form.style.borderRadius = '18px';

    setTimeout(() => {
      form.style.animation = '';
      point.style.animation = '';
      form.style.border = 'none';
    }, SHAKE_ANIMATION_TIMEOUT);
  }
}
