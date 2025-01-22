# PDF-Based Question Answering Chatbot

This project is a chatbot application that answers user questions based on the content of a provided PDF document. If the answer cannot be retrieved from the document, the chatbot provides a fallback response.

## Features

- **PDF Understanding**:  
  The chatbot extracts and processes text from the uploaded PDF document and retrieves answers to user queries using the Gemini API.
  
- **Fallback Response**:  
  When the answer is not found in the PDF, the chatbot responds with:  
  *"Sorry, I didn’t understand your question. Do you want to connect with a live agent?"*
  
- **User Interaction**:  
  An intuitive web-based interface allows users to upload a PDF, ask questions, and receive responses in real time.

## Technologies Used

- **Frontend:** React, TypeScript, Vite
- **Backend:** Gemini API (NLP model for question-answering)
- **PDF Processing:** pdf.js
- **Deployment:** [PDF Chatbot URL](iridescent-gaufre-48ae56.netlify.app)

## Getting Started

### Prerequisites

Ensure you have the following installed:

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:  
   ```bash
   git clone https://github.com/your-username/pdf-chatbot.git

2. Replace the VITE_GEMINI_API_KEY=your-gemini-api-key in the .env file
