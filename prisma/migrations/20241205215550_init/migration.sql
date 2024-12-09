-- CreateTable
CREATE TABLE "Project" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT,
    "isSaved" BOOLEAN NOT NULL DEFAULT false,
    "imageSrc" TEXT,
    "savedNodeIds" TEXT,
    "savedElementIds" TEXT
);

-- CreateTable
CREATE TABLE "NodeTreeData" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "coordinateX" INTEGER NOT NULL,
    "coordinateY" INTEGER NOT NULL,
    "coordinateZ" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "ElementTreeData" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "savedNodeIds" TEXT NOT NULL
);
