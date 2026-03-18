import { useEffect, useRef, useCallback } from "react";

export function useInfiniteScroll(onLoadMore: () => void, hasMore: boolean) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const callbackRef = useRef(onLoadMore);
  const hasMoreRef = useRef(hasMore);

  // Keep refs in sync without recreating observer
  callbackRef.current = onLoadMore;
  hasMoreRef.current = hasMore;

  const sentinelRef = useCallback((node: HTMLDivElement | null) => {
    if (observerRef.current) observerRef.current.disconnect();
    if (!node) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMoreRef.current) {
          callbackRef.current();
        }
      },
      { threshold: 0.1 }
    );

    observerRef.current.observe(node);
  }, []); // stable — never recreated

  useEffect(() => {
    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, []);

  return sentinelRef;
}
