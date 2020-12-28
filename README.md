# EventBookingApp-Node
A web based project for events searching and booking

# Stack Used
1. Node.js - Express (BackEnd)
2. Next.js (FrontEnd)

# Models structure
For Users
1. name
2. email
3. password
4. createdAt
5. imageUrl
6. bannerUrl
7. dateOfBirth
8. primaryContact
9. nationality

# BackEnd - Restful Api Routes
For authentication
1. /api/v1/auth/register - POST
2. /api/v1/auth/login - POST

For user profile
3. /api/v1/users - GET
4. /api/v1/users/:id - GET
5. /api/v1/users/updateimage/:id - PUT
6. /api/v1/users/updatebanner/:id - PUT
7. /api/v1/users/:id - PUT
8. /api/v1/users/:id - DELETE

For organizations or event organizers
9. /api/v1/organizations - GET
10. /api/v1/organizations/:id - GET
11. /api/v1/organizations - POST
12. /api/v1/organizations/:id - PUT
13. /api/v1/organizations/:id - DELETE
14. /api/v1/organizations/updatelogo/:id - PUT
15. /api/v1/organizations/updatebanner/:id - PUT

For events
16. /api/v1/events - GET
17. /api/v1/events/:id - GET
18. /api/v1/evnets - POST
19. /api/v1/events/:id - DELETE
20. /api/v1/events/markdone/:id - PUT
21. /api/v1/events/updatebanner/:id - PUT

For event tickets
22. /api/v1/tickets/all-event-tickets/:eventId - GET
23. /api/v1/tickes - POST
24. /api/v1/tickets - GET