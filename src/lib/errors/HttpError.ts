export class HttpError extends Error {
  title: string;
  description: string;
  cause?: unknown;

  constructor(title: string, description: string, cause?: unknown) {
    super(title);
    this.name = this.constructor.name;
    this.title = title;
    this.description = description;
    this.cause = cause;
  }
}

export class NotFoundError extends HttpError {
  constructor(title: string, description: string) {
    super(title, description);
  }
}






