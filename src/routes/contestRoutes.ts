import { Elysia } from "elysia";
import { auth } from "../middlewares/authMiddleware";
import { contestController } from "../controllers/contestControllers";
export const app = new Elysia();

app.group('/contests', (app) => {
	app.onBeforeHandle(auth);
	app.post('/', contestController.creatingContest);
	app.group('/:contestId', (app) => {
		app.get('/', contestController.getContest);
		app.group('/mcq', (app) => {
			app.post('/', contestController.contestMcq);
			app.post('/:questionId/submit', contestController.submitQuestion);
			return app;
		});
		return app;
	});
	return app;
})