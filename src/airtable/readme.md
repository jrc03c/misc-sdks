# Airtable

Unlike the other SDKs in this library, the Airtable SDK comes with three main classes:

- `AirtableClient`
- `AirtableBase`
- `AirtableTable`

Typical usage will probably look something like this:

```js
import { AirtableClient } from "@jrc03c/misc-sdks"

const client = new AirtableClient({ token: "YOUR_API_TOKEN" })
const baseRef = client.getBaseRef("YOUR_BASE_ID")
const tableRef = baseRef.getTableRef("YOUR_TABLE_ID")

const records = [
  // ...
]

tableRef.createRecords(records).then(response => {
  console.log(response.status)
  // ...
})
```

In other words, the most common workflow will probably involve:

1. instantiating an `AirtableClient` with a given API token,
2. getting a reference to a base with a given ID,
3. getting a reference to a table with a given ID, and then...
4. creating, reading, updating, and deleting records via the table reference.

## API

The core classes, `AirtableClient` and `AirtableClientResponse`, are documented below. Documentation for the other classes can be found via these links:

- [`AirtableBase`](./base/readme.md)
- [`AirtableTable`](./table/readme.md)

### `AirtableClient`

The `AirtableClient` class is a subclass of [`BaseClient`](../base/readme.md). The properties and methods inherited from that class will not be described below except where they override values or behaviors in some significant way.

#### `AirtableClient(config: object)` (constructor)

The properties of the `config` object passed into the constructor match the instance properties described below. The only property that's _required_ is `token`.

#### Properties

##### `apiVersion`

A non-negative integer representing the API version to use. Its default value is 0 (Airtable's current API version).

##### `baseUrl`

A string representing the "core" URL to which all API path calls will be appended. Its default value is `"https://api.airtable.com/v0"` (i.e., a concatenation of `"https://api.airtable.com/v"` and the value of the `apiVersion` property described above).

##### `token`

A string representing an API authentication token. This property _must_ be defined since all calls to the Airtable API require a valid token. Tokens can be managed [here](https://airtable.com/create/tokens).

#### Methods

##### `getBaseRef(id: string): AirtableBase`

Given the ID of a particular Airtable base, returns an [`AirtableBase`](./base/readme.md) instance.

##### `send(path: string, options: object): Promise<AirtableClientResponse>`

Given a path and an options object (of the kind that's usually passed into `fetch`), returns a `Promise` that resolves to an `AirtableClientResponse` instance.

### `AirtableClientResponse`

The `AirtableClientResponse` class is a subclass of [`BaseClientResponse`](../base/readme.md). It does not override any properties or methods of that class.

## Tests

To run the unit tests, do:

```bash
npx fake-jest src/airtable
```
