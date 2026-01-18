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

app.group('/api', (app) => {
	app.use(authRoutes);
	return app;
})

app.listen(3000, () => console.log("Server running on port 3000"));