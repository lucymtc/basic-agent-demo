import type OpenAI from 'openai';
import { generateImage, generateImageToolDefinition } from './tools/generateImage';
import { dadJoke, dadJokeToolDefinition } from './tools/dadJoke';
import { reddit, redditToolDefinition } from './tools/reddit';

// Track tool call counts to prevent infinite loops
const toolCallCounts = new Map<string, number>();
const MAX_TOOL_CALLS = 3;

export const runTool = async (
    toolCall: OpenAI.Chat.Completions.ChatCompletionMessageToolCall,
    userMessage: string,
) => {
    const toolName = toolCall.function.name;
    const currentCount = toolCallCounts.get(toolName) || 0;
    
    // Check if tool has exceeded max calls
    if (currentCount >= MAX_TOOL_CALLS) {
        return `Tool ${toolName} has been called ${currentCount} times. Maximum limit reached. Do not call this tool again.`;
    }
    
    // Increment call count
    toolCallCounts.set(toolName, currentCount + 1);
    
    const input = {
        userMessage,
        toolArgs: JSON.parse(toolCall.function.arguments || '{}'),
    };

    switch (toolCall.function.name) {
        case generateImageToolDefinition.name:
            return await generateImage(input);
            
        case dadJokeToolDefinition.name:
            return await dadJoke(input);
            
        case redditToolDefinition.name:
            return await reddit(input);
            
        default:
            return `Unknown tool: ${toolCall.function.name}. Never run this tool again.`;
    }
}