let lastClosedTime = 0;

export const recordGithubPopoverClosed = () => {
  lastClosedTime = Date.now();
};

export const shouldIgnoreTaskCardClick = (): boolean => {
  return Date.now() - lastClosedTime < 600;
};
