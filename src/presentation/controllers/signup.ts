import type { HttpRequest, HttpResponse } from '../protocols/http'
export class SignUpController {
  handle (httpRequest: HttpRequest): HttpResponse {
    if (!httpRequest.body.name) {
      return {
        statusCode: 400,
        body: new Error('Missing param: name')
      }
    }
    if (!httpRequest.body.email) {
      return {
        statusCode: 400,
        body: new Error('Missing param: email')
      }
    }
    // Adicione um retorno padrão caso nenhum dos blocos 'if' anteriores seja executado
    return {
      statusCode: 200,
      body: { message: 'Success' }
    }
  }
}
