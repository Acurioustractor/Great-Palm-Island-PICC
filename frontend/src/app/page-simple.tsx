export default function Home() {
  return (
    <div style={{ 
      padding: '2rem',
      textAlign: 'center',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div>
        <h1 style={{ color: '#19466C', marginBottom: '1rem' }}>
          Palm Island Storm Stories
        </h1>
        <p style={{ color: '#6c757d', marginBottom: '2rem' }}>
          Community voices and resilience in the face of extreme weather.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <a href="/stories" style={{ 
            padding: '1rem 2rem', 
            background: '#19466C', 
            color: 'white', 
            textDecoration: 'none',
            borderRadius: '8px'
          }}>
            View Stories
          </a>
          <a href="/analysis" style={{ 
            padding: '1rem 2rem', 
            background: '#227D51', 
            color: 'white', 
            textDecoration: 'none',
            borderRadius: '8px'
          }}>
            View Analysis
          </a>
        </div>
      </div>
    </div>
  );
}