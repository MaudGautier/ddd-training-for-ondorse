# DDD training for Ondorse

This repo contains a small practical example of the way we can apply DDD principles in the codebase.

## Description of the business case

This is based on an existing business problem tackled at Ondorse: the verification of a person's ID document.

In brief, somebody has uploaded their ID document (passport, driver's licence, ID card, etc...) and we need to make sure
that the information on the document correspond to the person.

About the business logic that needs to be implemented (done in this sample repo):

- The information stored on the ID document must be the same as what is known about the person. In particular:
    - Same first names
    - Same last name
    - Same date of birth
- About the first names: if there are multiple, we need to see that the ones on the ID document are a subset of those
  entered by the person (or vice-versa).
- About the last names: if there are multiple, we need to check that there is at least one in common between the ID
  document and the one(s) registered (Not implemented)
- About the date of birth: we need to check that there is no contradiction (but OK if one not filled) (Not implemented)

About the technical details (only pseudocode with mocks in this sample repo):

- The ID document is already stored in our DB (with the associated person linked to the document)
- The ID document has already been "checked" by making a request to IDNow (endpoint: /document/{document_id}/check)
- The "report" by IDNow is retrieved by making a request to IDNow (endpoint: /document/{document_id})

## Getting started

```
# Install dependencies
npm install

# Run tests
npm test
```




