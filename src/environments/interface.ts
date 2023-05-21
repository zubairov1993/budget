export interface Environment {
  production: boolean
  locales: string[]
  defaultLocale: string
  firebaseConfig: {
    apiKey: string
    authDomain: string
    databaseURL: string
    projectId: string
    storageBucket: string
    messagingSenderId: string
    appId: string
  }
}
