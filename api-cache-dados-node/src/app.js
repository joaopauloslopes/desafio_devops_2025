const express = require('express');
const fs = require('fs');
const redis = require('redis');

const app = express();
const PORT = 3000;

const CACHE_KEY = 'meus_dados_node';
const CACHE_TTL = 60; 
const ARQUIVO = 'dados.txt';
const CACHE_KEY_HORARIO = 'horario';
const CACHE_TTL_HORARIO = 60; 


function lerArquivo() {
  return fs.readFileSync(ARQUIVO, 'utf-8');
}

async function obterDados(client) {
  const dadosEmCache = await client.get(CACHE_KEY);

  if (dadosEmCache) {
    return dadosEmCache; //Usando early retrurn evitando a necessidade edo else.
  }

  console.log('Lido do arquivo');
  const dados = lerArquivo();
  await client.setEx(CACHE_KEY, CACHE_TTL, dados);
  return dados;
}

async function obterHorario(client) {
  const horarioEmCache = await client.get(CACHE_KEY_HORARIO);

  if (horarioEmCache) {
    return horarioEmCache; //Usando early retrurn evitando a necessidade edo else.
  }

  
  const horario = new Date().toLocaleTimeString();
  await client.setEx(CACHE_KEY_HORARIO, CACHE_TTL_HORARIO, horario);
  return horario;
}


(async () => {
  const client = redis.createClient({
  socket: {
    host: 'redis',   
    port: 6379
  }
});

  client.on('error', (err) => {
    console.error('Erro no Redis:', err);
  });

  await client.connect();

  app.get('/horario', async (req, res) => {
    try {
      const resultado = await obterHorario(client);
      res.json({ conteudo: resultado });
    } catch (err) {
      console.error('Erro ao obter dados:', err);
      res.status(500).json({ erro: 'Erro interno no servidor' });
    }
  });

app.get('/dados', async (req, res) => {
    try {
      const resultado = await obterDados(client);
      res.json({ conteudo: resultado });
    } catch (err) {
      console.error('Erro ao obter dados:', err);
      res.status(500).json({ erro: 'Erro interno no servidor' });
    }
  });


  app.listen(PORT, () => {
    console.log(`Servidor Express rodando em http://localhost:${PORT}`);
  });
})();