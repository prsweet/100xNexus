import { status, type Context } from "elysia";
import { loginSchema, signupSchema } from "../types";
import { response } from "..";
import jwt from "jsonwebtoken";
import { prisma } from "../db";


const signupUser = async (ctx: Context) => {
	const validated = signupSchema.safeParse(ctx.body);
	if (!validated.success) return status(400, response(false, null, "INVALID_REQUEST"));
	const userExist = await prisma.users.findFirst({
		where: { email: validated.data.email }
	});
	if (userExist) return status(400, response(false, null, "EMAIL_ALREADY_EXISTS"));
	const createdUser = await prisma.users.create({
		omit: { created_at: true, password: true },
		data: {
			email: validated.data.email,
			name: validated.data.name,
			password: validated.data.password,
			role: validated.data.role ? validated.data.role : 'contestee'
		}
	});
	return status(201, response(true, createdUser, null));
}

const loginUser = async (ctx: Context) => {
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
}

export const authControllerExports = {
	signupUser,
	loginUser
}