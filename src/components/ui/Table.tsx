import React from "react";

interface TableProps<T> {
  data: T[];
  columns: {
    header: string;
    accessor: keyof T | ((item: T, index?: number) => React.ReactNode);
    sortable?: boolean;
  }[];
  onSort?: (accessor: keyof T, direction: "asc" | "desc") => void;
  currentSortColumn?: keyof T;
  currentSortDirection?: "asc" | "desc";
  onRowClick?: (item: T, index: number) => void;
}

export default function Table<T extends Record<string, any>>({
  data,
  columns,
  onSort,
  currentSortColumn,
  currentSortDirection = "asc",
  onRowClick,
}: TableProps<T>) {
  const handleSort = (accessor: keyof T) => {
    if (!onSort || typeof accessor === "function") return;

    const newDirection =
      currentSortColumn === accessor && currentSortDirection === "asc"
        ? "desc"
        : "asc";

    onSort(accessor, newDirection);
  };

  const handleRowClick = (item: T, index: number) => {
    if (onRowClick) {
      onRowClick(item, index);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="">
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                scope="col"
                className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                  typeof column.accessor !== "function" && column.sortable
                    ? "cursor-pointer hover:bg-foreground hover:text-background"
                    : ""
                }`}
                onClick={() => {
                  if (
                    typeof column.accessor !== "function" &&
                    column.sortable
                  ) {
                    handleSort(column.accessor);
                  }
                }}
              >
                <div className="flex items-center">
                  {column.header}
                  {typeof column.accessor !== "function" && column.sortable && (
                    <span className="ml-1">
                      {currentSortColumn === column.accessor
                        ? currentSortDirection === "asc"
                          ? "↑"
                          : "↓"
                        : "↕"}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.length > 0 ? (
            data.map((item, rowIndex) => (
              <tr
                key={rowIndex}
                className={`hover:bg-foreground hover:text-background ${
                  onRowClick ? "cursor-pointer" : ""
                }`}
                onClick={() => handleRowClick(item, rowIndex)}
              >
                {columns.map((column, colIndex) => (
                  <td
                    key={colIndex}
                    className="px-6 py-4 whitespace-nowrap text-sm"
                  >
                    {typeof column.accessor === "function"
                      ? column.accessor(item, rowIndex)
                      : item[column.accessor] !== undefined
                      ? String(item[column.accessor])
                      : ""}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="px-6 py-4 text-center text-sm"
              >
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
