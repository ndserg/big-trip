import { createElement } from '../utils/utils';

const createLoadingTemplate = (loadingText) => {
  return (
    `<p class="trip-events__msg">${loadingText}</p>
    `);
};

export default class Loading {
  #element = null;

  #loadingText = '';

  constructor(loadingText) {
    this.#element = null;
    this.#loadingText = loadingText || 'Loading...';
  }

  getTemplate() {
    return createLoadingTemplate(this.#loadingText);
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
