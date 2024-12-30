# Time Zone API Microservice

## Overview
The Time Zone API is a microservice that provides time zone information for different locations around the world. It allows users to retrieve the current time, UTC offset, and daylight saving time information for a specified location.

## Features
- Get current time for a specific location


## Endpoints
### Get Current Time
- **URL:** `/api/time`
- **Method:** `GET`
- **Query Parameters:**
    - `location` (required): The name of the location (e.g., `America/New_York`)
    - `utc-offset` (required): The UTC offset in the format `UTC±hh:mm`, where `hh` represents hours and `mm` represents minutes. Example: `UTC+02:00`, `UTC-05:00`.
    - `gmt-offset` (required): The GMT offset in the format `GMT±hh:mm`, where `hh` represents hours and `mm` represents minutes. Example: `GMT+02:00`, `GMT-05:00`.


### Get Current Time
```sh
curl -X GET "http://localhost:3000/api/time?timezone=America/Santiago"
```
```sh
curl -X GET "http://localhost:3000/api/time?utc-offset=UTC-03:00"
```
```sh
curl -X GET "http://localhost:3000/api/time?gmt-offset=GMT+03:00"
```
## Installation
1. Clone the repository:
     ```sh
     git clone https://github.com/cfzunigam/time-zone-api.git
     ```
2. Navigate to the project directory:
     ```sh
     cd time-zone-api
     ```
3. Install dependencies:
     ```sh
     npm install
     ```

## Usage
1. Start the server:
     ```sh
     npm start
     ```
2. Access the API at `http://localhost:3000`

## Test & Coverage
1. Command test with Jest:
     ```sh
     npm run test
     ```
2. Command coverage with Jest:
     ```sh
     npm run coverage
     ```
