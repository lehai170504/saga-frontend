"use client";

import React from "react";
import { JiraTask } from "@/features/projects/types";
import { TaskDetailModal } from "./task-detail-modal";
import { BoardCreateTaskModal, BoardEditTaskModal, BoardDeleteTaskModal } from "./board-task-modals";

interface BoardModalsContainerProps {
  projectId: string;
  isLeader: boolean;
  teamMembers: Array<{ studentId: string; fullName: string }>;

  // Detail Modal
  isDetailOpen: boolean;
  setIsDetailOpen: (open: boolean) => void;
  selectedTask: JiraTask | null;
  setSelectedTask: (task: JiraTask | null) => void;

  // Create Modal
  isCreateOpen: boolean;
  setIsCreateOpen: (open: boolean) => void;
  createTitle: string;
  setCreateTitle: (val: string) => void;
  createIssueType: string;
  setCreateIssueType: (val: string) => void;
  createPriority: string;
  setCreatePriority: (val: string) => void;
  createDueDate: string;
  setCreateDueDate: (val: string) => void;
  createAssignee: string;
  setCreateAssignee: (val: string) => void;
  createLabels: string;
  setCreateLabels: (val: string) => void;
  createDescription: string;
  setCreateDescription: (val: string) => void;
  handleCreateTask: (e: React.FormEvent) => void;
  isCreateTaskPending: boolean;

  // Edit Modal
  isEditOpen: boolean;
  setIsEditOpen: (open: boolean) => void;
  editTitle: string;
  setEditTitle: (val: string) => void;
  editIssueType: string;
  setEditIssueType: (val: string) => void;
  editPriority: string;
  setEditPriority: (val: string) => void;
  editDueDate: string;
  setEditDueDate: (val: string) => void;
  editLabels: string;
  setEditLabels: (val: string) => void;
  editDescription: string;
  setEditDescription: (val: string) => void;
  handleEditTask: (e: React.FormEvent) => void;
  isEditTaskPending: boolean;

  // Delete Modal
  isDeleteOpen: boolean;
  setIsDeleteOpen: (open: boolean) => void;
  taskToDelete: JiraTask | null;
  handleConfirmDelete: () => void;
  isDeleteTaskPending: boolean;
}

export function BoardModalsContainer({
  projectId,
  isLeader,
  teamMembers,
  isDetailOpen,
  setIsDetailOpen,
  selectedTask,
  setSelectedTask,
  isCreateOpen,
  setIsCreateOpen,
  createTitle,
  setCreateTitle,
  createIssueType,
  setCreateIssueType,
  createPriority,
  setCreatePriority,
  createDueDate,
  setCreateDueDate,
  createAssignee,
  setCreateAssignee,
  createLabels,
  setCreateLabels,
  createDescription,
  setCreateDescription,
  handleCreateTask,
  isCreateTaskPending,
  isEditOpen,
  setIsEditOpen,
  editTitle,
  setEditTitle,
  editIssueType,
  setEditIssueType,
  editPriority,
  setEditPriority,
  editDueDate,
  setEditDueDate,
  editLabels,
  setEditLabels,
  editDescription,
  setEditDescription,
  handleEditTask,
  isEditTaskPending,
  isDeleteOpen,
  setIsDeleteOpen,
  taskToDelete,
  handleConfirmDelete,
  isDeleteTaskPending,
}: BoardModalsContainerProps) {
  return (
    <>
      {/* Detail Task Modal */}
      <TaskDetailModal
        isOpen={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        selectedTask={selectedTask}
        projectId={projectId}
        onTaskUpdated={(updatedTask) => setSelectedTask(updatedTask)}
      />

      {/* Create Task Modal */}
      <BoardCreateTaskModal
        isOpen={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        createTitle={createTitle}
        onCreateTitleChange={setCreateTitle}
        createIssueType={createIssueType}
        onCreateIssueTypeChange={setCreateIssueType}
        createPriority={createPriority}
        onCreatePriorityChange={setCreatePriority}
        createDueDate={createDueDate}
        onCreateDueDateChange={setCreateDueDate}
        createAssignee={createAssignee}
        onCreateAssigneeChange={setCreateAssignee}
        createLabels={createLabels}
        onCreateLabelsChange={setCreateLabels}
        createDescription={createDescription}
        onCreateDescriptionChange={setCreateDescription}
        isLeader={isLeader}
        teamMembers={teamMembers}
        onSubmit={handleCreateTask}
        isPending={isCreateTaskPending}
      />

      {/* Edit Task Modal */}
      <BoardEditTaskModal
        isOpen={isEditOpen}
        onOpenChange={setIsEditOpen}
        editTitle={editTitle}
        onEditTitleChange={setEditTitle}
        editIssueType={editIssueType}
        onEditIssueTypeChange={setEditIssueType}
        editPriority={editPriority}
        onEditPriorityChange={setEditPriority}
        editDueDate={editDueDate}
        onEditDueDateChange={setEditDueDate}
        editLabels={editLabels}
        onEditLabelsChange={setEditLabels}
        editDescription={editDescription}
        onEditDescriptionChange={setEditDescription}
        onSubmit={handleEditTask}
        isPending={isEditTaskPending}
      />

      {/* Delete Task Modal */}
      <BoardDeleteTaskModal
        isOpen={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        taskToDelete={taskToDelete}
        onConfirmDelete={handleConfirmDelete}
        isPending={isDeleteTaskPending}
      />
    </>
  );
}
