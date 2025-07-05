🧾 Invoice API

A RESTful API for managing users, clients, and invoices with authentication, PDF export, and online payment integration.

📦 Technologies

Node.js, Express.js

TypeScript

PostgreSQL + TypeORM

JWT Authentication (Access + Refresh Token)

SendGrid (Email)

Puppeteer (PDF Export)

VNPay (Payment Gateway)

Cookie-based Auth

🔐 Authentication Routes

Method	Endpoint	Middleware	Description

POST	/api/auth/register	–	Register a new user

POST	/api/auth/login	–	Login and receive tokens

GET	/api/auth/me	auth	Get current logged-in user

POST	/api/auth/refeshToken	–	Refresh access token

DELETE	/api/auth/logOut	auth	Logout and clear tokens

👤 User Routes

Method	Endpoint	Middleware	Description

GET	/api/users	auth	Get all users

GET	/api/users/:id	auth	Get user by ID

PUT	/api/users/:id	auth	Update user

DELETE	/api/users/:id	auth	Delete user

🧑‍💼 Client Routes

Method	Endpoint	Middleware	Description

GET	/api/clients	auth	Get all clients

GET	/api/clients/:id	auth	Get client by ID

POST	/api/clients	auth	Create new client

PUT	/api/clients/:id	auth	Update client

DELETE	/api/clients/:id	auth	Delete client

🧾 Invoice Routes

Method	Endpoint	Middleware	Description

POST	/api/invoices	auth	Create new invoice

GET	/api/invoices	auth	Get all invoices

GET	/api/invoices/:id	auth	Get invoice by ID

PUT	/api/invoices/:id	auth	Update invoice

DELETE	/api/invoices/:id	auth	Delete invoice

GET	/api/invoices/:id/download	auth	Download invoice as PDF

💰 Payment Routes

Method	Endpoint	Middleware	Description

POST	/api/payment/:id	auth	Make payment for invoice

GET	/api/payment/status	–	Callback to update payment status (VNPay)
