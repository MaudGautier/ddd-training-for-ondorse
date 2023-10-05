type Day = number;
type Month = number;
type Year = number;

export type BirthDate = {
  day: Day;
  month: Month;
  year: Year;
};

export type FirstName = string;
type LastName = string;

export type Person = {
  firstName: FirstName;
  lastName: LastName;
  birthDate: BirthDate;
};

export type IdDocument = {
  id: string;
  person: Person;
};

export type Status = "valid" | "invalid";

export type Dependencies = {
  checkPersonNameInOfficialRegister: (name: string) => boolean;
};
