import { EmailTemplateProps } from "@/app/lib/types";

export function WelcomeEmail({firstName, email, avatar}: EmailTemplateProps) {
  return (
    <>
    <div style={{padding: "32px", backgroundColor: "white", borderRadius: "12px", fontFamily: "sans-serif"}}>
      <h1>Welcome to Klar</h1>
      <p>{firstName}</p>
      <p>{email}</p>
      <img src={avatar} alt="avatar" />
    </div>
    </>
  )
}

export default WelcomeEmail