import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import twilio from 'twilio';

const app = express();
app.use(cors());
app.use(express.json());

// 👉 Supabase config
const supabaseUrl = 'https://akvkayzjcazyhytbfnbz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFrdmtheXpqY2F6eWh5dGJmbmJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMzMTM2MTgsImV4cCI6MjA1ODg4OTYxOH0.t-AsmvTGpYLWCoxxNDV6017PdlSydpRvant2WxxMFIE';
const supabase = createClient(supabaseUrl, supabaseKey);

// 👉 Twilio config
const accountSid = 'SK756351e72e0d0032c12a34f983e75a3c'; // ← SID DE CUENTA
const authToken = 'abf44a34ed57893cdda1c74553dd1ff3';     // ← Auth token real
const client = twilio(accountSid, authToken);

// ✅ Ruta POST para guardar registros
app.post('/registros', async (req, res) => {
  const { user_id, nombre, latitud, longitud, foto } = req.body;

  try {
    const { data, error } = await supabase
      .from('lugares_favoritos')
      .insert({
        user_id,
        nombre,
        latitud,
        longitud,
        foto: foto || null,
      })
      .select();

    if (error) return res.status(400).json({ error: error.message });

    res.status(200).json({ registros: data });
  } catch (e) {
    console.error('Error en POST /registros:', e);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// ✅ Ruta GET para obtener registros por usuario
app.get('/registros/:user_id', async (req, res) => {
  const { user_id } = req.params;

  try {
    const { data, error } = await supabase
      .from('lugares_favoritos')
      .select('*')
      .eq('user_id', user_id)
      .order('id', { ascending: false });

    if (error) return res.status(400).json({ error: error.message });

    res.status(200).json({ registros: data });
  } catch (e) {
    console.error('Error en GET /registros/:user_id:', e);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// ✅ Ruta POST para enviar SMS con Twilio
app.post('/enviar-sms', async (req, res) => {
  const { to, message } = req.body;

  try {
    const response = await client.messages.create({
      body: message,
      from: '+16205361380', // ← Tu número Twilio
      to,
    });

    res.status(200).json({ success: true, sid: response.sid });
  } catch (error) {
    console.error('Error al enviar SMS:', error);
    res.status(500).json({ error: error.message });
  }
});

// 🚀 Servidor en marcha
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
