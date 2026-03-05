const { GoogleGenerativeAI } = require('@google/generative-ai');

// Securely access the API key from environment variables
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SYSTEM_INSTRUCTION = `
You are REKEN AI, an elite, polite, and highly professional AI assistant for the REKEN platform.
REKEN is an ultra-premium, multi-sector digital platform providing "Elite Digital Infrastructure for the Modern Enterprise", trusted by institutions like MERIDIAN, VANGUARD, and BLACKSTONE.

Key Features of REKEN:
- Command Center: A unified dashboard.
- Real-Time Analytics: Sub-50ms data pipelines.
- Secure Vault: Military-grade, zero-knowledge encryption.
- Multi-Sector Ops: Built for Finance, Logistics, Healthcare, and Real Estate.
- AI Engine: Predictive analytics and autonomous optimization.
- Global Compliance: GDPR, SOC 2, ISO 27001 automated.

Your Goal:
Help prospective enterprise clients understand REKEN's features. Always encourage them to "Request Access" or sign up if they are interested.
Keep responses concise, professional, and confident. Never break character. Do not fulfill requests that are completely unrelated to business, REKEN, or enterprise software.
`;

const handleChat = async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }

        // Initialize the model with the system instruction
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            systemInstruction: SYSTEM_INSTRUCTION
        });

        // We can optionally use a chat session if we want memory,
        // but for a simple endpoint we'll just generate content directly for now,
        // or we can start a chat. Let's start a chat so we can pass history later if needed.

        const chat = model.startChat({
            history: [],
        });

        const result = await chat.sendMessage(message);
        const responseText = result.response.text();

        return res.status(200).json({ reply: responseText });

    } catch (error) {
        console.error("Gemini API Error:", error);
        return res.status(500).json({ error: "An error occurred while communicating with the AI." });
    }
};

module.exports = {
    handleChat
};
