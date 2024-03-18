export class InvalidPasswordConfirmationError extends Error {
  constructor (passwordConfirmation: string) {
    super(`Invalid password confirmation: ${passwordConfirmation}`)
    this.name = 'InvalidPasswordConfirmationError'
  }
}
