export function Footer() {
  return (
    <footer className="w-full py-section-gap bg-surface-container-lowest border-t border-white/5">
      <div className="max-w-container-max mx-auto px-gutter grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-stack-lg text-left">
        <div className="col-span-2 lg:col-span-2 flex flex-col gap-6">
          <div className="font-headline-md text-headline-md font-bold text-on-background">
            Klar AI
          </div>
          <p className="text-on-surface-variant max-w-xs">Intelligence in motion. The fastest way to process your digital life.</p>
          <p className="text-on-surface-variant/50 text-sm mt-auto">© 2024 Klar AI.</p>
        </div>
        <div className="flex flex-col gap-4">
          <h4 className="font-semibold text-on-background mb-2">Product</h4>
          <a className="text-on-surface-variant hover:text-primary transition-colors hover:underline decoration-primary/30" href="#">Features</a>
          <a className="text-on-surface-variant hover:text-primary transition-colors hover:underline decoration-primary/30" href="#">Pricing</a>
          <a className="text-on-surface-variant hover:text-primary transition-colors hover:underline decoration-primary/30" href="#">Security</a>
          <a className="text-on-surface-variant hover:text-primary transition-colors hover:underline decoration-primary/30" href="#">API</a>
        </div>
        <div className="flex flex-col gap-4">
          <h4 className="font-semibold text-on-background mb-2">Company</h4>
          <a className="text-on-surface-variant hover:text-primary transition-colors hover:underline decoration-primary/30" href="#">About</a>
          <a className="text-on-surface-variant hover:text-primary transition-colors hover:underline decoration-primary/30" href="#">Blog</a>
          <a className="text-on-surface-variant hover:text-primary transition-colors hover:underline decoration-primary/30" href="#">Careers</a>
        </div>
        <div className="flex flex-col gap-4">
          <h4 className="font-semibold text-on-background mb-2">Legal</h4>
          <a className="text-on-surface-variant hover:text-primary transition-colors hover:underline decoration-primary/30" href="#">Privacy</a>
          <a className="text-on-surface-variant hover:text-primary transition-colors hover:underline decoration-primary/30" href="#">Terms</a>
        </div>
        <div className="flex flex-col gap-4">
          <h4 className="font-semibold text-on-background mb-2">Social</h4>
          <a className="text-on-surface-variant hover:text-primary transition-colors hover:underline decoration-primary/30" href="#">Twitter</a>
          <a className="text-on-surface-variant hover:text-primary transition-colors hover:underline decoration-primary/30" href="#">LinkedIn</a>
          <a className="text-on-surface-variant hover:text-primary transition-colors hover:underline decoration-primary/30" href="#">Support</a>
        </div>
      </div>
    </footer>
  )
}
