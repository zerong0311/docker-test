## Introduction
this project default run as docker-compose with ONE mysql container and ONE nodejs container.
you can easy to scale the service with stateless nodejs service with a loadbalancer  (load balancer did not provided here)


## Description
### 1. nodejs rest API
- directory : ./nodejs/
- for more details,please read ./nodejs/README.md
- Travis-CI are setup for automated test
- Travis-CI will also auto build docker image push to docker hub after the automated test passed

### 2. MYSQL Database
- directory : ./data/
- use the official mysql image,so only provide the schema here.
- MYSQL can be replaced with any other MYSQL DB instead of docker image

### 3. docker-compose
- the container management part
- linking up between database and nodejs service
- database volume ar mount to ./db/
- for more details about the nodejs environment variable setup,please read ./nodejs/README.md


## Start the project
1. modify docker-compose.yml
2. set GOOGLEMAPAPIKEY to your key
3. run `sh start.sh` in Terminal

## Stop the project
1. run `sh stop.sh` in Terminal

## Remove this project
1. run `sh stopAndRemove.sh` to remove the container and stop the service
2. remove this folder