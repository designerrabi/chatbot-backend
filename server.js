// প্রয়োজনীয় মডিউল ইম্পোর্ট করা হচ্ছে
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

// অ্যাপ এবং জেমিনি এআই ইনিশিয়ালাইজ করা হচ্ছে
const app = express();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// মিডলওয়্যার সেটআপ
app.use(cors()); // যেকোনো ডোমেইন থেকে রিকোয়েস্ট গ্রহণ করার জন্য
app.use(express.json()); // JSON বডি পার্স করার জন্য

// চ্যাট করার জন্য একটি রুট তৈরি করা হচ্ছে
app.post('/api/chat', async (req, res) => {
    try {
        // ইউজারের পাঠানো মেসেজ গ্রহণ
        const userMessage = req.body.message;
        if (!userMessage) {
            return res.status(400).json({ error: 'Message is required' });
        }

        // জেমিনি মডেল ইনিশিয়ালাইজ করা
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        
        // সরাসরি ইউজারের প্রশ্ন জেমিনিকে পাঠানো হচ্ছে, কোনো অতিরিক্ত প্রসঙ্গ ছাড়াই
        const result = await model.generateContent(userMessage);
        const response = await result.response;
        const botReply = response.text();
        
        // উত্তরটি JSON হিসেবে ফেরত পাঠানো
        res.json({ reply: botReply });

    } catch (error) {
        console.error('Error in Gemini API call:', error);
        res.status(500).json({ error: 'Failed to get response from AI' });
    }
});

// সার্ভার চালু করা হচ্ছে
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});