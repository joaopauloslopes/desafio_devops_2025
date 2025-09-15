echo "Inicializando Docker Swarm..."
docker swarm init

echo "Deploy da stack..."
docker stack deploy -c docker-stack.yml desafio_devops_2025
