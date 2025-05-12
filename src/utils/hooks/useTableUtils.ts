import { useState, useMemo } from "react";

type OrderDirection = "asc" | "desc";

export const useTableUtils = <T>(
  items: T[],
  getSearchValue: (item: T) => string
) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [orderBy, setOrderBy] = useState<string>("");
  const [orderDirection, setOrderDirection] = useState<OrderDirection>("asc");
  const [searchTerm, setSearchTerm] = useState("");

  const handleSort = (property: string) => {
    const isAsc = orderBy === property && orderDirection === "asc";
    setOrderBy(property);
    setOrderDirection(isAsc ? "desc" : "asc");
  };

  const getValueByPath = (obj: any, path: string) =>
     path.split(".").reduce((acc, part) => acc?.[part], obj) ?? "";

  const filteredItems = useMemo(() => {
    return (items || []).filter((item) => {
      const searchValue = getSearchValue(item);
      return searchTerm && searchTerm !== "" 
        ? searchValue && searchValue.toLowerCase().includes(searchTerm.toLowerCase())
        : true; // Mostra todos os itens se searchTerm estiver vazio
    });
  }, [items, searchTerm, getSearchValue]);

  const sortedItems = useMemo(() => {
    return [...filteredItems].sort((a, b) => {
      if (!orderBy) return 0;
      const aValue = getValueByPath(a, orderBy);
      const bValue = getValueByPath(b, orderBy);
      return orderDirection === "asc"
        ? aValue?.toString().localeCompare(bValue?.toString())
        : bValue?.toString().localeCompare(aValue?.toString());
    });
  }, [filteredItems, orderBy, orderDirection]);

  const paginatedItems = useMemo(() => {
    return sortedItems.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
  }, [sortedItems, page, rowsPerPage]);

  return {
    page,
    rowsPerPage,
    orderBy,
    orderDirection,
    searchTerm,
    paginatedItems,
    filteredItems,
    setSearchTerm,
    setPage,
    setRowsPerPage,
    handleSort,
  };
};
