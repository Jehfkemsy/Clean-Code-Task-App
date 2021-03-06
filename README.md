# Clean Code Task App

This is a feature-rich Task Management example application that is built with TypeScript and PostgreSQL, heavily inspired by many of the well-known .NET Enterprise Patterns, such a three-layer architecture and Unit of Work.

Features and Setup:
- Infrastructure
  - PostgreSQL
  - HTTP/REST
- Architecture
  - Three-Layer (Controller/Service/Repository/Mapper)
  - Domain/Database Model Separation and Mapping
  - Dependency Injection
  - Command-Query Separation (CQS)
- Patterns
  - Adapters/Facades
  - Composition/Delegation
  - Singleton
  - Observer
  - Factory/Builder
  - Inversion of Control
- File Upload
  - AWS S3 and GCP Adapters for Streaming
    - Avatar Images and on-the-fly pre-processing
    - EXIF Metadata Removal during pre-processing
- Jobs
  - Deferred Job Processing
  - Bull Job Queueing on top of Redis
- Security
  - Helmet and OWASP Best Practices
  - Endpoint Rate Throttling/Rate Limiting
  - IP Address Blacklisting
  - Lockout for incorrect login attempts
  - Bcrypt Password Hashing and JSON Web Tokens
  - Environment Variables
- General
  - Email Confirmations for login
  - Multi-day email onboarding
- Production Environment
  - Logging
  - Clustering
  - Development, Staging, Release
  - HTTP Health Check
- Testing
  - Unit/Integration (E2E)/Mutation

## Author

Jamie Corkhill