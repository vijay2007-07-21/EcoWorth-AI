import Button from '../components/Button'

export default function NotFound() {
  return (
    <div className="container-page py-24 text-center">
      <p className="text-sm font-semibold text-emerald">404</p>
      <h1 className="mt-2 text-4xl font-bold text-forest">Page not found</h1>
      <p className="mt-3 text-gray-600">That page does not exist.</p>
      <Button to="/" className="mt-8">Back to home</Button>
    </div>
  )
}
