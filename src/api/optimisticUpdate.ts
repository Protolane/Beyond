import type { KeyedMutator } from 'swr';

export async function optimisticUpdate<T, R>(
  newData: Required<T>,
  mutate: KeyedMutator<T>,
  apiFunction?: () => R,
  remutate = true
) {
  // await mutate(undefined, false);
  await mutate(newData, false);
  const result = await apiFunction?.();
  if (remutate) await mutate();
  return result;
}
