import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ChevronUp, ChevronDown, Search } from 'lucide-react';
import Input from './Input';
import Button from './Button';

interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: any, index: number) => React.ReactNode;
  className?: string;
}

interface TableProps {
  data: any[];
  columns: TableColumn[];
  searchable?: boolean;
  searchPlaceholder?: string;
  emptyMessage?: string;
  onRowClick?: (row: any) => void;
  className?: string;
}

const Table: React.FC<TableProps> = ({
  data,
  columns,
  searchable = false,
  searchPlaceholder = 'Search...',
  emptyMessage = 'No data available',
  onRowClick,
  className = '',
}) => {
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAndSortedData = useMemo(() => {
    let result = [...data];

    if (searchTerm) {
      result = result.filter(row =>
        columns.some(column => {
          const value = row[column.key];
          return value?.toString().toLowerCase().includes(searchTerm.toLowerCase());
        })
      );
    }

    if (sortField) {
      result.sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];

        if (aValue === bValue) return 0;

        const comparison = aValue < bValue ? -1 : 1;
        return sortDirection === 'asc' ? comparison : -comparison;
      });
    }

    return result;
  }, [data, columns, searchTerm, sortField, sortDirection]);

  const handleSort = (columnKey: string) => {
    if (sortField === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(columnKey);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (columnKey: string) => {
    if (sortField !== columnKey) return null;
    return sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />;
  };

  return (
    <div className={`bg-white rounded-xl border border-gray-200 overflow-hidden ${className}`}>
      {searchable && (
        <div className="p-4 border-b border-gray-200">
          <Input
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search size={16} />}
          />
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${column.className || ''}`}
                >
                  {column.sortable ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort(column.key)}
                      className="!p-0 !text-xs !font-medium !text-gray-500 hover:!text-gray-700"
                      iconRight={getSortIcon(column.key)}
                    >
                      {column.label}
                    </Button>
                  ) : (
                    column.label
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAndSortedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-gray-500">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              filteredAndSortedData.map((row, index) => (
                <motion.tr
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`hover:bg-gray-50 transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 ${column.className || ''}`}
                    >
                      {column.render ? column.render(row[column.key], row, index) : row[column.key]}
                    </td>
                  ))}
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;