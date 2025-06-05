const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

const client = jwksClient({
  jwksUri: 'https://dev-pw043kz5473wulvy.us.auth0.com/.well-known/jwks.json'
});

function getKey(header, callback) {
  console.log("🔍 Verifying token with header:", header);

  client.getSigningKey(header.kid, function (err, key) {
    if (err) {
      console.error("❌ Failed to get signing key:", err);
      return callback(err);
    }

    const signingKey = key.getPublicKey
      ? key.getPublicKey()
      : key.rsaPublicKey;

    callback(null, signingKey);
  });
}

const verifySocketToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(
      token,
      getKey,
      {
        audience: 'https://agrimarket-end',
        issuer: 'https://dev-pw043kz5473wulvy.us.auth0.com/',
        algorithms: ['RS256']
      },
      (err, decoded) => {
        if (err) {
          console.error("❌ JWT verification failed:", err);
          return reject(err);
        }
        resolve(decoded);
      }
    );
  });
};

module.exports = verifySocketToken;
