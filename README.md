# cachelab Service Overview

## web
Purpose: Front-end user interface for the cache simulator application.
Technologies:
- React 18
- TypeScript
- Vite
- Ant Design UI
- Tailwind CSS
- ESLint / Vitest for linting and test support

## api
Purpose: HTTP API server that accepts uploads and manages job queueing for the simulator backend.
Technologies:
- Node.js
- Fastify web framework
- TypeScript
- BullMQ queue management
- ioredis Redis client

## worker
Purpose: Background worker process that executes queued jobs, compiles code, and extracts memory trace data.
Technologies:
- Node.js
- BullMQ queue worker
- ioredis Redis client
- dotenv for environment configuration
- Native build tooling installed in Docker image (gcc, g++, make, docker)

## tracergrind
Purpose: Containerized Valgrind extension build environment for the TracerGrind tool.
Technologies:
- Debian Linux base image
- Valgrind / TracerGrind source build
- build-essential, automake, libcapstone, libsqlite3, gcc-multilib
- ZIP and tar archive tooling

## texttrace
Purpose: Containerized build environment for the texttrace component used by the tracing workflow.
Technologies:
- Debian Linux base image
- TracerGrind texttrace build
- build-essential, automake, libcapstone, libsqlite3, gcc-multilib
- ZIP extraction tooling

## Environment configuration
The project uses a root `.env` file for Docker Compose and worker settings.

Variables in the root `.env`:
- `UID` and `GID`: local user/group IDs for container ownership mapping.
- `DOCKER_GID`: Docker group ID used by the `worker` container when mounting `/var/run/docker.sock`.
- `REDIS_HOST` and `REDIS_PORT`: Redis connection settings used by `api` and `worker`.
- `HOST_DATA_PATH`: local host path for the mounted `data` folder, required by the `worker` to run compilation and tracing containers.

Variables in `/web/.env`:
- `VITE_API_URL`: URL for the frontend to connect to the API server.

Notes:
- The `worker` service requires `HOST_DATA_PATH` to be defined in the environment so it can mount the correct host folder into the `tracergrind` and `texttrace` containers.
- The `api` service is configured by Docker Compose using `REDIS_HOST` and `REDIS_PORT` from the root `.env`.
- The `web` service currently runs with `CHOKIDAR_USEPOLLING=true` in Docker Compose and supports an optional `web/.env` file for frontend-specific settings.
