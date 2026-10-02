import { SimplePage } from "@/components/layout/SimplePage";

export default function NotFound() {
  return (
    <SimplePage title="We do not install there yet">
      <p>That page does not exist.</p>
      <p>
        <a href="/">Back to the home page</a>
      </p>
    </SimplePage>
  );
}
