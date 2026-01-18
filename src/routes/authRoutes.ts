import { Elysia } from "elysia";
import { authControllerExports } from "../controllers/authControllers";
export const app = new Elysia();

app.group('/auth', (app) => {
	app.post('/signup', authControllerExports.signupUser);
	app.post('/login', authControllerExports.loginUser);
	return app;
});
