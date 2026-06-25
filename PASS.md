# Password & Security Guidelines

## Default Credentials

For development purposes, the following demo accounts are available after running the seed:

| Username | Password |
|----------|----------|
| alice | password123 |
| bob | password123 |

## Security Best Practices

### Environment Variables
- Never commit `.env` files to version control
- Use strong, unique `JWT_SECRET` in production
- Configure `CORS_ORIGIN` to restrict allowed origins

### Production Checklist
- [ ] Change all default passwords
- [ ] Enable HTTPS
- [ ] Set secure cookie flags
- [ ] Configure rate limiting
- [ ] Set up proper logging
- [ ] Use environment-specific database credentials

### JWT Configuration
- Use strong secret key (min 32 characters)
- Set appropriate token expiration
- Consider refresh token implementation

## Password Requirements

When implementing user registration:
- Minimum 8 characters
- Mix of letters, numbers, and symbols recommended
- No common passwords
