export const {
  REACT_APP_AWS_COGNITO_URL_AUTH = "",
  REACT_APP_AWS_POOLS_WEB_CLIENT_ID = "",
  REACT_APP_AWS_COGNITO_REDIRECT_URI = "",
} = process.env;

export const LOCALSTORAGE_KEYS = {
  TOKEN: "AWS-Cognito-Token",
  CODE: "AWS-Cognito-Code",
};
