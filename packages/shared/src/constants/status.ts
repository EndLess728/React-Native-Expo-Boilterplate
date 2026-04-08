export const STATUS = {
  ERROR: 'ERROR',
  LOADING: 'LOADING',
  NOT_STARTED: 'NOT_STARTED',
  SUCCESS: 'SUCCESS',
} as const;

export type Status = keyof typeof STATUS;
