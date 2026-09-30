import { SimplePage } from "@/components/layout/SimplePage";

export default function NotFound() {
  return (
    <SimplePage title="We do not install there yet">
      <p>That city page does not exist.</p>
      <p>
        <a href="/">See the cities we serve</a>
      </p>
    </SimplePage>
  );
}
