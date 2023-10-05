import { BirthDate, Dependencies, IdDocument, Person } from "./types";

// --------------------------------------------------------------------------------
// -- Types --
// --------------------------------------------------------------------------------

// ------------------------------------ IDNow -------------------------------------
type IDNowPerson = {
  identityData: {
    name: string;
    birthdate: string;
  };
};

type IDNowDocumentReport = {
  persons: IDNowPerson[];
};

type IDNowDocumentResponse = {
  uid: string;
  type: "ID" | "IBAN" | "CHEQUE";
  // subType: Optional[IdnowDocumentSubType]
  // prettyName: Optional[str]
  lastReport: IDNowDocumentReport | undefined;
  // creationDate: datetime
  // lastUpdateDate: Optional[datetime]
};

// -------------------------------- OtherProvider ---------------------------------
type OtherProviderDocumentResponse = {
  id: number;
  user: {
    name: string;
    birthDate: {
      day: number;
      month: number;
      year: number;
    };
  };
};

// -------------------------------------- DB --------------------------------------
type DBDocument = {
  id: string;
  personId: string;
};

type DBPerson = {
  first_name: string;
  last_name: string;
  birth_date: {
    day: number;
    month: number;
    year: number;
  };
};

// --------------------------------------------------------------------------------
// -- Mocks (calls to DB and IDNow not implemented) --
// --------------------------------------------------------------------------------

// ------------------------------------ IDNow -------------------------------------

async function fetchIdNowDocument(documentId: string): Promise<IDNowDocumentResponse> {
  // MOCKING A REQUEST TO IDNOW
  return {
    uid: "1234",
    type: "ID",
    lastReport: {
      persons: [
        {
          identityData: {
            name: "Jane Doe",
            birthdate: "1990-01-01",
          },
        },
      ],
    },
  };
}

// -------------------------------- OtherProvider ---------------------------------
async function fetchOtherProviderDocument(documentId: string): Promise<OtherProviderDocumentResponse> {
  // MOCKING A REQUEST TO ANOTHER PROVIDER

  return {
    id: 123,
    user: {
      name: "Jane Doe",
      birthDate: {
        day: 1,
        month: 1,
        year: 1990,
      },
    },
  };
}

// -------------------------------------- DB --------------------------------------

async function fetchDocumentInDB(documentId: string): Promise<DBDocument> {
  return {
    id: "1",
    personId: "1",
  };
}

async function fetchPersonInDB(personId: string): Promise<DBPerson> {
  return {
    first_name: "Jane",
    last_name: "Doe",
    birth_date: {
      day: 1,
      month: 1,
      year: 1992,
    },
  };
}

// --------------------------------- Dependencies ---------------------------------

// This is a mock for a dependency that would make a call to an official register and
export function checkPersonNameInOfficialRegister(name: string): boolean {
  // make call to official register and get response
  return true;
}

export function buildDependencies(): Dependencies {
  return {
    checkPersonNameInOfficialRegister,
  };
}

// --------------------------------------------------------------------------------
// -- Anti-corruption layer (ACL): check integrity of data received --
// --------------------------------------------------------------------------------

function checkDocumentIsID(document: IDNowDocumentResponse): void {
  const isValid = document.type === "ID";
  if (!isValid) {
    throw new Error("Document should be an ID document");
  }
}

// --------------------------------------------------------------------------------
// -- Anti-corruption layer (ACL): convert format from IDNow type to domain type --
// --------------------------------------------------------------------------------

function extractFirstName(name: string): string {
  return name.split(" ")[0];
}

function extractLastName(name: string): string {
  return name.split(" ")[1];
}

function convertBirthdate(birthDate: string): BirthDate {
  const birthDateInfos = birthDate.split("-").map((info) => parseInt(info));
  return { day: birthDateInfos[2], month: birthDateInfos[1], year: birthDateInfos[0] };
}

function convertIdNowResponseToDomainDocument(idNowDocument: IDNowDocumentResponse): IdDocument {
  const IdNowPerson = idNowDocument.lastReport?.persons[0];

  return {
    id: idNowDocument.uid,
    person: {
      firstName: extractFirstName(IdNowPerson.identityData.name),
      lastName: extractLastName(IdNowPerson.identityData.name),
      birthDate: convertBirthdate(IdNowPerson.identityData.birthdate),
    },
  };
}

function convertOtherProviderResponseToDomainDocument(
  otherProviderDocument: OtherProviderDocumentResponse
): IdDocument {
  return {
    id: otherProviderDocument.id.toString(),
    person: {
      firstName: otherProviderDocument.user.name.split(" ")[0],
      lastName: otherProviderDocument.user.name.split(" ")[1],
      birthDate: otherProviderDocument.user.birthDate,
    },
  };
}

function convertDbPersonToDomainPerson(dbPerson: DBPerson): Person {
  return {
    firstName: dbPerson.first_name,
    lastName: dbPerson.last_name,
    birthDate: dbPerson.birth_date,
  };
}

// --------------------------------------------------------------------------------
// -- Fetch info from repository (either DB or API request) --
// --------------------------------------------------------------------------------

export async function fetchIdentityDocumentByIDNow(documentId: string): Promise<IdDocument> {
  // Request to IDNow
  const document = await fetchIdNowDocument(documentId);

  // Check validity
  checkDocumentIsID(document);

  // Convert data into our domain types
  return convertIdNowResponseToDomainDocument(document);
}

export async function fetchIdentityDocumentByOtherProvider(documentId: string): Promise<IdDocument> {
  // Request to otherProvider
  const document = await fetchOtherProviderDocument(documentId);

  // Convert data into our domain types
  return convertOtherProviderResponseToDomainDocument(document);
}

export async function fetchPerson(documentId: string): Promise<Person> {
  const document = await fetchDocumentInDB(documentId);
  const person = await fetchPersonInDB(document.personId);

  // Convert data into our domain type
  return convertDbPersonToDomainPerson(person);
}
