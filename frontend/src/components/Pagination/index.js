import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Paginator, PagePrev, PageItem, PageNext } from './styles';

export default function Pagination({
  align,
  onLoadPage,
  page,
  totalPage,
  sizePagination,
}) {
  const [itens, setItens] = useState([]);
  const [pageSelected, setPageSelected] = useState(1);

  /* useEffect(() => {
    // if (totalPage > 0) {
    //   const fill = new Array(totalPage).fill(1);
    //   setItens(fill);
    // }

    // 64 < 7 ?  64 : 7;
    sizePagination = totalPage < sizePagination ? totalPage : sizePagination;
    const currentPage = page || 1;

    let start = 1;
    let length = sizePagination;

    // console.log('currentPage', currentPage);

    // console.log('page:', page, 'totaPage:', totalPage, 'sizePagination:', sizePagination);

    if (currentPage > sizePagination) {
      start = currentPage - sizePagination;
      length = start + sizePagination;
    }

    // console.log('Start', start, 'Length', length);

    const fill = [];
    for (let number = start; number <= length; number++) {
      fill.push(number);
    }

    setItens(fill);

    setPageSelected(page);
  }, [page, totalPage]);

  */

  useMemo(() => {
    const size = totalPage < sizePagination ? totalPage : sizePagination;
    const currentPage = page || 1;

    let start = 1;
    let length = size;

    if (currentPage > size) {
      start = currentPage - size;
      length = start + size;
    }

    const fill = [];
    for (let number = start; number <= length; number++) {
      fill.push(number);
    }

    setItens(fill);

    setPageSelected(page);
  }, [page, totalPage, sizePagination]);

  function handleLoadPage(page) {
    setPageSelected(page);
    onLoadPage(page);
  }

  function handlePrevPage() {
    if (pageSelected === 1) return;
    const page = pageSelected - 1;
    setPageSelected(page);
    handleLoadPage(page);
  }

  function handleNextPage() {
    if (pageSelected === totalPage) return;
    const page = pageSelected + 1;
    setPageSelected(page);
    handleLoadPage(page);
  }

  return (
    <Paginator align={align}>
      {pageSelected > 1 && (
        <PagePrev title="Anterior" onClick={handlePrevPage}>
          &laquo;
        </PagePrev>
      )}

      {itens.map((item, index) => (
        <PageItem
          key={String(index)}
          active={item === pageSelected}
          onClick={() => handleLoadPage(item)}
        >
          {item}
        </PageItem>
      ))}
      {pageSelected < totalPage && (
        <PageNext title="Próxima" onClick={handleNextPage}>
          &raquo;
        </PageNext>
      )}
    </Paginator>
  );
}

Pagination.defaultProps = {
  align: 'center',
  sizePagination: 7,
};

Pagination.propTypes = {
  align: PropTypes.string,
  onLoadPage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  totalPage: PropTypes.number.isRequired,
  sizePagination: PropTypes.number,
};
