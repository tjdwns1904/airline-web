import { useMemo } from "react"

export const usePagination = ({
    totalCount,
    pageSize,
    siblingCount = 1,
    currentPage
}) => {
    const paginationRange = useMemo(() => {
        const totalPageCount = Math.ceil(totalCount / pageSize);
        const range = (start, end) => {
            let length = end - start + 1;
            return Array.from({ length }, (_, idx) => idx + start);
        }
        return range(1, totalPageCount);
    }, [totalCount, pageSize, siblingCount, currentPage]);

    return paginationRange;
}