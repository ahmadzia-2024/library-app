"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function FinePaymentPage() {
  const [finePayments, setFinePayments] = useState<any[]>([]);
  const [reservation, setReservation] = useState("");
  const [amount, setAmount] = useState("");
  const [finePaymentId, setFinePaymentId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const getAllFinePayments = async () => {
    const accessToken = localStorage.getItem("accessToken");
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/finePayment/getall", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const result = await response.json();
      if (response.ok) {
        setFinePayments(result.data || []);
      } else {
        toast.error(result.message || "Failed to get fine payments!");
      }
    } catch (error) {
      console.error("Error during get fine payments:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllFinePayments();
  }, []);

  const handleEdit = (finePayment: any) => {
    setFinePaymentId(finePayment.id);
    setReservation(finePayment.reservation);
    setAmount(finePayment.amount);
  };

  const handleDelete = async (id: number) => {
    const accessToken = localStorage.getItem("accessToken");
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3000/finePayment/delete/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const result = await response.json();
      if (response.ok) {
        toast.success("Fine payment deleted successfully!");
        getAllFinePayments(); // Refresh fine payments after delete
      } else {
        toast.error(result.message || "Failed to delete fine payment!");
      }
    } catch (error) {
      console.error("Error during delete fine payment:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reservation || !amount) {
      toast.error("All fields are required!");
      return;
    }
    const accessToken = localStorage.getItem("accessToken");
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3000/finePayment/${
          finePaymentId ? `update/${finePaymentId}` : "create"
        }`,
        {
          method: finePaymentId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ reservation, amount }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        toast.success(
          `Fine payment ${finePaymentId ? "updated" : "created"} successfully!`
        );
        getAllFinePayments(); // Refresh fine payments after creation/update
        setReservation(""); // Clear the input fields
        setAmount("");
        setFinePaymentId(null); // Reset fine payment ID after submission
      } else {
        toast.error(
          result.message ||
            `Fine payment ${finePaymentId ? "update" : "creation"} failed!`
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
            {finePaymentId ? "Edit Fine Payment" : "Add Fine Payment"}
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {/* Reservation */}
            <div className="col-span-2">
              <label
                className="block mb-2 text-sm font-medium text-gray-700"
                htmlFor="reservation"
              >
                Reservation
              </label>
              <select
                id="reservation"
                name="reservation"
                value={reservation}
                onChange={(e) => setReservation(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded-md"
                required
              >
                <option value="">Select Reservation</option>
                {/* Dynamically populate these options */}
                <option value="1">Reservation A</option>
                <option value="2">Reservation B</option>
              </select>
            </div>

            {/* Amount */}
            <div>
              <label
                className="block mb-2 text-sm font-medium text-gray-700"
                htmlFor="amount"
              >
                Amount
              </label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                step="0.01"
                className="w-full border border-gray-300 p-2 rounded-md"
                placeholder="Enter fine amount"
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
              {loading ? "Saving..." : finePaymentId ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </div>
      <div className="flex justify-center my-10">
        <div className="w-[90%] bg-white p-16 shadow-md rounded-md">
          <h2 className="text-2xl font-bold mb-2">Fine Payment List</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">ID</th>
                  <th className="py-2 px-4 border-b">Reservation</th>
                  <th className="py-2 px-4 border-b">Amount</th>
                  <th className="py-2 px-4 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {finePayments.length > 0 ? (
                  finePayments.map((finePayment) => (
                    <tr key={finePayment.id}>
                      <td className="py-2 px-4 border-b">{finePayment.id}</td>
                      <td className="py-2 px-4 border-b">
                        {finePayment.reservation}
                      </td>
                      <td className="py-2 px-4 border-b">
                        {finePayment.amount}
                      </td>
                      <td className="py-2 px-4 border-b">
                        <button
                          onClick={() => handleEdit(finePayment)}
                          className="px-2 py-1 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 mr-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(finePayment.id)}
                          className="px-2 py-1 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-2 px-4 border-b text-center">
                      No fine payments available
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
