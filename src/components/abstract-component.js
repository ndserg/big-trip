import { createElement } from '../utils/render';

const visuallyHiddenClass = 'visually-hidden';

export default class AbstractComponent {
  #element = null;

  constructor() {
    if (new.target === AbstractComponent) {
      throw new Error("Can't instantiate AbstractComponent, only concrete one.");
    }
  }

  getTemplate() {
    throw new Error('Abstract method not implemented: getTemplate');
  }

  getElement() {
    if (!this.#element) {
      this.#element = createElement(this.getTemplate());
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }

  show() {
    if (!this.#element.classList.contains(visuallyHiddenClass)) {
      return;
    }

    this.#element.classList.remove(visuallyHiddenClass);
  }

  hide() {
    if (this.#element.classList.contains(visuallyHiddenClass)) {
      return;
    }

    this.#element.classList.add(visuallyHiddenClass);
  }
}
