import { Elysia, type Context } from "elysia";

const app = new Elysia();
import { app as authRoutes } from "./routes/authRoutes";
import { app as contestRoutes } from "./routes/contestRoutes"

export const response = (success: boolean, data: object | null, error: string | null) => {
	return {
		success: success,
		data: data,
		error: error
	}
}

app.group('/api', (app) => {
	app.use(authRoutes);
	app.use(contestRoutes);
	return app;
})

app.listen(3000, () => console.log("Server running on port 3000"));