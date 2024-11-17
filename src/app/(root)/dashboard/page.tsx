import { useAuth } from "@/contexts/auth-context";
import api from "@/utils/services/api";
import { useState, useEffect, FormEvent } from "react";
import DataTable from "../_components/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface DataItem {
  _id: string;
  name: string;
  createdBy: { username: string } | null;
  createdAt: string;
}

const Dashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState<DataItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [editingItem, setEditingItem] = useState<DataItem | null>(null);
  const [newItemName, setNewItemName] = useState<string>("");

  const fetchData = async () => {
    try {
      const response = await api.get("/data");
      setData(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Failed to fetch data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user?.country]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await api.put(`/data/${editingItem._id}`, { name: newItemName });
      } else {
        await api.post("/data", { name: newItemName });
      }
      setNewItemName("");
      setEditingItem(null);
      fetchData();
    } catch (error) {
      console.error("Error saving data:", error);
      alert("Failed to save data");
    }
  };

  const handleEdit = (item: DataItem) => {
    setEditingItem(item);
    setNewItemName(item.name);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      await api.delete(`/data/${id}`);
      fetchData();
    } catch (error) {
      console.error("Error deleting data:", error);
      alert("Failed to delete data");
    }
  };

  const isAdmin = user?.role === "Admin";

  return (
    <div className="space-y-6">
      {isAdmin && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow"
        >
          <div className="flex items-center space-x-4">
            <Input
              type="text"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              placeholder="Enter name"
              required
            />
            <Button type="submit">{editingItem ? "Update" : "Add"} Item</Button>
            {editingItem && (
              <Button
                type="button"
                onClick={() => {
                  setEditingItem(null);
                  setNewItemName("");
                }}
                variant={"ghost"}
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      )}

      <DataTable
        data={data}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isLoading}
      />
    </div>
  );
};

export default Dashboard;
