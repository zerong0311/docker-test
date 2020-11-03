# NPM command
### `npm run test`
- run the unittest & integration test with mocha & supertest

### `npm run dev`
- run the app with environment set in command / as default

### `npm run start`
- officially start command for dockerImage,
- environment variable should be set in Docker-Compose/Docker Container


# Environment Variable
## MUST
### `process.env.DBHOST`
- the database host address

### `process.env.DBNAME`
- the database name

### `process.env.DBUSER`
- database user

### `process.env.DBPASSWORD`
- database user's password

### `process.env.GOOGLEMAPAPIKEY `
- key of google map api

## (OPTIONAL)
### `process.env.PORT`
- nodejs express listening port , default is 8080