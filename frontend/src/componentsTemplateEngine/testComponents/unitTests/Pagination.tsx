import { FC } from 'react';
import { range } from '../../../utils/templateEngine/utils';
interface PaginationProps {
    total: number;
    limit: number;
    currentPage: number;
    selectPage: (page: number) => void;
}

const Pagination: FC<PaginationProps> = ({ total, limit, currentPage, selectPage }) => {
    const pagesCount = Math.ceil(total / limit);
    const pages = range(1, pagesCount + 1);

    return (
        <ul className="pagination">
            {pages.map((page) => (
                <li
                    key={page}
                    data-testid="page-container"
                    onClick={() => selectPage(page)}
                    className={`page-item ${currentPage === page ? 'active' : ''}`}
                >
                    <span className="page-link">{page}</span>
                </li>
            ))}
        </ul>
    );
};

export default Pagination;
