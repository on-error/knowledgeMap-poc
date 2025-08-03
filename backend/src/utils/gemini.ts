import { GoogleGenerativeAI } from '@google/generative-ai';

const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const getPrompt = (text: string) => `
        Analyze the following text and identify the main topics, key concepts, and their relationships.
        Structure your response as a valid JSON object with two keys: "nodes" and "edges".
        Do not indclude markdown formatting. No "\`\`\`json" or "\`\`\`" or any other markdown formatting.

        - "nodes": An array of objects, where each object represents a topic or concept. Each node should have:
            - "id": A unique, lowercase, hyphenated string (e.g., "machine-learning").
            - "label": A human-readable title (e.g., "Machine Learning").
        - "edges": An array of objects, where each object represents a relationship between two nodes. Each edge should have:
            - "source": The "id" of the source node.
            - "target": The "id" of the target node.
            - "label": A description of the relationship (e.g., "is a type of", "is used for", "is a sub-field of").

        Here is the text:
        ---
        ${text}
        ---
    `;

const generateText = async (text: string) => {
  try {
    const model = gemini.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent(getPrompt(text));

    return result.response.text();
  } catch (error) {
    console.log('error', error);
    return '';
  }
};

export { generateText };
