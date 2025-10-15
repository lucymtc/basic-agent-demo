import { JSONFilePreset } from 'lowdb/node';
import type { AIMessage } from '../types';
import {  v4 as uuidv4 } from 'uuid';

export type MessageWithMetadata = AIMessage & {
    id: string
    createdAt: string
};

export const addMetadata = (message: AIMessage): MessageWithMetadata => ({
    ...message,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
});

// Get things that we don't want to send back to AI. 
export const removeMetadata = (message: MessageWithMetadata): AIMessage => {
    const { id, createdAt, ...messageWithoutMetadata } = message
    return messageWithoutMetadata
};

type Data = {
    messages: MessageWithMetadata[]
}

// Our DB is just an object with a messages array.
const defaultData: Data = { messages: [] };

export const getDb = async () => {
  const db = await JSONFilePreset<Data>('db.json', defaultData);
  return db;
}

export const addMessages = async (messages: AIMessage[]) => {
  const db = await getDb()
  db.data.messages.push(...messages.map(addMetadata))
  await db.write()
}

export const getMessages = async () => {
  const db = await getDb();
  // we remove the metadata because we are about to feedd it to AI and it will break if we send something it doesn't support.
  return db.data.messages.map(removeMetadata);
}
