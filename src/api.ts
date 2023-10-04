import { Status } from "./types";
import { doesPersonMatchDocument } from "./domain";
import { fetchIdentityDocument, fetchPerson } from "./repository";

// Route -> /api/checkPersonIdentityDocument/{documentId}
async function checkPersonIdentityDocument(documentId: string): Promise<Status> {
  const identityDocument = await fetchIdentityDocument(documentId);
  const person = await fetchPerson(documentId);

  return doesPersonMatchDocument(person, identityDocument);
}
