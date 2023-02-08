export class User {
  constructor(
    public email: string,
    public id: string,
    private _token: string,
    private _tokenExpiationDate: Date
  ) {}

  get token() {
    if (!this._tokenExpiationDate || new Date() > this._tokenExpiationDate) {
      return null;
    }
    return this._token;
  }
}
