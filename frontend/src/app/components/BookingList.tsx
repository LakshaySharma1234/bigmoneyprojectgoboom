import { useEffect, useState } from "react";
import { api } from "../services/api";
import { BookingListItem } from "./BookingListItem";

export function BookingList({
  endpoint = "/users/me/bookings",
  emptyMessage = "You have no bookings yet.",
}) {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const bookings = await api.get(endpoint);
        setBookings(bookings);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, [endpoint]);

  if (isLoading) {
    return <div>Loading bookings...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (bookings.length === 0) {
    return <div>{emptyMessage}</div>;
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <BookingListItem key={booking.id} booking={booking} />
      ))}
    </div>
  );
}
