# Software Security Fundamentals

Security should be a primary consideration throughout the software development lifecycle. Understanding common vulnerabilities and security practices is essential for building secure applications.

## OWASP Top 10 Web Application Risks

### 1. Injection Flaws
SQL, NoSQL, OS, and LDAP injection occur when untrusted data is sent to an interpreter.

**Prevention**: Use parameterized queries, input validation, and least privilege principles.

### 2. Broken Authentication
Application functions related to authentication and session management are often implemented incorrectly.

**Prevention**: Multi-factor authentication, secure session management, strong password policies.

### 3. Sensitive Data Exposure
Applications often don't properly protect sensitive data like financial, healthcare, and personal information.

**Prevention**: Encrypt data at rest and in transit, minimize data collection, secure key management.

### 4. XML External Entities (XXE)
Poorly configured XML processors evaluate external entity references within XML documents.

**Prevention**: Disable XML external entity processing, use less complex data formats like JSON.

### 5. Broken Access Control
Restrictions on authenticated users are often not properly enforced.

**Prevention**: Implement proper authorization checks, deny by default, principle of least privilege.

## Security Best Practices

### Input Validation
- Validate all inputs on the server side
- Use allowlists rather than blocklists
- Sanitize data before processing

### Authentication & Authorization
- Use established authentication frameworks
- Implement proper session management
- Multi-factor authentication for sensitive operations

### Cryptography
- Use established cryptographic libraries
- Proper key management and rotation
- Strong random number generation

### Error Handling
- Don't expose sensitive information in error messages
- Log security events for monitoring
- Fail securely when errors occur

## Security Testing

- Static Application Security Testing (SAST)
- Dynamic Application Security Testing (DAST)
- Interactive Application Security Testing (IAST)
- Penetration testing
- Code reviews with security focus