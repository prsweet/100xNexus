-- CreateTable
CREATE TABLE "mcq_submissions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "question_id" TEXT NOT NULL,
    "selected_option_index" INTEGER NOT NULL,
    "is_correct" BOOLEAN NOT NULL,
    "points_earned" INTEGER NOT NULL DEFAULT 0,
    "submitted_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mcq_submissions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "mcq_submissions_question_id_key" ON "mcq_submissions"("question_id");

-- AddForeignKey
ALTER TABLE "mcq_submissions" ADD CONSTRAINT "mcq_submissions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mcq_submissions" ADD CONSTRAINT "mcq_submissions_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "mcq_questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
