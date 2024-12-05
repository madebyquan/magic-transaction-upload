import { render, screen } from '@testing-library/react'
import DataTable from '../DataTable'

describe('DataTable', () => {
  it('renders table headers', () => {
    render(<DataTable />)
    expect(screen.getByText('Stock Ticker')).toBeInTheDocument()
    expect(screen.getByText('Shares')).toBeInTheDocument()
    expect(screen.getByText('Price')).toBeInTheDocument()
    expect(screen.getByText('Date')).toBeInTheDocument()
    expect(screen.getByText('Type')).toBeInTheDocument()
  })

  it('displays sample data', () => {
    render(<DataTable />)
    expect(screen.getByText('AAPL')).toBeInTheDocument()
    expect(screen.getByText('$150.50')).toBeInTheDocument()
    expect(screen.getByText('TSLA')).toBeInTheDocument()
    expect(screen.getByText('$250.75')).toBeInTheDocument()
  })
}) 