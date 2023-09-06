export const addLeadingZero = (num) => {
  return num < 10 ? `0${num}` : num;
};

export const getEventSpentTime = (from, to) => {
  const timeFrom = new Date(from);
  const timeTo = new Date(to);

  const eventDurationHours = Math.round(((timeTo - timeFrom) / 60000) / 60);

  return eventDurationHours;
};

export const getEventDuration = (from, to) => {
  let duration = '';
  const eventDurationHours = Math.floor(((to - from) / 60000) / 60);
  const eventDurationMinutes = Math.round(((to - from) / 60000) % 60);

  const hours = eventDurationHours === 0 ? '' : `${eventDurationHours}H`;
  const minutes = eventDurationMinutes === 0 ? '' : `${eventDurationMinutes}M`;
  if (hours && minutes) {
    duration = `${hours} ${minutes}`;
  } else if (hours && !minutes) {
    duration = `${hours}`;
  } else {
    duration = `${minutes}`;
  }
  return duration;
};

export const getEventTimes = (from, to) => {
  const timeFrom = new Date(from);
  const timeFromToString = `${addLeadingZero(timeFrom.getHours())}:${addLeadingZero(timeFrom.getMinutes())}`;

  const timeTo = new Date(to);
  const timeToToString = `${addLeadingZero(timeTo.getHours())}:${addLeadingZero(timeTo.getMinutes())}`;

  const eventDurationString = getEventDuration(timeFrom, timeTo);

  return {
    dateFrom: timeFromToString,
    dateTo: timeToToString,
    duration: eventDurationString,
  };
};

export const getPointTypeOffers = (pointType, offers) => {
  const pointTypeOffers = offers.find((currentOffers) => currentOffers.type === pointType) || { type: pointType, offers: [] };
  return pointTypeOffers;
};

export const getPointOffers = (pointOffers, pointType, allOffers) => {
  const pointTypeOffers = getPointTypeOffers(pointType, allOffers);
  const onlyPointOffers = pointOffers.reduce((acc, cur) => {
    const item = pointTypeOffers.offers.find((offer) => offer.id === cur);
    acc.push(item);
    return acc;
  }, []);
  return onlyPointOffers;
};

export const getPointDestination = (destinationId, destinations) => {
  return destinations.find((item) => item.id === destinationId);
};

export const transformPointToRaw = (point) => {
  const offers = point.offers.map((offer) => offer.id);

  return {
    ...point,
    destination: point.destination.id,
    offers,
  };
};

export const transformRawToPoint = (point, offers, destinations) => {
  return {
    ...point,
    destination: getPointDestination(point.destination, destinations),
    offers: getPointOffers(point.offers, point.type, offers),
  };
};

export const transformRawToPoints = (points, offers, destinations) => {
  return points.map((point) => transformRawToPoint(point, offers, destinations));
};
