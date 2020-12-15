# Aiven Node Utility

This is a personal project for interacting with Aiven services
via NodeJS and the API.

# Quick Start

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

# API

| Property                | Type             | Description                                       |
| ----------------------- | ---------------- | ------------------------------------------------- |
| `me()`                  | `async function` | Returns the currently logged in user              |
| `setProject(projectId)` | `function`       | Sets the active project.                          |
| `projects`              | `Object`         | Project utilities                                 |
| `projects.list()`       | `async function` | Returns all the project for the logged in user.   |
| `projects.details(id)`  | `async function` | Returns the details of the specified project.     |
| `projects.ca()`         | `async function` | Returns project CA.                               |
| `services`              | `Object`         | Service utilities                                 |
| `services.list()`       | `async function` | Returns all the services for the current project. |
| `services.details(id)`  | `async function` | Returns the details of the specified project.     |
| `services.powerOn(id)`  | `async function` | Powers on the specified project.                  |
| `services.powerOff(id)` | `async function` | Powers off the specified project.                 |
| `services.remove(id)`   | `async function` | Deletes the specified service.                    |
