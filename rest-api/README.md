# Simple REST API

A minimal REST API built with Node.js and Express for managing a collection of items.

## Features

- **GET /items**: Fetch all items
- **POST /items**: Add a new item
- **GET /health**: Check API health status
- CORS support for cross-origin requests
- JSON-formatted responses
- Basic error handling and input validation

## Getting Started

### Prerequisites

- Node.js (version 14 or newer)
- npm or yarn

### Setup

1. Clone or download this repository and navigate to the project directory:
   ```bash
   cd Project
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```

   For development with automatic restarts:
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:3000`

## API Reference

### GET /items

Returns a list of all items.

**Example Response:**
