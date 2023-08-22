const AUTORIZATION = 'Basic u4mtv8m3498tmiemgbe74';
const END_POINT = 'https://16.ecmascript.pages.academy/big-trip';

const checkStatus = (response) => {
  if (!response.ok) {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};

const load = async ({
  url,
  method = 'GET',
  body = null,
  headers = new Headers(),
}) => {
  headers.append('Authorization', AUTORIZATION);

  const response = await fetch(
    `${END_POINT}/${url}`,
    { method, body, headers },
  );

  try {
    checkStatus(response);
    return response;
  } catch (err) {
    throw new Error(err.message);
  }
};

const getPoints = () => {
  return load({ url: 'points' })
    .then((response) => response.json());
};

const getOffers = () => {
  return load({ url: 'offers' })
    .then((response) => response.json());
};

const getDestinations = () => {
  return load({ url: 'destinations' })
    .then((response) => response.json());
};

export { getPoints, getOffers, getDestinations };
