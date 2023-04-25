import { StatusCodes, getReasonPhrase } from 'http-status-codes';

class ApiError extends Error {
  status!: number;

  constructor(
    status: number,
    message = getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)
  ) {
    super(message);
    this.status = status;
  }

  static badRequest(message: string): ApiError {
    return new ApiError(StatusCodes.BAD_REQUEST, message);
  }

  static unauthorized(): ApiError {
    return new ApiError(
      StatusCodes.UNAUTHORIZED,
      getReasonPhrase(StatusCodes.UNAUTHORIZED)
    );
  }

  static forbidden(): ApiError {
    return new ApiError(StatusCodes.FORBIDDEN, getReasonPhrase(StatusCodes.FORBIDDEN));
  }
}

export default ApiError;
