# Running MockMate with Docker

### Prerequisites

Create a `.env` file in the project root with your `MONGODB_URI`, `GEMINI_API_KEY`, and Clerk keys (see `.env.example`). MockMate uses a managed MongoDB instance (for example MongoDB Atlas), so no local database container is required.

### Building and running your application

When you're ready, start the application by running:

```bash
docker compose up --build
```

The app will be available at [http://localhost:3000](http://localhost:3000).

### Deploying your application to the cloud

First, build your image, e.g.:

```bash
docker build -t mockmate .
```

If your cloud uses a different CPU architecture than your development machine
(e.g., you are on an Apple Silicon Mac and your cloud provider is amd64),
build the image for that platform, e.g.:

```bash
docker build --platform=linux/amd64 -t mockmate .
```

Then push it to your registry, e.g. `docker push myregistry.com/mockmate`.

Consult Docker's [getting started](https://docs.docker.com/go/get-started-sharing/)
docs for more detail on building and pushing.
