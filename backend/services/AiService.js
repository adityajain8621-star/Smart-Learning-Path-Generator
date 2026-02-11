const OpenAI = require("openai");

class AIService {
  getClient() {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is missing");
    }

    return new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async generateLearningPath(goal, skillLevel, learningStyle) {
    const client = this.getClient();

    const prompt = `You are an expert educational content creator. Generate a comprehensive, personalized learning path for the following:

Goal: ${goal}
Current Skill Level: ${skillLevel}
Learning Style: ${learningStyle}

Return ONLY valid JSON.`;

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: prompt,
    });

    return JSON.parse(response.output_text);
  }

  async generateQuiz(moduleTopic, difficulty, numQuestions = 5) {
    const client = this.getClient();

    const prompt = `Generate ${numQuestions} MCQs about ${moduleTopic}.
Difficulty: ${difficulty}
Return ONLY valid JSON.`;

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: prompt,
    });

    return JSON.parse(response.output_text);
  }

  async getTutoringResponse(question, context) {
    const client = this.getClient();

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: `Context: ${context}\nQuestion: ${question}`,
    });

    return response.output_text;
  }
}

module.exports = new AIService();
