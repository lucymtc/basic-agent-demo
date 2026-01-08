import type { AIMessage } from '../types';
import { addMessages, getMessages, saveToolResponse } from './memory';
import { runLLM } from './llm';
import { runTool } from './toolRunner';
import { showLoader, logMessage } from './ui';

export const runAgent = async ({ userMessage, tools }: { userMessage: string, tools: any[] }) => {
	await addMessages([{ role: 'user', content: userMessage }]);
	
	const loader = showLoader('🤔');

	// Loop
	while (true) {
		const history = await getMessages();
		
		const response = await runLLM({ messages: history, tools });
		await addMessages([response]); // this is the response of the agent. 

		if (response.content) {
			loader.stop();
			logMessage(response);
			return getMessages();
		}

		// if there is a tool call then we call it and save response to the db.
		if(response.tool_calls) {
			const toolCall = response.tool_calls[0];
			logMessage(response);
			loader.update(`🔧 Running tool: ${toolCall.function.name}`);
			
			const toolResponse = await runTool(toolCall, userMessage);
			await saveToolResponse(toolCall.id, toolResponse);
			loader.update(`✅ Tool response saved`);
		}
	}
}