import {z} from 'zod'

export const Store = z.object({
	storeId: z.string(),
	name: z.string(),
	description: z.string(),
});

