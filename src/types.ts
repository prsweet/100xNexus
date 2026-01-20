import { z } from "zod";

export const signupSchema = z.object({
	"name": z.string(),
	"email": z.email(),
	"password": z.string(),
	"role": z.enum(['contestee', 'creator']).optional()
});

export const loginSchema = z.object({
	"email": z.email(),
	"password": z.string()
});

export const creatingContestSchema = z.object({
	"title": z.string(),
	"description": z.string(),
	"startTime": z.iso.datetime(),
	"endTime": z.iso.datetime()
});