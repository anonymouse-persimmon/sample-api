import {
	OpenAPIRoute,
	OpenAPIRouteSchema,
	Path,
} from "@cloudflare/itty-router-openapi";
import {Store} from "./types/Store";

export class StoreDelete extends OpenAPIRoute {
	static schema: OpenAPIRouteSchema = {
		tags: ["Stores"],
		summary: "Delete a Store by store Id",
		parameters: {
			storeId: Path(String, {
				description: "Store Id",
			}),
		},
		responses: {
			"204": {
				description: "Returns if the Store was deleted successfully",
				schema: {
					success: Boolean,
					result: {
						task: Store,
					},
				},
			},
			"404": {
				description: "Returns if the Store was already deleted",
				schema: {
					success: Boolean,
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

		// Implement your own object deletion here

		// Return the deleted task for confirmation
		return {
			success: true,
		};
	}
}
