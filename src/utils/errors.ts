/*
BadRequestError (400) → malformed/missing input (e.g. no refresh token provided).
UnauthorizedError (401) → invalid credentials or token (e.g. wrong password, expired token).
ForbiddenError (403) → authenticated but not allowed (e.g. role mismatch, revoked token).
*/

export class HttpClientError extends Error {
  status: number;
  name;

  constructor(message: string, { status }: { status: number }) {
    super(message); // inherit message property
    this.name = this.constructor.name; // standard JS property that returns the class name of the current instance
    this.status = status;
  }
}
export class BadRequestError extends HttpClientError {
  constructor(message: string) {
    super(message, { status: 400 });
  }
}

export class UnauthorizedError extends HttpClientError {
  constructor(message: string) {
    super(message, { status: 401 });
  }
}

export class ForbiddenError extends HttpClientError {
  constructor(message: string) {
    super(message, { status: 403 });
  }
}

export class NotFoundError extends HttpClientError {
  constructor(message: string) {
    super(message, { status: 404 });
  }
}

export class ConflictError extends HttpClientError {
  constructor(message: string) {
    super(message, { status: 409 });
  }
}
