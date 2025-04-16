# Telegram Group Analytics Bot with DeepSeek Integration 🤖🔍

![Bot Demo](docs/demo.gif)

Enterprise-grade chat analytics solution for Telegram groups, featuring advanced NLP processing powered by DeepSeek API. Built with Node.js and MongoDB.

## Table of Contents
- [Key Features](#key-features-)
- [Architecture Overview](#architecture-overview-)
- [Tech Stack](#tech-stack-)
- [Installation](#installation-)
- [Configuration](#configuration-)
- [DeepSeek Processing Pipeline](#deepseek-processing-pipeline-)
- [Data Models](#data-models-)
- [API Endpoints](#api-endpoints-)
- [Deployment](#deployment-)
- [Contributing](#contributing-)
- [Ethical Considerations](#ethical-considerations-)

## Key Features ✨
- **Real-time Message Processing** with WebSocket integration
- **Multi-stage NLP Analysis** using DeepSeek's AI models
- **Automated Data Sanitization** pipeline
- **Time-series Chat Analytics** with MongoDB Aggregation
- **Customizable Quality Metrics** system
- **Interactive PDF Report Generation**
- **Multi-language Content Support**

## Architecture Overview 🏗️
```mermaid
graph LR
    A[Telegram MTProto] --> B[Node.js Bot]
    B --> C[Message Queue]
    C --> D[Data Sanitizer]
    D --> E[DeepSeek API]
    E --> F[MongoDB Atlas]
    F --> G[Analytics Engine]
    G --> H[Report Generator]
    H --> I[Telegram UI]
```

## Tech Stack 💻
| Component              | Technology                          |
|------------------------|-------------------------------------|
| **Core Platform**      | Node.js 18 LTS + TypeScript         |
| **Database**           | MongoDB 7.0 (Time Series Collections)|
| **NLP Processing**     | DeepSeek API (chat-32k model)       |
| **Queue System**       | BullMQ + Redis                      |
| **API Framework**      | NestJS 10                           |
| **Data Visualization** | Chart.js + PDFKit                   |
| **Deployment**         | Docker Swarm + Traefik              |

## Installation 📥
```bash
# Clone repository
git clone https://github.com/yourrepo/telegram-deepseek-analytics.git
cd telegram-deepseek-analytics

# Install dependencies
npm install

# Setup environment
cp .env.example .env
```

## Configuration ⚙️
Edit `.env` file:
```ini
# Telegram Configuration
BOT_TOKEN=your_telegram_bot_token
API_ID=your_telegram_api_id
API_HASH=your_telegram_api_hash

# DeepSeek Integration
DEEPSEEK_API_KEY=your_api_key
DEEPSEEK_MODEL=deepseek-chat-32k
MAX_TOKENS=4096

# MongoDB Settings
MONGO_URI=mongodb://user:pass@localhost:27017/chat_analytics
REDIS_URI=redis://localhost:6379

# Analysis Parameters
MIN_MESSAGE_LENGTH=20
MAX_DAILY_REQUESTS=5000
```

## DeepSeek Processing Pipeline 🔄
### 1. Data Sanitization
```javascript
class MessageSanitizer {
  async prepareText(message) {
    return message
      .replace(/http[s]?:\/\/\S+/g, '') // Remove URLs
      .replace(/@\w+/g, '') // Remove mentions
      .replace(/[^\w\s.,!?]/g, '') // Clean special chars
      .trim()
      .substring(0, 2000); // Truncate to 2000 chars
  }
}
```

### 2. DeepSeek Analysis Request
```typescript
interface AnalysisPayload {
  model: string;
  messages: Array<{
    role: 'system' | 'user';
    content: string;
  }>;
  temperature: number;
  max_tokens: number;
}

const analysisPrompt = `Analyze message quality (1-100) and extract entities:
- Score based on relevance and depth
- Identify main topics (max 3)
- Detect language
- Flag inappropriate content

Format response as JSON: 
{
  "score": number,
  "topics": string[],
  "language": string,
  "violations": string[]
}`;

const sendToDeepSeek = async (text: string) => {
  const payload: AnalysisPayload = {
    model: process.env.DEEPSEEK_MODEL,
    messages: [
      { role: 'system', content: analysisPrompt },
      { role: 'user', content: text }
    ],
    temperature: 0.7,
    max_tokens: parseInt(process.env.MAX_TOKENS)
  };

  const response = await axios.post(
    'https://api.deepseek.com/v1/chat/completions',
    payload,
    { headers: { Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}` } }
  );

  return JSON.parse(response.data.choices[0].message.content);
};
```

### 3. Result Processing
```javascript
{
  "score": 88,
  "topics": ["Artificial Intelligence", "Machine Learning"],
  "language": "en",
  "violations": [],
  "sentiment": 0.72,
  "complexity": "high"
}
```

## Data Models 📊
### Message Document
```javascript
{
  _id: ObjectId,
  chatId: Number,
  userId: Number,
  rawText: String,
  sanitizedText: String,
  analysis: {
    score: Number,
    topics: [String],
    language: String,
    sentiment: Number,
    complexity: String
  },
  metadata: {
    replyCount: Number,
    views: Number,
    timestamp: Date
  }
}
```

### User Statistics
```javascript
{
  userId: Number,
  period: String, // daily/weekly/monthly
  averageScore: Number,
  totalMessages: Number,
  topTopics: [String],
  engagementRatio: Number
}
```

## API Endpoints 🌐
| Endpoint                | Method | Description                          |
|-------------------------|--------|--------------------------------------|
| `/api/messages`         | GET    | Get paginated analyzed messages      |
| `/api/users/top`        | GET    | List top contributors by period      |
| `/api/topics/trending`  | GET    | Get trending topics analysis         |
| `/api/reports/generate` | POST   | Trigger custom report generation     |

## Deployment 🚀
```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  bot:
    image: node:18-alpine
    build: .
    environment:
      - NODE_ENV=production
    deploy:
      replicas: 3
    depends_on:
      - mongo
      - redis

  mongo:
    image: mongo:7.0
    volumes:
      - mongodb_data:/data/db

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data

volumes:
  mongodb_data:
  redis_data:
```

## Contributing 🤝
1. Fork the repository
2. Create feature branch (`git checkout -b feature/improvement`)
3. Commit changes (`git commit -am 'Add new feature'`)
4. Push to branch (`git push origin feature/improvement`)
5. Open Pull Request

## Ethical Considerations 🛡️
- All message processing follows Telegram's Privacy Policy
- Users can request data deletion via `/delete_my_data` command
- No personal information is stored beyond 30 days
- Analysis results are anonymized for aggregate reporting

---

> **Important**: This bot requires explicit group admin approval before activation. Message processing is disabled by default until enabled by authorized users.

## How about this readme ?

Well , may be you already know , all the information up here are generated by deepseek itself . 

So ... It seems like will not be a hard task for it to analize group chat record lol .
