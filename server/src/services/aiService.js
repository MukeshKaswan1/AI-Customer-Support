import fetch from 'node-fetch';

export const generateAIResponse = async (message, conversationId, userId) => {
  try {
    // Define the API URL for OpenRouter
    const apiUrl = 'https://openrouter.ai/api/v1/chat/completions';
    
    // Create the request payload
    const payload = {
      model: 'openai/gpt-3.5-turbo', // You can change this to other models
      messages: [
        {
          role: 'system',
          content: 'You are a helpful customer support AI assistant. Provide concise, accurate, and friendly responses to user queries. Keep responses under 150 words unless more detail is necessary.'
        },
        {
          role: 'user',
          content: message
        }
      ]
    };
    
    // Make the API request
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'https://support-chat-app.com',
        'X-Title': 'AI Support Chat'
      },
      body: JSON.stringify(payload)
    });
    
    // Check if the request was successful
    if (!response.ok) {
      console.error('AI service error:', await response.text());
      return 'Sorry, I encountered an error processing your request. Please try again later.';
    }
    
    // Parse the response
    const data = await response.json();
    
    // Extract and return the AI's response
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error generating AI response:', error);
    return 'Sorry, I encountered an error processing your request. Please try again later.';
  }
};