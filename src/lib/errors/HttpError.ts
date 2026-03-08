export class HttpError extends Error {
  statusCode: number;
  title: string;
  description: string;
  cause?: unknown;

  constructor(
    statusCode: number,
    title: string,
    description: string,
    cause?: unknown,
  ) {
    super(title);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    this.title = title;
    this.description = description;
    this.cause = cause;
  }
}

export class BadRequestError extends HttpError {
  constructor(description: string, cause?: unknown) {
    super(400, "Bad Request", description, cause);
  }
}

export class NotFoundError extends HttpError {
  constructor(description: string, cause?: unknown) {
    super(404, "Not Found", description, cause);
  }
}

export class TooManyRequest extends HttpError {
  constructor(description: string, cause?: unknown) {
    super(429, "Too Many Requests", description, cause);
  }
}

export class UnprocessableEntityError extends HttpError {
  constructor(description: string, cause?: unknown) {
    super(422, "Unprocessable Entity", description, cause);
  }
}

export class InternalServerError extends HttpError {
  constructor(description: string, cause?: unknown) {
    super(500, "Internal Server Error", description, cause);
  }
}

export class UnauthorizedError extends HttpError {
  constructor(description: string, cause?: unknown) {
    super(401, "Unauthorized", description, cause);
  }
}

/**
 * @deprecated
 */
export class NotFoundError_DEPRECATED extends HttpError {
  constructor(title: string, description: string) {
    super(404, title, description);
  }
}

/**
 * @deprecated
 */
export class TooManyRequest_DEPRECATED extends HttpError {
  constructor(title: string, description: string) {
    super(429, title, description);
  }
}
