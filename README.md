
# Run the workonblockchain.com app locally
## Run the back end

First start MongoDB
```
mongod
```

Then run the back end
```
cd server
npm install
npm start
```

Back end API is running on localhost:4000

#### Run MongoDB from Windows
1. Create the following folder C:\data\db
2. Run command "C:\Program Files\MongoDB\Server\3.6\bin\mongod.exe" --dbpath C:\data

## Run the front end

```
cd client
npm install
npm start
```

Front end is running on localhost:4200

# Deploy the application to AWS
## Deploy the backend

1. Finish all work and commit all changes. Merge all changes for deployment to the `staging` branch.
2. Run the backend app once to check that it starts
3. Place your access key in the `scipts/access` folder
3. Deploy the backend

```
npm install
node scripts/server.js staging
```

Or

```
node scripts/server.js production
```

## Deploy the frontend