// enviar-sms.js
const express = require('express');
const cors = require('cors');
const twilio = require('twilio');

const app = express();
app.use(cors());
app.use(express.json());

const accountSid = 'AC35a1bff5af76f45fea4f1e52154e78d3'; // <<--- USA el SID DE CUENTA, no el SK
const authToken = 'abf44a34ed57893cdda1c74553dd1ff3';    // <<--- Auth Token real
const client = twilio(accountSid, authToken);

app.post('/enviar-sms', async (req, res) => {
  const { to, message } = req.body;

  try {
    const response = await client.messages.create({
      body: message,
      from: '+16205361380', // tu número de Twilio
      to,
    });

    res.status(200).json({ success: true, sid: response.sid });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ API corriendo en puerto ${PORT}`));
