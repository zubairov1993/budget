export interface IUser {
  email: string
  password: string
  returnSecureToken: boolean | null
}

export interface IFBResponse {
  displayName: string
  email: string
  expiresIn: string
  idToken: string
  kind: string
  localId: string
  refreshToken: string
  registered: boolean
}
