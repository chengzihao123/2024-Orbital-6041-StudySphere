"use client";
import React, { useEffect, useState } from &aposreact&apos;
import { collection, query, where, onSnapshot, updateDoc, doc } from &aposfirebase/firestore&apos;
import { firestore } from &apos../../../firebase/firebase&apos;
import { useAuth } from &apos../../components/Auth/AuthContext&apos;
import { FaCheckCircle, FaRegCircle } from &aposreact-icons/fa&apos;

interface Notification {
  id: string;
  message: string;
  read: boolean;
  timestamp: any;
}

const AllNotifications: React.FC = () => {
  const { currentUser } = useAuth() || {};
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const notificationsPerPage = 10;

  useEffect(() => {
    if (!currentUser) return;

    const notificationsCollection = collection(firestore, &aposnotifications&apos);
    const q = query(
      notificationsCollection,
      where(&aposuserId&apos, &apos==&apos, currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedNotifications = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      } as Notification));

      // sort by timestamp in descending order
      const sortedNotifications = fetchedNotifications.sort((a, b) => b.timestamp.toDate() - a.timestamp.toDate());

      setNotifications(sortedNotifications);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const markAsRead = async (id: string) => {
    const notificationRef = doc(firestore, &aposnotifications&apos, id);
    await updateDoc(notificationRef, { read: true });
  };

  const totalPages = Math.ceil(notifications.length / notificationsPerPage);
  const currentNotifications = notifications.slice(
    (currentPage - 1) * notificationsPerPage,
    currentPage * notificationsPerPage
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-lg font-bold mb-4">All Notifications</h2>
      {notifications.length > 0 ? (
        <>
          <ul className="space-y-2">
            {currentNotifications.map((notification) => (
              <li key={notification.id} className={`p-2 rounded flex items-center ${notification.read ? &aposbg-gray-100&apos : &aposbg-green-300&apos}`}>
                <button
                  className={`mr-2 ${notification.read ? &apostext-gray-400&apos : &apostext-green-600&apos}`}
                  onClick={() => markAsRead(notification.id)}
                  title={notification.read ? "Marked as read" : "Mark as read"}
                >
                  {notification.read ? <FaCheckCircle size={20} /> : <FaRegCircle size={20} />}
                </button>
                {notification.message}
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-center items-center space-x-2">
            {currentPage > 1 && (
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                className="px-3 py-1 bg-gray-300 rounded-lg"
              >
                Previous
              </button>
            )}
            <span>
              Page {currentPage} of {totalPages}
            </span>
            {currentPage < totalPages && (
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                className="px-3 py-1 bg-gray-300 rounded-lg"
              >
                Next
              </button>
            )}
          </div>
        </>
      ) : (
        <p className="text-gray-500">No notifications.</p>
      )}
    </div>
  );
};

export default AllNotifications;
