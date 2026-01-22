import { status } from "elysia";
import { response } from "..";
import type { payloadData } from "../middlewares/authMiddleware";
import { contestmcqSchema, creatingContestSchema, submitquestionSchema } from "../types";
import { prisma } from "../db";

const creatingContest = async (ctx: payloadData) => {
	if (ctx.role != 'creator') return status(403, response(false, null, "FORBIDDEN"));
	const validated = creatingContestSchema.safeParse(ctx.body);
	if (!validated.success) return status(400, response(false, null, "INVALID_REQUEST"));
	const userExist = await prisma.users.findFirst({
		where: { id: ctx.userId }
	});
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

const contestMcq = async (ctx: payloadData) => {
	if (ctx.role == 'contestee') return status(403, response(false, null, "FORBIDDEN"));
	const { contestId } = ctx.params;
	const validated = contestmcqSchema.safeParse(ctx.body);
	if (!validated.success) return status(400, response(false, null, "INVALID_REQUEST"));
	const contestExist = await prisma.contests.findFirst({
		where: { id: contestId }
	});
	if (!contestExist) return status(404, response(false, null, "CONTEST_NOT_FOUND"));
	const createdQuestion = await prisma.mcq_questions.create({
		data: {
			contest_id: contestId!,
			question_text: validated.data.questionText,
			options: validated.data.options,
			correct_option_index: validated.data.correctOptionIndex,
			points: validated.data.points
		}
	});
	const data = { id: createdQuestion.id, contestId: createdQuestion.contest_id };
	return status(201, response(true, data, null));
}

const submitQuestion = async (ctx: payloadData) => {
	const { contestId, questionId } = ctx.params;
	if (ctx.role == 'creator') return status(403, response(false, null, "FORBIDDEN"));
	const validated = submitquestionSchema.safeParse(ctx.body);
	if (!validated.success) return status(400, response(false, null, "INVALID_REQUEST"));
	const contestExist = await prisma.contests.findFirst({ where: { id: contestId } });
	if (!contestExist) return status(404, response(false, null, "CONTEST_NOT_FOUND"));
	if (contestExist.end_time < new Date()) return status(400, response(false, null, "CONTEST_NOT_ACTIVE"));
	const questionExist = await prisma.mcq_questions.findFirst({ where: { id: questionId } });
	if (!questionExist) return status(404, response(false, null, "QUESTION_NOT_FOUND"));
	const submissionExist = await prisma.mcq_submissions.findFirst({ where: { question_id: questionId, user_id: ctx.userId } });
	if (submissionExist) return status(400, response(false, null, "ALREADY_SUBMITTED"));
	const submittedQuestion = await prisma.mcq_submissions.create({
		data: {
			user_id: ctx.userId!,
			question_id: questionId!,
			selected_option_index: validated.data.selectedOptionIndex,
			is_correct: (questionExist.correct_option_index == validated.data.selectedOptionIndex) ? true : false,
			points_earned: (questionExist.correct_option_index == validated.data.selectedOptionIndex) ? questionExist.points : 0
		}
	});
	const data = {
		isCorrect: submittedQuestion.is_correct,
		pointsEarned: submittedQuestion.points_earned
	}
	return status(201, response(true, data, null));
}

export const contestController = {
	creatingContest,
	getContest,
	contestMcq,
	submitQuestion
}