const allowedCors = [
  'https://amelin.mesto.nomoredomains.icu,',
  'http://amelin.mesto.nomoredomains.icu,',
  'https://localhost:3000',
  'http://localhost:3000',
  'https://127.0.0.1:3000',
  'http://127.0.0.1:3000',
];

module.exports = (req, res, next) => {
  const { origin } = req.headers;
  console.log(origin)
  const requestHeaders = req.headers['access-control-request-headers'];
  const { method } = req;
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
  res.header('Access-Control-Allow-Credentials', true);
  if (allowedCors.includes(origin)) {
    console.log(1)
    res.header('Access-Control-Allow-Origin', origin);
  } else {
    console.log(2)
  }
  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    return res.end();
  }
  return next();
};
