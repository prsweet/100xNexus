import { Elysia, status } from "elysia";
import jwt from "jsonwebtoken";
import { prisma } from "../db";
import { response } from "..";
export const app = new Elysia();

app.group('/contest', (app) => {
	
	return app;
})