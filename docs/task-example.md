### User story
As a company
<br/>I should receive emails about the new candidates that sign up that match what I am looking for
<br/>So that I am more likely to go to the platform and talk to them (currently they are too lazy to do search manually)

### Acceptance criteria
When a company signs up to the platform they must complete an extra wizard step
1. see questions here https://docs.google.com/document/d/1f03BtYLLE27m_6K2RTSEOmD6LXr4-8oetw2-eq0ksKE
   - Where are you looking for developers? (multiselect, required)
   - Are the positions full time, part time or freelance? (multiselect, required)
   - What positions are you looking for? (multiselect, required)
   - Available salary and currency? (select number, and currency dropdown, required)
   - When do they want to start employment? (single select dropdown, required)
   - What blockchain technology(ies) do you want them to have experience with? (multiselect, optional)
   - What programming languages do you want them to have experience with? (multiselect, optional)
   - Other stack: Ripple, MongoDB, AWS (text box, optional)
   - Do you consent to getting emails when new candidates that match your criteria sign up? (tick box, required)
   - Also ask question: When would you like to receive email notifications of users that match your search: Never, Daily, 3 days, Weekly (single select radio box required)
   - Daily is selected by default
2. According to their selection, a cron job will send the user an email according to their preference with a link to the candidates
3. When a company clicks the link they go to the candidate page, if they are not signed in then the go to login and then are redirected to candidate page
4. in the company page, they can see their preferences
5. they can edit their preferences
6. if they dissable their profile then they no longer receive the email
7. the admin can see their preferences
8. when they go to the candidate search screen, then their search preferences are automatically filled in

### Definition of done/closed:
1. Impact assessment complete and approved
2. UI design approved
3. Any endpoints that are modified are converted to async await
4. Unit tests passing
5. Deployed to staging and approved

### Sendgrid
sendgrid template id: d-951e44e917e340798954c638f151bf76

sample sendgrid dynamic template data:
```
{
  "firstName": "Jack",
  "company_name": "Work on Blockchain",
  "candidates": {
    "count": 6,
    "list": [
      {
        "url": "static.com",
        "initials": "JT",
        "why_work": "I like blockchains",
        "programming_languages": [
          {
            "language": "Java",
            "exp_years": "0-1"
          },
          {
            "language": "Python",
            "exp_years": "6+"
          }
          ]
      },
      {
        "url": "static.com",
        "initials": "JT",
        "why_work": "I like blockchains",
        "programming_languages": [
          {
            "language": "Java",
            "exp_year": "0-1"
          },
          {
            "language": "Python",
            "exp_year": "6+"
          }
          ]
      }
      
      ]
  }
}
```