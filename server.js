// প্রয়োজনীয় মডিউল ইম্পোর্ট করা হচ্ছে
const express = require('express');
const cors = require('cors');
require('dotenv').config();

// অ্যাপ ইনিশিয়ালাইজ করা হচ্ছে
const app = express();

// মিডলওয়্যার সেটআপ
app.use(cors());
app.use(express.json());

// চ্যাট করার জন্য একটি রুট তৈরি করা হচ্ছে
app.post('/api/chat', async (req, res) => {
    try {
        const userMessage = req.body.message;
        if (!userMessage) {
            return res.status(400).json({ error: 'Message is required' });
        }

        // Groq API-কে কল করার জন্য fetch ব্যবহার করা হচ্ছে
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.GROQ_API_KEY}`, // Groq API Key ব্যবহার
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                messages: [
                    {
                        role: 'user',
                        content: userMessage
                    }
                ],
                model: 'llama3-8b-8192' // আপনি 'mixtral-8x7b-32768' ও ব্যবহার করতে পারেন
            })
        });

        if (!response.ok) {
            // যদি API থেকে কোনো এরর আসে, সেটি দেখার জন্য
            const errorData = await response.json();
            console.error('Groq API Error:', errorData);
            throw new Error('Failed to get response from Groq API');
        }

        const data = await response.json();
        const botReply = data.choices[0]?.message?.content || 'Sorry, I could not get a response.';
        
        // উত্তরটি JSON হিসেবে ফেরত পাঠানো
        res.json({ reply: botReply });

    } catch (error) {
        console.error('Server Error:', error);
        res.status(500).json({ error: 'Failed to get response from AI' });
    }
});

// সার্ভার চালু করা হচ্ছে
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});