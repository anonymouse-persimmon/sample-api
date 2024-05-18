import {z} from 'zod'

export const User = z.object({
    userId: z.string(),
    name: z.string(),
    nickname: z.string(),
    email: z.string(),
    emailVerified: z.boolean()
});
