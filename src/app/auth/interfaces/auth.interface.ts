export interface UserI {
  email: string
  password: string
  returnSecureToken: boolean | null
}

export interface FBResponseI {
  displayName: string
  email: string
  expiresIn: string
  idToken: string
  kind: string
  localId: string
  refreshToken: string
  registered: boolean
}

export interface AuthStateI {
  isSubmitting: boolean
}
