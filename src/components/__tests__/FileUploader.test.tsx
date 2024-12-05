import { render, screen, fireEvent } from '@testing-library/react'
import FileUploader from '../FileUploader'

describe('FileUploader', () => {
  it('renders upload area', () => {
    render(<FileUploader />)
    expect(screen.getByText(/drag & drop files here/i)).toBeInTheDocument()
  })

  it('handles file upload', async () => {
    render(<FileUploader />)
    const file = new File(['dummy content'], 'test.csv', { type: 'text/csv' })
    const uploadArea = screen.getByText(/drag & drop files here/i)

    fireEvent.drop(uploadArea, {
      dataTransfer: {
        files: [file],
      },
    })

    expect(await screen.findByText('test.csv')).toBeInTheDocument()
  })
}) 