"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function BookPage() {
  const [books, setBooks] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [publicationDate, setPublicationDate] = useState("");
  const [isbn, setIsbn] = useState("");
  const [pages, setPages] = useState<number | null>(null);
  const [category, setCategory] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [bookId, setBookId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const getAllBooks = async () => {
    const accessToken = localStorage.getItem("accessToken");
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/book/getall", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const result = await response.json();
      if (response.ok) {
        setBooks(result || []);
      } else {
        toast.error(result.message || "Failed to get books!");
      }
    } catch (error) {
      console.error("Error during get books:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllBooks();
  }, []);

  const handleEdit = (book: any) => {
    setBookId(book.id);
    setTitle(book.title);
    setPublicationDate(book.publicationDate);
    setIsbn(book.isbn);
    setPages(book.pages);
    setCategory(book.category);
    setAuthor(book.author);
    setDescription(book.description);
  };

  const handleDelete = async (id: number) => {
    const accessToken = localStorage.getItem("accessToken");
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/book/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const result = await response.json();
      if (response.ok) {
        toast.success("Book deleted successfully!");
        getAllBooks(); // Refresh books after delete
      } else {
        toast.error(result.message || "Failed to delete book!");
      }
    } catch (error) {
      console.error("Error during delete book:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !title ||
      !publicationDate ||
      !isbn ||
      !pages ||
      !category ||
      !author ||
      !description
    ) {
      toast.error("All fields are required!");
      return;
    }
    const accessToken = localStorage.getItem("accessToken");
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3000/book/${bookId ? `update/${bookId}` : "create"}`,
        {
          method: bookId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            title,
            publicationDate,
            isbn,
            pages,
            category,
            author,
            description,
          }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        toast.success(`Book ${bookId ? "updated" : "created"} successfully!`);
        getAllBooks(); // Refresh books after creation/update
        setTitle(""); // Clear the input fields
        setPublicationDate("");
        setIsbn("");
        setPages(null);
        setCategory("");
        setAuthor("");
        setDescription("");
        setBookId(null); // Reset book ID after submission
      } else {
        toast.error(
          result.message || `Book ${bookId ? "update" : "creation"} failed!`
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
            {bookId ? "Edit Book" : "Add Book"}
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {/* Title */}
            <div className="col-span-2">
              <label
                className="block mb-2 text-sm font-medium text-gray-700"
                htmlFor="title"
              >
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded-md"
                placeholder="Enter book title"
                required
              />
            </div>

            {/* Publication Date */}
            <div>
              <label
                className="block mb-2 text-sm font-medium text-gray-700"
                htmlFor="publicationDate"
              >
                Publication Date
              </label>
              <input
                type="date"
                id="publicationDate"
                name="publicationDate"
                value={publicationDate}
                onChange={(e) => setPublicationDate(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded-md"
                required
              />
            </div>

            {/* ISBN */}
            <div>
              <label
                className="block mb-2 text-sm font-medium text-gray-700"
                htmlFor="isbn"
              >
                ISBN
              </label>
              <input
                type="number"
                id="isbn"
                name="isbn"
                value={isbn}
                onChange={(e) => setIsbn(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded-md"
                placeholder="Enter ISBN number"
                required
              />
            </div>

            {/* Pages */}
            <div>
              <label
                className="block mb-2 text-sm font-medium text-gray-700"
                htmlFor="pages"
              >
                Pages
              </label>
              <input
                type="number"
                id="pages"
                name="pages"
                value={pages || ""}
                onChange={(e) => setPages(Number(e.target.value))}
                className="w-full border border-gray-300 p-2 rounded-md"
                placeholder="Enter total pages"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label
                className="block mb-2 text-sm font-medium text-gray-700"
                htmlFor="category"
              >
                Category
              </label>
              <select
                id="category"
                name="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded-md"
                required
              >
                <option value="">Select Category</option>
                {/* Dynamically populate these options */}
                <option value="1">Fiction</option>
                <option value="2">Non-Fiction</option>
              </select>
            </div>

            {/* Author */}
            <div>
              <label
                className="block mb-2 text-sm font-medium text-gray-700"
                htmlFor="author"
              >
                Author
              </label>
              <select
                id="author"
                name="author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded-md"
                required
              >
                <option value="">Select Author</option>
                {/* Dynamically populate these options */}
                <option value="1">Author A</option>
                <option value="2">Author B</option>
              </select>
            </div>

            {/* Description */}
            <div className="col-span-2">
              <label
                className="block mb-2 text-sm font-medium text-gray-700"
                htmlFor="description"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded-md"
                placeholder="Enter a brief description of the book"
                rows={4}
                required
              ></textarea>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-6 text-right">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
            >
              {loading ? "Saving..." : bookId ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </div>

      <div className="flex justify-center my-10">
        <div className="w-[90%] bg-white p-16 shadow-md rounded-md">
          <h2 className="text-2xl font-bold mb-2">Book List</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">ID</th>
                  <th className="py-2 px-4 border-b">Title</th>
                  <th className="py-2 px-4 border-b">Publication Date</th>
                  <th className="py-2 px-4 border-b">ISBN</th>
                  <th className="py-2 px-4 border-b">Pages</th>
                  <th className="py-2 px-4 border-b">Category</th>
                  <th className="py-2 px-4 border-b">Author</th>
                  <th className="py-2 px-4 border-b">Description</th>
                  <th className="py-2 px-4 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {books.length > 0 ? (
                  books.map((book) => (
                    <tr key={book.id}>
                      <td className="py-2 px-4 border-b">{book.id}</td>
                      <td className="py-2 px-4 border-b">{book.title}</td>
                      <td className="py-2 px-4 border-b">
                        {book.publicationDate}
                      </td>
                      <td className="py-2 px-4 border-b">{book.isbn}</td>
                      <td className="py-2 px-4 border-b">{book.pages}</td>
                      <td className="py-2 px-4 border-b">{book.category}</td>
                      <td className="py-2 px-4 border-b">{book.author}</td>
                      <td className="py-2 px-4 border-b">{book.description}</td>
                      <td className="py-2 px-4 border-b">
                        <button
                          onClick={() => handleEdit(book)}
                          className="px-2 py-1 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 mr-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(book.id)}
                          className="px-2 py-1 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="py-2 px-4 border-b text-center">
                      No books available
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
