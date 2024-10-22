# Image Converter
A simple server to convert image to webp format.

## Requirement
- Node.js
- Express.js
- Axios
- Sharp
- Crypto
- Body-parser

## How to use
1. Clone this repository
2. Install dependencies with `npm install`
3. Run the server with `node server.js`
4. Send a POST request to `http://localhost:4000/convert` with the following body:
    - `url_gambar`: the URL of the image to be converted
    - `persentase_kompresi`: the percentage of compression (optional, default is 60)
5. The server will return a JSON response with the following properties:
    - `url_webp`: the URL of the converted image
    - `ukuran_webp`: the size of the converted image in bytes
    - `status`: the status of the request (success or error)
    - `message`: a message describing the result of the request

## Example
