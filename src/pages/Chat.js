import { useState, useEffect, useRef } from "react";
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot } from "firebase/firestore";
import { useUser } from "../contexts/userContext";

function Chat({ roomId }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const { user } = useUser();
  const db = getFirestore();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const messagesRef = collection(db, `rooms/${roomId}/messages`);
    const q = query(messagesRef, orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(msgs);

      // Scroll to the bottom
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    });

    return () => unsubscribe();
  }, [db, roomId]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !user) return;

    const messagesRef = collection(db, `rooms/${roomId}/messages`);
    await addDoc(messagesRef, {
      text: newMessage,
      userId: user.uid,
      username: user.displayName || "Anonymous",
      timestamp: new Date(),
    });

    setNewMessage("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && newMessage.trim()) {
      sendMessage();
    }
  };

  // Styles as objects
  const styles = {
    container: {
      position: "fixed",
      padding: "10px 15px",
      top: 78,
      right: 10,
      width: "25%",
      height: "90%",
      backgroundColor: "rgba(255, 255, 255, 0.8)",
      display: "flex",
      flexDirection: "column",
      boxShadow: "-2px 0px 5px rgba(0, 0, 0, 0.1)",
      borderRadius: "20px",
    },
    messages: {
      flex: 1,
      overflowY: "auto",
      padding: "10px",
      display: "flex",
      flexDirection: "column",
      borderRadius: "15px",
    },
    message: {
      margin: "5px 0",
      padding: "8px",
      borderRadius: "10px",
      backgroundColor: "rgba(240, 240, 240, 0.8)",
    },
    ownMessage: {
      backgroundColor: "rgba(173, 216, 230, 1)",
      alignSelf: "flex-end",
      borderRadius: "10px",
    },
    inputContainer: {
      display: "flex",
      padding: "5 15px",
      borderTop: "1px solid #ccc",
      borderBottomLeftRadius: "20px",
      borderBottomRightRadius: "20px",

      alignItems: "center",
      gap: "8px",
      height: "50px",
    },
    input: {
      flex: 1,
      border: "1px solid #ccc",
      borderRadius: "8px",
      padding: "8px",
      marginRight: "8px",
    },
    button: {
      button: {
        height: "100%",
        width: "auto",
        backgroundColor: "#000",
        color: "#fff",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        padding: "0 12px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxSizing: "border-box",
      },
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.messages}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              ...styles.message,
              ...(msg.userId === user.uid ? styles.ownMessage : {}),
            }}
          >
            <strong>{msg.username}: </strong>
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef}></div>
      </div>
      <div style={styles.inputContainer}>
        <input
          type="text"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          style={styles.input}
        />
        <button onClick={sendMessage} style={styles.button}>
          Send
        </button>
      </div>

    </div>
  );
}

export default Chat;
