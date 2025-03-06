# Dev-In APIs
## AuthRouter
- POST /signup
- POST /login
- POST /logout

## ProfileRouter
- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password

## connectionRequestRouter
- POST /request/send/intrested/:userId
- POST /request/send/ignored/:userId
## the above two api can be dynamic for intrested & ignored
- POST /request/send/:status/:userId


- POST /request/review/accepted/:requestId
- POST /request/review/rejected/:requestId
## the above two api can be dynamic for intrested & ignored
- POST /request/review/:status/:requestId

## userRouter
- GET /user/requests/received
- GET /user/connections
- GET /user/feed - Gets yopu the profile of other users on platforms

-Pagination 
 - /feed?page=1&limit=10 => first 10 users 1-10 =>.skip(0) , .limit(10)
 - /feed?page=2&limit=10 =>users 11-20  =>.skip(10) , .limit(10)
 - etc.

 - with the help of .skip() , limit()
 -Formula for skip 
  - skip = (page-1)*limit
 
Status: ignored, intrested, accepted, rejected

# CORS
 - added cors confguration origin and credentials in frontend as well as backend