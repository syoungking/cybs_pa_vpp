# PA+VPP Demo Project

## Project Introduction

This project is a dynamic demo website for PA+VPP payment authentication flows, implemented using pure HTML + JavaScript + Express.js technology stack with a complete frontend-backend architecture. The project supports FIDO/Init, PA Setup, DDC (Device Data Collection), VPP Enrollment Flow, and VPP Authentication Flow processes.

## Technology Stack

- **Frontend**: HTML5, JavaScript (ES6+), CSS3
- **Backend**: Express.js, jsonwebtoken, cors
- **Dependencies**: JWT (HS256 algorithm), REST API calls, cross-origin, iframe embedding

## Environment Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure HTTPS Certificates

The project includes self-signed HTTPS certificates in the `ssl` directory:
- `ssl/key.pem`: Private key
- `ssl/cert.pem`: Certificate

### 3. Configuration File

The configuration file is located at `config/app.properties` and contains the following configuration items:

```properties
SANDBOX_SITE=https://centinelapistag.cardinalcommerce.com/
PROD_SITE=https://centinelapi.cardinalcommerce.com/
FIDO_INIT=V2/FIDO/Init
FIDO_CHALLENGE=V2/FIDO/Challenge
JWT_API_KEY_ID=61a79c46a8bd2d6dd6ab521a
JWT_ORG_UNIT_ID=61a79c46a8bd2d6dd6ab5219
JWT_SECRET=af3aeed1-bac4-41f6-93e8-050eed0e1484
MERCHANT_ORIGIN=Project domain  # Replace with actual domain
RETURN_URL=Project callback URL  # Replace with actual callback URL
```

**Note**: Upon first run, the system will check configuration integrity but will not automatically redirect to the configuration page. Please access the configuration page through the "Configurations" button on the homepage to modify configuration items as needed.

## Startup Steps

### Start the Server

```bash
npm start
```

The server will run on `https://localhost:8443`.

### Access the Project

Open a browser and navigate to `https://localhost:8443`:
- The homepage displays the main functionality interface
- You can select the environment (Sandbox/Production) and follow the steps to execute the complete flow

## Feature Description

### 1. Configuration Management

- View and edit all configuration items
- Configuration is persisted to `config/app.properties` file
- Configuration page is available for modifying settings at any time

### 2. Card Information Management

- Support for manual input of card number and expiration date
- Real-time card number format validation and Luhn check
- Automatic removal of non-numeric characters from card numbers

### 3. FIDO/Init Flow

1. Select environment (Sandbox/Production)
2. Click "FIDO Init" button
3. System generates JWT and submits via iframe to Cardinal Commerce
4. Receive callback and verify JWT
5. Display request and response information
6. Parse ReferenceId from Response

### 4. PA Setup Flow

1. Parse FIDO/Init Response to get ReferenceId
2. Click "Generate PA Setup request" button
3. System generates PA Setup request
4. Display generated request information

### 5. DDC (Device Data Collection) Flow

1. Click "Run DDC" button
2. System submits form via hidden iframe to Cardinal Commerce
3. System sets 10-second timeout, displays "Device information collection timeout" if exceeded
4. After receiving callback, determine based on ActionCode:
   - ActionCode=SUCCESS: Display "Device information collection successful"
   - Other cases: Display "Device information collection failed"

### 6. VPP Enrollment Flow

1. Click "Generate PA Enroll request for VPP Enrollment Flow" button
2. System generates PA Enroll request
3. Paste PA Enroll Response into text box
4. Click "StepUp" button
5. System submits StepUp request via iframe
6. Click "Generate PA Validate request" button
7. System generates PA Validate request
8. Paste PA Validate Response into text box
9. If authentication is successful, display "Authentication Successful" and show "FIDO Challenge" button
10. Click "FIDO Challenge" button to execute FIDO Challenge flow

### 7. VPP Authentication Flow

1. Click "Execute FIDO Challenge" button
2. System executes FIDO Challenge flow
3. Click "Generate PA Enroll Request" button
4. System generates PA Enroll request
5. Paste PA Enroll Response into text box

### 8. Error Handling

- JWT generation failure: Display error message
- API call timeout/failure: Display error message
- JWT verification failure: Display error message
- Callback reception exception: Display error message
- Configuration missing: Prompt user to enter configuration page

## Project Structure

```
PAVPP-Project/
├── public/            # Frontend static files
│   ├── css/          # Style files
│   │   └── styles.css
│   ├── index.html    # Main page
│   └── fido-form.html # FIDO form page
├── config/            # Configuration files
│   └── app.properties # Application configuration
├── server/            # Backend code
│   ├── configManager.js # Configuration management
│   └── jwtManager.js  # JWT management
├── ssl/               # HTTPS certificates
│   ├── key.pem        # Private key
│   └── cert.pem       # Certificate
├── server.js          # Server entry point
├── package.json       # Project configuration
└── README.md          # Project documentation
```

## Notes

1. This project uses self-signed HTTPS certificates, which may trigger browser security warnings. Please select "Continue to visit".
2. Ensure `MERCHANT_ORIGIN` and `RETURN_URL` are configured correctly, otherwise callback failures may occur.
3. This project is for demo purposes only. Use official HTTPS certificates and configurations in production environments.
4. When entering card numbers, the system automatically removes non-numeric characters and performs Luhn validation to ensure correct card number format.

## Version

1.0.1