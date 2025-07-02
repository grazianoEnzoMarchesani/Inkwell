# Inkwell

A lightweight, secure, and self-hosted blog engine powered by Markdown.


*(You can replace this image link with a screenshot of your own blog)*

## About The Project

Inkwell is a single-page application (SPA) designed to provide a simple, elegant, and secure personal blog. It was born out of the desire to have a personal blog integrated into an existing website, without relying on expensive and often restrictive third-party services like Elfsight or Powr.

The core philosophy is to empower users with full control over their content, with management being as simple as editing a text file. It is built to be embedded, performant, and secure from the ground up.

## Key Features

*   **Zero Backend:** Runs entirely in the browser. No databases, no server-side processing needed.
*   **Markdown-Powered:** Write your posts in the simple and intuitive Markdown format.
*   **Secure by Design:** All rendered HTML is sanitised using **DOMPurify** to prevent XSS attacks, making it safe to use content from external files.
*   **Mobile-First & Responsive:** Designed to look great on all devices, from mobile phones to desktop screens.
*   **Blazing Fast:** A single initial fetch for the post index, with individual post content loaded on-demand.
*   **Simple Management:** Adding a new post is a two-step process: drop a new `.md` file into a folder and add one line to an index file.
*   **Built-in Filtering and Searching:** Allows readers to easily find content by title, tag, or year.
*   **Easily Embeddable:** Perfect for use within an `<iframe>` on an existing website.
*   **No Build Tools Required:** Built with vanilla JavaScript, HTML, and CSS. No need for Node.js, npm, or complex build steps.

## Tech Stack

*   **HTML5**
*   **CSS3** (Flexbox & Grid)
*   **Vanilla JavaScript (ES6+)**
*   [Marked.js](https://marked.js.org/) - For Markdown to HTML conversion.
*   [DOMPurify](https://github.com/cure53/DOMPurify) - For HTML sanitisation and XSS prevention.

## Getting Started

To get a local copy up and running, follow these simple steps.

### 1. Download the Project

Clone or download this repository to your local machine or web server.

```bash
git clone https://github.com/your-username/inkwell.git
