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

export const contestmcqSchema = z.object({
	"questionText": z.string(),
	"options": z.array(z.string()),
	"correctOptionIndex": z.number(),
	"points": z.number()
}).refine(data => data.correctOptionIndex >= 0 && data.correctOptionIndex <= data.options.length && data.options.length > 1);

export const submitquestionSchema = z.object({
	"selectedOptionIndex": z.number()
}).refine(data => data.selectedOptionIndex >= 0);