import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, FONT, SIZES } from "@/constants/theme";

const AIChatScreen = () => {
  const [messages, setMessages] = useState([
    { id: "1", text: "Hello! How can I assist you today?", sender: "bot" },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (input.trim()) {
      const userMessage = { id: Date.now().toString(), text: input, sender: "user" };
      setMessages((prev) => [...prev, userMessage]);
      setInput("");

      // Simulate AI response (Replace with API call later)
      setTimeout(() => {
        const botResponse = {
          id: Date.now().toString() + "bot",
          text: "I'm still learning. How can I help?",
          sender: "bot",
        };
        setMessages((prev) => [...prev, botResponse]);
      }, 1000);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={[
              styles.message,
              item.sender === "user" ? styles.userMessage : styles.botMessage,
            ]}
          >
            <Text style={styles.messageText}>{item.text}</Text>
          </View>
        )}
        contentContainerStyle={styles.chatContainer}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={input}
          onChangeText={setInput}
        />
        <TouchableOpacity onPress={sendMessage}>
          <Ionicons name="send" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: SIZES.medium },
  chatContainer: { paddingBottom: SIZES.large },
  message: { padding: SIZES.medium, borderRadius: SIZES.small, marginVertical: 5, maxWidth: "80%" },
  userMessage: { alignSelf: "flex-end", backgroundColor: COLORS.primary },
  botMessage: { alignSelf: "flex-start", backgroundColor: COLORS.gray300 },
  messageText: { fontFamily: FONT.regular, fontSize: SIZES.medium, color: COLORS.white },
  inputContainer: { flexDirection: "row", alignItems: "center", padding: SIZES.medium, borderTopWidth: 1, borderColor: COLORS.gray200 },
  input: { flex: 1, fontSize: SIZES.medium, padding: SIZES.small, backgroundColor: COLORS.gray100, borderRadius: SIZES.small, marginRight: SIZES.small },
});

export default AIChatScreen;
