# workonblockchain.com

This MEAN stack application runs a candidate-based recruitment platform. Companies apply to candidates based on their profiles (same model as [hired.com](https://hired.com)).

Please see following article for more information, architecture diagram and dev processes:
[https://medium.com/work-on-blockchain/recruitment-platform-workonblockchain-com-an-open-source-final-gift-da7594b45e8d](https://medium.com/work-on-blockchain/recruitment-platform-workonblockchain-com-an-open-source-final-gift-da7594b45e8d)

**Angularjs front-end client:**
- Angular application
- Custom component library
- Hotjar and Google Analytics
- Google and Linkedin oAuth 2.0
- Linkedin pdf import and parse
- Server Side Rendering of Angular application
- Custom administration and CMR panel

**Nodejs back-end server:**
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

**Scripts:**
- Multi-branch, multi-stage and parallelized CI/CD using Bitbucket pipelines
- Continuous Integration running mocha unit tests
- Continuous Deployment to to AWS Elastic Beanstalk and AWS Lambda

## Acknowledgements
**WOB team**

- [Antonio Sabado](https://www.linkedin.com/in/antonio-sabado-97150511b) - Product vision and company director
- [Jack Tanner](https://www.linkedin.com/in/jack-tanner) - Product owner/manager (hands on) and company director

**[Mwan Mobile](https://www.mwanmobile.com) development agency team**

- [Andreas Tsindos](https://www.linkedin.com/in/andreas-tsindos-1174421) - Company director
- [Asad Mahmood](https://www.linkedin.com/in/asad117) - SCRUM master
- [Sadia Abbas](https://www.linkedin.com/in/sadia-abbas-437a20124) - Full-stack tech lead
- [Tayyab Hussain](https://www.linkedin.com/in/tayyab-hussain-6117bab6) - Full-stack developer

## Prerequisits
- [Mongodb 4.x](https://www.mongodb.com/)
- [Npm 6.x](https://www.npmjs.com/)
- Node 14.x - Installed with npm

Tested on Ubuntu 18.04

## Run the back-end server

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

Back-end API is running on localhost:4000

## Run the front-end client

```
cd client
npm install
npm start
```

Front-end is running on localhost:4200

## Run the front-end client with server side rendering

```
npm run-script build:ssr:local
npm run-script serve:ssr
```

Front-end is running on localhost:8080

## Initialize

1. Create a new user
2. Run migration 

```
cd server
export MONGO_CONNECTION_STRING="mongodb://localhost:27017/wob"
node migrations/migrate.js init.js up
```