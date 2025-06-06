-- CreateTable
CREATE TABLE "Requirement" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT,
    "content" TEXT,
    "scoreBase" INTEGER NOT NULL,
    "deadline" TIMESTAMP(3) NOT NULL,
    "type" TEXT NOT NULL,
    "subjectInstanceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Requirement_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Requirement" ADD CONSTRAINT "Requirement_subjectInstanceId_fkey" FOREIGN KEY ("subjectInstanceId") REFERENCES "SubjectInstance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
