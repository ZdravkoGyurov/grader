### Setup postgres

docker run --name grader-postgres -p 5432:5432 -e POSTGRES_PASSWORD=postgres -d postgres

### Connect to postgres

psql -h localhost -p 5432 -U postgres -d postgres
