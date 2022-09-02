import ky from 'ky'
import type { AfterResponseHook } from 'ky'
import { getEnv } from '~/env.server'
import { z } from 'zod'

const { HEADSCALE_API_KEY, HEADSCALE_API_URL } = getEnv()

const defaultHeaders = new Headers({
  Authorization: `Bearer ${HEADSCALE_API_KEY}`,
})

const apiErrorSchema = z.object({
  code: z.number(),
  message: z.string(),
  details: z.array(z.record(z.string())),
})

type ApiErrorValues = z.infer<typeof apiErrorSchema> & {
  response: Pick<Response, 'status' | 'statusText'>
}

export class ApiError extends Error {
  response: ApiErrorValues['response']
  code: ApiErrorValues['code']
  details: ApiErrorValues['details']

  constructor(values: ApiErrorValues) {
    super(values.message)
    this.response = values.response
    this.code = values.code
    this.details = values.details
  }
}

const defaultResponseErrorHandler: AfterResponseHook = async (
  request,
  options,
  response,
) => {
  const _response = response.clone()

  // If response is not ok validate if error message is returned
  // Throw ApiError if valid error message is returned from api
  if (!_response.ok) {
    try {
      const json = await response.json()
      const error = apiErrorSchema.parse(json)
      return Promise.reject(
        new ApiError({
          ...error,
          response: {
            status: _response.status,
            statusText: _response.statusText,
          },
        }),
      )
    } catch (error) {
      // Do nothing
    }
  }

  return response
}

export const client = ky.create({
  prefixUrl: HEADSCALE_API_URL,
  headers: defaultHeaders,
  hooks: {
    afterResponse: [defaultResponseErrorHandler],
  },
})
