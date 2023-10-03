// DOMAIN
import { IdDocument, Person, Status } from "./types";

export function doesPersonMatchDocument(person: Person, identityDocument: IdDocument): Status {
  if (person.firstName !== identityDocument.person.firstName) {
    return "invalid";
  }

  if (person.lastName !== identityDocument.person.lastName) {
    return "invalid";
  }

  if (person.birthDate !== identityDocument.person.birthDate) {
    return "invalid";
  }

  return "valid";
}
