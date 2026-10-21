import { ValidationError } from '../domain/errors.js';
import { TranslationRepository } from '../domain/repositories/TranslationRepository.js';

export function requireInteger(value, name, min, max) {
  const n = typeof value === 'number' ? value : Number(value);
  if (!Number.isInteger(n) || n < min || n > max) {
    throw new ValidationError(`${name} must be an integer between ${min} and ${max}`);
  }
  return n;
}

export function requireLanguage(value) {
  if (!TranslationRepository.LANGUAGES.includes(value)) {
    throw new ValidationError(`language must be one of: ${TranslationRepository.LANGUAGES.join(', ')}`);
  }
  return value;
}
