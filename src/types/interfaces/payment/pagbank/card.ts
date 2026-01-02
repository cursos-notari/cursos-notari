export type CardErrorCode =
  'INVALID_NUMBER' |
  'INVALID_SECURITY_CODE' |
  'INVALID_EXPIRATION_MONTH' |
  'INVALID_EXPIRATION_YEAR' |
  'INVALID_HOLDER'
;

export interface CardError {
  code: CardErrorCode;
  message: string;
}

export interface Card {
  encryptedCard: string;
  errors: CardError[] | [];
  hasErrors: boolean;
}