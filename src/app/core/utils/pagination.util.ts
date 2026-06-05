import { computed, signal } from '@angular/core';

export function createPagination(initialPage = 1, initialLimit = 10) {
  const page = signal(initialPage);
  const limit = signal(initialLimit);

  return {
    page,
    limit,
    params: computed(() => ({ page: page(), limit: limit() })),
    next: () => page.update(p => p + 1),
    prev: () => page.update(p => Math.max(1, p - 1)),
    goTo: (n: number) => page.set(n),
    totalPages: (total: number) => computed(() => Math.ceil(total / limit())),
  };
}
