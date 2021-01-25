const generateMessage = (username, message) => {
  return {
    message,
    username,
    createdAt: new Date().getTime(),
  };
};

const generateLocation = (url, username) => {
  return {
    url,
    username,
    createdAt: new Date().getTime(),
  };
};

module.exports = {
  generateMessage,
  generateLocation,
};
