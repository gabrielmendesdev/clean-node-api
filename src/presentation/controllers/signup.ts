import { MissingParamError, InvalidParamError } from '../errors'
import { badRequest, serverError } from '../helpers/http-helpers'
import type { HttpRequest, HttpResponse, EmailValidator } from '../protocols'
import type { Controller } from '../protocols/controller'
export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator
  constructor (emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
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
      // Desabilitando a checagem de tipos da linha abaixo pois: isValid espera uma string, porém, httpRequest.body é do tipo any,
      // já que não sabemos que informações o cliente irá retornar através do body, o que causa um erro de typagem
      // nas novas atualizações do typescript, visto que isValid(string) está recebendo isValid(any).
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const isValid = this.emailValidator.isValid(httpRequest.body.email)
      if (!isValid) {
        return badRequest(new InvalidParamError('email'))
      }
      return {
        statusCode: 200,
        body: { message: 'Success' }
      }
    } catch (error) {
      return serverError()
    }
  }
}
