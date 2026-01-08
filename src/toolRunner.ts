import type OpenAI from 'openai';

const getWeather = (input: { userMessage: string, toolArgs: any }) => `it's cold 15 degrees Celsius`;

export const runTool = async (
    toolCall: OpenAI.Chat.Completions.ChatCompletionMessageToolCall,
    userMessage: string,
) => {
    const input = {
        userMessage,
        toolArgs: JSON.parse(toolCall.function.arguments || '{}'),
    };

    switch (toolCall.function.name) {
        case 'get_weather':
            return getWeather(input);
        default:
            // Trow error if it's calling something we didn't define. We can also call a function here to send a reposnse to the llm to not call this function again.
            throw new Error(`Unknown tool: ${toolCall.function.name}`);
    }
}