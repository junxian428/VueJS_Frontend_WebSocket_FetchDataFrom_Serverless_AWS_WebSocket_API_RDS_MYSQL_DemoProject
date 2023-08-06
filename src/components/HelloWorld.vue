<template>
  <div>
    <h1>Sterilizer SCADA</h1>
    <p>Status: {{ connectionStatus }}</p>
    <p v-if="countdown > 0" class="countdown">Refresh Timer : {{ countdown }}</p>

    <input v-model="message" type="text" placeholder="Type a message" />
    <button @click="sendMessage">Update Manually</button>
    <ul>
      <li v-for="message in receivedMessages" :key="message">{{ message }}</li>
    </ul>
    <div class="image-container">
 
    <img src="/SCADA.jpg" alt="My Image" />
    <div class="data-display">
      <table class="center-table border-table">
        <tr>
          <th>ID</th>
          <th>Device</th>
          <th>Temp</th>
          <th>Pressure</th>
          <th>Amp</th>
          <th>Status</th>
          <th>Valve 1</th>
          <th>Valve 1 Status</th>
          <th>Valve 2</th>
          <th>Valve 2 Status</th>
          <th>Valve 3</th>
          <th>Valve 3 Status</th>
          <th>Timer 1</th>
          <th>Timer 2</th>
        </tr>
        <tr>
          <td>{{ id }}</td>
          <td>{{ device }}</td>
          <td>{{ temp }}</td>
          <td>{{ pressure }}</td>
          <td>{{ amp }}</td>
          <td>{{ status }}</td>
          <td>{{ valve1 }}</td>
          <td>{{ valve1_status }}</td>
          <td>{{ valve2 }}</td>
          <td>{{ valve2_status }}</td>
          <td>{{ valve3 }}</td>
          <td>{{ valve3_status }}</td>
          <td>{{ timer1 }}</td>
          <td>{{ timer2 }}</td>
        </tr>
      </table>
      <!-- Add more properties here -->
    </div>


</div>





  </div>
</template>

<script>
//[{"id":12,"device":"PLC CP1E","Temp":25.5,"pressure":1013.25,"amp":5.55,"status":"Ok","valve1":"OMRON","valve1_status":"IOT","valve2":"OMRON","valve2_status":"OMRON","valve3":"OMRON","valve3_status":"OMRON","timer1":"OMRON","timer2":"OMRON"}]
import { ref, onMounted, onBeforeUnmount } from 'vue';

export default {
  setup() {
    const connectionStatus = ref('Not connected');
    const receivedMessages = ref([]);
    const message = ref('');
    const status = ref('');
    const id = ref('');
    const device = ref('');
    const temp = ref('');
    const pressure = ref('');
    const amp = ref('');
    const valve1 = ref('');
    const valve1_status = ref('');
    const valve2 = ref('');
    const valve2_status = ref('');
    const valve3 = ref('');
    const valve3_status = ref('');
    const timer1 = ref('');
    const timer2 = ref('');
    let socket = null;


    const countdown = ref(0);


    let countdownInterval;

    const startSendingMessages = () => {
      countdown.value = 10;

      countdownInterval = setInterval(() => {
        countdown.value--;
        if (countdown.value === 0) {
          sendMessage();
          countdown.value = 10;
        }
      }, 1000);
    };

    const connectWebSocket = () => {
      // Replace with your WebSocket server URL
      const serverUrl = 'wss://';
      socket = new WebSocket(serverUrl);

      socket.onopen = () => {
        connectionStatus.value = 'Connected';
      };

      socket.onmessage = (event) => {
        console.log(event.data);
        const jsonData = event.data;
        const dataArray = JSON.parse(jsonData);

        if (dataArray.length > 0) {
          const dataObject = dataArray[0];
          id.value = dataObject.id;
          device.value = dataObject.device;
          temp.value = dataObject.Temp;
          pressure.value = dataObject.pressure;
          amp.value = dataObject.amp;
          status.value = dataObject.status;
          valve1.value = dataObject.valve1;
          valve1_status.value = dataObject.valve1_status;
          valve2.value = dataObject.valve2;
          valve2_status.value = dataObject.valve2_status;
          valve3.value = dataObject.valve3;
          valve3_status.value = dataObject.valve3_status;
          timer1.value = dataObject.timer1;
          timer2.value = dataObject.timer2;
        }

        //receivedMessages.value.push(event.data);
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
      startSendingMessages(); // Start countdown automatically when component is mounted

    });

    onBeforeUnmount(() => {
      clearInterval(countdownInterval);

      if (socket) {
        socket.close();
      }
    });

    return {
      startSendingMessages,
      countdown,
      connectionStatus,
      receivedMessages,
      message,
      sendMessage,
      status,
      id,
      device,
      temp,
      pressure,
      amp,
      valve1,
      valve1_status,
      valve2,
      valve2_status,
      valve3,
      valve3_status,
      timer1,
      timer2,
     
    };
  },
};
</script>

<style>

.countdown {
  font-size: 24px;
  font-weight: bold;
  color: red;
  animation: countdown-animation 1s linear infinite;
}

@keyframes countdown-animation {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

/* Add your CSS styles here */
.image-container {
  position: relative;
}

.overlay-text {
  position: absolute;
  top: 50%; /* Adjust to vertically center the text */
  left: 50%; /* Adjust to horizontally center the text */
  transform: translate(-50%, -50%);
  font-size: 24px; /* Adjust as needed */
  font-weight: bold;
  color: red; /* Adjust the text color */
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.6); /* Add a text shadow for better visibility */
}

.center-table {
  margin: auto;
}

.border-table {
  border-collapse: collapse;
  border: 1px solid black;
}

.data-display th,
.data-display td {
  padding: 8px;
  text-align: center;
  border: 1px solid black;
}
</style>
