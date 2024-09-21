import { EnvironmentI } from "./interface";

export const environment: EnvironmentI = {
  production: false,
  locales: ['en', 'ru'],
  defaultLocale: 'ru',
  firebaseConfig: {
    signInWithPasswordPath: 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=',
    apiKey: "AIzaSyBnX9llJwizeyzDUW80ZOr71A-Yfqv8Uh8",
    databaseURL: "https://budget-6336f-default-rtdb.firebaseio.com",
    authDomain: "budget-6336f.firebaseapp.com",
    projectId: "budget-6336f",
    storageBucket: "budget-6336f.appspot.com",
    messagingSenderId: "834885722811",
    appId: "1:834885722811:web:356a1854e18ffa524dff9e"
  }
}
