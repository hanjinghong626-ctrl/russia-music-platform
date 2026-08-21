'use client'

export default function Error({ error, reset }) {
  return (
    <div style={{ padding: '40px', fontFamily: 'monospace', background: '#1a1a2e', color: '#eee', minHeight: '100vh' }}>
      <h1 style={{ color: '#ff6b6b', fontSize: '24px', marginBottom: '20px' }}>Error Boundary</h1>
      <div style={{ background: '#16213e', padding: '20px', borderRadius: '8px', marginBottom: '20px', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
        <strong>Error Name:</strong> {error?.name || 'Unknown'}
        {'\n\n'}
        <strong>Error Message:</strong> {error?.message || 'No message'}
        {'\n\n'}
        <strong>Stack:</strong>
        {'\n'}
        {error?.stack || 'No stack trace'}
      </div>
      <button
        onClick={() => reset()}
        style={{ padding: '10px 20px', background: '#4ecdc4', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px' }}
      >
        Try again
      </button>
    </div>
  )
}
