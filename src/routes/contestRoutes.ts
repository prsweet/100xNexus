import { Elysia } from "elysia";
import { auth } from "../middlewares/authMiddleware";
export const app = new Elysia();

app.group('/contest', (app) => {
	app.onBeforeHandle(auth);
	return app;
})