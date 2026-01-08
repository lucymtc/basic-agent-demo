import type { AIMessage } from '../types';
import { openai } from './ai';
import { zodFunction } from 'openai/helpers/zod';

export const runLLM = async({ messages, tools }: { messages: AIMessage[], tools: any[] }) => {
    // Formats the tools to be used by the LLM in Zod schema https://zod.dev 
    const formattedTools = tools.map(zodFunction);
    
    const response = await openai.chat.completions.create({
       model: 'gpt-4o-mini',
       temperature: 0.1, // how creative the model should be. Reduce randomness.
       messages,
       tools: formattedTools,
       tool_choice: 'auto', // telling LLM to choose the tool out of the ones are passed. 
       parallel_tool_calls: false, // do not run multiple tools at the same time, it's harder to handle.
    });

    // if it's a tool there won't be content, will be message.tool_calls instead.
    return response.choices[0].message;
};
