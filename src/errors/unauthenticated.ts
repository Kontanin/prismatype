class UnauthenticatedError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = "UnauthenticatedError";
    this.statusCode = 401;
  }
}

export default UnauthenticatedError;
