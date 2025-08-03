import fs from 'fs';
import pdfParse from 'pdf-parse';
import { generateText } from './gemini';
import { prisma } from '../lib/prisma';
import Fuse from 'fuse.js';

const parsePdf = async (filePath: string) => {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdfParse(dataBuffer);

  return data.text;
};

const getTopicsFromPdf = async (text: string) => {
  const topics = await generateText(text);

  if(topics === '') {
    console.log('No topics found')
    return {
      nodes: [],
      edges: [],
    }
  }

  return JSON.parse(topics);
};

const processTopics = async (topics: any, previousNodes: any, previousEdges: any, newNodes: any, newEdges: any, documentId: string, userId: string) => {
  const fuse = new Fuse(previousNodes, {
    keys: ['name'],
    threshold: 0.4,
  });

  const previousIdToNodesMap: Record<string, { id: string, name: string }> = {};

  for (const node of newNodes) {
    const searchResults = fuse.search(node.label);

    if (searchResults.length > 0) {
      // Match found
      const match = searchResults[0].item as { id: string, name: string };
      previousIdToNodesMap[node.id] = { id: match.id, name: match.name };
    } else {
      const newNode = await prisma.node.create({
        data: {
          name: node.label,
          userId: userId,
        }
      })
      previousIdToNodesMap[node.id] = { id: newNode.id, name: newNode.name };
    }
  } 

  const previousEdgesIdMap: Record<string, boolean> = {};
  const edgesIdArr = previousEdges.forEach((edge: any) => {
    previousEdgesIdMap[`${edge.sourceNodeId}_${edge.targetNodeId}`] = true;
  })

  for (const edge of newEdges) {
    const sourceNode = previousIdToNodesMap[edge.source];
    const targetNode = previousIdToNodesMap[edge.target];
    if(!sourceNode || !targetNode) { 
      console.log('Source node or target node not found', sourceNode, targetNode)
      continue;
    }
    console.log('Source node and target node log', sourceNode, targetNode)
    if (previousEdgesIdMap[`${sourceNode.id}_${targetNode.id}`]) {
      continue;
    }

    const newEdge = await prisma.edge.create({
      data: {
        sourceNodeId: sourceNode.id,
        targetNodeId: targetNode.id,
        userId: userId,
      }
    })
  }

  return { nodes: previousNodes, edges: previousEdges };
};

const processFile = async (filepath: string, userId: string, documentId: string) => {
  try {
    console.log('Processing file', filepath);
    const text = await parsePdf(filepath);
    console.log('failing here')
    const topics = await getTopicsFromPdf(text);
    console.log('failing here 2')
    
    const edges = await prisma.edge.findMany({
      where: {
        userId,
      }
    });
  
    const nodes = await prisma.node.findMany({
      where: {
        userId,
      }
    });
  
    console.log('Processing topics and fetched nodes and edges from DB');
  
    await processTopics(topics, nodes, edges, topics.nodes, topics.edges, documentId, userId);
  
    console.log('processing completed and probably everything saved in DB')
  } catch (error) {
    console.error('Error processing file', error);
  }
}

export { parsePdf, getTopicsFromPdf, processTopics, processFile };
