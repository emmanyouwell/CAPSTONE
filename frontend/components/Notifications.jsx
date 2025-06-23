import React, { useEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Alert,
  StyleSheet,
  FlatList,
  Modal,
  TouchableOpacity,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { deleteNotif, getUserNotifications, markAsSeen } from "../redux/actions/notifActions";

const Notifications = ({ visible, onClose }) => {
  const dispatch = useDispatch();
  const { userDetails } = useSelector((state) => state.users);
  const { notifications, message, loading, error } = useSelector(
    (state) => state.notifications
  );
  const [menuVisibleId, setMenuVisibleId] = React.useState(null);
  const formatDateWithAgo = (input) => {
    const date = new Date(input);
    const now = new Date();

    if (isNaN(date.getTime())) return "Invalid date";

    const seconds = Math.floor((now - date) / 1000);

    const pad = (n) => (n < 10 ? "0" + n : n);
    const formattedDate = `${pad(date.getMonth() + 1)}/${pad(
      date.getDate()
    )}/${date.getFullYear()}`;

    let ago = "Just now";
    if (seconds >= 1) {
      const intervals = [
        { label: "year", seconds: 31536000 },
        { label: "month", seconds: 2592000 },
        { label: "week", seconds: 604800 },
        { label: "day", seconds: 86400 },
        { label: "hour", seconds: 3600 },
        { label: "minute", seconds: 60 },
        { label: "second", seconds: 1 },
      ];

      for (const interval of intervals) {
        const count = Math.floor(seconds / interval.seconds);
        if (count >= 1) {
          ago = `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
          break;
        }
      }
    }

    return `${formattedDate} • ${ago}`;
  };

  useEffect(() => {
    if (userDetails && visible) {
      dispatch(getUserNotifications());
    }
  }, [userDetails, visible, dispatch]);

  if (error) {
    Alert.alert("Error", error);
  }

  const renderItem = ({ item }) => {
    const isUnseen = !item.seen;

    const initials = item.title
      .split(" ")
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase();

    const isMenuOpen = menuVisibleId === item._id;

    return (
      <View
        style={[styles.notificationItem, isUnseen && styles.unseenNotification]}
      >
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>

        <View style={styles.content}>
          <Text style={[styles.title, isUnseen && styles.unseenTitle]}>
            {item.title}
          </Text>
          <Text style={[styles.body, isUnseen && styles.unseenBody]}>
            {item.body}
          </Text>
          <Text style={styles.time}>{formatDateWithAgo(item.notifiedAt)}</Text>
        </View>

        <TouchableOpacity
          onPress={() => setMenuVisibleId(isMenuOpen ? null : item._id)}
        >
          <Text style={styles.menuDots}>⋮</Text>
        </TouchableOpacity>

        {isMenuOpen && (
          <View style={styles.menuOptions}>
            {!item.seen && (
              <TouchableOpacity
                onPress={() => {
                  dispatch(markAsSeen(item._id)).then(() => {
                    setMenuVisibleId(null);
                    dispatch(getUserNotifications());
                  });
                }}
              >
                <Text style={styles.menuText}>Mark as Read</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={() => {
                dispatch(deleteNotif(item._id)).then(() => {
                  setMenuVisibleId(null);
                  dispatch(getUserNotifications());
                });
              }}
            >
              <Text style={styles.menuText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>

          {loading ? (
            <ActivityIndicator
              size="large"
              color="#007bff"
              style={styles.loader}
            />
          ) : (
            <FlatList
              data={[...notifications].sort((a, b) => new Date(b.notifiedAt) - new Date(a.notifiedAt))}
              keyExtractor={(_, index) => index.toString()}
              renderItem={renderItem}
              ListEmptyComponent={
                <Text style={styles.emptyText}>
                  No notifications available.
                </Text>
              }
            />
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    height: "80%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
  },
  closeButton: {
    alignSelf: "flex-end",
    padding: 6,
  },
  closeButtonText: {
    fontSize: 16,
    color: "#76A51D",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
  },
  notificationItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#fff",
    marginBottom: 10,
    elevation: 2,
  },
  unseenNotification: {
    backgroundColor: "#e6f7ff",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#76A51D",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    color: "#fff",
    fontWeight: "bold",
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },
  body: {
    fontSize: 14,
    color: "#555",
    marginTop: 2,
  },
  time: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },
  unseenTitle: {
    fontWeight: "bold",
    color: "#000",
  },
  unseenBody: {
    fontWeight: "bold",
    color: "#333",
  },
  menuDots: {
    fontSize: 18,
    color: "#aaa",
    paddingLeft: 8,
  },
  emptyText: {
    textAlign: "center",
    color: "#999",
    marginTop: 20,
    fontSize: 16,
  },
  menuOptions: {
    position: "absolute",
    top: 40,
    right: 10,
    backgroundColor: "#fff",
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    elevation: 5,
    zIndex: 10,
  },
  menuText: {
    fontSize: 14,
    color: "#333",
    paddingVertical: 4,
  },
});

export default Notifications;