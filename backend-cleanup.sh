docker compose down;
docker ps -q | xargs docker rm;
docker image ls -q | xargs docker image rm;
docker volume ls -q | xargs docker volume rm;
rm -rf ./blueprint/lib/db_data;
rm -rf ./Wordpress;
docker compose up -d;
