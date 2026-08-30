# ⚡ AI Scheduling Agent

> **Production multi-tenant agent architecture leveraging stateless streamable UI transport protocols, automated session persistence, and distributed token rate-limiting.**

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-blue?style=flat-square&logo=react)](https://react.dev/)
[![Vercel AI SDK](https://img.shields.io/badge/Vercel%20AI%20SDK-ai%20v7%20%7C%20react%20v4-black?style=flat-square&logo=vercel)](https://sdk.vercel.ai/)
[![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-v4%20(base--nova)-000000?style=flat-square&logo=shadcnui)](https://ui.shadcn.com/)
[![Google Gemini](https://img.shields.io/badge/Google%20Gemini-Flash-8E75B2?style=flat-square&logo=google)](https://ai.google.dev/)
[![Upstash Redis](https://img.shields.io/badge/Upstash-Redis%20RateLimit-00E599?style=flat-square&logo=redis)](https://upstash.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose%20v9-47A248?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)

---

## 🏛️ System Architecture

```mermaid
flowchart TD
    subgraph Client["Client Layer (Next.js 16 / React 19 / shadcn/ui)"]
        UI[Chat Interface & Generative UI Components]
        CH[useChatHistory & localStorage State]
        RLB[Rate Limit Counter & Guard Badge]
        HITL[Interactive Tool Approval Dialogue]
    end

    subgraph EdgeAPI["API & Ingestion Layer (Edge / Serverless)"]
        RLMiddleware["Distributed Rate Limiter (@upstash/ratelimit)"]
        ChatRoute["POST /api/chat (SSE Stream Endpoint)"]
        HydrateRoute["GET /api/chat/[chatId] (Hydration Endpoint)"]
    end

    subgraph AgentCore["Agent Core (Vercel AI SDK Core)"]
        LLM["Google Gemini 3.5 Flash Model"]
        Engine["streamText + convertToModelMessages Engine"]
        ToolExecutor["Dynamic Tool Execution Pipeline"]
    end

    subgraph ExtServices["External Ecosystem & Storage"]
        Redis[("Upstash Redis (Sliding Window KV)")]
        Mongo[("MongoDB Atlas (Chat & Booking Schemas)")]
        CalAPI["Cal.com API v2 (Slots & Bookings)"]
    end

    UI -->|1. SSE Stream Request| RLMiddleware
    RLMiddleware <-->|Sliding Window Check| Redis
    RLMiddleware -->|Authorized| ChatRoute
    ChatRoute -->|2. Convert UI Parts to Model Messages| Engine
    Engine <-->|3. Multi-Step Reasoning| LLM
    Engine -->|4. Tool Invocation Request| ToolExecutor
    ToolExecutor -->|Slot Fetch| CalAPI
    ToolExecutor -->|Requires Approval| HITL
    HITL -->|5. Cryptographic Approval Payload| Engine
    ToolExecutor -->|Booking Dispatch| CalAPI
    ToolExecutor -->|Record Booking| Mongo
    ChatRoute -->|6. Stateless UI Message Stream| UI
    ChatRoute -.->|7. Asynchronous onFinish Hook| Mongo
    CH <-->|Hydrate on Load| HydrateRoute
    HydrateRoute <--> Mongo
```

---

## 🚀 Key Architectural Pillars

### 1. Stateless Streamable UI Transport Protocol
- **Transport Abstraction**: Uses Vercel AI SDK's `createUIMessageStreamResponse` and `toUIMessageStream` over standard Server-Sent Events (SSE).
- **Generative Interactive UI**: Message streams carry granular UI parts (`tool-checkAvailableSlots`, `tool-bookAppointment`, `reasoning`, `text`). The client dynamically renders rich interactive components (`AvailabilitySlotPicker`, `BookingApproval`) directly inside the conversation stream rather than parsing raw text or JSON.
- **Stateless Server Execution**: The server remains completely stateless across stream segments, transforming serializable UI payloads via `convertToModelMessages` into model-compliant schemas on each turn.

### 2. Human-In-The-Loop (HITL) & Safe Tool Execution
- **Cryptographic Action Approval**: Sensitive tool executions (`bookAppointment`) require explicit client-side confirmation via `toolApproval: { bookAppointment: "user-approval" }`.
- **Approval Lifecycle**: The model pauses execution in an `approval-requested` state until the user approves or rejects the booking via interactive UI controls. The response resumes the stream via `lastAssistantMessageIsCompleteWithApprovalResponses` with optional HMAC verification via `experimental_toolApprovalSecret`.

### 3. Distributed Sliding-Window Token Rate Limiting
- **Centralized Enforcement**: Protected by `@upstash/ratelimit` backed by serverless Redis to enforce rate limits across distributed serverless instances.
- **Sliding Window Algorithm**: Enforces a strict 20-request per 20-minute sliding window keyed by client IP (`x-forwarded-for`).
- **Standard Protocol Headers**: Emits standard RFC rate limit headers (`X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`, `Retry-After`).
- **Resilient Fallback**: Implements graceful degradation — if the Redis cache encounters downtime, requests are optimistically allowed with fallback defaults to maintain system availability.

### 4. Non-Blocking Automated Session Persistence
- **Zero-Latency Persistence**: Session state is persisted asynchronously inside the stream's `onFinish` lifecycle hook. Chat messages are upserted into MongoDB via `Chat.findOneAndUpdate({ chatId }, { $set: { messages } }, { upsert: true })` after stream completion without introducing latency into the token stream.
- **Client-Side Session Hydration**: Sessions are managed with a dual-tier mechanism: fast initial rendering via client storage (`useChatHistory`), followed by validation and hydration via `GET /api/chat/[chatId]`.

### 5. Multi-Timezone Slot Discovery & Cal.com v2 Engine
- **Slot Discovery**: `checkAvailableSlots` fetches available intervals from the Cal.com v2 API (`/v2/slots`).
- **Timezone Normalization**: Automatically reconciles time offsets between the host's base timezone (`Asia/Karachi`) and the client's IANA browser timezone.
- **Autonomous Booking Execution**: Automatically dispatches validated booking payloads to Cal.com (`/v2/bookings`) and stores confirmed records in MongoDB.

---

## 🛠️ Tech Stack

| Layer | Technologies | Purpose |
| :--- | :--- | :--- |
| **Framework** | [Next.js 16 (App Router)](https://nextjs.org/), [React 19](https://react.dev/) | Serverless application framework & React Server Components |
| **Agent Core** | [Vercel AI SDK (`ai` v7)](https://sdk.vercel.ai/), [`@ai-sdk/react` v4](https://sdk.vercel.ai/), [`@ai-sdk/google` v4](https://sdk.vercel.ai/) | Generative UI streaming, tool orchestration, and LLM communication |
| **Foundation Model** | [Google Gemini 3.5 / 2.5 Flash](https://ai.google.dev/) | Fast reasoning, tool invocation, and structured date/time extraction |
| **Component Library & UI** | [shadcn/ui (base-nova)](https://ui.shadcn.com/), [Base UI](https://base-ui.com/), [Tailwind CSS v4](https://tailwindcss.com/), [Remix Icons](https://remixicon.com/) | Accessible, composable UI component library & dark-mode styling |
| **Caching & Rate Limiting** | [Upstash Redis](https://upstash.com/), [`@upstash/ratelimit`](https://upstash.com/) | Distributed sliding-window rate limiting & analytics |
| **Persistence** | [MongoDB Atlas](https://www.mongodb.com/), [Mongoose 9](https://mongoosejs.com/) | Persistent document storage for chats and confirmed appointments |
| **Scheduling Engine** | [Cal.com API v2](https://cal.com/docs/api-reference/v2) | Slot query, scheduling verification, and calendar sync |

---

## 📁 Repository Structure

```text
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── chat/
│   │   │   │   ├── [chatId]/route.ts   # Chat session hydration endpoint
│   │   │   │   └── route.ts            # SSE streaming endpoint with tool pipeline & rate limit
│   │   │   ├── models/route.ts         # Model capability discovery endpoint
│   │   │   └── ratelimit/route.ts      # Rate limit telemetry & status endpoint
│   │   ├── globals.css                 # Tailwind CSS v4 variables & custom styles
│   │   ├── layout.tsx                  # Root layout with font and metadata configuration
│   │   └── page.tsx                    # Main chat interface with Generative UI renderer
│   ├── components/
│   │   ├── booking-actions.tsx         # Generative UI components (AvailabilitySlotPicker, BookingApproval)
│   │   ├── chat-header.tsx             # Header component with rate limit badge & theme toggles
│   │   ├── chat-input.tsx              # Input bar with stream status & rate limit counters
│   │   ├── chat-message.tsx            # Message row renderer with Markdown & tool parts
│   │   ├── rate-limit-badge.tsx        # Dynamic token capacity badge & countdown timer
│   │   ├── sidebar.tsx                 # Multi-session navigation & history sidebar
│   │   └── ui/                         # shadcn/ui primitives built on Base UI (Button, Card, Input, Textarea)
│   ├── hooks/
│   │   ├── use-chat-history.ts         # Multi-session state management & storage synchronization
│   │   ├── use-countdown.ts            # Reactive timestamp countdown utility
│   │   └── use-rate-limit.ts           # Rate limit polling, header parsing & optimistic updates
│   ├── lib/
│   │   ├── db.ts                       # Cached MongoDB connection manager
│   │   ├── ratelimit.ts                # Upstash Redis client & sliding window configuration
│   │   └── utils.ts                    # Class name merging & utility helpers
│   ├── models/
│   │   ├── appointment.ts              # MongoDB schema for confirmed calendar bookings
│   │   └── chat.ts                     # MongoDB schema for persistent chat trajectories
│   └── tools/
│       └── allTools.ts                 # Cal.com API v2 tool definitions with Zod schema validation
├── package.json
├── tsconfig.json
└── next.config.ts
```

---

## ⚙️ Environment Variables

Create a `.env.local` file in the root directory:

```env
# AI Model Provider
GOOGLE_GENERATIVE_AI_API_KEY="your-google-gemini-api-key"

# Distributed Rate Limiting (Upstash Redis)
UPSTASH_REDIS_REST_URL="https://your-database.upstash.io"
UPSTASH_REDIS_REST_TOKEN="your-upstash-token"

# Database Persistence (MongoDB)
MONGODB_URI="mongodb+srv://user:password@cluster.mongodb.net/scheduling_agent"

# Scheduling Integration (Cal.com v2)
CAL_API_KEY="cal_live_xxxxxxxxxxxxxxxx"
CAL_USERNAME="your-cal-username"
CAL_EVENT_TYPE_SLUG="15-min-meeting"

# Optional: Cryptographic Tool Verification
TOOL_APPROVAL_SECRET="your-cryptographic-signing-secret"
```

---

## 🚦 Getting Started

### Prerequisites
- Node.js >= 20.x
- [pnpm](https://pnpm.io/) >= 10.x

### Installation

```bash
# Clone the repository
git clone https://github.com/baseergroot/appointment-agent.git
cd appointment-agent

# Install dependencies using pnpm
pnpm install

# Start the local development server
pnpm dev
```

Visit [`http://localhost:3000`](http://localhost:3000) to interact with the scheduling agent.

### Production Build

```bash
# Compile and optimize production build
pnpm build

# Start the production server
pnpm start
```

---

## 🔌 API Reference

### `POST /api/chat`
Handles incoming message payloads, executes sliding window rate-limiting, runs Gemini agent reasoning loops with tool calling, and yields a stateless UI message stream.

- **Request Body**:
  ```json
  {
    "id": "chat_uuid",
    "messages": [
      { "role": "user", "parts": [{ "type": "text", "text": "Are there open slots tomorrow?" }] }
    ]
  }
  ```
- **Response**: Server-Sent Events (SSE) `text/event-stream` returning incremental text deltas, tool invocation parts, and execution results.
- **Headers**:
  - `X-RateLimit-Limit`: Maximum allowable tokens in the sliding window.
  - `X-RateLimit-Remaining`: Remaining allowable tokens.
  - `X-RateLimit-Reset`: Unix epoch timestamp (ms) when token bucket resets.

### `GET /api/chat/[chatId]`
Hydrates persisted chat histories from MongoDB.

- **Response**:
  ```json
  {
    "messages": [ /* UIMessage trajectory */ ]
  }
  ```

### `GET /api/ratelimit`
Returns real-time rate limit capacity and time-to-reset for the requesting IP.

- **Response**:
  ```json
  {
    "limit": 20,
    "remaining": 18,
    "reset": 1771744000000
  }
  ```

---

## 🛡️ Security & Reliability

- **HITL Tool Gateways**: Prevents automated unintended bookings by requiring explicit interactive user consent before dispatching booking mutations.
- **Zod Schema Validation**: Strict input validation on tool arguments ensures type safety and protects downstream API endpoints.
- **Fault-Tolerant Degraded Modes**: Built-in fallback handlers for rate-limiting services and automatic retry mechanisms for Google Gemini quota triggers (`RESOURCE_EXHAUSTED` / 429).
- **Environment Isolation**: Server-side tool execution keeps Cal.com API keys and database credentials secure from client exposure.

---

## 📄 License

MIT © [Baseer Afridi](https://github.com/baseergroot)
