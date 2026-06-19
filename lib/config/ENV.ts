import "dotenv/config";
import { execSync } from 'child_process';

function resolveDatabaseUrl(url: string): string {
  try {
    const parsedUrl = new URL(url);
    if (parsedUrl.hostname.includes("neon.tech")) {
      const endpointId = parsedUrl.hostname.split('.')[0];
      try {
        const nslookupOutput = execSync(`nslookup ${parsedUrl.hostname}`, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] });
        const parts = nslookupOutput.split(/Name:\s+/);
        if (parts.length > 1) {
          const resolvedPart = parts[1];
          const ipv4s = resolvedPart.match(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g);
          if (ipv4s && ipv4s.length > 0) {
            parsedUrl.hostname = ipv4s[0];
            parsedUrl.searchParams.set('options', `endpoint=${endpointId}`);
            parsedUrl.searchParams.delete('sslmode');
            return parsedUrl.toString();
          }
        }
      } catch (e) {
        // Ignore and fallback
      }
    }
  } catch (err) {
    // Ignore and fallback
  }
  return url;
}

class ENV{
  static DATABASE_URL = resolveDatabaseUrl(this.required("DATABASE_URL"))
  static CORSAIR_KEK = this.required("CORSAIR_KEK")
  static GOOGLE_CLIENT_ID = this.required("GOOGLE_OAUTH_CLIENT_ID")
  static GOOGLE_CLIENT_SECRET = this.required("GOOGLE_OAUTH_CLIENT_SECRET")
  static GOOGLE_REDIRECT_URI = this.required("GOOGLE_REDIRECT_URI")
  static RESEND_API_KEY = this.required("RESEND_API_KEY")
  static RESEND_EMAIL = this.required("SENDER_EMAIL")
  static NEXTAUTH_URL = this.required('NEXTAUTH_URL')
  static AI_API_KEY = this.required('AI_API_KEY')
  static VERCEL_API_KEY = this.required('AI_GATEWAY_API_KEY')
  static NEXTAUTH_SECRET = this.required('NEXTAUTH_SECRET')
  static GEMINI_API_KEY = this.required('GEMINI_API_KEY')

  static required(name:string){
    const value = process.env[name]
    if(!value){
      throw new Error(`${name} is not defined`)
    }
    return value
  }
}

export default ENV;
