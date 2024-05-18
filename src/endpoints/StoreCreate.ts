import {
	OpenAPIRoute,
	OpenAPIRouteSchema,
} from "@cloudflare/itty-router-openapi";
import {Store} from "./types/Store";

export class StoreCreate extends OpenAPIRoute {
	static schema: OpenAPIRouteSchema = {
		tags: ["Stores"],
		summary: "Create a new Store",
		requestBody: Store,
		responses: {
			"201": {
				description: "Returns the created Store",
				schema: {
					success: Boolean,
					store:  Store,
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
		console.debug("body:%o", data.body)
		const storeToCreate = data.body;

		// return the new store
		return {
			success: true,
			store: storeToCreate,
		};
	}
}
