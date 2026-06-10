# Overview

This repository contains a **website** for cache simulation, a **back-end workflow** for gattering execution traces of a `.c` code, and an **API** to connect the previous two.

## Back-end worflow

- User uploads a `.c` file to the **API**
- Examples of _POST_ request for `/upload`:

```bash
curl -X POST "http://localhost:3333/uploads" -F "file=@hello.c"
```

- The **API** will send back a response, warning if it was able to start the processing
- Examples of _json_ responses:

```json
{
  "message": "File recieved and job created",
  "jobId": "1"
}
```

- In case it suceeds:

1. Generate an unique identifier
2. Creates an exclusive folder that is shared amongst the services
3. Saves the uploaded file in the new shared volume
4. Creates and adds a _job_ to the queue

- Folder example:

```text id="m1lh6p"
/data/uploads/550e8400-hello-world/
```

- The **worker** gets the jobs automatically and after that will:

1. Find the uploaded file knowing the folder's path
2. Run it through TracerGrind and TextTrace
3. Save the results in the same folder as the uploaded file
4. Process the results into a _json_ to be send

- Example of folder's content:

```text id="2kqz6d"
data/uploads/
└── <uuid>-<nome-arquivo>/
     ├── <nome-arquivo>.c (uploaded file)
     ├── <nome-arquivo>.out (binary)
     ├── <nome-arquivo>.trace (execution traces gattered by TracerGrind)
     ├── <nome-arquivo>.texttrace (the traces in a more human readable format)
     ├── <nome-arquivo>-main-memory-accesses.json (end result)
     └── compile.log
```

- Example of `<nome-arquivo>-main-memory-accesses.json`:

```json
{
  "program": {
    "name": "hello-world",
    "main": {
      "start": "0x401112",
      "end": "0x401126",
      "size": 20
    }
  },
  "statistics": {
    "totalAccesses": 4,
    "loads": 2,
    "stores": 2
  },
  "accesses": [
    {
      "instructionAddress": "0x401112",
      "memoryAddress": "0x1fff000bb0",
      "accessType": "STORE",
      "size": 8
    },
    {
      "instructionAddress": "0x40111b",
      "memoryAddress": "0x1fff000ba8",
      "accessType": "STORE",
      "size": 8
    },
    {
      "instructionAddress": "0x401125",
      "memoryAddress": "0x1fff000bb0",
      "accessType": "LOAD",
      "size": 8
    },
    {
      "instructionAddress": "0x401126",
      "memoryAddress": "0x1fff000bb8",
      "accessType": "LOAD",
      "size": 8
    }
  ]
}
```

- The **website** will be checking to know the _job's_ progress:

```bash
curl http://localhost:3333/jobs/{jobId}
```

- Since the **website** is only supposed to interpret _LOADs_, the **API** response (when suceeded) is:

```json
{
  "id": "1",
  "status": "completed",
  "simulation": {
    "accesses": ["0x1fff000bb0", "0x1fff000be8"]
  }
}
```

- In case of failure in the worker a response is send back, but doesn't explain the reason for failure.

# Project folders

**web:** front-end user interface for the cache simulator application.

- React 18
- TypeScript
- Vite
- Ant Design UI
- Tailwind CSS
- ESLint / Vitest for linting and test support

**api:** HTTP API server that accepts uploads and manages job queueing for the simulator backend.

- Node.js
- Fastify web framework
- TypeScript
- BullMQ queue management
- ioredis Redis client

**worker:** background worker process that executes queued jobs, compiles code, and extracts memory trace data.

- Node.js
- BullMQ queue worker
- ioredis Redis client
- Native build tooling installed in Docker image (gcc, g++, make, docker)

**tracergrind:** containerized Valgrind extension build environment for the TracerGrind tool.

- Debian Linux base image
- Valgrind / TracerGrind source build
- build-essential, automake, libcapstone, libsqlite3, gcc-multilib
- ZIP and tar archive tooling

**texttrace:** containerized build environment for the TextTrace component used by the tracing workflow.

- Debian Linux base image
- TracerGrind texttrace build
- build-essential, automake, libcapstone, libsqlite3, gcc-multilib
- ZIP extraction tooling

## Environment configuration

In the root folder, create data/uploads.

The project uses a root `.env` file for Docker Compose and worker settings.

Variables in the root `.env`:

- `UID` and `GID`: local user/group IDs for container ownership mapping.
- `DOCKER_GID`: Docker group ID used by the `worker` container when mounting `/var/run/docker.sock`.
- `REDIS_HOST` and `REDIS_PORT`: Redis connection settings used by `api` and `worker`.
- `HOST_DATA_PATH`: local host path for the mounted `data` folder, required by the `worker` to run compilation and tracing containers.

Example of root `.env` content:

```
UID=1000
GID=1000

DOCKER_GID=1001

REDIS_HOST=redis
REDIS_PORT=6379

HOST_DATA_PATH=/home/username/project/data
```

Variables in `/web/.env`:

- `VITE_API_URL`: URL for the frontend to connect to the API server.

Example of `/web/.env` content:

```
VITE_API_URL=http://localhost:3333
```

Notes:

- The `worker` service requires `HOST_DATA_PATH` to be defined in the environment so it can mount the correct host folder into the `tracergrind` and `texttrace` containers.
- The `api` service is configured by Docker Compose using `REDIS_HOST` and `REDIS_PORT` from the root `.env`.
