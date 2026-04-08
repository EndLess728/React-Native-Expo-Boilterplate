import type { GetNextPageParamFunction, GetPreviousPageParamFunction } from '@tanstack/react-query';

import type { PaginateQuery } from '../types';

type KeyParams = {
  [key: string]: unknown;
};

export const DEFAULT_LIMIT = 10;

export function getQueryKey<T extends KeyParams>(key: string, params?: T) {
  return [key, ...(params ? [params] : [])];
}

export function normalizePages<T>(pages?: PaginateQuery<T>[]): T[] {
  return pages ? pages.reduce((prev: T[], current) => [...prev, ...current.results], []) : [];
}

export function getUrlParameters(url: string | null): { [k: string]: string } | null {
  if (url === null) return null;
  const regex = /[?&]([^=#]+)=([^&#]*)/g;
  const params: Record<string, string> = {};
  let match;
  while ((match = regex.exec(url))) {
    params[match[1]] = match[2];
  }
  return params;
}

export const getPreviousPageParam: GetNextPageParamFunction<unknown, PaginateQuery<unknown>> = (
  page,
) => getUrlParameters(page.previous)?.offset ?? null;

export const getNextPageParam: GetPreviousPageParamFunction<unknown, PaginateQuery<unknown>> = (
  page,
) => getUrlParameters(page.next)?.offset ?? null;
