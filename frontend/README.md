# Safely Hotel Management System — Study Guide

This README is a beginner-friendly guide to the current React project. Read the
sections in order, then follow the workflows to see how the files work together.

## Contents

1. [Project overview](#project-overview)
2. [Project features](#project-features)
3. [Technologies used](#technologies-used)
4. [Project folder structure](#project-folder-structure)
5. [File-by-file explanation](#file-by-file-explanation)
6. [How the React application works](#how-the-react-application-works)
7. [Component explanation](#component-explanation)
8. [Routing and navigation](#routing-and-navigation)
9. [Hotel data flow](#hotel-data-flow)
10. [Add, edit, and delete flows](#add-edit-and-delete-flows)
11. [View Details and image carousel](#view-details-and-image-carousel)
12. [Booking and billing](#booking-and-billing)
13. [Important React and JavaScript concepts](#important-react-and-javascript-concepts)
14. [CSS and responsive design](#css-and-responsive-design)
15. [How to run the project](#how-to-run-the-project)
16. [Common errors and fixes](#common-errors-and-fixes)
17. [Beginner study notes](#beginner-study-notes)
18. [Complete project workflow](#complete-project-workflow)

---

## Project overview

Safely is a small hotel management and browsing application built with React.
Visitors can browse hotel cards, search by name, filter by nightly price, view a
hotel's details and photos, and fill in a booking form. The navigation also
provides screens for adding, editing, deleting, and learning about hotels.

The project is a **front-end demo**. Hotel records and booking details live in
the browser's React state. There is no API, database, login system, payment
gateway, or server-side booking operation. Refreshing the page resets hotel
changes and booking details to the initial data in `src/App.jsx`.

## Project features

- A hotel list with image, name, location, description, and nightly price.
- Live hotel-name search and minimum/maximum price filters.
- Three hotel cards per page with pagination when needed.
- Hotel details pages with image carousels, image dots, and arrow buttons.
- A location button that opens a Google Maps search.
- A booking form with guest details, dates, guest count, and an estimated bill.
- Add Hotel form with a live card preview.
- Edit Hotel selection and update form.
- Delete Hotel screen with a confirmation prompt.
- Help & Support guide with frequently asked questions and a support email.
- Responsive layouts for smaller screens.

## Technologies used

| Technology | What it does here |
| --- | --- |
| React 19 | Builds the interface out of reusable components and state. |
| React DOM | Mounts the React application into the HTML page. |
| React Router DOM 7 | Changes screens using URL routes without full page reloads. |
| Vite 8 | Runs the development server and creates the production build. |
| JavaScript and JSX | Implements component behavior and UI markup. |
| CSS | Defines colors, layouts, backgrounds, animations, and responsive rules. |
| ESLint | Checks JavaScript/JSX for common errors and project rules. |

The React Compiler is enabled in `vite.config.js` through the Babel plugin.

## Project folder structure

```text
frontend/
├── index.html                 # Browser HTML shell and React mount point
├── package.json               # Dependencies and npm scripts
├── package-lock.json          # Exact dependency versions for npm installs
├── vite.config.js             # Vite and React plugin configuration
├── eslint.config.js           # JavaScript/JSX lint rules
├── README.md                  # This study guide
├── public/                    # Static images and icons served from the site root
│   ├── hotel1-*.jpg           # The Residency Towers carousel images
│   ├── hotel2-*.jpg           # ITC Grand Chola carousel images
│   ├── hotel3*.jpg            # Sterling Ooty Elk Hill carousel images
│   ├── hotel4-*.jpg           # Hotel TamilNadu carousel images
│   ├── hotel5*.jpg            # Courtyard by Marriott carousel images
│   ├── hotel6*.jpg            # Radisson Blu Hotel carousel images
│   ├── hotel2.jpg             # Shared hotel-themed page background
│   └── ...                    # Other images, favicon, and icons
├── src/
│   ├── main.jsx               # React entry point
│   ├── App.jsx                # Shared hotel state and route definitions
│   ├── nav.jsx                # Main navigation links
│   ├── search.jsx             # Search, filter, hotel cards, and pagination
│   ├── hoteldetails.jsx       # Hotel details, carousel, booking, and bill
│   ├── Addhotel.jsx           # Add Hotel form and preview
│   ├── EditSelect.jsx         # Choose a hotel to edit
│   ├── edithotel.jsx          # Edit a selected hotel's fields
│   ├── DeleteHotels.jsx       # Hotel deletion screen
│   ├── Help.jsx               # Help & Support guide
│   ├── *.css                  # Styles associated with the screens/components
│   └── assets/                # Starter Vite/React assets (not used by app UI)
└── dist/                      # Generated production output after `npm run build`
```

> File names are case-sensitive in many hosting environments. For example,
> `Addhotel.jsx` and `edithotel.jsx` use the capitalization shown above.

## File-by-file explanation

### Application setup and configuration

#### `index.html`

- This is the one HTML document loaded by the browser.
- `<div id="root"></div>` is an empty mounting point. React renders the app
  inside it.
- `<script type="module" src="/src/main.jsx"></script>` starts the JavaScript
  application.
- The viewport meta tag helps the page fit phone screens.
- The favicon is loaded from `public/favicon.svg`.

#### `src/main.jsx`

This is the JavaScript entry point:

1. Imports React's `StrictMode` and React DOM's `createRoot`.
2. Imports global CSS from `index.css`.
3. Imports the root `App` component.
4. Finds the HTML element whose id is `root`.
5. Calls `createRoot(...).render(...)` to place `<App />` in that element.

`StrictMode` is a development helper. It can intentionally run some lifecycle
logic more than once in development to help reveal unsafe patterns. It does not
create another visible copy of the application.

#### `src/App.jsx`

This is the main application coordinator.

- `initialHotels` is an array of six starting hotel objects. Each object
  includes an `id`, `name`, `location`, `description`, `price`, coordinates,
  and an `image`. The six supplied hotels also have an `images` array for their
  details-page carousel.
- `const [hotels, setHotels] = useState(initialHotels)` creates the central
  hotel list. `hotels` is the current value; `setHotels` changes it.
- `<BrowserRouter>` enables URL-based navigation.
- `<Nav />` displays the navigation bar for every route.
- `<Routes>` contains all page-to-URL mappings. Each page receives the hotel
  values or update function it needs through props.
- `Search`, `Addhotel`, `DeleteHotels`, and `EditHotel` receive `hotels` and/or
  `setHotels`; the detail and selection screens receive the hotel array.

The state is owned here because more than one screen needs to read or update the
same hotel list. Keeping it in a common parent lets child screens share one
source of truth.

#### `vite.config.js`

- Imports the Vite configuration helper.
- Enables the React plugin to process JSX and React Fast Refresh.
- Adds the Babel plugin with the React Compiler preset.
- Vite uses this file for development and production builds.

#### `eslint.config.js`

- Combines ESLint's recommended JavaScript rules with React Hooks and React
  Refresh rules.
- Tells ESLint that browser globals such as `window` exist.
- Enables JSX parsing for `.jsx` files.
- Ignores the generated `dist` folder.

#### `package.json` and `package-lock.json`

- `package.json` lists the application dependencies and commands.
- `npm run dev` starts Vite's development server.
- `npm run build` creates the production site in `dist/`.
- `npm run preview` serves the generated build locally.
- `npm run lint` runs ESLint over the project.
- `package-lock.json` records exact dependency versions so installs are
  repeatable. Do not edit installed packages in `node_modules` by hand.

### React components

#### `src/nav.jsx`

- Defines the `Nav` component.
- Uses React Router's `NavLink` for the home, Add hotel, Edit hotel, Delete
  hotels, and Help & Support links.
- `NavLink` provides the destination URL and an `isActive` value. That value
  adds the `active` class to the current page's link.
- The Hotels link uses `end` so it is active only at `/`, not on every URL that
  starts with `/`.
- Imports `nav.css` for visual styling.

#### `src/search.jsx`

This component is the hotel listing page.

- `HOTELS_PER_PAGE = 3` controls how many cards appear on a page.
- `useNavigate()` gives the component a function to open a hotel details route.
- Four `useState` calls store the search text, un-applied min/max inputs, the
  currently applied price range, and the current pagination page.
- `filteredHotels` chains conditions: the name must include the search text;
  if a minimum or maximum has been applied, the price must be inside that
  range.
- Name search is live because `setSearchName()` runs in the input's `onChange`.
- Price filtering is applied when the form is submitted. `applyFilters()`
  prevents the browser's default form reload, copies the entered values into
  `priceRange`, and resets the page to 1.
- `slice()` chooses the three hotels for the current page.
- `.map()` creates a card for each visible hotel. The card's View Details button
  navigates to `/hotel/<id>`.
- If no hotels match, an empty-results message appears.
- Pagination is shown only if more than one page exists. Buttons update
  `currentPage`, and disabled buttons prevent moving beyond the first/last page.

The input values are strings because HTML inputs provide string values.
`Number(...)` converts price text to a number for numeric comparisons and
formatting.

#### `src/hoteldetails.jsx`

This component handles a single hotel and its booking form.

- `useParams()` reads the `id` segment from `/hotel/:id`.
- `hotels.find(...)` looks for the object whose numeric id matches the URL.
- `useNavigate()` provides the Back to Hotels action.
- `useState` stores the active carousel image, customer form values, and
  submitted booking details.
- `useEffect()` resets the carousel to image zero when the route's hotel id
  changes.
- `hotel.images` supplies a gallery when present; otherwise the component uses
  `[hotel.image]` as a one-image gallery.
- The arrow handler changes the array index with modulo arithmetic, which wraps
  from last image to first and from first image to last.
- Buttons below the image are generated from `hotelImages`; clicking a dot
  chooses that image directly.
- The location button opens a Google Maps search for the hotel name and
  location in a new tab.
- The booking form and confirmation section use conditional rendering:
  `bookingDetails ? confirmation : form`.
- If an unknown id is opened, a Hotel Not Found message and Back to Hotels
  button are shown.

The component also defines the date and money helpers explained in
[Booking and billing](#booking-and-billing).

#### `src/Addhotel.jsx`

- Receives `hotels` and `setHotels` from `App`.
- Uses `useState` for each input and to control whether the preview appears.
- Controlled inputs display React state via `value` and update it in
  `onChange`.
- `selectImage()` reads the selected image file and creates a temporary browser
  URL with `URL.createObjectURL(file)`. That URL is used for preview and the
  newly added card.
- `addHotel()` checks that all current required values are non-empty, creates a
  new object with a timestamp id, converts number fields with `Number()`, adds
  it to the current array, shows an alert, and navigates home.
- The form's `onSubmit` calls `preventDefault()` to stop a regular browser
  submission/reload, then calls `addHotel()`.
- The Preview button sets `showPreview` to true. React then renders the hotel
  card preview beside the form on wide screens (under the form on narrow ones).
- The new hotel currently receives the fixed location `"New Location"`; the
  form does not have a location text field.

The preview is a display-only card. It does not add the hotel. Only the form's
Add Hotel submit button changes the shared hotel list.

#### `src/EditSelect.jsx`

- Receives the shared `hotels` array.
- Uses `.map()` to show an image card for every hotel.
- `useNavigate()` sends the user to `/hotels/<id>/edit` when Edit hotel is
  clicked.
- Imports `EditSelect.css`.

This is a selection screen, not the editing form itself.

#### `src/edithotel.jsx`

- `useParams()` gets the hotel id from `/hotels/:id/edit`.
- `.find()` locates the existing record.
- Each `useState` begins with that hotel's current value, so the form starts
  pre-filled.
- If no hotel matches, the component displays an error and a button back to the
  hotel list.
- `handleImageChange()` selects a new image and makes a temporary object URL.
- `handleUpdate()` prevents normal form submission, validates fields, creates
  an updated hotel by spreading (`...hotel`) the old record and replacing the
  changed fields, then uses `.map()` to replace only the matching array item.
- `setHotels(updatedHotels)` updates the parent state; after success, an alert
  is shown and navigation returns home.
- The existing `images` array is kept by the object spread. This form only
  changes the single `image` field, not the multi-image gallery.

#### `src/DeleteHotels.jsx`

- Receives the hotel list and update function as props.
- `deleteHotel(hotel)` first calls `window.confirm()`.
- If the user cancels, the function returns without changing anything.
- If confirmed, the functional form of the state setter filters out the hotel
  with the matching id.
- The functional setter uses the latest state value, which is useful when the
  next state depends on the previous state.
- `.map()` renders each hotel's thumbnail, name, location, price, and Delete
  button. An empty-state message appears when the list has no records.

#### `src/Help.jsx`

- Renders the Getting Started guidance, Add/Edit/Delete/Search/Details/Booking
  instructions, FAQ disclosures, and Contact Support section.
- Native HTML `<details>` and `<summary>` elements provide expandable FAQ items
  without an extra JavaScript library.
- The support email is a `mailto:` link.
- Imports `help.css`.

### CSS files

#### `src/index.css`

Sets site-wide base styles: the font family, base text size and color, body
margin, line-height, and the font family used by headings and form controls.
An older Vite starter theme is left inside a CSS comment and is inactive.

#### `src/App.css`

Currently empty and not imported by the application. The active styles are
loaded by `index.css` and the individual component CSS files.

#### `src/nav.css`

Styles the full-width dark green navigation bar, brand, link spacing, active
link underline, and mobile wrapping behavior.

#### `src/search.css`

Contains styles for both the hotel search/listing screen and the Hotel Details
screen:

- Search page background, search form controls, card grid, card typography,
  buttons, and pagination.
- Details-page backdrop, translucent detail panel, carousel image and arrows,
  dots, hotel summary, booking form, billing box, confirmation panel, and
  mobile layouts.
- The hotel details page uses `/hotel2.jpg` as its shared professional
  background, with a translucent overlay; the actual hotel gallery image is
  shown separately inside the carousel.

#### `src/addhotel.css`

Styles the Add Hotel screen's hotel-photo backdrop, form card, labels, inputs,
buttons, preview card, and responsive form/preview layout. At small widths, the
preview moves below the form.

#### `src/EditSelect.css`

Styles the hotel-selection page for editing, including its dark hotel-themed
background, responsive card grid, images, and Edit buttons.

#### `src/edithotel.css`

Styles the update form, file input, image preview, buttons, missing-hotel
message, and mobile layout.

#### `src/delete-hotels.css`

Styles the Delete hotels screen's background, hotel rows, thumbnails, delete
buttons, empty state, and mobile arrangement.

#### `src/help.css`

Styles the help page backdrop, introductory panel, guidance cards, FAQ,
contact panel, and responsive card columns.

### Images and other assets

#### `public/`

Vite serves files in `public/` from the site root. For example,
`public/hotel1-1.jpg` is referenced in React as `/hotel1-1.jpg` (not
`/public/hotel1-1.jpg`). The `hotel1` through `hotel6` image groups are the
initial hotels' carousel galleries. `hotel2.jpg` is also reused as a page
background. Other original images and repeated dot-named copies may remain in
the folder even when the current UI does not reference them.

#### `src/assets/`

Contains starter Vite/React artwork (`vite.svg`, `react.svg`, and `hero.png`).
The current hotel UI does not import these files.

## How the React application works

The startup sequence is:

```text
index.html
  └─ loads src/main.jsx
       ├─ loads global CSS
       └─ renders <App />
            ├─ creates shared hotel state
            ├─ renders the always-visible navbar
            └─ selects a page using the current URL
```

React components return JSX. JSX looks similar to HTML, but braces `{...}` let
JavaScript values and expressions be placed in the markup. For example,
`{hotel.name}` displays a value, and `{hotels.map(...)}` creates repeated UI.

When a state setter such as `setHotels(...)` or `setCurrentPage(...)` runs,
React schedules a render using the new state. The component then returns JSX
again, so the visible interface stays in sync with the data.

## Component explanation

| Component | Main job | Important connection |
| --- | --- | --- |
| `App` | Own the hotel array and define routes | Passes hotel data/update functions to pages |
| `Nav` | Display links on all pages | Uses `NavLink` inside `BrowserRouter` |
| `Search` | Find and display hotels | Navigates to the selected hotel's details route |
| `HotelDetails` | Show gallery, hotel info, booking and bill | Finds hotel by route id |
| `AddHotel` | Collect new hotel details and preview | Appends a record with `setHotels` |
| `EditSelect` | Let the user choose a hotel | Navigates to the id-specific edit route |
| `EditHotel` | Update an existing record | Replaces one record in the shared array |
| `DeleteHotels` | Confirm and remove a record | Filters shared array through `setHotels` |
| `Help` | Explain how to use the app | Linked from the navbar |

Props are values passed from a parent component to a child. In this project,
`hotels` gives a child read access to the current list, and `setHotels` lets
selected children ask `App` to update that list.

## Routing and navigation

`BrowserRouter`, `Routes`, and `Route` are imported from `react-router-dom` in
`App.jsx`.

| URL | Component | What it shows |
| --- | --- | --- |
| `/` | `Search` | Search/filter and hotel cards |
| `/hotel/:id` | `HotelDetails` | Details for a hotel id |
| `/addhotel` | `Addhotel` | Add form and optional preview |
| `/edithotel` | `EditSelect` | List of hotels to choose for editing |
| `/hotels/:id/edit` | `EditHotel` | Edit form for one hotel |
| `/deletehotel` | `DeleteHotels` | Hotel deletion list |
| `/help` | `Help` | Help and support guide |

`:id` is a route parameter. For example, `/hotel/2` means `useParams()` returns
`id` as the string `"2"`. The code converts it with `Number(id)` to compare with
the numeric hotel id.

`NavLink` and `useNavigate()` change the URL through client-side navigation.
The browser does not need to reload the entire page when the user follows one
of these links.

## Hotel data flow

The six sample hotels are created in `initialHotels` inside `App.jsx`. They are
then copied into React state:

```js
const [hotels, setHotels] = useState(initialHotels);
```

The same list flows to multiple screens:

```text
App state (hotels)
  ├─ Search          reads and filters hotels
  ├─ HotelDetails    finds one hotel by id
  ├─ AddHotel        appends a new hotel using setHotels
  ├─ EditSelect      displays all hotels to choose from
  ├─ EditHotel       replaces one hotel using setHotels
  └─ DeleteHotels    removes one hotel using setHotels
```

The list is held only in memory. It is **not saved to local storage or a
database**, so a page refresh restores `initialHotels`. This is an important
difference between a learning demo and a production app.

## Add, edit, and delete flows

### Add Hotel flow

1. The user opens `/addhotel` using the navbar.
2. `Addhotel` stores each field in local component state.
3. Choosing an image creates a temporary object URL for the browser to display.
4. Preview sets `showPreview` to true; it does not alter the hotel list.
5. Add Hotel submits the form and checks that required fields are filled.
6. The component builds an object with a new timestamp id and numeric price/
   coordinates.
7. `setHotels([...hotels, newHotel])` creates a new array with the new record at
   the end.
8. The UI returns to `/`, where the updated array is rendered.

Current limitation: the Add Hotel form has no location field, so new records
use `"New Location"`. Uploaded files use temporary `blob:` URLs; there is no
upload server or durable file storage. Refreshing the page loses the added
record and that temporary image URL.

### Edit Hotel flow

1. Open `/edithotel`; `EditSelect` renders all hotels.
2. Clicking Edit hotel navigates to `/hotels/<id>/edit`.
3. `EditHotel` finds the record by id and initializes the form values from it.
4. The user changes fields or chooses a new image.
5. `handleUpdate()` validates and creates `updatedHotel`.
6. `.map()` creates a new array, changing only the matching id.
7. `setHotels(updatedHotels)` updates shared state, then the page returns home.

The existing hotel object is copied with `{ ...hotel }` before changed fields
are assigned. This preserves fields not directly edited (such as `location` and
`images`). As a result, changing the single `image` field does not replace the
existing multi-image `images` gallery.

### Delete Hotel flow

1. Open `/deletehotel`.
2. Click Delete on a hotel row.
3. `window.confirm()` asks whether to continue.
4. Cancel means no state change.
5. Confirm calls `setHotels(currentHotels => currentHotels.filter(...))`.
6. The returned array excludes the selected id, and React rerenders the list.

## View Details and image carousel

1. Each Search card's View Details button calls
   `navigate(`/hotel/${hotel.id}`)`.
2. `HotelDetails` reads the id using `useParams()` and finds the matching hotel.
3. The selected hotel has an `images` array; `image` is the card thumbnail and
   fallback for hotels without a gallery.
4. `activeImageIndex` selects the photo displayed in the carousel.
5. Left/right buttons update the index. The modulo expression makes navigation
   wrap around at either end.
6. Dots are created with `.map()` and set the index to the clicked photo.
7. The `key` on the `<img>` changes with its source, and CSS adds a short fade.
8. The hotel name, location, price, description, and booking form are separate
   from the active image, so changing photos does not change hotel details.

The card's View Details action is navigation, not a direct data lookup. The URL
contains the id; the details component uses that id to look the hotel up in the
shared array.

## Booking and billing

### Booking form behavior

The form tracks `name`, `email`, `phone`, `checkIn`, `checkOut`, and `guests`
inside `customer` state.

- `updateCustomer()` reads the input's `name` and `value`, then uses a computed
  property (`[name]`) to update the matching field.
- Inputs have HTML `required` attributes. Email uses `type="email"`; guest
  count uses a range of 1 to 20.
- Check-in cannot be earlier than today.
- Check-out's `min` is the day after check-in (or tomorrow if there is no
  check-in yet).
- Changing check-in clears a checkout date that is no longer valid.
- Submitting a valid form calls `submitBooking()`, prevents a browser reload,
  and stores the entered details plus hotel and bill data.
- Once `bookingDetails` is set, React replaces the form with **Booking
  Confirmed** and the submitted details.

This confirmation is local UI state only. No booking is sent to a server, no
availability is checked, and no payment is taken. The bill explicitly says
taxes are excluded and payment is not processed.

### Date and bill helpers

`formatDate(date)` produces `YYYY-MM-DD`, padding month and day with a leading
zero when needed. It is used to set the earliest check-in date.

`getNextDate(dateValue)` turns a date string into a Date, adds one day, then
formats it. This supplies the earliest allowed check-out date.

`getStayNights(checkIn, checkOut)`:

1. Returns `0` if either date is missing.
2. Splits each `YYYY-MM-DD` string into year, month, and day numbers.
3. Converts both dates to UTC midnight timestamps with `Date.UTC`.
4. Subtracts the start from the end and divides milliseconds per day
   (`86,400,000`).
5. Uses `Math.max(0, ...)` so the result cannot be negative.

Using UTC timestamps avoids daylight-saving changes affecting a whole-night
count.

The total is calculated in `HotelDetails`:

```js
const estimatedTotal = stayNights * hotel.price;
```

For example, if the nightly price is ₹2,500 and the stay is 3 nights:

```text
₹2,500 × 3 nights = ₹7,500 estimated total
```

`formatPrice(amount)` uses `toLocaleString("en-IN")` to display Indian-style
comma grouping, such as `₹7,500`. The same calculation and formatting are used
in the live estimate and the confirmation summary.

## Important React and JavaScript concepts

### React concepts

- **Component:** A function that returns a reusable piece of UI, such as
  `Search` or `Nav`.
- **JSX:** HTML-like syntax inside JavaScript. Use `className` instead of
  `class`; use `{expression}` to insert JavaScript values.
- **Props:** Inputs passed from a parent. Example: `hotels` passed from `App`
  to `Search`.
- **State:** Component data that can change and trigger a rerender.
- **`useState`:** Creates state and its setter. Always call the setter rather
  than assigning directly to the state variable.
- **`useEffect`:** Runs side-effect logic after rendering. Here it resets the
  carousel when the hotel id changes.
- **Conditional rendering:** `condition ? A : B` or `condition && A` chooses
  which JSX to show. Used for booking confirmation, the preview, and empty
  states.
- **Event handlers:** Functions such as `onChange`, `onClick`, and `onSubmit`
  respond to user activity.
- **List rendering and keys:** `.map()` creates a component for each item.
  `key={hotel.id}` helps React match items when a list changes.
- **Lifting state up:** Hotel state is in `App` because several pages need to
  share and update it.

### JavaScript concepts

- **Arrays and objects:** Hotel records are objects in the `initialHotels`
  array.
- **Array methods:** `.map()` transforms data into UI or updated arrays;
  `.filter()` removes non-matching records; `.find()` finds one record;
  `.slice()` selects a page of results.
- **Arrow functions:** Compact function syntax used for handlers and callbacks.
- **Template strings:** Backticks insert values into route paths and messages,
  for example `` `/hotel/${hotel.id}` ``.
- **Spread syntax:** `{ ...hotel }` copies an object; `[...hotels, newHotel]`
  copies an array and appends an item.
- **Numbers and strings:** Form values start as strings; `Number()` converts
  price and coordinates for calculations.
- **Destructuring:** `const { name, value } = event.target` extracts properties
  from an object.
- **Modulo (`%`):** Keeps carousel image indexes within the gallery range.
- **Date and timestamps:** `Date`, `Date.UTC`, and milliseconds calculate
  calendar stay length and unique-enough demo ids.

## CSS and responsive design

CSS files are imported by components or the entry point. The browser combines
these rules to style all rendered JSX. Classes connect the two: for example,
`className="hotel-details-page"` in JSX is targeted by `.hotel-details-page` in
`search.css`.

Common techniques used in this app:

- CSS Grid and Flexbox arrange cards, forms, and navigation.
- `min()` and `minmax()` let widths adapt to available screen space.
- `@media` rules change columns, padding, and navigation wrapping on phones.
- `background` gradients add contrast over hotel photography.
- `object-fit: cover` crops photos without stretching them.
- `:hover`, `:focus`, and `:disabled` style different interaction states.
- `transition` and `@keyframes` provide small animations.
- `rgba(...)` colors have an alpha value for transparency.

The UI is split among page-specific stylesheets so each screen can be adjusted
without placing all styling in one file. `index.css` holds global defaults.

## How to run the project

Install Node.js and npm, then open a terminal in the project folder:

```bash
npm install
npm run dev
```

Vite prints a local URL (commonly `http://localhost:5173`). Open it in a
browser. To check the production build:

```bash
npm run build
npm run preview
```

To run the configured lint checks:

```bash
npm run lint
```

## Common errors and how to fix them

| Symptom | Likely reason | What to check |
| --- | --- | --- |
| `npm` or `node` is not recognized | Node.js is not installed or terminal PATH is stale | Install Node.js LTS and reopen the terminal |
| `Failed to resolve import` | A filename, capitalization, or import path is wrong | Compare the import exactly with the file name |
| Hotel image is broken | Asset path/name does not match a file in `public/` | Use `/filename.jpg` for a file at `public/filename.jpg` |
| Details says Hotel Not Found | URL id is not present in the current `hotels` array | Check the selected card id and route parameter |
| New/edited hotel disappears after refresh | Data is only stored in React memory | Add a backend or browser persistence if durable storage is required |
| Uploaded image disappears after refresh | `URL.createObjectURL()` makes a temporary browser URL | Upload/store the file persistently for a production app |
| `NaN` appears in a price calculation | A value is empty or was not converted to a number | Check input values and `Number(...)` conversion |
| Filter looks unchanged before pressing Filter | Price fields are applied on form submit | Submit the filter form; name search updates as you type |
| Build output has an error | JSX syntax or CSS/import problem | Read the first Vite error and inspect the named file/line |

## Beginner study notes

1. Start at `index.html`, then read `src/main.jsx`, then `src/App.jsx`.
2. In `App.jsx`, follow the props passed into each `<Route>`.
3. In a child component, look for `useState` to learn which values can change.
4. Find event props (`onClick`, `onChange`, `onSubmit`) to see what user actions
   change state.
5. Follow a setter to see how the next render is produced.
6. Follow route strings to see how navigation connects components.
7. Pair JSX class names with the matching CSS selectors.
8. Try one small change at a time and run `npm run build`.
9. Remember that visual confirmation is not the same as backend persistence.

### Useful interview revision questions

- Why is `hotels` stored in `App` rather than separately in every page?
- What causes a React component to render again after `setHotels()`?
- Why do list items need stable keys?
- What is the difference between a prop and state?
- How does `/hotel/:id` pass an id to `HotelDetails`?
- Why does edit use `.map()` while delete uses `.filter()`?
- Why does `getStayNights()` calculate from UTC timestamps?
- Why is this booking confirmation not equivalent to a real booking system?

## Complete project workflow

```text
Start application
  → main.jsx mounts App inside #root
  → App initializes initialHotels in state
  → NavLink changes the route
  → Routes renders the matching page
  → page reads hotel props and/or manages its local form state
  → user action calls a handler
  → handler validates or transforms data
  → state setter updates the shared or local state
  → React rerenders the affected UI
```

Typical user journeys:

1. **Browse:** Hotels route → Search component → filter/search → card list →
   pagination if necessary.
2. **Inspect and book:** View Details → URL contains hotel id → details and
   gallery render → dates determine nights → bill updates → submit shows
   Booking Confirmed.
3. **Add:** Add hotel → enter fields → optional preview → submit → shared list
   grows → return to Hotels.
4. **Edit:** Edit hotel → select a card → update form → submit → matching list
   item is replaced → return to Hotels.
5. **Delete:** Delete hotels → select Delete → confirm → matching list item is
   removed.
6. **Learn:** Help & Support → read instructions or expand a FAQ → use the
   support email link if needed.

Following these paths while reading the matching component is a practical way
to study how routing, props, state, events, and rendering fit together.
