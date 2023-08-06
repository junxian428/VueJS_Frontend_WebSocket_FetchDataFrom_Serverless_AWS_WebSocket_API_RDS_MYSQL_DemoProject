<template>
  <div>
    <h1>WebSocket Connection Example</h1>
    <p>Status: {{ connectionStatus }}</p>
    <input v-model="message" type="text" placeholder="Type a message" />
    <button @click="sendMessage">Send Message</button>
    <ul>
      <li v-for="message in receivedMessages" :key="message">{{ message }}</li>
    </ul>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue';

export default {
  setup() {
    const connectionStatus = ref('Not connected');
    const receivedMessages = ref([]);
    const message = ref('');
    let socket = null;

    const connectWebSocket = () => {
      // Replace with your WebSocket server URL
      const serverUrl = 'wss://';
      socket = new WebSocket(serverUrl);

      socket.onopen = () => {
        connectionStatus.value = 'Connected';
      };

      socket.onmessage = (event) => {
        receivedMessages.value.push(event.data);
      };

      socket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      socket.onclose = () => {
        connectionStatus.value = 'Disconnected';
      };
    };

    const sendMessage = () => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(message.value);
        message.value = '';
      }
    };

    onMounted(() => {
      connectWebSocket();
    });

    onBeforeUnmount(() => {
      if (socket) {
        socket.close();
      }
    });

    return {
      connectionStatus,
      receivedMessages,
      message,
      sendMessage,
    };
  },
};
</script>

<style>
/* Add your CSS styles here */
</style>
