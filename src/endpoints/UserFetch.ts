import { OpenAPIRoute, Path, Header } from '@cloudflare/itty-router-openapi'
import {z} from 'zod'
import { User } from "./types/User"

export class UserFetch extends OpenAPIRoute {
    static schema = {
        tags: ['Users'],
        summary: 'Get a single User by user Id',
        parameters: {
            userId: Path(z.string(), {
                description: 'User ID',
            }),
        },
        responses: {
            '200': {
                description: 'Returns a single User if found',
                schema: {
                    success: z.boolean(),
                    user: User
                },
            },
            '204': {
                description: 'NOT Found User response',
                schema: {
                    success: z.boolean(),
                    user: User
                },
            },
            "404": {
                description: "Store not found",
                schema: {
                    success: Boolean,
                    error: String,
                },
            },
        },
    }

    async handle(
        request: Request,
        env: any,
        context: any,
        data: any
    ) {
        console.debug("params:%o", data.params)
        const { UserId } = data.params

        return {
            success: true,
            user: {
                userId: env.user.sub,
                name: env.user.name,
                nickname: env.user.nickname,
                email: env.user.email,
                emailVerified: env.user.emailVerified,
            },
        };
    }
}
