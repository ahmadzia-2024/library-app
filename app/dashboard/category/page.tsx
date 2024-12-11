"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function CategoryPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const getAllCategories = async () => {
    const accessToken = localStorage.getItem("accessToken");
    setLoading(true);
    try {
      const response = await fetch(
        "http://localhost:3000/bookcategory/getall",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const result = await response.json();
      if (response.ok) {
        setCategories(result || []);
      } else {
        toast.error(result.message || "Failed to get categories!");
      }
    } catch (error) {
      console.error("Error during get categories:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllCategories();
  }, []);

  const handleEdit = (category: any) => {
    setCategoryId(category.id);
    setName(category.name);
  };

  const handleDelete = async (id: number) => {
    const accessToken = localStorage.getItem("accessToken");
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3000/bookcategory/delete/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const result = await response.json();
      if (response.ok) {
        toast.success("Category deleted successfully!");
        getAllCategories(); // Refresh categories after delete
      } else {
        toast.error(result.message || "Failed to delete category!");
      }
    } catch (error) {
      console.error("Error during delete category:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      toast.error("Name is required!");
      return;
    }
    const accessToken = localStorage.getItem("accessToken");
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3000/bookcategory/${
          categoryId ? `update/${categoryId}` : "create"
        }`,
        {
          method: categoryId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ name }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        toast.success(
          `Book Category ${categoryId ? "updated" : "created"} successfully!`
        );
        getAllCategories(); // Refresh categories after creation/update
        setName(""); // Clear the input field
        setCategoryId(null); // Reset category ID after submission
      } else {
        toast.error(
          result.message ||
            `Book Category ${categoryId ? "update" : "creation"} failed!`
        );
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-center">
        <form
          className="w-[90%] bg-white p-6 shadow-md rounded-md"
          onSubmit={handleSubmit}
        >
          <h2 className="text-2xl font-bold mb-6">
            {categoryId ? "Edit Category" : "Add Category"}
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label
                className="block mb-2 text-sm font-medium text-gray-700"
                htmlFor="name"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded-md"
                placeholder="Enter category name"
                required
              />
            </div>
          </div>
          <div className="mt-6 text-right">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
            >
              {loading ? "Saving..." : categoryId ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </div>
      <div className="flex justify-center my-10">
        <div className="w-[90%] bg-white p-16 shadow-md rounded-md">
          <h2 className="text-2xl font-bold mb-2">Category List</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">ID</th>
                  <th className="py-2 px-4 border-b">Name</th>
                  <th className="py-2 px-4 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <tr key={category.id}>
                      <td className="py-2 px-4 border-b">{category.id}</td>
                      <td className="py-2 px-4 border-b">{category.name}</td>
                      <td className="py-2 px-4 border-b">
                        <button
                          onClick={() => handleEdit(category)}
                          className="px-2 py-1 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 mr-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(category.id)}
                          className="px-2 py-1 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="py-2 px-4 border-b text-center">
                      No categories available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
