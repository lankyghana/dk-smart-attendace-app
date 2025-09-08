# Testing Guide

## Running Tests

### Basic Commands
```bash
# Run all tests
npm test

# Run tests in watch mode (re-runs when files change)
npm run test:watch

# Run tests with UI dashboard
npm run test:ui

# Run tests once (useful for CI)
npm run test:run

# Run tests with coverage report
npm run test:coverage
```

### Test Organization

Tests are organized in the following structure:
- `src/test/` - Test utilities and setup
- `src/**/*.test.{ts,tsx}` - Unit tests next to components
- `src/lib/utils.test.ts` - Utility function tests
- `src/pages/Index.test.tsx` - Integration tests

### Test Categories

1. **Unit Tests** - Individual components and functions
2. **Integration Tests** - Component interactions and routing
3. **UI Tests** - User interface behavior and accessibility

### Writing Tests

#### Component Testing
```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@/test/utils'
import { Button } from '@/components/ui/button'

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })
})
```

#### User Interaction Testing
```tsx
import userEvent from '@testing-library/user-event'

it('handles click events', async () => {
  const user = userEvent.setup()
  const handleClick = vi.fn()
  
  render(<Button onClick={handleClick}>Click me</Button>)
  await user.click(screen.getByRole('button'))
  
  expect(handleClick).toHaveBeenCalled()
})
```

#### Mocking Components
```tsx
vi.mock('@/components/dashboard/Dashboard', () => ({
  Dashboard: () => <div data-testid="dashboard">Mocked Dashboard</div>
}))
```

### Test Utilities

Custom utilities are available in `src/test/utils.tsx`:
- `mockTeacher()` - Creates mock teacher data
- `mockStudent()` - Creates mock student data
- `mockClass()` - Creates mock class data
- `mockAttendanceRecord()` - Creates mock attendance data

### Coverage Goals

Aim for:
- **90%+ statement coverage**
- **85%+ branch coverage**
- **90%+ function coverage**
- **85%+ line coverage**

### Best Practices

1. **Test behavior, not implementation**
2. **Use meaningful test descriptions**
3. **Group related tests with `describe`**
4. **Mock external dependencies**
5. **Test edge cases and error conditions**
6. **Use accessibility queries (getByRole, getByLabelText)**
7. **Test user interactions, not internal state**

### Common Patterns

#### Testing Forms
```tsx
it('submits form with valid data', async () => {
  const user = userEvent.setup()
  const onSubmit = vi.fn()
  
  render(<LoginForm onSubmit={onSubmit} />)
  
  await user.type(screen.getByLabelText(/email/i), 'test@example.com')
  await user.type(screen.getByLabelText(/password/i), 'password123')
  await user.click(screen.getByRole('button', { name: /submit/i }))
  
  expect(onSubmit).toHaveBeenCalledWith({
    email: 'test@example.com',
    password: 'password123'
  })
})
```

#### Testing Responsive Components
```tsx
it('adapts to mobile viewport', () => {
  // Mock window.matchMedia for responsive tests
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches: query === '(max-width: 768px)',
      media: query,
    })),
  })
  
  render(<ResponsiveComponent />)
  expect(screen.getByTestId('mobile-layout')).toBeInTheDocument()
})
```

### Debugging Tests

1. **Use `screen.debug()`** to see current DOM
2. **Use `--reporter=verbose`** for detailed output
3. **Check browser dev tools** with `npm run test:ui`
4. **Use `only` and `skip`** to focus on specific tests

### Continuous Integration

Tests run automatically on:
- Every commit (pre-commit hook)
- Pull requests
- Main branch pushes
- Scheduled nightly runs

For CI failure investigation:
1. Check test output logs
2. Review coverage reports
3. Test locally with same Node.js version
4. Check for flaky tests

## Troubleshooting

### Common Issues

1. **jsdom environment issues**: Ensure proper setup in `src/test/setup.ts`
2. **Async test failures**: Use proper `await` with user interactions
3. **Mock not working**: Check import paths and hoisting
4. **Flaky tests**: Usually timing issues - use `waitFor` or `findBy*`

### Getting Help

- Check the [Vitest docs](https://vitest.dev/)
- Review [Testing Library guides](https://testing-library.com/docs/)
- Look at existing tests for patterns
- Ask team members for code review
