export interface ErrorDetail {
  path?: (string | number | symbol)[]; // = Zod type PropertyKey[]
  message: string; // human-readable validation message
}

export interface ErrorResponse {
  status: number; // HTTP status code
  error: {
    type: string; // error class name, e.g. "BadRequestError"
    message: string; // main error message
    details?: ErrorDetail[]; // optional array of validation issues
  };
  stack?: string; // only included in non-production
}
