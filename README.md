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
 . Project Setup (Using Spring Initializr)
Go to start.spring.io

Select:

Project: Gradle - Kotlin

Language: Kotlin

Spring Boot: 3.2.x (or latest stable)

Add Dependencies:

Spring Web

Generate the project and download the ZIP

2. Project Structure
After unzipping, your project should look like:

arthplus-chat-api/
├── src/
│   ├── main/
│   │   ├── kotlin/com/wealthera/arthplus/api/
│   │   │   └── ChatController.kt
│   │   └── resources/
│   │       ├── application.properties
│   │       └── (other config files)
│   └── test/
├── build.gradle.kts
└── settings.gradle.kts
3. Complete build.gradle.kts
kotlin
plugins {
    id("org.springframework.boot") version "3.2.0"
    id("io.spring.dependency-management") version "1.1.4"
    kotlin("jvm") version "1.9.20"
    kotlin("plugin.spring") version "1.9.20"
}

group = "com.wealthera"
version = "0.0.1-SNAPSHOT"

java {
    sourceCompatibility = JavaVersion.VERSION_17
}

repositories {
    mavenCentral()
}

dependencies {
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("com.fasterxml.jackson.module:jackson-module-kotlin")
    implementation("org.jetbrains.kotlin:kotlin-reflect")
    testImplementation("org.springframework.boot:spring-boot-starter-test")
}

tasks.withType<Test> {
    useJUnitPlatform()
}
4. Create the Controller
Create ChatController.kt in src/main/kotlin/com/wealthera/arthplus/api/ with your provided code.

5. Run the Application
Option 1: Using Gradle

bash
./gradlew bootRun
# or on Windows
gradlew.bat bootRun
Option 2: Using IDE

Open the project in IntelliJ IDEA

Locate the main application class (should be auto-generated)

Run the main method

6. Test the Endpoints
Once running (default port 8080):

Test media upload:

bash
curl -X POST http://localhost:8080/api/user/chat/media/upload \
-H "Content-Type: application/json" \
-d '{
  "sessionId": "test123",
  "customerId": 123,
  "medias": [
    {
      "type": "image",
      "fileName": "test.jpg",
      "requestId": "req1",
      "description": "Test image"
    }
  ]
}'
Test chat analysis:

bash
curl -X POST http://localhost:8080/api/user/chat \
-H "Content-Type: application/json" \
-d '{
  "sessionId": "test123",
  "customerId": 123,
  "message": "Analyze this",
  "medias": [
    {
      "type": "image",
      "url": "https://example.com/test.jpg",
      "description": "Test image"
    }
  ]
}'
7. Expected Output
You should see responses like:

json
// For media upload
{
  "status": "SUCCESS",
  "errorCode": "0",
  "message": "",
  "timestamp": [current_timestamp],
  "uploadedMedia": [
    {
      "type": "image",
      "requestId": "req1",
      "url": "https://arth-s3-storage-prod.s3.amazonaws.com/images/123/test123/test.jpg",
      "description": "Portfolio image uploaded"
    }
  ]
}

// For chat analysis
{
  "timestamp": [current_timestamp],
  "body": {
    "message": "Analyze portfolio",
    "medias": [
      {
        "type": "image",
        "url": "https://arth-s3-storage-prod.s3.amazonaws.com/images/123/test123/analysis_result.jpg",
        "description": "portfolio"
      }
    ],
    "suggestedFollowUps": [
      {
        "content": "Would you like me to focus on a specific aspect of the image..."
      },
      {
        "content": "What would you like to do next?"
      }
    ]
  },
  "message": "",
  "errorCode": "0",
  "status": "SUCCESS"
}
8. Additional Configuration (Optional)
Add to application.properties:

properties
# Change server port if needed
server.port=8080

# Enable pretty-print JSON
spring.jackson.serialization.indent-output=true
This gives you a fully functional Spring Boot Kotlin API with the two endpoints you designed. The application will run with an embedded Tomcat server.

I'll help you run this React component that interacts with your Spring Boot API. Here's how to set it up and run it:

1. Create a React Project (if you don't have one)
bash
npx create-react-app arthplus-frontend --template typescript
cd arthplus-frontend
2. Install Dependencies
bash
npm install axios
npm install --save-dev @types/react @types/react-dom
3. Replace the App Component
Create a new file src/PortfolioUploader.tsx and paste your component code.

4. Modify src/App.tsx
tsx
import React from 'react';
import PortfolioUploader from './PortfolioUploader';
import './App.css';

function App() {
  return (
    <div className="App">
      <PortfolioUploader />
    </div>
  );
}

export default App;
5. Run the Application
bash
npm start
6. Important Configuration Notes
API Base URL:

The component uses https://co.inwealthera.com/api/user/chat as the base URL

For local development, you might want to change this to http://localhost:8080/api/user/chat

Authentication:

The component expects an auth token in localStorage

You can set a test token in your browser's console:

javascript
localStorage.setItem('authToken', 'your-test-token-here');
CORS Setup (in your Spring Boot app):
Add this to your Spring Boot controller or a configuration class:

kotlin
@Configuration
class WebConfig : WebMvcConfigurer {
    override fun addCorsMappings(registry: CorsRegistry) {
        registry.addMapping("/**")
            .allowedOrigins("http://localhost:3000") // React default port
            .allowedMethods("*")
            .allowedHeaders("*")
    }
}
7. Complete Flow
Upload Files:

Select one or more image files

Click "Upload" to get S3 URLs from your backend

Analyze Portfolio:

After successful upload, click "Analyze Portfolio"

The component will send the image URLs to your analysis endpoint

Display the results including follow-up questions

8. Error Handling
Consider adding error handling to your axios calls:

tsx
try {
  const { data: uploadRes } = await axios.post<MediaUploadResponse>(
    `${API_BASE}/media/upload`,
    uploadReq,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getAuthToken()}`,
      },
    }
  );
  setUploadedMedia(uploadRes.uploadedMedia);
} catch (error) {
  console.error("Upload failed:", error);
  // Show error to user
} finally {
  setLoading(false);
}
9. Styling
Add some basic styling in src/App.css:

css
.App {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

button {
  margin: 10px;
  padding: 8px 16px;
}

img {
  margin: 10px 0;
  border: 1px solid #ddd;
}

ul {
  text-align: left;
}
This will give you a functional React frontend that connects to your Spring Boot backend. The component handles:

File selection

Media upload to get S3 URLs

Portfolio analysis request

Display of results and follow-up questions

Would you like me to add any specific features or make any adjustments to this implementation?

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


