# Artverse

**Artverse** is an AI-based image sharing platform designed for seamless user interaction and enhanced visual content discovery. The platform is divided into four submodules:
- **ArtCore**: Frontend built with Next.js (Typescript).
- **ArtEngine**: Backend powered by FastAPI, with PostgreSQL and MilvusDB.
- **ArtFetch**: AI-based web scraper using Selenium and Python.
- **ArtVault**: Central Storage Directory

## Features

- AI-powered image sharing social media platform.
- Semantic and visual search for precise content discovery.
- Personalized image recommendations.
- NSFW filter and image blurring capabilities.
- AI-based image tagging for automated categorization.
- Users can create and manage their own collections.
- Scrape images from external links.
- Detect and separate anomaly images from collections.
- Collections have weak, medium, and strong levels to manage anomaly images.
- Users can like, dislike posts, follow others, upload images, and create collections.

## Installation

Clone the repository and run the installation script to install dependencies:

```bash
git clone https://github.com/Silversoul-07/Artverse.git
cd Artverse
bash install.sh
```
## Usage

To start the frontend and all servers:

```bash
bash start.sh
```

## Technologies
**Frontend (Core):** Next.js, TypeScript  
**Backend (Engine):** FastAPI, Python, PostgreSQL, MilvusDB  
**Web Scraping (Fetch):** Python, Selenium


## Contributing
Contributions are welcome! Feel free to fork the repository and submit pull requests :).

## License
This project is licensed under the GPLv3 License.