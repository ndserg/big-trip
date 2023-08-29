import { createElement } from '../utils/render';

export default class AbstractComponent {
  #element;

  constructor() {
    if (new.target === AbstractComponent) {
      throw new Error("Can't instantiate AbstractComponent, only concrete one.");
    }

    this.#element = null;
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
}
