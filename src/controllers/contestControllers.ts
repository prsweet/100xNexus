import { status } from "elysia";
import { response } from "..";
import type { payloadData } from "../middlewares/authMiddleware";
import { creatingContestSchema } from "../types";
import { prisma } from "../db";

const creatingContest = async (ctx: payloadData) => {
	if (ctx.role != 'creator') return status(403, response(false, null, "FORBIDDEN"));
	const validated = creatingContestSchema.safeParse(ctx.body);
	if (!validated.success) return status(400, response(false, null, "INVALID_REQUEST"));
	const userExist = await prisma.users.findFirst({
		where: { id: ctx.userId }
	});
	console.log(userExist, 'creatingContest');
	if (!userExist) return status(404, response(false, null, "USER_NOT_FOUND"));
	const createdContest = await prisma.contests.create({
		data: {
			creator_id: ctx.userId!,
			title: validated.data.title,
			description: validated.data.description,
			start_time: validated.data.startTime,
			end_time: validated.data.endTime,
		},
		omit: { created_at: true }
	});
	console.log(createdContest, 'creatingContest');
	const data = {
		"id": createdContest.id,
		"title": createdContest.title,
		"description": createdContest.description,
		"creatorId": createdContest.creator_id,
		"startTime": createdContest.start_time,
		"endTime": createdContest.end_time
	}
	return status(201, response(true, data, null));
}

const getContest = async (ctx: payloadData) => {
	const { contestId } = ctx.params;
	const gettingContest = await prisma.contests.findFirst({
		where: { id: contestId },
		omit: { created_at: true },
		include: {
			dsa_problems: true,
			mcq_questions: { omit: { correct_option_index: (ctx.role == 'contestee') ? true : false } }
		}
	});
	console.log(gettingContest)
	if (!gettingContest) return status(404, response(false, null, "CONTEST_NOT_FOUND"));
	const data = {
		"id": gettingContest.id,
	    "title": gettingContest.title,
	    "description": gettingContest.description,
	    "startTime": gettingContest.start_time,
	    "endTime": gettingContest.end_time,
	    "creatorId": gettingContest.creator_id,
		"mcqs": gettingContest.mcq_questions,
		"dsaProblems": gettingContest.dsa_problems
	}
	return status(200, response(true, data, null));
}

export const contestController = {
	creatingContest,
	getContest
}