# 🤖📚 AI Book Recommendation Agent

An AI-powered full-stack book recommendation application that understands natural-language reading preferences and returns relevant book suggestions.

The application combines a **React + TypeScript frontend**, a **Node.js + Express backend**, **Open Library book data**, and an **LLM-powered recommendation workflow** to search, filter and rank books based on the user's request.

## ✨ Features

- 💬 Natural-language book recommendation requests
- 🤖 AI-powered preference extraction
- 📚 Book search using the Open Library API
- 🎯 AI-assisted ranking of candidate books
- ✅ Structured preference validation with Zod
- 📅 Deterministic filtering by publication year
- 🖼️ Book covers, titles, authors and publication dates
- 🔄 Loading and error states
- 🧪 Mock mode for frontend development without consuming AI API quota
- 🌙 Responsive dark UI
- 🧩 Reusable React components
- 🪝 Custom React hook for recommendation requests
- 🧪 Unit testing with Vitest

## 🛠️ Tech Stack

### Frontend

- **React**
- **TypeScript**
- **Vite**
- **CSS3**
- **Vitest**
- **React Testing Library**

### Backend

- **Node.js**
- **TypeScript**
- **Express**
- **Zod**
- **Vitest**

### APIs & AI

- **Open Library API**
- **OpenRouter**
- **OpenAI-compatible SDK**

## 🏗️ Project Structure

```text
AI-Book-Recommendation-Agent/
│
├── backend/
│   ├── src/
│   │   ├── agents/
│   │   │   ├── bookRecommendationWorkflow.ts
│   │   │   └── bookRecommendationWorkflow.test.ts
│   │   │
│   │   ├── mocks/
│   │   │   └── bookRecommendationsMock.ts
│   │   │
│   │   ├── services/
│   │   │   ├── openLibraryService.ts
│   │   │   └── openaiService.ts
│   │   │
│   │   ├── types/
│   │   │   ├── book.ts
│   │   │   └── bookPreferences.ts
│   │   │
│   │   └── server.ts
│   │
│   ├── .env
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── BookCard.tsx
    │   │   └── SearchBar.tsx
    │   │
    │   ├── hooks/
    │   │   └── useBookRecommendations.ts
    │   │
    │   ├── types/
    │   │   └── book.ts
    │   │
    │   ├── App.tsx
    │   ├── index.css
    │   └── main.tsx
    │
    ├── package.json
    └── vite.config.ts
```

## 🧠 Architecture

The project is split into a frontend and backend.

```text
User
  ↓
React Frontend
  ↓
POST /api/recommendations
  ↓
Express Backend
  ↓
AI Preference Extraction
  ↓
Zod Validation
  ↓
Open Library Search
  ↓
TypeScript Filters
  ↓
AI Ranking
  ↓
Book[]
  ↓
React Book Cards
```

This separation keeps the UI independent from the recommendation logic and avoids exposing AI API credentials in the browser.

## 🤖 Recommendation Workflow

The recommendation workflow is implemented in:

```text
backend/src/agents/bookRecommendationWorkflow.ts
```

The workflow follows three main steps.

### 1. Understand the request

The user can write a request such as:

```text
I want a dark fantasy book similar to Harry Potter, published after 2018.
```

The AI extracts structured preferences such as:

```json
{
  "genre": "dark fantasy",
  "author": null,
  "similarBook": "Harry Potter",
  "minimumPublicationYear": 2019,
  "maximumPages": null,
  "language": null
}
```

The response is then validated using **Zod**.

### 2. Search and filter books

The backend searches Open Library using the extracted genre.

The returned books are mapped to the application's `Book` type and deterministic filters are applied before the ranking step.

For example, if a minimum publication year is provided, older books are removed before they are sent to the AI.

### 3. Rank candidates

The remaining candidate books are sent to the AI.

Instead of asking the model to recreate book objects, the AI returns only the IDs of the selected books:

```json
["/works/OL123W", "/works/OL456W"]
```

The backend then maps those IDs back to the original `Book` objects.

This prevents the model from inventing book metadata and keeps the final response grounded in Open Library data.

## 📚 Book Data

Book data is retrieved from the **Open Library Search API**.

The current application uses information such as:

- Title
- Author
- First publication year
- Cover image
- Open Library work ID

The backend transforms Open Library results into a shared `Book` structure:

```ts
export interface Book {
  id: string;
  title: string;
  authors: string[];
  description?: string;
  publishedDate?: string;
  pageCount?: number;
  categories?: string[];
  thumbnail?: string;
}
```

## 🧩 Frontend Components

### `SearchBar`

The search component allows the user to describe the type of book they are looking for in natural language.

It receives the current query and callbacks from `App.tsx`, keeping the component focused on presentation and user interaction.

### `BookCard`

Displays each recommended book with information such as:

