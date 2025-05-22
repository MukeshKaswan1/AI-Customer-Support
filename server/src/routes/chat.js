import express from 'express';
import { authenticate } from '../middleware/auth.js';
import Conversation from '../models/conversation.js';
import Message from '../models/message.js';
import { generateAIResponse } from '../services/aiService.js';

const router = express.Router();

// Apply authentication middleware to all chat routes
router.use(authenticate);

// @route   POST /chat/send
// @desc    Send a message and get AI response
// @access  Private
router.post('/send', async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user._id;
    
    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    let conversation;
    let conversationId = req.body.conversationId;

    // Create new conversation if needed
    if (!conversationId) {
      conversation = await Conversation.create({
        user: userId,
        title: message.substring(0, 30) + (message.length > 30 ? '...' : ''),
      });
      conversationId = conversation._id;
    } else {
      // Verify the conversation belongs to the user
      conversation = await Conversation.findOne({
        _id: conversationId,
        user: userId,
      });
      
      if (!conversation) {
        return res.status(404).json({ message: 'Conversation not found' });
      }
    }

    // Save user message
    const userMessage = await Message.create({
      conversation: conversationId,
      content: message,
      sender: 'user',
    });

    // Get response from AI
    const aiResponse = await generateAIResponse(message, conversation._id, userId);

    // Save AI response
    const aiMessage = await Message.create({
      conversation: conversationId,
      content: aiResponse,
      sender: 'ai',
    });

    // Update conversation timestamp
    await Conversation.findByIdAndUpdate(conversationId, { 
      updatedAt: new Date() 
    });

    return res.status(200).json({
      message: {
        _id: aiMessage._id,
        content: aiMessage.content,
        sender: aiMessage.sender,
        timestamp: aiMessage.createdAt,
      },
      conversationId,
    });
  } catch (error) {
    console.error('Error sending message:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /chat/history
// @desc    Get all messages for the user
// @access  Private
router.get('/history', async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Get all conversations for this user
    const conversations = await Conversation.find({ user: userId })
      .sort({ updatedAt: -1 });
      
    // Get all messages for all conversations
    const messages = [];
    
    for (const convo of conversations) {
      const convoMessages = await Message.find({ conversation: convo._id })
        .sort({ createdAt: 1 });
        
      messages.push(...convoMessages.map(msg => ({
        _id: msg._id,
        content: msg.content,
        sender: msg.sender,
        timestamp: msg.createdAt,
        conversationId: convo._id,
      })));
    }
    
    return res.status(200).json(messages);
  } catch (error) {
    console.error('Error getting chat history:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /chat/conversations
// @desc    Get all conversations for the user
// @access  Private
router.get('/conversations', async (req, res) => {
  try {
    const userId = req.user._id;
    
    const conversations = await Conversation.find({ user: userId })
      .sort({ updatedAt: -1 });
      
    return res.status(200).json(conversations.map(c => ({
      _id: c._id,
      title: c.title,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    })));
  } catch (error) {
    console.error('Error getting conversations:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /chat/conversations/:id
// @desc    Get all messages for a conversation
// @access  Private
router.get('/conversations/:id', async (req, res) => {
  try {
    const userId = req.user._id;
    const conversationId = req.params.id;
    
    // Verify the conversation belongs to the user
    const conversation = await Conversation.findOne({
      _id: conversationId,
      user: userId,
    });
    
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }
    
    // Get all messages
    const messages = await Message.find({ conversation: conversationId })
      .sort({ createdAt: 1 });
      
    return res.status(200).json(messages.map(msg => ({
      _id: msg._id,
      content: msg.content,
      sender: msg.sender,
      timestamp: msg.createdAt,
    })));
  } catch (error) {
    console.error('Error getting conversation messages:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;