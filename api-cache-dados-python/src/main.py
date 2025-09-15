from fastapi import FastAPI
from datetime import datetime
import redis
import time

app = FastAPI()

CACHE_KEY = "meus_dados"
CACHE_TTL = 10  
ARQUIVO = "dados.txt"
CACHE_KEY_HORARIO = "dataHora"

def ler_arquivo():
    with open(ARQUIVO, "r", encoding="utf-8") as f:
        return f.read()

def obter_dados():
    r = redis.Redis(host='redis', port=6379, db=0)

    dados_em_cache = r.get(CACHE_KEY)
    if dados_em_cache:
        return dados_em_cache.decode('utf-8')

    dados = ler_arquivo()
    r.setex(CACHE_KEY, CACHE_TTL, dados)
    return dados


def obeter_horario():
    r = redis.Redis(host='redis', port=6379, db=0)

    horario_em_cache = r.get(CACHE_KEY_HORARIO)
    if horario_em_cache:
        return horario_em_cache.decode('utf-8') ### EArly return para evitar else

    horario = datetime.now().strftime("%H:%M:%S")
    r.setex(CACHE_KEY_HORARIO, CACHE_TTL, horario)
    return horario

@app.get("/dados")
def get_dados():
    resultado_dados = obter_dados()
    return {"conteudo": resultado_dados}


@app.get("/horario")
def get_horario():
    resultado_hora = obeter_horario()
    return {"conteudo": resultado_hora}
