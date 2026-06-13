export interface IntegrationCardProps {
  title: string;
  description: string;
  icon: string;
  isConnected: boolean;
  scopes: string[];
  connectUrl: string;
  connectedAction: {
    type: "link" | "button";
    text: string;
    href?: string;
  };
  connectActionText: string;
}

export function IntegrationCard({
  title,
  description,
  icon,
  isConnected,
  scopes,
  connectUrl,
  connectedAction,
  connectActionText,
}: IntegrationCardProps) {
  return (
    <div
      className={`glass-card rounded-xl p-8 flex flex-col justify-between interactive-card border glow-accent ${
        isConnected ? "border-primary/20 bg-primary/5" : "border-white/4"
      }`}
    >
      <div>
        <div className="flex items-start justify-between mb-6">
          <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-2xl">{icon}</span>
          </div>
          {isConnected ? (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20">
              Connected ✓
            </span>
          ) : (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-white/5 text-on-surface-variant border border-white/6">
              Not Connected
            </span>
          )}
        </div>

        <h2 className="text-base font-semibold text-white mb-2 text-left">
          {title}
        </h2>
        <p className="text-on-surface-variant text-[11px] leading-relaxed mb-6 text-left font-normal">
          {description}
        </p>

        <div className="border-t border-white/4 pt-5 mb-6 text-left">
          <h4 className="text-[10px] font-semibold text-white uppercase tracking-wider mb-3">
            Requested Scopes:
          </h4>
          <ul className="flex flex-col gap-2">
            {scopes.map((scope, index) => (
              <li
                key={index}
                className="flex items-center gap-2 text-[11px] text-on-surface-variant font-normal"
              >
                <span className="material-symbols-outlined text-primary text-sm">
                  check
                </span>
                {scope}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {isConnected ? (
        connectedAction.type === "link" && connectedAction.href ? (
          <a
            href={connectedAction.href}
            className="w-full py-2.5 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-semibold text-center flex items-center justify-center gap-1.5 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] shadow-[0_4px_12px_rgba(139,92,246,0.2)]"
          >
            {connectedAction.text}{" "}
            <span className="material-symbols-outlined text-sm">
              arrow_forward
            </span>
          </a>
        ) : (
          <button
            disabled
            className="w-full py-2.5 rounded-lg bg-primary/10 border border-primary/20 text-primary/80 font-semibold text-xs cursor-not-allowed text-center"
          >
            {connectedAction.text}
          </button>
        )
      ) : (
        <a
          href={connectUrl}
          className="w-full py-2.5 rounded-lg bg-white/4 hover:bg-white/8 text-white text-xs font-semibold text-center flex items-center justify-center gap-1.5 border border-white/6 hover:border-white/12 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
        >
          {connectActionText}{" "}
          <span className="material-symbols-outlined text-sm">
            arrow_forward
          </span>
        </a>
      )}
    </div>
  );
}
