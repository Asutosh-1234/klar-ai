// app/connect/page.tsx
export default function ConnectPage() {
  return (
    <div>
      <h1>Connect your accounts</h1>
      <a href="/api/connect?plugin=gmail">Connect Gmail</a>
      <a href="/api/connect?plugin=googlecalendar">Connect Google Calendar</a>
    </div>
  )
}