# Astound Commerce Test

![CI Badge](https://github.com/cfagudelo96/configure-test/workflows/Node%20CI/badge.svg)

This project is a technical test made for Astound Commerce. The challenge was to develop a web server able to
return a screenshot of a configurable product in the Configure public showcase. The challenge was addressed using
NestJS as the framework for the web server, and using Puppeteer to take the screenshot.

To see the solution provided working, first install the dependencies running `npm install`.
After the installation is completed run the command `npm run start` and consume the endpoint GET <http://localhost:3000/products/screenshot.>
The query parameter `resolution` can be added to decide the resolution of the taken screenshot, the valid values for this parameter are:

- '800x600'
- '1280x720'
- '1600x900'
- '1920x1080'

For quick reference, please start the server and run the following curl: `curl --location --request GET 'http://localhost:3000/products/screenshot?resolution=800x600'`

The solution uses a local in-memory cache with a TTL of 5 minutes. I acknowledge that Redis is a better solution if we contemplate multiple servers running this application.

To run the automatic tests provided, please run the command `npm run test` after the dependencies are installed.
