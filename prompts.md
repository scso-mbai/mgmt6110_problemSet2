# prompts.md
Student: Sean Eric So · Course: MGMT 6110 · Problem Set 1

## 1. First attempt at the API function with Open-Meteo

ROLE: You are a senior full-stack developer working in my existing project. Do not rewrite what is already there; add to it.

GOAL: My screen currently shows the user’s base as a hard-coded value “City Hall”. Replace it with real data from Open-Meteo, fetched through a serverless function of my own.
 1) api/location_tracker.js—calls https://geocoding-api.open-meteo.com/v1/search?name=Singapore&count=1, returns only the fields my screen needs, and nothing else.
 2) api/health.js—reports whether the credential is configured (keyConfigured) and whether the upstream answered, including the HTTP status it returned. It must
    never print the credential or any part of it.
 3) On the screen, replace the hard-coded value with the live one, and decide what the user sees in each of these four cases: the data is loading, the data is
    empty, the upstream refused, and the upstream is unreachable. I want four different sentences, not one spinner.

OUTPUT: Both functions at api/ in the PROJECT ROOT, siblings of package.json, never
 inside src/. If this project has a server entry file, register the same two routes there too,
 because that is the shape the preview can answer. If it has no server file, skip
 that and tell me so rather than inventing one.
 Make sure package.json contains "type": "module".
 BEFORE the fetch, if the credential is missing or empty, return 503 with a message
 naming the variable, and do not call the upstream at all. A missing variable is sent
 as the word "undefined" and looks exactly like a wrong credential, so stop it early.
 AFTER the fetch, check response.ok before reading the body. A refusal often has an
 empty body, so calling .json() on it throws and my function dies with a 500 instead
 of telling me what happened. On a non-2xx reply, return the upstream status and a
 one-line reason in your own JSON.
 Cache the response for 5 to 60 seconds with Cache-Control: s-maxage=[N],
 stale-while-revalidate=[2N], matching how often the source actually changes.
 In the footer, credit the source in the exact form the provider's licence asks for.

GUARDRAILS: Never write the credential into any file, comment or README. Never create
 a variable whose name starts with VITE_. Never call the upstream from browser code;
 every call happens inside api/. Never print the credential, or any part of it, in a
 response or a log. No new npm packages. No database, no login. Leave every screen I
 already have working exactly as it is.

CONTEXT: Deployed on Vercel from GitHub. The credential lives only in a Vercel
 environment variable named location. A real response from the endpoint,
 called by hand just now, looks like this:
Your Base: Woodlands
Your Base: City Hall
Your Base: Orchard
Your Base: Novena
Your Base: Bishan
Your Base: Stevens
Your Base: Serangoon
Your Base: Bright Hill
Your Base: Toa Payoh
Your Base: Bugis
Your Base: Promenade
Your Base: Gardens by the Bay
Your Base: Woodlands South
Your Base: MacPherson
Your Base: Marymount

Came back with: A UI element that attempts to track the user's current location, however this version always came with an "unreachable" result.
Action: Switch to using Geolocation API instead of Open-Meteo

## 2. Second attempt at the API function with Geolocation API

Undo what was instructed in the GOAL of the previous prompt, as I realise that Open-Meteo cannot be used to determine one's location. For the GOAL, instead use this:

"GOAL: My screen currently shows current area as a hard-coded value. Replace it with
real data from the browser's built-in Geolocation API (navigator.geolocation), fetched through a serverless function of my own.
 1) api/location.js—calls N/A — navigator.geolocation.getCurrentPosition() must be called in the user's browser and has no HTTP endpoint, returns only the fields my screen
    needs, and nothing else.
 2) api/health.js—reports whether the credential is configured (keyConfigured) and
    whether the upstream answered, including the HTTP status it returned. It must
    never print the credential or any part of it.
 3) On the screen, replace the hard-coded value with the live one, and decide what
    the user sees in each of these four cases: the data is loading, the data is
    empty, the upstream refused, and the upstream is unreachable. I want four
    different sentences, not one spinner."

Do not change anything else.

Came back with: An app that asks the browser for current location privileges and UI element that is attempting to display the current location.
Action: Determine if location access code is working and whether the correct UI elements are being displayed

## 3. Updating UI element that displays user location

For the UI sentences, please make them shorter so that they do not take up the whole screen. Use phrases such as "Loading" or "Unavailable". Do not change anything else.

Came back with: The UI element using one word or two words to describe its location status as opposed to the full sentences it was originally using.

## 4. Fixing typo's in UI element

Please update the UI status phrases so that each word is capitalised. Also do not include a single "." at the end of those that are not the Loading state.

Came back with: The UI element capitalizing every word displayed to make the site look more professional.

## 5. Adding a backend system that tracks how far the user is from different hobby stores

GOAL: Add distance and public-transport accessibility information to each hobby store in the store locator.
 1) Use the user's latitude and longitude obtained from the browser's existing Geolocation API.
 2) Every hobby store must have latitude and longitude coordinates.
 3) Calculate the straight-line distance between the user's coordinates and each store's coordinates using the Haversine formula. Do this locally in the application. Do not call LTA DataMall just to calculate geographical distance.
 4) For every store, calculate: distanceKm Round the displayed value appropriately:
below 1 km: display metres, e.g. 650 m away
 5) 1 km or more: display kilometres, e.g. 2.4 km away

Came back with: An app that supposedly calculates the user's distance from a hobby store. The hobby stores currently displayed in this app are not really, but the calculation is still conducted regardless. Locations of stores are not available on any free API. Another aspect I would've liked to include were the product prices from the online e-commerce platform TCGPlayer. However, that API is not available for unauthorised users, therefore could not reliably implement TCGplayer as the application's live pricing source.

## 6. Updating backend permission properties to enable Geolocation API (This prompt was created with the help of an LLM)

My browser Geolocation API implementation is reporting that location access was refused even though I have explicitly allowed location access for the site in Google Chrome.
Do not replace the Geolocation API and do not use IP-based geolocation.

Diagnose the existing implementation first.
 1) Inspect how navigator.geolocation.getCurrentPosition() is currently being called.
 2) Before requesting location, log these diagnostics to the console:
- window.isSecureContext
- window.location.origin
- whether navigator.geolocation exists
 3) Query the browser's geolocation permission using: navigator.permissions.query({ name: "geolocation" }) Log whether the returned state is:
- granted
- prompt
- denied
 4) When navigator.geolocation.getCurrentPosition() fails, log the complete error information:
- error.code
- error.message
 5) Distinguish between these GeolocationPositionError codes:
1 = PERMISSION_DENIED
2 = POSITION_UNAVAILABLE
3 = TIMEOUT
 6) Do not display every geolocation failure to the user as "Location access refused." Display:
- PERMISSION_DENIED: Location access is unavailable or has been blocked.
- POSITION_UNAVAILABLE: Your current location could not be determined.
- TIMEOUT: Determining your location took too long. Please try again.
 7) Detect whether the application is running inside an iframe using: window.self !== window.top If it is running inside an iframe, log: App is running inside an iframe. Geolocation may be restricted by the parent page's Permissions Policy.
 8) Do not attempt to bypass browser permissions or iframe restrictions.
 9) Preserve the existing application and UI. Only modify the location implementation and diagnostics necessary to determine why geolocation is failing.
 10) After making these changes, explain in the response which part of the existing implementation was causing the location request to fail.

Came back with: An app that properly determines the user's current base and displays it on the screen.
