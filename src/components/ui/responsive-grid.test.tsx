import { describe, it, expect } from 'vitest'
import { render, screen } from '@/test/utils'
import { ResponsiveGrid, ResponsiveStack, ResponsiveContainer } from '@/components/ui/responsive-grid'

describe('Responsive Grid Components', () => {
  describe('ResponsiveGrid', () => {
    it('renders with default grid classes', () => {
      render(
        <ResponsiveGrid data-testid="grid">
          <div>Item 1</div>
          <div>Item 2</div>
        </ResponsiveGrid>
      )
      
      const grid = screen.getByTestId('grid')
      expect(grid).toHaveClass('grid', 'grid-cols-1', 'sm:grid-cols-2', 'lg:grid-cols-3', 'xl:grid-cols-4', 'gap-4')
    })

    it('applies custom column configuration', () => {
      render(
        <ResponsiveGrid 
          cols={{ default: 2, md: 3, lg: 4 }}
          data-testid="grid"
        >
          <div>Item 1</div>
        </ResponsiveGrid>
      )
      
      const grid = screen.getByTestId('grid')
      expect(grid).toHaveClass('grid-cols-2', 'md:grid-cols-3', 'lg:grid-cols-4')
    })

    it('applies custom gap', () => {
      render(
        <ResponsiveGrid gap={6} data-testid="grid">
          <div>Item 1</div>
        </ResponsiveGrid>
      )
      
      const grid = screen.getByTestId('grid')
      expect(grid).toHaveClass('gap-6')
    })

    it('applies custom gap as string', () => {
      render(
        <ResponsiveGrid gap="gap-x-4 gap-y-8" data-testid="grid">
          <div>Item 1</div>
        </ResponsiveGrid>
      )
      
      const grid = screen.getByTestId('grid')
      expect(grid).toHaveClass('gap-x-4', 'gap-y-8')
    })

    it('applies additional className', () => {
      render(
        <ResponsiveGrid className="custom-class" data-testid="grid">
          <div>Item 1</div>
        </ResponsiveGrid>
      )
      
      const grid = screen.getByTestId('grid')
      expect(grid).toHaveClass('custom-class')
    })
  })

  describe('ResponsiveStack', () => {
    it('renders with default stack classes', () => {
      render(
        <ResponsiveStack data-testid="stack">
          <div>Item 1</div>
          <div>Item 2</div>
        </ResponsiveStack>
      )
      
      const stack = screen.getByTestId('stack')
      expect(stack).toHaveClass('flex', 'flex-col', 'space-y-4')
    })

    it('applies custom spacing', () => {
      render(
        <ResponsiveStack spacing={8} data-testid="stack">
          <div>Item 1</div>
        </ResponsiveStack>
      )
      
      const stack = screen.getByTestId('stack')
      expect(stack).toHaveClass('space-y-8')
    })

    it('applies custom spacing as string', () => {
      render(
        <ResponsiveStack spacing="space-y-2 sm:space-y-4" data-testid="stack">
          <div>Item 1</div>
        </ResponsiveStack>
      )
      
      const stack = screen.getByTestId('stack')
      expect(stack).toHaveClass('space-y-2', 'sm:space-y-4')
    })
  })

  describe('ResponsiveContainer', () => {
    it('renders with default container classes', () => {
      render(
        <ResponsiveContainer data-testid="container">
          <div>Content</div>
        </ResponsiveContainer>
      )
      
      const container = screen.getByTestId('container')
      expect(container).toHaveClass('w-full', 'mx-auto', 'max-w-screen-2xl', 'p-4')
    })

    it('applies custom max width', () => {
      render(
        <ResponsiveContainer maxWidth="lg" data-testid="container">
          <div>Content</div>
        </ResponsiveContainer>
      )
      
      const container = screen.getByTestId('container')
      expect(container).toHaveClass('max-w-screen-lg')
    })

    it('applies full width when maxWidth is "full"', () => {
      render(
        <ResponsiveContainer maxWidth="full" data-testid="container">
          <div>Content</div>
        </ResponsiveContainer>
      )
      
      const container = screen.getByTestId('container')
      expect(container).not.toHaveClass('max-w-screen-2xl')
      expect(container).toHaveClass('w-full', 'mx-auto')
    })

    it('applies custom padding', () => {
      render(
        <ResponsiveContainer padding={8} data-testid="container">
          <div>Content</div>
        </ResponsiveContainer>
      )
      
      const container = screen.getByTestId('container')
      expect(container).toHaveClass('p-8')
    })

    it('applies custom padding as string', () => {
      render(
        <ResponsiveContainer padding="px-4 py-8" data-testid="container">
          <div>Content</div>
        </ResponsiveContainer>
      )
      
      const container = screen.getByTestId('container')
      expect(container).toHaveClass('px-4', 'py-8')
    })
  })

  describe('Nested Components', () => {
    it('works when components are nested', () => {
      render(
        <ResponsiveContainer data-testid="container">
          <ResponsiveStack data-testid="stack">
            <ResponsiveGrid data-testid="grid">
              <div>Item 1</div>
              <div>Item 2</div>
            </ResponsiveGrid>
          </ResponsiveStack>
        </ResponsiveContainer>
      )
      
      expect(screen.getByTestId('container')).toBeInTheDocument()
      expect(screen.getByTestId('stack')).toBeInTheDocument()
      expect(screen.getByTestId('grid')).toBeInTheDocument()
      expect(screen.getByText('Item 1')).toBeInTheDocument()
      expect(screen.getByText('Item 2')).toBeInTheDocument()
    })
  })
})
