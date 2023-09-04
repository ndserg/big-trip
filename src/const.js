const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OKT', 'NOV', 'DEC'];

const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PAST: 'past',
};

const SORT_EVENTS = ['event', 'time', 'price'];

const TABS = ['Table', 'Stats'];

const EVENT_TYPES = {
  transfer: ['flight', 'taxi', 'bus', 'train', 'ship', 'transport', 'drive'],
  activity: ['check-in', 'sightseeing', 'restaurant'],
};

const OFFERS_TYPES = {
  taxi: {
    id1: 'business',
    id2: 'radio',
    id3: 'temperature',
    id4: 'quickly',
    id5: 'slowly',
  },
  bus: {
    id1: 'infotainment ',
    id2: 'meal',
    id3: 'seats',
  },
  train: {
    id1: 'taxi ',
    id2: 'breakfast',
    id3: 'wakeUp',
  },
  flight: {
    id1: 'meal',
    id2: 'seats',
    id3: 'comfort',
    id4: 'business',
    id5: 'luggage',
    id6: 'lounge',
  },
  'check-in': {
    id1: 'check-in',
    id2: 'check-out',
    id3: 'breakfast',
    id4: 'laundry',
    id5: 'meal',
  },
  ship: {
    id1: 'meal',
    id2: 'seats',
    id3: 'comfort',
    id4: 'business',
    id5: 'luggage',
    id6: 'lounge',
  },
  drive: {
    id1: 'automatic',
    id2: 'conditioning',
  },
  restaurant: {
    id1: 'music',
    id2: 'VIP',
  },
};

const DatesRange = {
  date_from: 'date_from',
  date_to: 'date_to',
};

export {
  MONTHS,
  FilterType,
  SORT_EVENTS,
  TABS,
  EVENT_TYPES,
  OFFERS_TYPES,
  DatesRange,
};
