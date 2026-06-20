import { useEffect, useRef } from "react";

export default function InfiniteScrollTrigger({
    onLoadMore,
    hasMore,
    loading,
}) {
    const ref = useRef(null);

    useEffect(() => {
        if (!hasMore || loading) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    onLoadMore();
                }
            },
            { rootMargin: "400px" }
        );

        if (ref.current) observer.observe(ref.current);

        return () => observer.disconnect();
    }, [hasMore, loading, onLoadMore]);

    return (
        <div ref={ref} className="h-10 flex justify-center items-center">
            {loading && <span>Loading more...</span>}
        </div>
    );
}