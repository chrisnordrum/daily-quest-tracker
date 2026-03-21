# dorc-app

DORC is a MERN stack RPG-style productivity app that turns habit-building into a game. Users create personal quests (habits or goals), earn XP for completing them, level up, unlock badges, and join guilds with friends to share progress and stay motivated.

<div style="display: flex; flex-wrap: wrap; gap: 8px;">
  <img src="https://img.shields.io/badge/-MongoDB-002548?style=for-the-badge&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/-Express-002548?style=for-the-badge&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/-React-002548?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/-Node.js-002548?style=for-the-badge" />

  <img src="https://img.shields.io/badge/-JavaScript-002548?style=for-the-badge&logo=javascript&logoColor=F7DF1E" />
  <img src="https://img.shields.io/badge/-Vite-002548?style=for-the-badge&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/-TailwindCSS-002548?style=for-the-badge&logo=tailwindcss&logoColor=38B2AC" />
  <img src="https://img.shields.io/badge/-JWT-002548?style=for-the-badge&logo=jsonwebtokens&logoColor=white" />
  <img src="https://img.shields.io/badge/-Helmet-002548?style=for-the-badge" />
  <img src="https://img.shields.io/badge/-HTTPS-002548?style=for-the-badge&logo=google-chrome&logoColor=white" />
</div>

---

## Setup Instructions

### Prerequisites

