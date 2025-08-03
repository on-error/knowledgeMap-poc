import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
// import './App.css'
import KnowledgeMap from './components/KnowledgeMap'
import { type Node, type Edge } from 'reactflow'

function App() {
  const [nodes, setNodes] = useState<Node[]>([])
  const [edges, setEdges] = useState<Edge[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchMap = async () => {
    const response = await fetch(`http://localhost:3003/api/get-map/220933db-278d-4596-8fd6-b0d8969c3971`)
    const data = await response.json()
    const fetchedNodes = data.nodes.map((node: { id: string, name: string }) => {
      return {
        id: node.id,
        data: {
          label: node.name,
        }
      }
    })
    const fetchedEdges = data.edges.map((edge: { id: string, sourceNodeId: string, targetNodeId: string }) => {
      return {
        id: `${edge.sourceNodeId}-${edge.targetNodeId}`,
        source: edge.sourceNodeId,
        target: edge.targetNodeId,
      }
    })
    setNodes(fetchedNodes)
    setEdges(fetchedEdges)
    setIsLoading(false)
  }

  useEffect(() => {
    fetchMap()
  }, [])

  return (
    <div>
      {isLoading ? <div>Loading...</div> : <KnowledgeMap nodes={nodes} edges={edges} />}
    </div>
  )
}

export default App
