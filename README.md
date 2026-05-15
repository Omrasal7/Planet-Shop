# Planet Shop

Planet Shop is a multi-page front-end e-commerce concept for buying fictional planets. It uses plain HTML, CSS, and JavaScript, with a dark cosmic theme, product browsing, cart management, and simple client-side authentication.

## Features

- Multi-page storefront with `Home`, `Catalog`, `Product`, `Cart`, and `Sign Up / Log In`
- Planet catalog with category filters
- Product detail pages generated from shared JavaScript data
- Cart stored in `localStorage`
- Client-side sign up, login, session display, and logout
- Checkout flow with email entry and order confirmation notification
- Updated planet artwork with cache-busting asset URLs for deployment refreshes

## Pages

- `index.html`: landing page with hero, offers, and about sections
- `catalog.html`: product listing and type filters
- `product.html`: single planet detail page
- `cart.html`: cart summary and checkout form
- `signup.html`: sign up and log in screen

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript
- Browser `localStorage`
- Browser Notification API

## Project Structure

```text
index.html
catalog.html
product.html
cart.html
signup.html
styles.css
app.js
```

Image assets live in the project root and are referenced by `app.js` and `index.html`.

## How It Works

### Authentication

User accounts are stored in the browser using `localStorage`.

- Users can sign up with name, email, and password
- Existing users can log in from the same auth page
- After login, the header shows the user name and a logout button

This is a client-side demo only and is not a secure production auth system.

### Cart and Checkout

- Cart items are stored in `localStorage`
- Checkout requires an email address
- The app stores the latest order in `localStorage`
- A browser notification is shown when permission is available

## Running Locally

You can open `index.html` directly in the browser, or run a simple local server.

Example with VS Code Live Server or any static hosting tool:

```powershell
# open the folder and run with your preferred static server
```

## Deployment Notes

- The app uses versioned asset URLs like `styles.css?v=...` and image query strings to reduce stale cache issues after deployment.
- If an old version still appears after pushing, do a hard refresh in the browser with `Ctrl+F5`.

## Git Commands

To commit all current work:

```powershell
git status
git add -A
git commit -m "Update Planet Shop app and assets"
git push origin main
```

To commit only the recent image/code updates:

```powershell
git status
git add app.js index.html earth.jpeg juipter.jpeg neptune.jpeg mars.jpg README.md
git commit -m "Update planet images and add project README"
git push origin main
```

## Future Improvements

- Move auth and orders to a real backend
- Hash passwords securely
- Send real transactional emails
- Add search and sorting in the catalog
- Improve mobile nav and account management