- Cover
- Title
- Author
- Publication year

The component is reusable and receives book information through typed props.

## 🪝 Custom Hook

The frontend uses:

```text
src/hooks/useBookRecommendations.ts
```

The `useBookRecommendations` hook is responsible for:

- Sending recommendation requests to the backend
- Managing the loading state
- Managing errors
- Storing the returned recommendations

This keeps API-related state and logic outside the UI components.

## 🧪 Mock Mode

During development, the backend can return mock recommendations instead of calling the AI provider.

This is useful for:

- Working on the UI without consuming API quota
- Testing frontend states consistently
- Continuing development when the AI provider reaches a rate limit
- Reducing unnecessary external API requests

Enable mock mode in:

```env
USE_AI_MOCK=true
```

To use the real AI workflow:

```env
USE_AI_MOCK=false
```

## 🧪 Testing

The project uses **Vitest**.

Backend workflow tests can mock external dependencies such as:

- `askAI`
- `searchBooks`

This allows the agent logic to be tested without making real OpenRouter or Open Library requests.

Important scenarios include:

- Returning only books selected by the AI
- Filtering books by minimum publication year
- Handling books without publication dates
- Parsing AI responses wrapped in Markdown JSON blocks
- Rejecting invalid AI preference structures
- Ignoring recommendation IDs that do not exist in the available candidates

Frontend tests can use **React Testing Library** to test components such as `BookCard` and `SearchBar`.

Run tests with:

```bash
npm test
```

## 🚀 Getting Started

### Prerequisites

Make sure you have installed:

- Node.js
- npm

You also need an OpenRouter API key to use the real AI workflow.

### 1. Clone the repository

```bash
git clone <YOUR_REPOSITORY_URL>
```

### 2. Install backend dependencies

```bash
cd AI-Book-Recommendation-Agent/backend
npm install
```

### 3. Configure backend environment variables

Create a `.env` file inside the `backend` folder:

```env
OPENROUTER_API_KEY=your_openrouter_api_key
USE_AI_MOCK=true
```

Do not commit the `.env` file to GitHub.

### 4. Start the backend

```bash
npm run dev
```

The backend runs by default on:

```text
http://localhost:3000
```

You can test the health endpoint at:

```text
GET /api/health
```

### 5. Install frontend dependencies

Open another terminal:

```bash
cd AI-Book-Recommendation-Agent/frontend
npm install
```

### 6. Start the frontend

```bash
npm run dev
```

The application will then be available through the local Vite development server.

## 🔌 API

### `GET /api/health`

Checks whether the backend server is running.

Example response:

```json
{
  "status": "ok"
}
```

### `POST /api/recommendations`

Generates book recommendations from a natural-language request.

Example request:

```json
{
  "query": "I want a dark fantasy book similar to Harry Potter, published after 2018"
}
```

Example response:

```json
{
  "recommendations": [
    {
      "id": "/works/OL123W",
      "title": "Example Book",
      "authors": ["Example Author"],
      "publishedDate": "2024",
      "thumbnail": "https://covers.openlibrary.org/..."
    }
  ]
}
```

## 📦 Available Scripts

### Backend

| Command       | Description                                    |
| ------------- | ---------------------------------------------- |
| `npm run dev` | Starts the Express backend in development mode |
| `npm test`    | Runs backend tests                             |

### Frontend

| Command           | Description                        |
| ----------------- | ---------------------------------- |
| `npm run dev`     | Starts the Vite development server |
| `npm run build`   | Creates a production build         |
| `npm run preview` | Previews the production build      |
| `npm run lint`    | Runs ESLint                        |
| `npm test`        | Runs frontend tests                |

## 🔮 Future Improvements

Possible future improvements include:

- 🧠 Richer AI ranking using descriptions, themes and genres
- 📖 Fetching additional Open Library work details
- 💡 Showing an AI-generated explanation for each recommendation
- 📊 Recommendation match scores
- 🎛️ Filters for genre, publication year, language and page count
- 💾 Saving recommendation history
- ❤️ Favourite books
- 👤 User accounts
- 🔐 Persistent database storage
- ⚡ Caching AI and Open Library requests
- 🧪 More frontend, backend and integration tests
- 🚀 Production deployment
- 🤖 More advanced agentic workflows or tool calling

## 📸 Screenshots

### 🏠 Home

![AI Book Recommendation Agent Home](./public/screenshots/home.png)

### 📚 Recommendations

![AI Book Recommendations](./public/screenshots/recommendations.png)

## 👩‍💻 Author

**Jéssica Alves**

Computer Engineering graduate and Software Engineer interested in full-stack development, React, TypeScript and AI-powered applications.

[GitHub](https://github.com/jessica-alves-19)

## 📄 License

This project is for educational and portfolio purposes.
