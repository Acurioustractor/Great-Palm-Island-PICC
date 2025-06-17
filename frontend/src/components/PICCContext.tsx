'use client';

export function PICCContext() {
  return (
    <section style={{
      background: '#2c3e50',
      color: 'white',
      padding: '4rem 2rem',
    }}>
      <div style={{
        maxWidth: '1000px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '3rem',
        alignItems: 'center',
      }}>
        <div>
          <h2 style={{
            fontSize: 'clamp(1.5rem, 4vw, 2rem)',
            marginBottom: '1.5rem',
            color: '#3498db',
            fontWeight: 700,
          }}>
            PICC: Community Backbone in Crisis
          </h2>
          
          <p style={{
            lineHeight: 1.6,
            marginBottom: '1.5rem',
            opacity: 0.9,
          }}>
            The Palm Island Community Company (PICC) played a crucial role during and after the storm, 
            coordinating response efforts across its extensive network of services. As a community-controlled 
            organization employing nearly 200 local people, PICC represents more than infrastructure—it 
            embodies the community's commitment to self-determination and collective care.
          </p>
          
          <p style={{
            lineHeight: 1.6,
            opacity: 0.9,
          }}>
            From health services to childcare, youth programs to elder support, PICC's integrated approach 
            meant that when crisis hit, the community had local leadership and resources to respond. Staff 
            members went beyond their job descriptions, checking on community members, coordinating supplies, 
            and maintaining essential services even as their own facilities were damaged.
          </p>
        </div>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '1.5rem',
        }}>
          {[
            { number: '197', label: 'Staff Members' },
            { number: '80%+', label: 'Indigenous Staff' },
            { number: '16+', label: 'Community Services' },
            { number: '2021', label: 'Community Controlled' },
          ].map((stat, index) => (
            <div
              key={index}
              style={{
                textAlign: 'center',
                padding: '1.5rem 1rem',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '8px',
                transition: 'transform 0.2s ease',
              }}
            >
              <span style={{
                fontSize: 'clamp(1.5rem, 4vw, 2rem)',
                fontWeight: 'bold',
                color: '#3498db',
                display: 'block',
                marginBottom: '0.5rem',
              }}>
                {stat.number}
              </span>
              <span style={{
                fontSize: '0.9rem',
                opacity: 0.8,
              }}>
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}