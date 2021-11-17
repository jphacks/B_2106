export const Config = {
  API_URL: process.env.REACT_APP_API_URL
    ? process.env.REACT_APP_API_URL
    : "http://localhost",

  API_PORT: process.env.REACT_APP_API_PORT
    ? process.env.REACT_APP_API_PORT
    : "8080",
};
