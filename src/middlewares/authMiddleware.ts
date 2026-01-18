import { Elysia, status, type Context } from "elysia";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { response } from "..";

interface payloadData extends Context {
	userId?: string;
	role?: string;
}

export const auth = (ctx: payloadData) => {
	try {
		const token = ctx.headers.authorization?.split(' ')[1] as string;
		const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
		ctx.userId = decoded.userId;
		ctx.role = decoded.role;
	} catch (error) {
		return status(401, response(false, null, "UNAUTHORIZED"));
	}
}