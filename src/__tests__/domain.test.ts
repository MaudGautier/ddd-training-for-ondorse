import { Dependencies, IdDocument, Person } from "../types";
import { doesPersonMatchDocument } from "../domain";

const JANE_DOE: Person = {
  firstName: "Jane",
  lastName: "Doe",
  birthDate: {
    day: 1,
    month: 1,
    year: 1992,
  },
};

const JANE_DOE_DOC: IdDocument = {
  id: "1",
  person: JANE_DOE,
};

const MOCKED_DEPENDENCIES: Dependencies = {
  checkPersonNameInOfficialRegister: (name: string) => {
    if (name === "Janne Doe") {
      return false;
    }
    return true;
  },
};

describe("doesPersonMatchDocument", () => {
  test("Should return 'valid' if all pieces of information match (firstName, lastName, birthdate)", () => {
    // GIVEN
    const person = JANE_DOE;
    const idDocument = JANE_DOE_DOC;

    // WHEN
    const status = doesPersonMatchDocument(person, idDocument, MOCKED_DEPENDENCIES);

    // THEN
    expect(status).toEqual("valid");
  });

  describe("Checks on firstName", () => {
    test("Should return 'invalid' if firstName doesn't match", () => {
      // GIVEN
      const person = {
        ...JANE_DOE,
        firstName: "Janet",
      };
      const idDocument = JANE_DOE_DOC;

      // WHEN
      const status = doesPersonMatchDocument(person, idDocument, MOCKED_DEPENDENCIES);

      // THEN
      expect(status).toEqual("invalid");
    });

    test("Should return 'valid' if the firstName on the document has additional names not registered by the person, but the first name(s) match", () => {
      // GIVEN
      const person = JANE_DOE;
      const idDocument = {
        id: "1",
        person: {
          ...JANE_DOE,
          firstName: "Jane Michelle",
        },
      };

      // WHEN
      const status = doesPersonMatchDocument(person, idDocument, MOCKED_DEPENDENCIES);

      // THEN
      expect(status).toEqual("valid");
    });
  });

  describe("Checks on lastName", () => {
    test("Should return 'invalid' if lastName doesn't match", () => {
      // GIVEN
      const person = {
        ...JANE_DOE,
        lastName: "Doolittle",
      };
      const idDocument = JANE_DOE_DOC;

      // WHEN
      const status = doesPersonMatchDocument(person, idDocument, MOCKED_DEPENDENCIES);

      // THEN
      expect(status).toEqual("invalid");
    });
  });

  describe("Checks on name validity in official register", () => {
    test("Should return 'invalid' if name doesn't match the official register", () => {
      // GIVEN
      const person = {
        ...JANE_DOE,
        firstName: "Janne",
      };
      const idDocument = {
        ...JANE_DOE_DOC,
        person: {
          ...JANE_DOE,
          firstName: "Janne",
        },
      };

      // WHEN
      const status = doesPersonMatchDocument(person, idDocument, MOCKED_DEPENDENCIES);

      // THEN
      expect(status).toEqual("invalid");
    });
  });

  describe("Checks on date of birth", () => {
    test("Should return 'invalid' if days of birth don't match", () => {
      // GIVEN
      const person = {
        ...JANE_DOE,
        birthDate: {
          ...JANE_DOE.birthDate,
          day: 31,
        },
      };
      const idDocument = JANE_DOE_DOC;

      // WHEN
      const status = doesPersonMatchDocument(person, idDocument, MOCKED_DEPENDENCIES);

      // THEN
      expect(status).toEqual("invalid");
    });

    test("Should return 'invalid' if days of birth don't match", () => {
      // GIVEN
      const person = {
        ...JANE_DOE,
        birthDate: {
          ...JANE_DOE.birthDate,
          day: 31,
        },
      };
      const idDocument = JANE_DOE_DOC;

      // WHEN
      const status = doesPersonMatchDocument(person, idDocument, MOCKED_DEPENDENCIES);

      // THEN
      expect(status).toEqual("invalid");
    });
  });
});
