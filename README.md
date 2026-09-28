# Nirendra Patel Calculator

A complete, dependency-free website with a welcome page and a responsive calculator.

## Run locally

Open `index.html` in a browser. For a local web-server preview, run `python -m http.server 8000` from this folder and open `http://localhost:8000`.

## Put it online

Upload the contents of this folder to any static web host, such as GitHub Pages, Netlify, or Cloudflare Pages. Set the publish/root directory to this folder; there is no build step. The welcome page is `index.html` and the calculator page is `calculator.html`.

The calculator checks the browser's network connection and blocks calculator use while offline. It does not cache pages for offline use. The first visit to a hosted site requires internet access. A local preview is, naturally, served from your own device.

## Visitor privacy

Calculations are performed in the visitor's browser and are not sent to the owner. The site does not record keystrokes or collect arbitrary typed content. To accept information from visitors, add a clearly labeled form with explicit consent and connect it to a service or server endpoint you control; no destination email or backend was supplied, so this project does not transmit visitor data.
