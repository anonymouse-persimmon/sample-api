import { OpenAPIRoute, Query } from "@cloudflare/itty-router-openapi";
import { z } from 'zod'
import { User } from "./types/User";

export class UserSearch extends OpenAPIRoute {
    static schema = {
        tags: ["Users"],
        summary: "Search Users",
        parameters: {
            userId: Query(z.string(), {
                description: "User ID",
                required: false,
            }),
            name: Query(z.string(), {
                description: "User name",
                required: false,
            }),
            email: Query(z.string(), {
                description: "User email",
                required: false,
            }),
            pagingSize: Query(z.number(), {
                description: "paging size",
                required: false,
            }),
            page: Query(z.number(), {
                description: "page number",
                required: false,
            })
        },
        responses: {
            "200": {
                description: "Returns a list of users",
                schema: {
                    success: z.boolean({description: "if data was found set true"}),
                    total: z.number({description: "found users count"}),
                    pagingSize: z.number({description: "paging size of this response"}),
                    page: z.number({description: "page number of this response"}),
                    users: z.array(User),
                },
            },
            "204": {
                description: "Returns a empty list of users",
                schema: {
                    success: z.boolean({description: "if data was found set true"}),
                    total: z.number({description: "found users count"}),
                    pagingSize: z.number({description: "paging size of this response"}),
                    page: z.number({description: "page number of this response"}),
                    users: z.array(User),
                },
            },
        }
    };

    async handle(
        request: Request,
        env: any,
        context: any,
        data: Record<string, any>
    ) {
        // Retrieve the validated parameters
        console.debug("params:%o", data.params)
        const { userId, name, email, pagingSize, page } = data.query;

        // Implement your own object list here

        return {
            success: true,
            total: 2,
            pagingSize: 10,
            page:0,
            users: [
                {
                    userId: "uid1",
                    name: "name",
                    nickname: "nickname",
                    email: "email@aaa.com",
                    emailVerified: true,
                },
                {
                    userId: "uid2",
                    name: "name",
                    nickname: "nickname",
                    email: "email@aaa.com",
                    emailVerified: true,
                },
            ],
        };
    }
}
