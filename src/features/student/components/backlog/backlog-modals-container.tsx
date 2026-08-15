"use client";

import React from "react";
import { JiraTask, Sprint } from "@/features/projects/types";
import { TaskDetailModal } from "../board/task-detail-modal";
import { BacklogCreateTaskModal, BacklogEditTaskModal, BacklogDeleteTaskModal } from "./backlog-task-modals";
import { CreateSprintModal, EditSprintModal, MoveTaskConfirmModal } from "./sprint-modals";

interface BacklogModalsContainerProps {
  projectId: string;
  sprints: Sprint[];
  teamMembers: Array<{ studentId: string; fullName: string }>;

  // Detail Task Modal
  isDetailOpen: boolean;
  setIsDetailOpen: (open: boolean) => void;
  selectedTask: JiraTask | null;
  setSelectedTask: (task: JiraTask | null) => void;

  // Create Task Modal
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

  // Edit Task Modal
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
  editAssignee: string;
  setEditAssignee: (val: string) => void;
  editLabels: string;
  setEditLabels: (val: string) => void;
  editDescription: string;
  setEditDescription: (val: string) => void;
  handleEditTask: (e: React.FormEvent) => void;
  isEditTaskPending: boolean;

  // Delete Task Modal
  isDeleteOpen: boolean;
  setIsDeleteOpen: (open: boolean) => void;
  taskToDelete: JiraTask | null;
  handleDeleteTask: () => void;
  isDeleteTaskPending: boolean;

  // Create Sprint Modal
  isCreateSprintOpen: boolean;
  setIsCreateSprintOpen: (open: boolean) => void;
  sprintNameInput: string;
  setSprintNameInput: (val: string) => void;
  sprintGoalInput: string;
  setSprintGoalInput: (val: string) => void;
  sprintStartDateInput: string;
  setSprintStartDateInput: (val: string) => void;
  sprintEndDateInput: string;
  setSprintEndDateInput: (val: string) => void;
  handleCreateSprint: (e: React.FormEvent) => void;
  isCreateSprintPending: boolean;

  // Edit Sprint Modal
  isEditSprintOpen: boolean;
  setIsEditSprintOpen: (open: boolean) => void;
  editSprintNameInput: string;
  setEditSprintNameInput: (val: string) => void;
  editSprintGoalInput: string;
  setEditSprintGoalInput: (val: string) => void;
  editSprintStartDateInput: string;
  setEditSprintStartDateInput: (val: string) => void;
  editSprintEndDateInput: string;
  setEditSprintEndDateInput: (val: string) => void;
  handleUpdateSprint: (e: React.FormEvent) => void;
  isEditSprintPending: boolean;
  isAutoStart: boolean;

  // Move Task Confirm Modal
  isMoveConfirmOpen: boolean;
  setIsMoveConfirmOpen: (open: boolean) => void;
  taskToMove: JiraTask | null;
  targetSprintForMove: string | null;
  handleConfirmMoveTask: () => void;
  isMoveTaskPending: boolean;
}

export function BacklogModalsContainer({
  projectId,
  sprints,
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
  editAssignee,
  setEditAssignee,
  editLabels,
  setEditLabels,
  editDescription,
  setEditDescription,
  handleEditTask,
  isEditTaskPending,
  isDeleteOpen,
  setIsDeleteOpen,
  taskToDelete,
  handleDeleteTask,
  isDeleteTaskPending,
  isCreateSprintOpen,
  setIsCreateSprintOpen,
  sprintNameInput,
  setSprintNameInput,
  sprintGoalInput,
  setSprintGoalInput,
  sprintStartDateInput,
  setSprintStartDateInput,
  sprintEndDateInput,
  setSprintEndDateInput,
  handleCreateSprint,
  isCreateSprintPending,
  isEditSprintOpen,
  setIsEditSprintOpen,
  editSprintNameInput,
  setEditSprintNameInput,
  editSprintGoalInput,
  setEditSprintGoalInput,
  editSprintStartDateInput,
  setEditSprintStartDateInput,
  editSprintEndDateInput,
  setEditSprintEndDateInput,
  handleUpdateSprint,
  isEditSprintPending,
  isAutoStart,
  isMoveConfirmOpen,
  setIsMoveConfirmOpen,
  taskToMove,
  targetSprintForMove,
  handleConfirmMoveTask,
  isMoveTaskPending,
}: BacklogModalsContainerProps) {
  return (
    <>
      {/* Task Detail Drawer */}
      <TaskDetailModal
        isOpen={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        selectedTask={selectedTask}
        projectId={projectId}
        onTaskUpdated={(updatedTask) => setSelectedTask(updatedTask)}
        variant="drawer"
      />

      {/* Create Task Modal */}
      <BacklogCreateTaskModal
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
        teamMembers={teamMembers}
        onSubmit={handleCreateTask}
        isPending={isCreateTaskPending}
      />

      {/* Edit Task Modal */}
      <BacklogEditTaskModal
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
        editAssignee={editAssignee}
        onEditAssigneeChange={setEditAssignee}
        editLabels={editLabels}
        onEditLabelsChange={setEditLabels}
        editDescription={editDescription}
        onEditDescriptionChange={setEditDescription}
        teamMembers={teamMembers}
        onSubmit={handleEditTask}
        isPending={isEditTaskPending}
      />

      {/* Delete Task Modal */}
      <BacklogDeleteTaskModal
        isOpen={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        taskToDelete={taskToDelete}
        onConfirmDelete={handleDeleteTask}
        isPending={isDeleteTaskPending}
      />

      {/* Create Sprint Modal */}
      <CreateSprintModal
        isOpen={isCreateSprintOpen}
        onOpenChange={setIsCreateSprintOpen}
        sprintNameInput={sprintNameInput}
        onSprintNameChange={setSprintNameInput}
        sprintGoalInput={sprintGoalInput}
        onSprintGoalChange={setSprintGoalInput}
        sprintStartDateInput={sprintStartDateInput}
        onSprintStartDateChange={setSprintStartDateInput}
        sprintEndDateInput={sprintEndDateInput}
        onSprintEndDateChange={setSprintEndDateInput}
        onSubmit={handleCreateSprint}
        isPending={isCreateSprintPending}
      />

      {/* Edit Sprint Modal */}
      <EditSprintModal
        isOpen={isEditSprintOpen}
        onOpenChange={setIsEditSprintOpen}
        editSprintNameInput={editSprintNameInput}
        onEditSprintNameChange={setEditSprintNameInput}
        editSprintGoalInput={editSprintGoalInput}
        onEditSprintGoalChange={setEditSprintGoalInput}
        editSprintStartDateInput={editSprintStartDateInput}
        onEditSprintStartDateChange={setEditSprintStartDateInput}
        editSprintEndDateInput={editSprintEndDateInput}
        onEditSprintEndDateChange={setEditSprintEndDateInput}
        onSubmit={handleUpdateSprint}
        isPending={isEditSprintPending}
        isAutoStart={isAutoStart}
      />

      {/* Move Task Confirmation Dialog */}
      <MoveTaskConfirmModal
        isOpen={isMoveConfirmOpen}
        onOpenChange={setIsMoveConfirmOpen}
        taskToMove={taskToMove}
        sourceSprintName={taskToMove?.sprint?.name || "Backlog"}
        targetSprintName={sprints.find((s) => s.sprintId === targetSprintForMove)?.sprintName || "Backlog"}
        onConfirm={handleConfirmMoveTask}
        isPending={isMoveTaskPending}
      />
    </>
  );
}
