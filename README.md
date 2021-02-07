# Aiven Node Utility

This is a personal project for interacting with Aiven services
via NodeJS and the API.

## Quick Start

```bash
npm install -S @de44/aiven-node
npm i @de44/aiven-node
```

```javascript
const AivenApi = require('@de44/aiven-node');

const avn = new AivenApi({
  token: 'my-aiven-api-token',
  projectId: 'my-project-id',
});
```

## API

### General

| Property                | Type             | Description                            |
| ----------------------- | ---------------- | -------------------------------------- |
| `me()`                  | `async function` | Returns the currently logged in user   |
| `setProject(projectId)` | `function`       | Sets the active project.               |
| `clouds`                | `async function` | Fetches all public clouds and regions. |

### Projects

| Property               | Type             | Description                                     |
| ---------------------- | ---------------- | ----------------------------------------------- |
| `projects.list()`      | `async function` | Returns all the project for the logged in user. |
| `projects.details(id)` | `async function` | Returns the details of the specified project.   |
| `projects.ca()`        | `async function` | Returns project CA.                             |

### Services

| Property                | Type             | Description                                       |
| ----------------------- | ---------------- | ------------------------------------------------- |
| `services.list()`       | `async function` | Returns all the services for the current project. |
| `services.details(id)`  | `async function` | Returns the details of the specified project.     |
| `services.powerOn(id)`  | `async function` | Powers on the specified project.                  |
| `services.powerOff(id)` | `async function` | Powers off the specified project.                 |
| `services.remove(id)`   | `async function` | Deletes the specified service.                    |

### Kafka

`avn.getKafkaCreds(serviceName: string): Promise<KafkaCredentials>`

Uses the active project set in the client. Returns the following type

```js
const kCreds = await avn.getKafkaCreds('my-service');
```

| Property                   | Type       | Description                                                     |
| -------------------------- | ---------- | --------------------------------------------------------------- |
| `kCreds.conn`              | `Object`   | [KafkaJS](https://www.npmjs.com/package/kafkajs) style configs. |
| `kCreds.conn.brokers`      | `string[]` | Broker list.                                                    |
| `kCreds.conn.ssl`          | `Object`   | Object containing encryption and authentication certificates.   |
| `kCreds.kafkaUri`          | `string`   | Kafka brokers URI.                                              |
| `kCreds.connectUri`        | `string`   | Kafka Connect URI.                                              |
| `kCreds.kafkaRestUri`      | `string`   | Kafka Rest Proxy URI.                                           |
| `kCreds.schemaRegistryUri` | `string`   | Kafka Schema Registry URI.                                      |

### Elasticsearch

`avn.getElasticsearchCreds(serviceName: string): Promise<ElasticsearchCredentials>`

Uses the active project set in the client. Returns the following type

```js
const esCreds = await avn.getElasticsearchCreds('my-service');
```

| Property              | Type     | Description                                                       |
| --------------------- | -------- | ----------------------------------------------------------------- |
| `esCreds.baseReq`     | `Object` | [Axios](https://www.npmjs.com/package/axios) style request object |
| `esCreds.baseReq.url` | `string` | The request uri, including basic auth.                            |
| `esCreds.username`    | `string` | The admin username.                                               |
| `esCreds.password`    | `string` | The admin password.                                               |
| `esCreds.esUri`       | `string` | The cluster uri, including basic auth.                            |
| `esCreds.kibanaUri`   | `string` | The Kibana uri, including basic auth.                             |
