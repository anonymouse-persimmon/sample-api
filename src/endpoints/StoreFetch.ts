import {
	OpenAPIRoute,
	OpenAPIRouteSchema,
	Path,
} from "@cloudflare/itty-router-openapi";
import {Store} from "./types/Store";

export class StoreFetch extends OpenAPIRoute {
	static schema: OpenAPIRouteSchema = {
		tags: ["Stores"],
		summary: "Get a single Store by store Id",
		parameters: {
			storeId: Path(String, {
				description: "Store Id",
			}),
		},
		responses: {
			"200": {
				description: "Returns a single Store if found",
				schema: {
					success: Boolean,
					store:  Store,
				},
			},
			"204": {
				description: "NOT Found User response",
				schema: {
					success: Boolean,
					store:  Store,
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
	};

	async handle(
		request: Request,
		env: any,
		context: any,
		data: Record<string, any>
	) {
		console.debug("params:%o", data.params)
		const { storeId } = data.params;

		const exists = true;

		// @ts-ignore: check if the object exists
		if (exists === false) {
			return Response.json(
				{
					success: false,
					error: "Object not found",
				},
				{
					status: 404,
				}
			);
		}

		return {
			success: true,
		};
	}
}
