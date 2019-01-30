#To create migration:
1. Add new migration file (copy 20181025-terms-and-conditions.js and use same naming conventions)
2. Write an up and down script

#To run up migration
            export NODE_ENV=migrate
            export MONGO_CONNECTION_STRING=...
            node migrations/files/migrate.js 20181025-terms-and-conditions.js up

#To run down migration
            export NODE_ENV=migrate
            export MONGO_CONNECTION_STRING=...
            node migrations/files/migrate.js 20181025-terms-and-conditions.js down