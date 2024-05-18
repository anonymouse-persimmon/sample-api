import {
	OpenAPIRoute,
	OpenAPIRouteSchema,
	Query,
} from "@cloudflare/itty-router-openapi";
import {z} from 'zod'
import {Store} from "./types/Store";

export class StoreSearch extends OpenAPIRoute {
	static schema: OpenAPIRouteSchema = {
		tags: ["Stores"],
		summary: "Search Stores",
		parameters: {
			storeId: Query(z.string(), {
				description: "User ID",
				required: false,
			}),
			name: Query(z.string(), {
				description: "User name",
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
				description: "Returns a list of stores",
				schema: {
					success: z.boolean({description: "if data was found set true"}),
					total: z.number({description: "found users count"}),
					pagingSize: z.number({description: "paging size of this response"}),
					page: z.number({description: "page number of this response"}),
					stores: z.array(Store),
				},
			},
			"204": {
				description: "Returns a empty list of users",
				schema: {
					success: z.boolean({description: "if data was found set true"}),
					total: z.number({description: "found users count"}),
					pagingSize: z.number({description: "paging size of this response"}),
					page: z.number({description: "page number of this response"}),
					stores: z.array(Store),
				},
			},
		},
	};

	async handle(
		request: Request,
		env: any,
		context: any,
		data: Record<string, any>
	) {
		console.debug("query:%o", data.query)
		const { storeId, name, pagingSize, page } = data.query;

		return {
			success: true,
			total: 2,
			pagingSize: 10,
			page:0,
			stores: [
				{
					storeId: "sId1",
					name: "name",
					description: "description",
				},
				{
					storeId: "sId2",
					name: "name",
					description: "description",
				}
			],
		};
	}
}
