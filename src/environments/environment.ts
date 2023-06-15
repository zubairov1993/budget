// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

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

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error'  // Included with Angular CLI.
import { EnvironmentI } from './interface'
