import React, { useState } from "react";
import { useTable, useSortBy, usePagination } from "react-table";
import { CSVLink } from "react-csv";
import useFetchBooks from "../hooks/useFetchBook";

const AdminDashboard = () => {
  const { data, loading } = useFetchBooks();
  const [pageSize, setPageSize] = useState(10);

  const columns = React.useMemo(
    () => [
      { Header: "Title", accessor: "title" },
      { Header: "Author Name", accessor: "author_name" },
      { Header: "First Publish Year", accessor: "first_publish_year" },
      {
        Header: "Subject",
        accessor: "subject",
        Cell: ({ value }) => <div className="w-48 truncate">{value}</div>,
      },
      { Header: "Ratings Average", accessor: "ratings_average" },
      { Header: "Author Birth Date", accessor: "author_birth_date" },
      { Header: "Author Top Work", accessor: "author_top_work" },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    nextPage,
    previousPage,
    state: { pageIndex },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize },
    //   pageSize,
    },
    useSortBy,
    usePagination
  );

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <table
            {...getTableProps()}
            className="min-w-full divide-y divide-gray-200"
          >
            <thead className="bg-gray-50">
              {headerGroups.map((headerGroup) => (
                <tr key={headerGroup.id} {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th
                      key={column.id}
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {column.render("Header")}
                      <span>
                        {column.isSorted
                          ? column.isSortedDesc
                            ? " 🔽"
                            : " 🔼"
                          : ""}
                      </span>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody
              {...getTableBodyProps()}
              className="bg-white divide-y divide-gray-200"
            >
              {page.map((row, rowIndex) => {
                prepareRow(row);
                return (
                  <tr key={`row-${rowIndex}`} {...row.getRowProps()}>
                    {row.cells.map((cell, cellIndex) => (
                      <td
                        key={`cell-${rowIndex}-${cellIndex}`}
                        {...cell.getCellProps()}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                      >
                        {cell.render("Cell")}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="flex items-center justify-between mt-4">
            <div>
              <button
                onClick={() => previousPage()}
                disabled={!canPreviousPage}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded mr-2 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => nextPage()}
                disabled={!canNextPage}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <span className="text-sm">
              Page{" "}
              <strong>
                {pageIndex + 1} of {pageOptions.length}
              </strong>
            </span>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="ml-2 py-2 pl-3 pr-10 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              {[10, 50, 100].map((size) => (
                <option key={size} value={size}>
                  Show {size}
                </option>
              ))}
            </select>
            <CSVLink
              data={data}
              headers={columns.map((column) => ({
                label: column.Header,
                key: column.accessor,
              }))}
              filename={"books.csv"}
              className="ml-4 px-4 py-2 bg-blue-500 text-white rounded"
            >
              Download CSV
            </CSVLink>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
