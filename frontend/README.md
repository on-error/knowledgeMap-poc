# Chemistry Knowledge Map

A beautiful, interactive knowledge map built with React and D3.js that visualizes chemistry concepts and their relationships.

## Features

- **Interactive Force-Directed Graph**: Nodes automatically arrange themselves using D3.js force simulation
- **Color-Coded Categories**: Different node types are represented by distinct colors
- **Interactive Elements**: 
  - Hover effects on nodes and links
  - Drag and drop functionality
  - Link highlighting on node hover
- **Responsive Design**: Works on desktop and mobile devices
- **Beautiful UI**: Modern gradient backgrounds and smooth animations
- **Legend**: Clear visual guide showing node categories

## Node Categories

The knowledge map includes the following chemistry concept categories:

- **Central Concepts** (Blue): Core chemistry topics like Chemical Reactions, Types of Chemical Reactions, Chemical Equations
- **Reaction Components** (Green): Reactants and Products
- **Types of Reactions** (Orange): Redox, Displacement, Combination, Precipitation, Decomposition reactions
- **Decomposition Types** (Red): Thermal, Electrolytic, and Photolytic decomposition
- **Equation Components** (Purple): Word equations, Physical states, Skeletal equations, etc.
- **Energy & Indicators** (Teal): Endothermic, Exothermic reactions and reaction indicators
- **Related Concepts** (Magenta): Ions, Respiration, and other related topics

## Technologies Used

- **React 19**: Modern React with hooks
- **TypeScript**: Type-safe development
- **D3.js**: Data visualization and force simulation
- **Vite**: Fast build tool and development server
- **CSS3**: Modern styling with gradients and animations

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to the local development URL (usually `http://localhost:5173`)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/
│   ├── KnowledgeMap.tsx    # Main D3.js knowledge map component
│   └── KnowledgeMap.css    # Styling for the knowledge map
├── App.tsx                 # Main app component
├── main.tsx               # App entry point
└── index.css              # Global styles
```

## Customization

To add new nodes or modify the knowledge map:

1. Edit the `nodes` array in `KnowledgeMap.tsx` to add new concepts
2. Edit the `links` array to define relationships between nodes
3. Update the `colorScale` domain and range to add new categories
4. Modify the `legendData` array to update the legend

## Dependencies

- `d3`: Data visualization library
- `@types/d3`: TypeScript definitions for D3.js
- `react`: React library
- `react-dom`: React DOM rendering
- `typescript`: TypeScript compiler
- `vite`: Build tool and dev server

## Browser Support

This application works in all modern browsers that support:
- ES6+ JavaScript features
- CSS Grid and Flexbox
- CSS Custom Properties
- SVG animations

## License

This project is open source and available under the MIT License.
