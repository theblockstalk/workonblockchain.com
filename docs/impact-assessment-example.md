# IMPACT ASSESSMENT: FE/BE company should get automatic notifications of candidates
https://projects.zoho.com/portal/mwan#taskdetail/264358000001449005/264358000001717001/264358000001705221

## DATABASE

Modify user collection

```js
company: {
   saved_searches:
   {
       type:[new Schema({
           location: {
               type: String,
               enum: enumerations.workLocations
           },
           job_type: {
               type: String,
           },
           position: {
               type: String,
               enum : enumerations.workRoles
           },
           current_currency: {
               type: String,
               enum: enumerations.currencies
           },
           current_salary:
               {
                   type:Number,
                   min: 0
               },
           blockchain: {
               type: String,
               enum : enumerations.blockchainPlatforms
           },
           skills: {
               type: String,
               enum: enumerations.programmingLanguages
           },
           receive_email_notitfications: {
               type: Boolean
           },
           when_receive_email_notitfications : {
               type : String ,
               enum : enumerations.email_notificaiton
           },
		last_email_sent: {
			Type: Date
		}
       })]
   }
}
```

## BACKEND
- New endpoint for new wizard(preferences)**
  - Accept the new fields
  - Add those to database in user collection
- Input schema:
```js
[{
		location
		job_type
		position
		current_currency
		current_salary
		blockchain
		skills
		receive_email_notitfications
		when_receive_email_notitfications
}]
```
- Output schema:
  - When successfully update the db then return success : true
  - If the user document not found then return error : “User not found”.
- Modify (company update profile endpoint)
  - Accept the new fields too
  - Add those to database in user collection
- Update Input schema:
```js
[{
		location
		job_type
		position
		current_currency
		current_salary
		blockchain
		skills
		receive_email_notitfications
		When_receive_email_notitfications
}]
```
- Output schema:
  - When successfully update the db then return success : true
  - If the user document not found then return error : “User not found”.

## FRONTEND
- New FE component for new wizard(preferences)
- Modify company edit profile (need to add new panel)
- Modify company profile view ( need to add new panel)
- Modify admin company detail page view (need to add new panel)
- Modify company side candidate search page for prefilled the filters according to saved_searches

## OTHER COMPONENTS
- Cron job for new signup candidate (check the existing companies preferences if one/multiple companies matches with new candidate data) send email with candidate detail page link
 - Every day at 9am
 - Loop through all approved, active companies
 - If they have active search preference then
 - If (last_email_sent < now - when_receive_email_notitfications) then
 - Do search, and send new candidates after {{approved date - see T386}} that match search
 - Update last_email_sent
- New email template for automatic notification
  - First Name of the user
  - Name of the company
  - List of min 1, max 8 candidates
    - Why work on blockchain?
    - Link to their profile
    - Initials


## MIGRATIONS
N/A
