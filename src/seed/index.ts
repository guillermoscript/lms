
import type { Payload } from 'payload'
import { MediaSeed } from './media'

export const seed = async (payload: Payload): Promise<void> => {

    await MediaSeed(payload)
}