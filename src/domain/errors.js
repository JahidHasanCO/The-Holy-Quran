export class DomainError extends Error {
  constructor(message) {
    super(message);
    this.name = new.target.name;
  }
}

export class NotFoundError extends DomainError {}
export class ValidationError extends DomainError {}
