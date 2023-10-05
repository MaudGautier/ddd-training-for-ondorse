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

## Process to implement

First, we define the types for the objects that will serve as inputs and outputs to our domain (`src/types.ts`). We also
implement the domain logic (business rules) using these input and output types (`src/domain.ts`) and add unit tests to
make sure that there is no mistake in the implementation of the domain (`src/__tests__/domain.test.ts`).
All of this corresponds to the commit with the tag `v1-domain_simple`.

Second, we can add the other implementation details, i.e. the calls to retrieve the data, whether by making requests to
the DB, or by making requests to third-party APIs. This corresponds to the commit tagged `v2-implementation-details`.
Importantly, let's note that these have to be plugged onto the domain and not the other way round. In practice, this
means we need to create an adapter layer for each in order to "adapt" the API/DB response schema to that of our domain.

Later on, we can enrich the domain if the specs evolve (tag `v3-domain-enriched`).
Note that, as long as the input and output objects' types don't change, this should not affect other layers (API, Data
access), because these layers are decoupled.

If we need to plug other 3rd party APIs, we can plug the new API to the domain without having to modify even one single
line of code in the domain, which means that we cannot introduce any mistake.
The only thing we need to do is implement the call to the new 3rd-party API, and implement an adapter so that it matches
the types of our domain (tag `v4-add-new-provider`).

If the schema of the response sent by the provider changes (possible as this is something we cannot control), we only
need to update the types and the adapter, so that we still match the domain types from the new API specs (
tag `v5-update-new-provider-response`).

When the domain gets a bit more complex, we may need for example to make requests to 3rd-party APIs in the middle of the
domain logic. In that case, we can opt for dependency injection, i.e. inject the function making the call as a
dependency to the domain logic (tag `v6-dependency-injection`).

