export const getLinkedTaskIds = (projectId: string): Set<string> => {
  if (typeof window === "undefined" || !projectId) return new Set();
  try {
    const raw = localStorage.getItem(`saga_linked_tasks_${projectId}`);
    if (!raw) return new Set();
    const arr = JSON.parse(raw);
    return new Set(Array.isArray(arr) ? arr : []);
  } catch {
    return new Set();
  }
};

export const addLinkedTaskId = (projectId: string, taskId: string) => {
  if (typeof window === "undefined" || !projectId || !taskId) return;
  const current = getLinkedTaskIds(projectId);
  current.add(taskId);
  try {
    localStorage.setItem(`saga_linked_tasks_${projectId}`, JSON.stringify(Array.from(current)));
    window.dispatchEvent(new Event("saga_linked_tasks_updated"));
  } catch {}
};

export const removeLinkedTaskId = (projectId: string, taskId: string) => {
  if (typeof window === "undefined" || !projectId || !taskId) return;
  const current = getLinkedTaskIds(projectId);
  current.delete(taskId);
  try {
    localStorage.setItem(`saga_linked_tasks_${projectId}`, JSON.stringify(Array.from(current)));
    window.dispatchEvent(new Event("saga_linked_tasks_updated"));
  } catch {}
};
