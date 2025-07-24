import { useContext } from 'react';
import { NotificationContext } from '../context/NotificationProvider';

const useNotification = () => {
  const { notifications, setNotifications, isOpen, setIsOpen } = useContext(NotificationContext);

  // Notification count, close handler ইত্যাদি আপনি এখানে লিখতে পারেন

  const closeNotifications = () => setIsOpen(false);

  return {
    notifications,
    isOpen,
    openNotifications: () => setIsOpen(true),
    closeNotifications,
    setNotifications,
  };
};

export default useNotification;
