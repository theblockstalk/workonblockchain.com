# workonblockchain.com

This MEAN stack application runs a candidate-based recruitment platform. Companies apply to candidates based on their profiles. (e.g. same model as [hired.com](https://hired.com)).

Please see following article for more information, architecture diagram and dev processes:
[https://medium.com/work-on-blockchain/recruitment-platform-workonblockchain-com-an-open-source-final-gift-da7594b45e8d](https://medium.com/work-on-blockchain/recruitment-platform-workonblockchain-com-an-open-source-final-gift-da7594b45e8d)

Angularjs front-end client:
- Angular application
- Custom component library
- Hotjar and Google Analytics
- Google and Linkedin oAuth 2.0
- Linkedin pdf import and parse
- Server Side Rendering of Angular application
- Custom administration and CMR panel

Nodejs back-end server:
- RESTful Express API
- Mongoose endpoint validations and Mongoose for database control
- JSON web token authorization
- Mongodb database migration examples
- Database sanitization, CORS and other security features
- Error handling, authorization and other middleware
- Mocha unit test suite
- Amplitude API analytics
- Logger to AWS Cloudwatch and file storage using AWS S3
- Email service using Sendgrid API
- Cron service for email reminders and synchronization with Sendgrid and Zoho contacts

Scripts:
- Multi-branch, multi-stage and parallelized CI/CD using Bitbucket pipelines
- Continuous Integration running mocha unit tests
- Continuous Deployment to to AWS Elastic Beanstalk and AWS Lambda

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