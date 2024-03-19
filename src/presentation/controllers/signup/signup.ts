import type { Controller, HttpRequest, HttpResponse, AddAcount, EmailValidator } from './signup-protocols'
import { MissingParamError, InvalidParamError, InvalidPasswordConfirmationError } from '../../errors'
import { badRequest, serverError, ok } from '../../helpers/http-helpers'

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly addAccount: AddAcount

  constructor (emailValidator: EmailValidator, addAccount: AddAcount) {
    this.emailValidator = emailValidator
    this.addAccount = addAccount
  }

  handle (httpRequest: HttpRequest): HttpResponse {
    try {
      const requiredFields = [
        'name',
        'email',
        'password',
        'passwordConfirmation'
      ]
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }
      const { name, email, password, passwordConfirmation } = httpRequest.body
      if (password !== passwordConfirmation) {
        return badRequest(new InvalidPasswordConfirmationError('passwordConfirmation'))
      }
      // Desabilitando a checagem de tipos da linha abaixo pois: isValid espera uma string, porém, httpRequest.body é do tipo any, já que não sabemos as informações que o cliente irá retornar através do body, o que causa um erro de typagem nas novas atualizações do typescript, visto que isValid(string) está recebendo isValid(any).
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const isValid = this.emailValidator.isValid(email)
      if (!isValid) {
        return badRequest(new InvalidParamError('email'))
      }
      const account = this.addAccount.add({
        name,
        email,
        password
      })
      return ok(account)
    } catch (error) {
      return serverError()
    }
  }
}
