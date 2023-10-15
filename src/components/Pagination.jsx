import React from "react";
import { usePagination } from "../usePagination";

function Pagination(props){
    const { onPageChange, totalCount, siblingCount = 1, currentPage, pageSize } = props;
    const paginationRange = usePagination({totalCount, pageSize, siblingCount, currentPage});
    if(currentPage === 0 && paginationRange.length < 2){
        return null;
    }
    const toPrev = () => {
        onPageChange(currentPage - 1);
    }
    const toNext = () => {
        onPageChange(currentPage + 1);
    }
    let lastPage = paginationRange[paginationRange.length - 1];
    return(
        <ul className="pagination-container">
            <li className="pagination-item" style={currentPage === 1 ? {display: "none"} : {display: "inline"}} onClick={toPrev}>
                <div className="arrow left"/>
            </li>
            {paginationRange.map((n) => {
                return(
                    <li key={n} className={currentPage === n ? "pagination-item selected" : "pagination-item"} onClick={() => onPageChange(n)}>
                        {n}
                    </li>
                )
            })}
            <li className="pagination-item" style={currentPage === lastPage ? {display: "none"} : {display: "inline"}} onClick={toNext}>
                <div className="arrow"/>
            </li>
        </ul>
    )
}

export default Pagination;