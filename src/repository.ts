import { BirthDate, IdDocument, Person } from "./types";

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

export async function fetchIdentityDocument(documentId: string): Promise<IdDocument> {
  // Request to IDNow
  const document = await fetchIdNowDocument(documentId);

  // Check validity
  checkDocumentIsID(document);

  // Convert data into our domain types
  return convertIdNowResponseToDomainDocument(document);
}

export async function fetchPerson(documentId: string): Promise<Person> {
  const document = await fetchDocumentInDB(documentId);
  const person = await fetchPersonInDB(document.personId);

  // Convert data into our domain type
  return convertDbPersonToDomainPerson(person);
}
