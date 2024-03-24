# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

# Running React Vite Application in Docker Container

This guide provides step-by-step instructions on how to run a React Vite application in a Docker container.

## Prerequisites

- Docker installed on your system.
- React Vite application configured to run on port `3000`.

## Installation

### 1. Install Docker

If you haven't already installed Docker on your system, follow the installation instructions for your operating system:

- For Windows: [Install Docker Desktop on Windows](https://docs.docker.com/desktop/install/windows-install/)
- For macOS: [Install Docker Desktop on macOS](https://docs.docker.com/desktop/install/mac-install/)
- For Linux: [Install Docker Engine on Linux](https://docs.docker.com/engine/install/)

## Usage

### 1. Update Vite Configuration

Ensure that your Vite configuration file (`vite.config.js`) sets the server port to `3000`:

```javascript
// vite.config.js
import { defineConfig } from "vite";

export default defineConfig({
  server: {
    port: 3000,
  },
});
```

### 2. Build Docker Image

Open a terminal in the root directory of your React Vite project and run the following command to build a Docker image:

```bash
docker build -t my-react-app .
```

Replace `my-react-app` with the desired name for your Docker image.

### 3. Run Docker Container

Once the Docker image is built, run the following command to start a Docker container:

```bash
docker run -it -p 3000:3000 my-react-app
```

This command runs the Docker container in interactive mode (`-it`) and maps port `3000` inside the container to port `3000` on your host machine.

### 4. Access Your Application

Open your web browser and navigate to `http://localhost:3000` to access your React Vite application running inside the Docker container.
