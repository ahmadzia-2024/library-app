"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function ReservationPage() {
  const [reservations, setReservations] = useState<any[]>([]);
  const [user, setUser] = useState("");
  const [book, setBook] = useState("");
  const [status, setStatus] = useState("PENDING");
  const [checkoutDate, setCheckoutDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [reservationId, setReservationId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const getAllReservations = async () => {
    const accessToken = localStorage.getItem("accessToken");
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/reservation/getall", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const result = await response.json();
      if (response.ok) {
        setReservations(result.data || []);
      } else {
        toast.error(result.message || "Failed to get reservations!");
      }
    } catch (error) {
      console.error("Error during get reservations:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllReservations();
  }, []);

  const handleEdit = (reservation: any) => {
    setReservationId(reservation.id);
    setUser(reservation.user);
    setBook(reservation.book);
    setStatus(reservation.status);
    setCheckoutDate(reservation.checkoutDate);
    setDueDate(reservation.dueDate);
  };

  const handleDelete = async (id: number) => {
    const accessToken = localStorage.getItem("accessToken");
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3000/reservation/delete/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const result = await response.json();
      if (response.ok) {
        toast.success("Reservation deleted successfully!");
        getAllReservations(); // Refresh reservations after delete
      } else {
        toast.error(result.message || "Failed to delete reservation!");
      }
    } catch (error) {
      console.error("Error during delete reservation:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !book || !status || !checkoutDate || !dueDate) {
      toast.error("All fields are required!");
      return;
    }
    const accessToken = localStorage.getItem("accessToken");
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3000/reservation/${
          reservationId ? `update/${reservationId}` : "create"
        }`,
        {
          method: reservationId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ user, book, status, checkoutDate, dueDate }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        toast.success(
          `Reservation ${reservationId ? "updated" : "created"} successfully!`
        );
        getAllReservations(); // Refresh reservations after creation/update
        setUser(""); // Clear the input fields
        setBook("");
        setStatus("PENDING");
        setCheckoutDate("");
        setDueDate("");
        setReservationId(null); // Reset reservation ID after submission
      } else {
        toast.error(
          result.message ||
            `Reservation ${reservationId ? "update" : "creation"} failed!`
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
            {reservationId ? "Edit Reservation" : "Add Reservation"}
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {/* User */}
            <div>
              <label
                className="block mb-2 text-sm font-medium text-gray-700"
                htmlFor="user"
              >
                User
              </label>
              <select
                id="user"
                name="user"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded-md"
                required
              >
                <option value="">Select User</option>
                {/* Dynamically populate these options */}
                <option value="1">User A</option>
                <option value="2">User B</option>
              </select>
            </div>

            {/* Book */}
            <div>
              <label
                className="block mb-2 text-sm font-medium text-gray-700"
                htmlFor="book"
              >
                Book
              </label>
              <select
                id="book"
                name="book"
                value={book}
                onChange={(e) => setBook(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded-md"
                required
              >
                <option value="">Select Book</option>
                {/* Dynamically populate these options */}
                <option value="1">Book A</option>
                <option value="2">Book B</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label
                className="block mb-2 text-sm font-medium text-gray-700"
                htmlFor="status"
              >
                Status
              </label>
              <select
                id="status"
                name="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded-md"
                required
              >
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>

            {/* Checkout Date */}
            <div>
              <label
                className="block mb-2 text-sm font-medium text-gray-700"
                htmlFor="checkoutDate"
              >
                Checkout Date
              </label>
              <input
                type="datetime-local"
                id="checkoutDate"
                name="checkoutDate"
                value={checkoutDate}
                onChange={(e) => setCheckoutDate(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded-md"
                required
              />
            </div>

            {/* Due Date */}
            <div>
              <label
                className="block mb-2 text-sm font-medium text-gray-700"
                htmlFor="dueDate"
              >
                Due Date
              </label>
              <input
                type="datetime-local"
                id="dueDate"
                name="dueDate"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded-md"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-6 text-right">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
            >
              {loading ? "Saving..." : reservationId ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </div>
      <div className="flex justify-center my-10">
        <div className="w-[90%] bg-white p-16 shadow-md rounded-md">
          <h2 className="text-2xl font-bold mb-2">Reservation List</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">ID</th>
                  <th className="py-2 px-4 border-b">User</th>
                  <th className="py-2 px-4 border-b">Book</th>
                  <th className="py-2 px-4 border-b">Status</th>
                  <th className="py-2 px-4 border-b">Checkout Date</th>
                  <th className="py-2 px-4 border-b">Due Date</th>
                  <th className="py-2 px-4 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reservations.length > 0 ? (
                  reservations.map((reservation) => (
                    <tr key={reservation.id}>
                      <td className="py-2 px-4 border-b">{reservation.id}</td>
                      <td className="py-2 px-4 border-b">{reservation.user}</td>
                      <td className="py-2 px-4 border-b">{reservation.book}</td>
                      <td className="py-2 px-4 border-b">
                        {reservation.status}
                      </td>
                      <td className="py-2 px-4 border-b">
                        {reservation.checkoutDate}
                      </td>
                      <td className="py-2 px-4 border-b">
                        {reservation.dueDate}
                      </td>
                      <td className="py-2 px-4 border-b">
                        <button
                          onClick={() => handleEdit(reservation)}
                          className="px-2 py-1 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 mr-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(reservation.id)}
                          className="px-2 py-1 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-2 px-4 border-b text-center">
                      No reservations available
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
