'use client'

interface EmailCheckboxProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}

export function EmailCheckbox({ checked, onChange }: EmailCheckboxProps) {
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange?.(e.target.checked)}
      onClick={(e) => e.stopPropagation()}
      className="w-4 h-4 rounded border-white/20 bg-transparent text-primary focus:ring-primary/20 cursor-pointer shrink-0"
    />
  );
}
