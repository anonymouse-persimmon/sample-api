import * as jose from "jose";
import {JWTVerifyOptions} from "jose/dist/types/jwt/verify";
import {z} from 'zod'
import {CustomHttpStatus, FORBIDDEN, UNAUTHORIZED} from "./CustomHttpStatus";

const userSchema = z.object({
    sub: z.string(),
    name: z.string(),
    nickname: z.string(),
    picture: z.string(),
    email: z.string(),
    email_verified: z.boolean(),
    updated_at: z.string(),
});

const getBearer = (request: Request): null | string => {
    //request.headers.forEach((value, key, header) => console.debug("headers: "+key+"="+value))
    const authHeader = request.headers.get('authorization')
    if (!authHeader || authHeader.substring(0, 6) !== 'Bearer') {
        return null
    }
    return authHeader.substring(6).trim()
}

const verify = async (token: string, env: any) => {
    const jwksUrl = await env.SETTINGS.get("JWKS_URL")
    const iss = await env.SETTINGS.get("JWT_ISSUER")
    const aud = await env.SETTINGS.get("JWT_AUDIENCE")

    console.group("verify token")
    console.debug("token:" + token)
    console.debug("JWKS_URL:" + jwksUrl)
    console.debug("JWT_ISSUER:" + iss)
    console.debug("JWT_AUDIENCE:" + aud)
    console.groupEnd()

    const JWKS = await jose.createRemoteJWKSet(new URL(jwksUrl))
    const options:JWTVerifyOptions = {
        issuer: iss,
        audience: aud,
    }
    const {payload, protectedHeader} =
        await jose.jwtVerify(token, JWKS, options).catch(async (error) => {
            if (error?.code === 'ERR_JWKS_MULTIPLE_MATCHING_KEYS') {
                for await (const publicKey of error) {
                    try {
                        return await jose.jwtVerify(token, publicKey, options)
                    } catch (innerError) {
                        if (innerError?.code === 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED') {
                            continue
                        }
                        throw innerError
                    }
                }
                throw new jose.errors.JWSSignatureVerificationFailed()
            }
            throw error
        })
    return {payload, protectedHeader}
}
const getUserInfo = async (token: string, env: any,) => {
    const payload = jose.decodeJwt(token)
    let userInfoEndPoint:string
    if (Array.isArray(payload.aud)) {
        userInfoEndPoint = payload.aud.find(e => e.endsWith("userinfo"))
    } else {
        if (payload.aud.endsWith("userinfo")) {
            userInfoEndPoint = payload.aud
        }
    }
    if (userInfoEndPoint) {
        const res = await fetch(userInfoEndPoint, {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            headers: {
                'Authorization': 'Bearer ' + token,
            }
        })
        if (res.ok) {
            const validatedUser = userSchema.safeParse(await res.json());

            if (!validatedUser.success) {
                throw new CustomHttpStatus(FORBIDDEN, "Unable to retrieve user information");
            }
            if (!validatedUser.data.email_verified) {
                throw new CustomHttpStatus(FORBIDDEN, "User Email not verified");
            }
            return validatedUser.data
        }
    }
}

export async function Authenticate(request: Request, env: any, context: any) {
    // Throw an error If not authenticated

    const token = getBearer(request)
    if (!token) {
        throw new CustomHttpStatus(UNAUTHORIZED, "token not found");
    }

    try {
        const {payload, protectedHeader} = await verify(token, env)
    } catch(error) {
        if (!(error instanceof CustomHttpStatus)) {
            throw new CustomHttpStatus(FORBIDDEN, "token not verified");
        }
    }

    // Throw an error if verify fails
    try {
        // set the user for endpoint routes to be able to reference it
        const user = await getUserInfo(token, env)
        env.user = user
        return

    } catch(error) {
        if (!(error instanceof CustomHttpStatus)) {
            throw new CustomHttpStatus(FORBIDDEN, "Unable to retrieve user information");
        }
    }

    throw new CustomHttpStatus(UNAUTHORIZED, "token not found");
}