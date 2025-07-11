-- CreateEnum
CREATE TYPE "Role" AS ENUM ('DEV', 'DES', 'PM', 'CORE', 'MENTOR');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "year" INTEGER,
    "role" "Role"[],
    "major" TEXT NOT NULL,
    "minor" TEXT,
    "birthday" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "quote" TEXT NOT NULL,
    "favThings" TEXT[],
    "funFact" TEXT NOT NULL,
    "tradition" TEXT NOT NULL,
    "img" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
