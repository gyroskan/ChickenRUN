# ChickenRUN
A Nodejs API to create chicken and farmyard

## Usage

### Docker-compose

```sh
git clone https://github.com/gyroskan/ChickenRUN  
cd ChickenRUN && docker-compose up -d
```

The api is available on prot 8080 by default.

### Node

```sh
git clone https://github.com/gyroskan/ChickenRUN  
cd ChickenRUN  
node .
```

Do not forget to provide the following environment variables
- DB_HOST
- PORT
- DB_USER
- DB_PWD
- DB_NAME

## Documentation

A swagger documentation is available on the endpoint /docs of the API.
