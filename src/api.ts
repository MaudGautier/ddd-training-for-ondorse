import { IdDocument, Status } from "./types";
import { doesPersonMatchDocument } from "./domain";
import {
  buildDependencies,
  fetchIdentityDocumentByIDNow,
  fetchIdentityDocumentByOtherProvider,
  fetchPerson,
} from "./repository";

type IdDocumentProvider = "IDNow" | "otherProvider";
type GetIdDocumentFunction = (documentId: string) => Promise<IdDocument>;

const ID_DOCUMENT_PROVIDER_FUNCTION: Record<IdDocumentProvider, GetIdDocumentFunction> = {
  IDNow: fetchIdentityDocumentByIDNow,
  otherProvider: fetchIdentityDocumentByOtherProvider,
};

// Route -> /api/checkPersonIdentityDocument/{documentId}
async function checkPersonIdentityDocument(
  documentId: string,
  idDocumentProvider: IdDocumentProvider
): Promise<Status> {
  const identityDocument = await ID_DOCUMENT_PROVIDER_FUNCTION[idDocumentProvider](documentId);
  const person = await fetchPerson(documentId);

  const dependencies = buildDependencies();

  return doesPersonMatchDocument(person, identityDocument, dependencies);
}
