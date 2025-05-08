# Portfolio Uploader

A React-based frontend application integrated with a Spring Boot backend for uploading and analyzing portfolio images.

## Features

- Upload portfolio images to an S3 bucket.
- Analyze uploaded images and provide suggestions.
- React frontend with Axios for API communication.
- Spring Boot backend for handling media uploads and analysis.

---

## Prerequisites

- **Node.js** (v16 or later)
- **npm** (v7 or later)
- **Java** (JDK 11 or later)
- **Maven** or **Gradle**

---

## Installation

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/portfolio-uploader.git
cd portfolio-uploader

Install Frontend Dependencies:
>>npm install

Build and Run the Backend
Navigate to the backend directory (if applicable) and run:

For Maven:
>>./mvnw clean install
  ./mvnw spring-boot:run

For Gradle:
>>./gradlew build
  ./gradlew bootRun

Running the Application
1. Start the Frontend
>>npm start

The React application will run at http://localhost:3000.

2. Start the Backend
The Spring Boot backend will run at http://localhost:8080.



Project Structure
Frontend
React: Handles the user interface.
Axios: Used for making API requests.
Backend
Spring Boot: Manages API endpoints.
Kotlin: Backend code is written in Kotlin.


Dependencies
Frontend
axios: ^1.9.0
react: ^19.1.0
Backend
Spring Boot dependencies (defined in pom.xml or build.gradle).
API Endpoints
Media Upload


API Endpoints
Media Upload
Endpoint: POST /api/user/chat/media/upload
Description: Uploads portfolio images and returns S3 URLs.
Chat Analysis
Endpoint: POST /api/user/chat
Description: Analyzes uploaded images and provides suggestions.
License
This project is licensed under the MIT License. See the LICENSE file for details.


