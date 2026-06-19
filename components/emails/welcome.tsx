import * as React from 'react';

interface WelcomeEmailProps {
  firstName: string;
  email: string;
  avatar?: string;
}

export function WelcomeEmail({ firstName, email, avatar }: WelcomeEmailProps) {
  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      backgroundColor: '#05050A',
      color: '#FAF9FB',
      padding: '40px 20px',
      textAlign: 'center',
    }}>
      <div style={{
        maxWidth: '600px',
        margin: '0 auto',
        backgroundColor: '#0A0A0F',
        border: '1px solid rgba(242, 202, 80, 0.1)',
        borderRadius: '16px',
        padding: '40px',
        textAlign: 'left',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
      }}>
        {avatar && (
          <img src={avatar} alt={firstName} style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            border: '2px solid #F2CA50',
            marginBottom: '24px',
          }} />
        )}
        <h1 style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#F2CA50',
          marginBottom: '16px',
          letterSpacing: '-0.5px',
        }}>
          Welcome to Klar OS, {firstName}!
        </h1>
        <p style={{
          fontSize: '16px',
          lineHeight: '1.6',
          color: '#E4E1E9',
          marginBottom: '24px',
        }}>
          We're excited to have you on board. Klar OS is your premium AI agent platform, bringing elite clarity, unified communication, and cognitive workflow automation to your daily operations.
        </p>
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.03)',
          borderLeft: '4px solid #8B5CF6',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '32px',
        }}>
          <p style={{ margin: 0, fontSize: '14px', color: '#FAF9FB', fontWeight: 'bold' }}>
            Account details:
          </p>
          <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: '#A78BFA' }}>
            Email: {email}
          </p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <a href="https://klar-ai.vercel.app" style={{
            display: 'inline-block',
            backgroundColor: '#8B5CF6',
            color: '#FFFFFF',
            padding: '12px 32px',
            borderRadius: '9999px',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: 'bold',
            boxShadow: '0 4px 15px rgba(139, 92, 246, 0.3)',
          }}>
            Launch Console
          </a>
        </div>
      </div>
      <p style={{
        marginTop: '32px',
        fontSize: '11px',
        color: '#71717A',
      }}>
        © 2026 Klar AI. All rights reserved.
      </p>
    </div>
  );
}
