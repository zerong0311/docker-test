## Introduction
this project split to three parts
1. nodejs rest API
2. MYSQL Database
3. docker-compose


## Description
### 1. nodejs rest API
- directory : ./nodejs/
- for more details,please read ./nodejs/README.md
- Travis-CI are setup for automated test
- Travis-CI will also auto build docker image push to docker hub after the automated test passed

### 2. MYSQL Database
- directory : ./data/
- this part only provide DATABASE STRUCTURE AND Data
- MYSQL can be replaced with any other MYSQL DB instead of docker image

### 3. docker-compose
- the container management part
- linking up database and service
- database volume ar mount to ./db/


## Start the project
1. modify docker-compose.yml
2. set GOOGLEMAPAPIKEY to your key
3. run `sh start.sh` in Terminal


