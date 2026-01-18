import { Elysia, status, type Context } from "elysia";
import jwt, { type JwtPayload } from "jsonwebtoken";

interface payloadData extends Context {
	userId?: string;
	role?: string;
}

const app = new Elysia();
import { app as authRoutes } from "./routes/authRoutes";

export const response = (success: boolean, data: object | null, error: string | null) => {
	return {
		success: success,
		data: data,
		error: error
	}
}

const auth = (ctx: payloadData) => {
	try {
		const token = ctx.headers.authorization?.split(' ')[1] as string;
		const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
		ctx.userId = decoded.userId;
		ctx.role = decoded.role;
	} catch (error) {
		return status(401, response(false, null, "UNAUTHORIZED"));
	}
}

app.group('/api', (app) => {
	app.use(authRoutes);
	return app;
})

app.listen(3000, () => console.log("Server running on port 3000"));