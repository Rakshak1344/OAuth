# OAuth Implementation

Implementation of OAuth using Node.JS and MongoDB.

## Procedure

 **1.** Clone/Download the repository </br>
 **2.** Install required packages using </br>&emsp;`npm install`</br>
 **3.** Configure the  required credentials under </br>&emsp;`config/index.js`</br>
 **4.** Run the express server under the root of the project</br>&emsp;`npm start`</br>
 **5.** Checkout the routes used under </br>&emsp;`routes/user.js`</br>

### Note

>Test on postman to get the **JWT_TOKEN** for all per request

Use **access token** for OAuth request Body (Google & Facebook)</br>
`{"access token": "<--GENERATE_TOKEN_FROM_BELOW_LINK-->"}`

### Links to generate OAuth access token

**1.** [Generate Google Access Token](https://developers.google.com/oauthplayground/)

**2.** [Generate Facebook Access Token](https://developers.facebook.com/tools/explorer/)
