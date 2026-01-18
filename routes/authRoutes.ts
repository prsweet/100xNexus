import { Elysia, status } from "elysia";
import { loginSchema, signupSchema } from "../types";
import jwt from "jsonwebtoken";
import { prisma } from "../db";
import { response } from "../index";
export const app = new Elysia();

app.group('/auth', (app) => {
	app.post('/signup', async (ctx) => {
		const validated = signupSchema.safeParse(ctx.body);
		if (!validated.success) return status(400, response(false, null, "INVALID_REQUEST"));
		const userExist = await prisma.users.findFirst({
			where: { email: validated.data.email }
		});
		if (userExist) return status(400, response(false, null, "EMAIL_ALREADY_EXISTS"));
		const createdUser = await prisma.users.create({
			select: { password: true, created_at: true },
			data: {
				email: validated.data.email,
				name: validated.data.name,
				password: validated.data.password,
				role: validated.data.role ? validated.data.role : 'contestee'
			}
		});
		return status(201, response(true, createdUser, null));
	})
	app.post('/login', async (ctx) => {
		const validated = loginSchema.safeParse(ctx.body);
		if (!validated.success) return status(400, response(false, null, "INVALID_REQUEST"));
		const loggedUser = await prisma.users.findFirst({
			where: {
				email: validated.data.email,
				password: validated.data.password
			},
			omit: { password: true, created_at: true }
		});
		if (!loggedUser) return status(401, response(false, null, "INVALID_CREDENTIALS"));
		const token = jwt.sign({ userId: loggedUser.id, role: loggedUser.role }, process.env.JWT_SECRET!);
		return status(200, response(true, { token: token }, null));
	})
	return app;
})