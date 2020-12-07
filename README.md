# workonblockchain.com

This MEAN stack application runs a candidate-based recruitment platform. Companies apply to candidates based on their profiles. (e.g. same model as [hired.com](https://hired.com)).

Please see following article for more information:
[https://medium.com/link](https://medium.com/link)

This software contains:
- Angular front-end application
- Custom component library
- Server Side Rendering of Angular application
- RESTful nodejs-express API with Mongoose API validations and Mongoose for database control
- Database migration examples
- Database sanitization, CORS and other security features
- Error handling, authorization and other middleware
- Mocha unit test suite for API
- Logger and file storage using AWS S3
- Email service using Sendgrid API
- Cron service for email reminders and synchronization with Sendgrid and Zoho contacts
- CI/CD script using Bitbucket pipelines to deploy to AWS Elastic Beanstalk and AWS Lambda for staging and master branch

## Acknowledgements
### WOB team

- [Antonio Sabado](https://www.linkedin.com/in/antonio-sabado-97150511b) - Product vision
- [Jack Tanner](https://www.linkedin.com/in/jack-tanner) - Product owner (hands on)
### [Mwan Mobile](https://www.mwanmobile.com) development agency team

- [Andreas Tsindos](https://www.linkedin.com/in/andreas-tsindos-1174421) - Company director
- [Asad Mahmood](https://www.linkedin.com/in/asad117) - SCRUM master
- [Sadia Abbas](https://www.linkedin.com/in/sadia-abbas-437a20124) - Full-stack tech lead
- [Tayyab Hussain](https://www.linkedin.com/in/tayyab-hussain-6117bab6) - Full-stack developer

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
3. Ensure that all commits are pushed to bitbucket
4. Place your access key in the `scipts/access` folder
5. Deploy the backend

```
npm install
node scripts/server.js staging
```

Or

```
node scripts/server.js production
```

You can check what version is currently deployed by going to the api url. eg
https://staging-api.workonblockchain.com/

## Deploy the frontend
1. Finish all work and commit all changes. Merge all changes for deployment to the `staging` branch.
2. Run the backend app once to check that it starts
3. Ensure that all commits are pushed to bitbucket
4. Place your access key in the `scipts/access` folder
5. Deploy the backend

```
npm install
node scripts/client.js staging
```

Or

```
node scripts/client.js production
```