import * as pdfjsLib from 'pdfjs-dist';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();
// Initialize Generative AI
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

export async function extractTextFromPDF(pdfBuffer: ArrayBuffer): Promise<string> {
  try {
    const pdf = await pdfjsLib.getDocument({ data: pdfBuffer }).promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      fullText += pageText + ' ';
    }

    return fullText.trim();
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error('Failed to extract text from PDF');
  }
}

export async function getAnswerFromAI(
  context: string,
  question: string
): Promise<string> {
  try {
    const prompt = `Context from PDF: ${context}\n\nQuestion: ${question}\n\nPlease provide a concise and relevant answer based on the context. If the answer cannot be found in the context, respond with: "Sorry, I didn't understand your question. Do you want to connect with a live agent?"`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return text || "Sorry, I didn't understand your question. Do you want to connect with a live agent?";
  } catch (error) {
    console.error('Error getting answer from AI:', error);
    return "Sorry, I didn't understand your question. Do you want to connect with a live agent?";
  }
}