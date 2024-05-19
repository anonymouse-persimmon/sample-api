import { OpenAPIRouter } from "@cloudflare/itty-router-openapi";
import { createCors } from 'itty-router'

import {NOT_FOUND} from "./endpoints/CustomHttpStatus";
import { Authenticate } from "./endpoints/Authenticate";

import { StoreCreate } from "./endpoints/StoreCreate";
import { StoreDelete } from "./endpoints/StoreDelete";
import { StoreFetch } from "./endpoints/StoreFetch";
import { StoreSearch } from "./endpoints/StoreSearch";

import { UserFetch } from "./endpoints/UserFetch";
import { UserSearch } from "./endpoints/UserSearch";

export const router = OpenAPIRouter({
	docs_url: "/",
	schema: {
		security: [
			{
				BearerAuth: [],
			},
		],
	},
});
const { preflight, corsify } = createCors()

router.registry.registerComponent(
	'securitySchemes',
	'BearerAuth',
	{
		type: 'http',
		scheme: 'bearer',
	},
)

router.all('*', preflight)
router.all('*', Authenticate)

router.get("/store/", StoreSearch);
router.get("/store/:storeId/", StoreFetch);
router.post("/store/", StoreCreate);
router.delete("/store/:storeId/", StoreDelete);

router.get('/user/', UserSearch)
router.get('/user/:userId/', UserFetch)

// 404 for everything else
router.all("*", () =>
	Response.json(
		{
			success: false,
			error: NOT_FOUND.message,
		},
		{ status: NOT_FOUND.code }
	)
);

export default {
	fetch: async (request, env, ctx) => {
		return router.handle(request, env, ctx).then(corsify)
	},
};