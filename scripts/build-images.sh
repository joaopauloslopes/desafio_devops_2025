echo "Buld redis"
docker build -t redis_custom:1 ../redis
echo "Buld api-cache-dados-node"
docker build -t api-cache-dados-node:1 ../api-cache-dados-node
echo "Buld api-cache-dados-python"
docker build -t api-cache-dados-python:1 ../api-cache-dados-python

