# Contributing to SportX India CPD Platform

Thank you for your interest in contributing to the SportX India CPD Platform! This document provides guidelines and information for contributors.

## 🤝 Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow
- Maintain professional communication

## 🛠 Development Setup

1. **Prerequisites**
   - Node.js 20 or higher
   - npm or yarn package manager
   - Git for version control

2. **Local Setup**
   ```bash
   git clone <repository-url>
   cd sportx-cpd-platform
   npm install
   cp .env.example .env
   npm run dev
   ```

3. **Database Setup**
   ```bash
   npm run db:push
   cd scripts && npx tsx seed-database.ts
   ```

## 📋 Development Guidelines

### Code Style

- **TypeScript**: Use strict typing, avoid `any`
- **React**: Use functional components with hooks
- **Styling**: Use Tailwind CSS classes, avoid custom CSS
- **Naming**: Use descriptive variable and function names
- **Comments**: Add JSDoc for complex functions

### File Organization

```
├── client/src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Page components
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utility functions
│   └── types/          # Type definitions
├── server/
│   ├── routes.ts       # API route definitions
│   ├── storage.ts      # Data access layer
│   └── middleware/     # Express middleware
└── shared/
    └── schema.ts       # Database schema and types
```

### Git Workflow

1. **Branch Naming**
   - `feature/description` - New features
   - `bugfix/description` - Bug fixes
   - `hotfix/description` - Critical fixes
   - `docs/description` - Documentation updates

2. **Commit Messages**
   ```
   type(scope): description
   
   feat(auth): add user registration functionality
   fix(api): resolve events endpoint error
   docs(readme): update installation instructions
   style(ui): improve button component styling
   ```

3. **Pull Request Process**
   - Create feature branch from `main`
   - Make changes with descriptive commits
   - Update documentation if needed
   - Submit PR with clear description
   - Address review feedback
   - Merge after approval

## 🧪 Testing

### Running Tests
```bash
npm run test                # Run all tests
npm run test:watch         # Run tests in watch mode
npm run test:coverage      # Run with coverage report
```

### Writing Tests
- Write unit tests for utility functions
- Add integration tests for API endpoints
- Include component tests for React components
- Test error scenarios and edge cases

### Test Structure
```typescript
describe('Component/Function Name', () => {
  beforeEach(() => {
    // Setup code
  });

  it('should perform expected behavior', () => {
    // Test implementation
  });

  it('should handle error cases', () => {
    // Error testing
  });
});
```

## 🎯 Feature Development

### Adding New Features

1. **Planning**
   - Create issue describing the feature
   - Discuss implementation approach
   - Plan database schema changes
   - Design API endpoints

2. **Implementation**
   - Update database schema if needed
   - Create backend API endpoints
   - Implement frontend components
   - Add comprehensive tests
   - Update documentation

3. **Review Process**
   - Self-review code changes
   - Submit pull request
   - Address reviewer feedback
   - Update based on suggestions

### Database Changes

1. **Schema Updates**
   ```bash
   # Update shared/schema.ts
   npm run db:push
   ```

2. **Seeding Updates**
   - Update seed data if needed
   - Test with fresh database
   - Document changes in SEEDING_GUIDE.md

## 🐛 Bug Reports

### Reporting Bugs

Include the following information:
- **Description**: Clear description of the issue
- **Steps to Reproduce**: Detailed steps to reproduce
- **Expected Behavior**: What should happen
- **Actual Behavior**: What actually happens
- **Environment**: OS, browser, Node.js version
- **Screenshots**: If applicable

### Bug Fix Process

1. Create issue or assign existing issue
2. Create bugfix branch
3. Identify root cause
4. Implement fix with tests
5. Verify fix resolves issue
6. Submit pull request

## 📚 Documentation

### Documentation Standards

- Use clear, concise language
- Include code examples
- Keep documentation up-to-date
- Add screenshots for UI changes

### Types of Documentation

- **API Documentation**: Endpoint descriptions and examples
- **Component Documentation**: Props and usage examples
- **Setup Guides**: Installation and configuration
- **Architecture Documentation**: System design and decisions

## 🚀 Release Process

### Version Numbering

Follow semantic versioning (SemVer):
- **Major**: Breaking changes
- **Minor**: New features, backward compatible
- **Patch**: Bug fixes, backward compatible

### Release Steps

1. Update version in package.json
2. Update CHANGELOG.md
3. Create release notes
4. Tag release in Git
5. Deploy to production
6. Announce release

## 💡 Getting Help

- **Questions**: Create discussion in repository
- **Issues**: Create issue with appropriate labels
- **Chat**: Use team communication channels
- **Documentation**: Check existing docs first

## 🎨 UI/UX Guidelines

### Design Principles

- **Accessibility**: WCAG 2.1 AA compliance
- **Responsive**: Mobile-first design
- **Performance**: Fast loading and smooth interactions
- **Consistency**: Use design system components

### Component Development

- Use shadcn/ui components as base
- Follow Tailwind CSS patterns
- Implement proper loading states
- Handle error scenarios gracefully

Thank you for contributing to the SportX India CPD Platform!