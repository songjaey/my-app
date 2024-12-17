-- CreateTable
CREATE TABLE "Project" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "title" TEXT,
    "isSaved" BOOLEAN NOT NULL DEFAULT false,
    "imageSrc" TEXT
);

-- CreateTable
CREATE TABLE "NodeTreeData" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "coordinateX" INTEGER NOT NULL,
    "coordinateY" INTEGER NOT NULL,
    "coordinateZ" INTEGER NOT NULL,
    "projectId" INTEGER NOT NULL,
    CONSTRAINT "NodeTreeData_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ElementTreeData" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "type" TEXT,
    "properties" TEXT,
    "projectId" INTEGER NOT NULL,
    CONSTRAINT "ElementTreeData_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_ElementTreeDataToNodeTreeData" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_ElementTreeDataToNodeTreeData_A_fkey" FOREIGN KEY ("A") REFERENCES "ElementTreeData" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_ElementTreeDataToNodeTreeData_B_fkey" FOREIGN KEY ("B") REFERENCES "NodeTreeData" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_ElementTreeDataToNodeTreeData_AB_unique" ON "_ElementTreeDataToNodeTreeData"("A", "B");

-- CreateIndex
CREATE INDEX "_ElementTreeDataToNodeTreeData_B_index" ON "_ElementTreeDataToNodeTreeData"("B");
