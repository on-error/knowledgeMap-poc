# Chemistry Knowledge Map

A beautiful, interactive knowledge map built with React, TypeScript, and D3.js that visualizes chemistry concepts and their relationships. The application features a force-directed graph with zoom/pan capabilities, hover effects, and dynamic node categorization.

## 🚀 Features

- **Interactive Force-Directed Graph**: Nodes automatically arrange themselves using D3.js force simulation
- **Zoom & Pan Functionality**: Mouse wheel zoom, drag to pan, and zoom control buttons
- **Hover Scaling**: Nodes scale up on hover for better text visibility
- **Dynamic Node Categorization**: Automatic color coding based on node labels
- **Link Highlighting**: Connected relationships are highlighted on node hover
- **Responsive Design**: Works on desktop and mobile devices
- **Dark Theme**: Modern dark background with high contrast elements
- **Real-time Data**: Fetches knowledge map data from API endpoints

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, D3.js, Vite
- **Styling**: CSS3 with modern animations and transitions
- **Data Visualization**: D3.js force simulation and SVG rendering
- **Build Tool**: Vite for fast development and building

## 📁 Project Structure

```
kmap-poc/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/
│   │   │   ├── KnowledgeMap.tsx    # Main D3.js knowledge map component
│   │   │   └── KnowledgeMap.css    # Styling for the knowledge map
│   │   ├── App.tsx                 # Main app component
│   │   ├── main.tsx               # App entry point
│   │   └── index.css              # Global styles
│   ├── package.json
│   ├── vite.config.ts
│   └── README.md
├── backend/                  # Backend API (if applicable)
│   └── ...
├── .env.example             # Environment variables template
└── README.md               # This file
```

## 🚀 Getting Started

### Prerequisites

- **Node.js**: Version 18 or higher
- **npm**: Version 8 or higher
- **Git**: For cloning the repository

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd kmap-poc
   ```

2. **Set up environment variables**
   ```bash
   # Copy the environment template
   cp .env.example .env
   
   # Edit the .env file with your configuration
   nano .env
   ```

3. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173` to view the application

## ⚙️ Environment Configuration

### Frontend Environment Variables

Create a `.env` file in the `frontend/` directory:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3003
VITE_API_TIMEOUT=10000

# Application Configuration
VITE_APP_TITLE=Chemistry Knowledge Map
VITE_APP_VERSION=1.0.0

# Development Configuration
VITE_DEV_MODE=true
VITE_ENABLE_LOGGING=true

# Feature Flags
VITE_ENABLE_ZOOM=true
VITE_ENABLE_HOVER_EFFECTS=true
VITE_ENABLE_ANIMATIONS=true
```

### Backend Environment Variables (if applicable)

Create a `.env` file in the `backend/` directory:

```env
# Server Configuration
PORT=3003
NODE_ENV=development

# Database Configuration (if using database)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=knowledge_map
DB_USER=your_username
DB_PASSWORD=your_password

# API Configuration
API_PREFIX=/api
CORS_ORIGIN=http://localhost:5173

# Security
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=24h

# Logging
LOG_LEVEL=info
LOG_FILE=logs/app.log
```

## 📦 Available Scripts

### Frontend Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking

# Testing (if configured)
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage
```

### Backend Scripts (if applicable)

```bash
# Development
npm run dev          # Start development server with nodemon
npm run start        # Start production server
npm run build        # Build TypeScript to JavaScript

# Testing
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
```

## 🔧 Configuration

### Vite Configuration

The project uses Vite for fast development. Key configurations in `frontend/vite.config.ts`:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3003',
        changeOrigin: true,
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})
```

### D3.js Configuration

The knowledge map uses D3.js force simulation with the following settings:

- **Link Distance**: 100px between connected nodes
- **Charge Strength**: -400 for node repulsion
- **Collision Radius**: 45px to prevent node overlap
- **Zoom Scale**: 0.1x to 4x zoom levels

## 🎨 Customization

### Adding New Node Categories

To add new node categories, update the `getNodeGroup` function in `KnowledgeMap.tsx`:

```typescript
const getNodeGroup = (label: string): string => {
  const lowerLabel = label.toLowerCase();
  
  // Add your new category logic here
  if (lowerLabel.includes('your-keyword')) {
    return 'your-category';
  }
  
  // ... existing logic
};
```

### Modifying Colors

Update the color scale in `KnowledgeMap.tsx`:

```typescript
const colorScale = d3.scaleOrdinal<string>()
  .domain(["central", "components", "reaction-types", "decomposition", "equations", "energy", "related", "your-category"])
  .range(["#4A90E2", "#7ED321", "#F5A623", "#D0021B", "#9013FE", "#50E3C2", "#BD10E0", "#YOUR_COLOR"]);
```

### Adjusting Force Simulation

Modify the force simulation parameters:

```typescript
const simulation = d3.forceSimulation<D3Node>(d3Nodes)
  .force("link", d3.forceLink<D3Node, D3Link>(d3Links).id((d) => d.id).distance(120)) // Adjust distance
  .force("charge", d3.forceManyBody().strength(-500)) // Adjust repulsion
  .force("center", d3.forceCenter(width / 2, height / 2))
  .force("collision", d3.forceCollide().radius(50)); // Adjust collision radius
```

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Kill process using port 5173
   lsof -ti:5173 | xargs kill -9
   ```

2. **Dependencies not found**
   ```bash
   # Clear npm cache and reinstall
   npm cache clean --force
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **TypeScript errors**
   ```bash
   # Check TypeScript configuration
   npx tsc --noEmit
   ```

4. **API connection issues**
   - Verify backend server is running
   - Check API URL in environment variables
   - Ensure CORS is properly configured

### Development Tips

- Use browser developer tools to inspect the D3.js SVG elements
- Check the console for any JavaScript errors
- Use React Developer Tools for component debugging
- Monitor network requests for API calls

## 📝 API Documentation

### Knowledge Map Endpoint

```
GET /api/get-map/{mapId}
```

**Response Format:**
```json
{
  "nodes": [
    {
      "id": "node-id",
      "name": "Node Label"
    }
  ],
  "edges": [
    {
      "id": "edge-id",
      "sourceNodeId": "source-node-id",
      "targetNodeId": "target-node-id"
    }
  ]
}


#Add this .env in the backend folder
```
DATABASE_URL=ADD_YOUR_DATABASE_URL_HERE
GEMINI_API_KEY=ADD_YOUR_GEMINI_API_KEY_HERE
```
