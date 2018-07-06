
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
