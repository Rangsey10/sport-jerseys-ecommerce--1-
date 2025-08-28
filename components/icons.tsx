
import {
  Loader2,
  Github,
  type LucideProps,
} from "lucide-react"

export const Icons = {
  logo: (props: LucideProps) => (
    <svg {...props} viewBox="0 0 24 24">
      <path
        fill="currentColor"
        d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"
      />
    </svg>
  ),
  spinner: Loader2,
  gitHub: Github,
  google: (props: LucideProps) => (
    <svg {...props} viewBox="0 0 24 24">
      <path
        fill="currentColor"
        d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.9 8.2,4.73 12.19,4.73C14.03,4.73 15.69,5.36 16.95,6.57L19.05,4.54C17.22,2.77 15,2 12.19,2C6.92,2 2.71,6.62 2.71,12C2.71,17.38 6.92,22 12.19,22C17.6,22 21.54,18.33 21.54,12.81C21.54,12.21 21.45,11.65 21.35,11.1Z"
      />
    </svg>
  ),
}
