docker compose down;
docker ps -q | xargs docker ps -a;
docker image ls -q | xargs docker image rm;
docker volume ls -q | xargs docker volume rm;
rm -rf ./blueprint/lib/db_data;
docker compose up -d;
