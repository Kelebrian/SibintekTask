CREATE TABLE [dbo].[Task]
(
    [TaskId] INT NOT NULL PRIMARY KEY,
    [Description] NVARCHAR(100) NOT NULL,
    [Complete] bit
);