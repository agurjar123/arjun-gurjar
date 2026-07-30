import PasswordGate from "@/components/backstage/PasswordGate";
import TimelinePage from "@/components/backstage/TimelinePage";

export default function BackstageTimelinePage() {
  return (
    <PasswordGate>
      <TimelinePage />
    </PasswordGate>
  );
}
