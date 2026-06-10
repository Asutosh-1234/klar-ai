import "dotenv/config"

class ENV{
  static DATABASE_URL = this.required("DATABASE_URL")
  static CORSAIR_KEK = this.required("CORSAIR_KEK")
  static GOOGLE_CLIENT_ID = this.required("GOOGLE_OAUTH_CLIENT_ID")
  static GOOGLE_CLIENT_SECRET = this.required("GOOGLE_OAUTH_CLIENT_SECRET")
  static GOOGLE_REDIRECT_URI = this.required("GOOGLE_REDIRECT_URI")
  static RESEND_API_KEY = this.required("RESEND_API_KEY")
  static RESEND_EMAIL = this.required("SENDER_EMAIL")

  static required(name:string){
    const value = process.env[name]
    if(!value){
      throw new Error(`${name} is not defined`)
    }
    return value
  }
}

export default ENV;
