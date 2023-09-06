import { transformRawToPoints, transformPointToRaw, transformRawToPoint } from '../utils/common';

const Method = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
};

const checkStatus = (response) => {
  if (!response.ok) {
    throw new Error(`${response.status}: ${response.statusText}`);
  } else {
    return response;
  }
};

export default class API {
  #authorization;

  #endPoint;

  #pointsModel;

  constructor(endPoint, authorization, pointsModel) {
    this.#authorization = authorization;
    this.#endPoint = endPoint;

    this.#pointsModel = pointsModel;
  }

  #load({
    url,
    method = Method.GET,
    body = null,
    headers = new Headers(),
  }) {
    headers.append('Authorization', this.#authorization);

    return fetch(`${this.#endPoint}/${url}`, { method, body, headers })
      .then(checkStatus)
      .catch((err) => {
        throw new Error(err.message);
      });
  }

  deletePoint(id) {
    return this.#load({ url: `points/${id}`, method: Method.DELETE });
  }

  createPoint(point) {
    return this.#load({
      url: 'points',
      method: Method.POST,
      body: JSON.stringify(transformPointToRaw(point)),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    })
      .then((response) => response.json())
      .then((data) => transformRawToPoint(data, this.#pointsModel.offers, this.#pointsModel.destinations));
  }

  updatePoint(id, point) {
    return this.#load({
      url: `points/${id}`,
      method: Method.PUT,
      body: JSON.stringify(transformPointToRaw(point)),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    })
      .then((response) => response.json())
      .then((data) => transformRawToPoint(data, this.#pointsModel.offers, this.#pointsModel.destinations));
  }

  #getPoints() {
    return this.#load({ url: 'points' })
      .then((response) => response.json());
  }

  #getOffers() {
    return this.#load({ url: 'offers' })
      .then((response) => response.json());
  }

  #getDestinations() {
    return this.#load({ url: 'destinations' })
      .then((response) => response.json());
  }

  getData() {
    const loadPoints = this.#getPoints().then((values) => values);

    const loadOffers = this.#getOffers().then((values) => values);

    const loadDestinations = this.#getDestinations().then((values) => values);

    return Promise.all([loadPoints, loadOffers, loadDestinations])
      .then(([points, offers, destinations]) => ({
        points: transformRawToPoints(points, offers, destinations),
        offers,
        destinations,
      }));
  }
}
