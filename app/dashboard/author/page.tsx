"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function AuthorPage() {
  const [authors, setAuthors] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [authorId, setAuthorId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const getAllAuthors = async () => {
    const accessToken = localStorage.getItem("accessToken");
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/author/getall", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const result = await response.json();
      if (response.ok) {
        setAuthors(result || []);
      } else {
        toast.error(result.message || "Failed to get authors!");
      }
    } catch (error) {
      console.error("Error during get authors:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllAuthors();
  }, []);

  const handleEdit = (author: any) => {
    setAuthorId(author.id);
    setName(author.name);
  };

  const handleDelete = async (id: number) => {
    const accessToken = localStorage.getItem("accessToken");
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3000/author/delete/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const result = await response.json();
      if (response.ok) {
        toast.success("Author deleted successfully!");
        getAllAuthors(); // Refresh authors after delete
      } else {
        toast.error(result.message || "Failed to delete author!");
      }
    } catch (error) {
      console.error("Error during delete author:", error);
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
        `http://localhost:3000/author/${
          authorId ? `update/${authorId}` : "create"
        }`,
        {
          method: authorId ? "PUT" : "POST",
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
          `Author ${authorId ? "updated" : "created"} successfully!`
        );
        getAllAuthors(); // Refresh authors after creation/update
        setName(""); // Clear the input field
        setAuthorId(null); // Reset author ID after submission
      } else {
        toast.error(
          result.message || `Author ${authorId ? "update" : "creation"} failed!`
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
            {authorId ? "Edit Author" : "Add Author"}
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
                placeholder="Enter author name"
                required
              />
            </div>
          </div>
          <div className="mt-6 text-right">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
            >
              {loading ? "Saving..." : authorId ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </div>
      <div className="flex justify-center my-10">
        <div className="w-[90%] bg-white p-16 shadow-md rounded-md">
          <h2 className="text-2xl font-bold mb-2">Author List</h2>
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
                {authors.length > 0 ? (
                  authors.map((author) => (
                    <tr key={author.id}>
                      <td className="py-2 px-4 border-b">{author.id}</td>
                      <td className="py-2 px-4 border-b">{author.name}</td>
                      <td className="py-2 px-4 border-b">
                        <button
                          onClick={() => handleEdit(author)}
                          className="px-2 py-1 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 mr-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(author.id)}
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
                      No authors available
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
