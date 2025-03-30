import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';

const app = express();
app.use(cors());
app.use(express.json());

const supabaseUrl = 'https://akvkayzjcazyhytbfnbz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFrdmtheXpqY2F6eWh5dGJmbmJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMzMTM2MTgsImV4cCI6MjA1ODg4OTYxOH0.t-AsmvTGpYLWCoxxNDV6017PdlSydpRvant2WxxMFIE';
const supabase = createClient(supabaseUrl, supabaseKey);

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
        foto: foto || null, // Si no se envía foto, se inserta null
      })
      .select();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(200).json({ registros: data });
  } catch (e) {
    console.error('Error en POST /registros:', e);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.get('/registros/:user_id', async (req, res) => {
  const { user_id } = req.params;
  
  try {
    const { data, error } = await supabase
      .from('lugares_favoritos')
      .select('*')
      .eq('user_id', user_id)
      .order('id', { ascending: false });
      
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    
    res.status(200).json({ registros: data });
  } catch (e) {
    console.error('Error en GET /registros/:user_id:', e);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
