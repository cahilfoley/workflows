export type Failure<T> = {
  isSuccess: false
  isFailure: true
  errors: T[]
}

export function fail<T extends Error>(error: T): Failure<T>
export function fail<T extends Error>(errors: T[]): Failure<T>
export function fail<T extends Error>(errors: T | T[]): Failure<T> {
  return {
    isSuccess: false,
    isFailure: true,
    errors: Array.isArray(errors) ? errors : [errors]
  }
}

export type Success<T> = {
  isSuccess: true
  isFailure: false
  value: T
}

export function succeed<T extends undefined>(value?: T): Success<T>
export function succeed<T>(value: T): Success<T>
export function succeed<T>(value: T): Success<T> {
  return {
    isSuccess: true,
    isFailure: false,
    value
  }
}

export type Failable<TValue, TError = string | Error> = Success<TValue> | Failure<TError>
export type FailablePromise<TValue, TError = string | Error> = Promise<Failable<TValue, TError>>
