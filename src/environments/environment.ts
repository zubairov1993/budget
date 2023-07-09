// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// export const environment: EnvironmentI = {
//   production: false,
//   locales: ['en', 'ru'],
//   defaultLocale: 'ru',
//   firebaseConfig: {
//     signInWithPasswordPath: 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=',
//     apiKey: "AIzaSyBnX9llJwizeyzDUW80ZOr71A-Yfqv8Uh8",
//     databaseURL: "https://budget-6336f-default-rtdb.firebaseio.com",
//     authDomain: "budget-6336f.firebaseapp.com",
//     projectId: "budget-6336f",
//     storageBucket: "budget-6336f.appspot.com",
//     messagingSenderId: "834885722811",
//     appId: "1:834885722811:web:356a1854e18ffa524dff9e"
//   }
// }
export const environment: EnvironmentI = {
  production: false,
  locales: ['en', 'ru'],
  defaultLocale: 'ru',
  firebaseConfig: {
    signInWithPasswordPath: 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=',
    apiKey: "AIzaSyCRqT6Kk6SsAosO0ynSMiSWO1y0cWmTCl0",
    authDomain: "budget2-28fea.firebaseapp.com",
    databaseURL: "https://budget2-28fea-default-rtdb.firebaseio.com",
    projectId: "budget2-28fea",
    storageBucket: "budget2-28fea.appspot.com",
    messagingSenderId: "512322383263",
    appId: "1:512322383263:web:3ec2b4f5f281a0e177e1aa"
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
