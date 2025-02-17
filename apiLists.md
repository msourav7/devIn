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

## userRouter
- GET /user/connections
- GET /user/requests/received
- GET /user/feed - Gets yopu the profile of other users on platforms

 
Status: ignored, intrested, accepted, rejected