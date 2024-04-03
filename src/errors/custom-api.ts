module.exports= class CustomAPIErrorClass extends Error {
  constructor(message: string) {
    super(message);

  }
}