- Make sure you have [Node.js](https://nodejs.org/en) and [OpenSSL](https://www.openssl.org/) installed on your device.
- Make sure you have a [MongoDB](https://www.mongodb.com/) database set up (MongoDB Atlas or local MongoDB).

### Installation

1. Clone the repository

```bash
git clone https://github.com/chrisnordrum/dorc-app.git
```

2. Go to the project directory within the terminal to install the dependencies:

```bash
cd server
npm install
cd ../client
npm install
```

### Environment Variables

1. Go to the `server` directory, create a `.env` file and copy the environment variables as shown in the `.env.example` file

```bash
cp .env.example .env
```

2. Inside the `.env` file, make sure to change the value of `MONGODB_URI` to your own [MongoDB Atlas](https://www.mongodb.com/products/platform) connection string using the `Mongoose` driver

```
MONGODB_URI=mongodb+srv://<username>:<db_password>@cluster0.ifhq3qs.mongodb.net/?appName=Cluster0
```

3. **Make sure** to change the values of `ACCESS_TOKEN_SECRET` and `REFRESH_TOKEN_SECRET` with your own secret keys ( *just in case Oda finally reveals the One Piece!* )

```
ACCESS_TOKEN_SECRET=0NE
REFRESH_TOKEN_SECRET=P1ECE
```

> We generated secure token secrets using OpenSSL
> ```bash
> openssl rand -hex 64
> ```

### SSL Configuration

1. Go to the `server` directory and generate a private key

```bash
openssl genrsa -out private-key.pem 2048
```

2. Generate a self-signed certificate

```bash
openssl req -new -x509 -key private-key.pem -out certificate.pem -days 365
```

### Development

1. Go to the project directory within the terminal to start the server

```bash
npm run dev
```

2. Open another terminal window, go to the `client` directory to start the client

```bash
npm run dev
```

3. Open [http://localhost:5173](http://localhost:5173) in your browser during development (changes to React files appear instantly due to Hot Module Replacement (HMR))

---

## SSL Configuration

### SSL Certificate

We opted for a self-signed OpenSSL certificate as it was the easiest method at the time, and fit well into the in-class activities we had already done. We had also opted for this one as we were still in early local development phase, and didn't yet have a final build to properly secure. We didn't yet have experience with CertBot and Let's Encrypt just yet, but we will be looking into implementing those in future builds.

### Security Headers

We used the [Helmet](https://helmetjs.github.io/) middleware to set HTTP response headers for the app.

- We set the `frame-ancestors` within the Content Security Policy header to `'none'` and legacy X-Frame-Options header to `{ action: "deny" }` to reject all frame embedding since we won't be using frames within our app.
- We set the `font-src` within the Content Security Policy header to `'self'` to reject all external fonts because we have fonts saved in our client directory and do not need to import any external fonts.
- The rest of the headers are set by default by the [Helmet](https://helmetjs.github.io/) middleware and are standard in securing web applications and also align with our project.

The next step for security headers is to incorporate nonces for script and style sources to only allow the user to load intended resources.

---

## Caching Strategies

### Static Assets

Badge images are static assets that rarely change and are considered version-stable resources within the application.
Caching them for 30 days can improves performance, reduces server load, and enhances user experience without affecting dynamic application data.

Since these images are design assets that are not expected to change frequently, long-term caching is appropriate.

From a security perspective, these assets contain no sensitive or user-specific information, making them safe to cache publicly. Long-term caching also reduces unnecessary repeated requests to the server, minimizing exposure to certain traffic-based attacks and lowering the overall attack surface.

### API Routes

Caching headers are defined in the controllers so that cache behaviour can be tailored to the specific data and purpose of each endpoint. This approach keeps the logic organized and makes future updates or version upgrades easier to manage without creating confusion.

#### 1. `questsController` – Get all quests

Handles GET requests to fetch all quests from the database.

- **Caching**: Not cached
- **Reason**: The quests are dynamic and change based on the user's progress.

---

##### 2. `ranksController` – Get all ranks

Handles GET requests to fetch all ranks from the database.

- **Caching**: Not cached
- **Reason**: The ranks are dynamic and change based on the user's progress.

---

#### 3. `usersController` – Get all users

Handles GET requests to fetch all users from the database.

- **Caching**: Not cached
- **Reason**: The content of users is sensitive and should not be cached.

---

#### 4. `badgesController` – Get all badges

Handles GET requests to fetch all badges from the database.

- **Caching**: Cached for 1 month
- **Reason**: The content is static and does not change frequently.

---

#### 5. `dailyQuotesController` – Get daily quotes

Handles GET requests to fetch daily quotes from the database.

- **Caching**: Not cached
- **Reason**: Allows immediate updates if any inappropriate content needs to be changed or removed.

### SPA Fallback

This route ensures any client-side route is handled by the client. The SPA Fallback replaces the server-side 404 error by serving the application shell.

The caching policy chosen for this route is `no-cache` to ensure the user is always served the latest build.

### Vite and React Build

All client-side routing is handled by [React Router](https://reactrouter.com/) including 404 errors. Caching for client-side routes are handled efficiently by [React](https://react.dev/).

### 500 Error

For temporary server errors, the `no-cache` caching policy is set to ensure temporary server errors are not stored and cannot be potentially exploited.

---

## Authentication Mechanisms

### Local Authentication

Why did we choose this? Document your reasoning in a short paragraph, noting any past experiences or expectations that influenced your decision.

### SSO Authentication

Why did we choose this? Document your reasoning in a short paragraph, noting any past experiences or expectations that influenced your decision.

### Token Storage and Management

Why did you choose your specific token storage and management strategies? Document any challenges you faced in balancing security with user experience. Reflect on the trade-offs and security measures involved.

---

## Role-Based Access Control

**DORC** uses a simple role-based access control system with two roles: **User** and **Admin**. This allows us to protect sensitive routes while keeping the permissions system easy to manage.

We enforce access control on both the **frontend** and **backend**. On the frontend, protected routes are only available to logged-in users. On the backend, middleware verifies both authentication and user role before allowing access to sensitive resources.

### Frontend Route Protection
Protected pages are wrapped inside a `ProtectedRoute` component:

```jsx
<Route element={<ProtectedRoute />}>
  <Route path="/leaderboard" element={<Leaderboard />} />
  <Route path="/profile" element={<Profile />} />
  <Route path="/admin" element={<Admin />} />
</Route>
```
This ensures that only authenticated users can access `/leaderboard` and `/profile`. If a user is not logged in and tries to access these routes, they are redirected to the login page. Once a user is authenticated, they are redirected to the main page instead of seeing the login page again.

The `/admin` route includes an additional role check. If a non-admin user attempts to access /admin, even by manually entering the URL, they are blocked and redirected back to a default page.

The admin dashboard button on `Home.jsx` is only visible to users with the **Admin** role. This ensures that regular users do not see or attempt to access admin functionality through the interface.

### Backend Protection
On the backend, access control is enforced using middleware for both **authentication** and **authorization**. This ensures security even if users try to bypass the frontend.

#### Authentication (`authMiddleware`)
- Extracts token from `req.headers.token`
- Verifies token using `jwt.verify()`
- Attaches decoded user data to `req.user`
- Returns `401 Unauthorized` if: 
  - token is missing
  - token is invalid

```jsx
const token = req.headers.token;

if (!token) {
  return res.status(401).json({ message: "No token, authorization denied" });
}

const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
req.user = decoded;
```

#### Authorization (`authorize`)
- Checks if `req.user` exists (user is authenticated)
- Verifies that the user’s role matches the required role
- Returns `403 Forbidden` if role is not allowed

```jsx
if (req.user && roles.includes(req.user.role)) {
  next();
} else {
  return res.status(403).json({
    message: "You are not authorized to access this resource"
  });
```

#### Admin Route Protection
Admin routes require **both** authentication and authorization:

```jsx 
router.get("/", authMiddleware, auth("admin"), (req, res) => { ... });

router.get("/users", authMiddleware, auth("admin"), async (req, res) => {
  const users = await User.find().select("-password");
  res.status(200).json(users);
});
```
- User must have a **valid JWT Token**
- User must have the **Admin Role**
- Non-admin users receive a `403` response 
- Passwords are excluded using `.select("-password"`
- Admins can **view all users (read-only)**
  

---

## Lessons Learned

### Phase 1: Establishing a Secure HTTPS Server

#### Implementing HTTPS 
- Perhaps the hardest part about implementing HTTPS into the site was configuring it to be compatible with it in the first place. The server's VITE system required reconfiguring to properly feed the right files from the server.

#### Setting Up Helmet
- Helmet is very easy to use and their default security headers are standard in securing a web application. In addition to security headers, we learned that the middleware can also handle the HSTS policy for HTTPS and allowed us to remove the HSTS dependancy and streamline our code.

#### Fetch API Data
- When fetching data from an API, never assume that the request will succeed. The server can always return an error status (e.g., 404 or 500). So ensure that the app handles error gracefully.
- Using `UseEffect` runs API requests when the component first loads. The UI renders before the data is returned, so setting a safe initial state (an empty array) is important to prevent errors when handling asynchronous data.
- Adding loading states helped improve UX by giving feedback while data is being fetched.

---

### Phase 2: Authentication and Authorization Mechanisms
#### Role-Based Access Control
- **Authentication vs Authorization** - This helped us clearly see how these work together but do different things. Authentication checks if the user is logged in, while authorization controls what they can access. In our case, users could be logged in but still blocked from `/admin` if they weren’t an admin.
- **Frontend vs Backend Security** - We realized that frontend protection is mainly for user experience, not security. Even if a route or button is hidden, users can still try to access it manually. The backend middleware is what actually enforces access control.
- **Middleware Order** - One issue we ran into was making sure middleware runs in the correct order. `authMiddleware` has to run first so `req.user` exists before checking the role. This showed how each step depends on the previous one.
- **Error Handling** - We handled different cases using:
  - `401` - when the user is not authenticated (no or invalid token)
  - `403` - when the user is authenticated but not allowed access
  - This made debugging and testing much clearer.
- **Role-Based UI Behavior** - The admin dashboard button in `Home.jsx` only shows for admin users. This keeps the UI clean and helps prevent regular users from trying to access admin features.
- **Simplicity vs Flexibility** - We kept the system simple with just **User** and **Admin** roles. This made it easier to build and test, but it would need to be expanded if more detailed permissions are needed later.
- **Main Challenge** - The biggest challenge was making sure everything worked together, not just individually. It wasn’t enough to protect routes on the frontend or backend alone. We had to make sure both layers were working together so that even if someone tried to access `/admin` directly, they would still be blocked. Getting this fully working required testing multiple scenarios and fixing small issues between frontend routing and backend checks.
- **Testing Restricted Access** - We tested different edge cases like missing tokens, invalid tokens, and wrong roles. This helped confirm that the system properly blocks unauthorized users and only allows access where it should.
