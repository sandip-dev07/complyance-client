import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useAuth } from "@/contexts/auth-context";

interface DataItem {
  _id: string;
  name: string;
  createdBy: { username: string } | null;
  createdAt: string;
}

interface DataTableProps {
  data: DataItem[];
  onEdit: (item: DataItem) => void;
  onDelete: (id: string) => void;
  isLoading: boolean;
}

const DataTable: React.FC<DataTableProps> = ({
  data,
  onEdit,
  onDelete,
  isLoading,
}) => {
  const { user } = useAuth();
  const isAdmin = user?.role === "Admin";

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <Table className="">
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Created By</TableHead>
            <TableHead>Created At</TableHead>
            {isAdmin && <TableHead>Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow className="" key={item._id}>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.createdBy?.username || "Unknown"}</TableCell>
              <TableCell>
                {new Date(item.createdAt).toLocaleDateString()}
              </TableCell>
              {isAdmin && (
                <TableCell className="">
                  <button
                    onClick={() => onEdit(item)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(item._id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DataTable;
