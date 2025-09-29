#! /bin/bash
set -euo pipefail

docker rmi $(docker images -a -q)
docker system prune -f

