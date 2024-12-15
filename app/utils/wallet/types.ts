interface SiweData {
  address: string
  chainId: string
  nonce: string
}

export interface JWTPayload {
  sub: string
  scope: string
  isBadgeholder: boolean
  isCitizen: boolean
  category: 'web3.js' | 'account-abstraction' | 'remix-project'
  siwe: SiweData
  exp: number
  iat: number
  nbf: number
}

export interface VerifyResponse {
  access_token: string
  token_type: 'JWT'
  expires_in: number
}
