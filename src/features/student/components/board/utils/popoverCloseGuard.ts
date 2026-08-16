let lastClosedTime = 0;
let isGithubPopoverOpen = false;

export const recordGithubPopoverOpened = () => {
  isGithubPopoverOpen = true;
};

export const recordGithubPopoverClosed = () => {
  isGithubPopoverOpen = false;
  lastClosedTime = Date.now();
};

export const shouldIgnoreTaskCardClick = (): boolean => {
  if (isGithubPopoverOpen) return true;
  return Date.now() - lastClosedTime < 1000;
};
