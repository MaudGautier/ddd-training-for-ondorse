// DOMAIN
import { Dependencies, FirstName, IdDocument, Person, Status } from "./types";

function firstNamesMatch(personFirstName: FirstName, documentFirstName: FirstName): boolean {
  return documentFirstName.startsWith(personFirstName);
}

export function doesPersonMatchDocument(
  person: Person,
  identityDocument: IdDocument,
  dependencies: Dependencies
): Status {
  if (!firstNamesMatch(person.firstName, identityDocument.person.firstName)) {
    return "invalid";
  }

  if (person.lastName !== identityDocument.person.lastName) {
    return "invalid";
  }

  if (!dependencies.checkPersonNameInOfficialRegister(person.firstName + " " + person.lastName)) {
    return "invalid";
  }

  if (person.birthDate !== identityDocument.person.birthDate) {
    return "invalid";
  }

  return "valid";
}
