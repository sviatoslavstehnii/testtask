
## Prerequisites

Make sure you have the following installed on your system:

- Python 3.8 or higher
- Node.js and npm
- Redis


## Backend (API) Setup

1. **Create a virtual environment**:
   ```bash
   python3 -m venv venv
   ```

2. **Activate the virtual environment**:
   - On macOS/Linux:
     ```bash
     source venv/bin/activate
     ```
   - On Windows:
     ```bash
     venv\Scripts\activate
     ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the API**:
   Navigate to the `api` directory and start the server:
   ```bash
   cd api
   python3 main.py
   ```

---

## Redis Setup

1. **Start Redis**:
   ```bash
   redis-server --port 6380
   ```

---

## Frontend (Client) Setup

1. **Navigate to the client directory**:
   ```bash
   cd ../client
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the client**:
   ```bash
   npm start
   ```

---

## Application Usage

- Ensure the backend API and Redis server are running before starting the client.
- Open the application in your browser at [http://localhost:3000](http://localhost:3000).

---

## Project Structure

- **api/**: Backend application (Python/FastApi).
- **client/**: Frontend application (React.js).

---


