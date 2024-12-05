import { render, screen, fireEvent } from '@testing-library/react'
import DownloadButton from '../DownloadButton'

describe('DownloadButton', () => {
  const mockData = [
    {
      stockTicker: 'AAPL',
      numberOfShares: 100,
      purchasePrice: 150.50,
      purchaseDate: '2023-12-01',
      transactionType: 'buy',
    }
  ]

  beforeEach(() => {
    // Mock URL.createObjectURL and URL.revokeObjectURL
    global.URL.createObjectURL = jest.fn()
    global.URL.revokeObjectURL = jest.fn()
  })

  it('renders download button', () => {
    render(<DownloadButton data={[]} />)
    expect(screen.getByText(/download csv/i)).toBeInTheDocument()
  })

  it('triggers download when clicked', () => {
    const createElementSpy = jest.spyOn(document, 'createElement')
    const clickSpy = jest.spyOn(HTMLAnchorElement.prototype, 'click')

    render(<DownloadButton data={mockData} />)
    fireEvent.click(screen.getByText(/download csv/i))

    expect(createElementSpy).toHaveBeenCalledWith('a')
    expect(clickSpy).toHaveBeenCalled()
  })
}) 