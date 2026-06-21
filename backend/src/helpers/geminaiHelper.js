import {GoogleGenAI} from "@google/genai"
import { config } from "../config/config.js"


const ai = new GoogleGenAI({apiKey: config.geminai.geminiApiKey})

export async function createEmbedding(text){
    try {
        const embedding = await ai.models.embedContent({
            model:"gemini-embedding-2",
            contents: text,
        })
        return embedding.embeddings[0].values;
        
    } catch (error) {
        console.log(`Embedding generation failed: ${error}`)
        return null;
    }
}


export function cosineSimilarity(a,b){
    if(!a || !b ||a.length !== b.length){
        return 0;
    }
    const dot = a.reduce((sum,val,i)=> sum+val*b[i], 0);
    const magA = Math.sqrt(a.reduce((sum,val) => sum+ val**2,0));
    const magB = Math.sqrt(b.reduce((sum,val) => sum+val**2,0))
    if(magA === 0|| magB === 0){
        return 0;
    }
    return dot/(magA*magB);
}


//recomendation system with Ai
export async function getRecommendationsWithGemini(userQuery, topProducts){
    try {
        const context = topProducts.map((p) => `Product ID: ${p._id}, Name: ${p.name}, Category: ${p.category}, Description: ${p.description}`).join("\n");
        const prompt = `you are AI shopping assistant. Based on user query:${userQuery}, and context: ${context}.Just Return JSON as a list of products Ids which best match the query. No extra text or explanations. Use the exact product IDs from context.`

        const response = await ai.models.generateContent({
            model:"gemini-2.5-flash",
            contents: prompt,
        })
        let text = response.text;
        text = text.replace(/```json/g, "").replace(/```/g, "").trim();
        const recomendation = JSON.parse(text);
        return recomendation.map(rec => {
            const originalProduct = topProducts.find(p => p.name === rec.name);
            return {
                ...rec,
                _id: originalProduct? originalProduct._id : null,
            }
        })
    } catch (error) {
         console.error("Recommendation generation failed:", error);
    return [];
    }
} 
