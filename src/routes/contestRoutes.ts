import { Elysia } from "elysia";
import { auth } from "../middlewares/authMiddleware";
import { contestController } from "../controllers/contestControllers";
export const app = new Elysia();

app.group('/contests', (app) => {
	app.onBeforeHandle(auth);
	app.post('/', contestController.creatingContest);
	app.get('/:contestId', contestController.getContest);
	return app;
})