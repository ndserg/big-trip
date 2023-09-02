export default class PointsModel {
  #points;

  #offers;

  #destinations;

  constructor() {
    this.#points = [];
    this.#offers = [];
    this.#destinations = [];
  }

  get points() {
    return this.#points;
  }

  set points(points) {
    this.#points = points;
  }

  get offers() {
    return this.#offers;
  }

  set offers(offers) {
    this.#offers = offers;
  }

  get destinations() {
    return this.#destinations;
  }

  set destinations(destinations) {
    this.#destinations = destinations;
  }

  updatePoint(id, newPoint) {
    const index = this.#points.findIndex((point) => point.id === id);

    if (index === -1) {
      return;
    }

    this.#points = [].concat(this.#points.slice(0, index), newPoint, this.#points.slice(index + 1));

    return true;
  }
}
