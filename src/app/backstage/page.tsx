import PasswordGate from "@/components/backstage/PasswordGate";
import BackstageHome from "@/components/backstage/BackstageHome";

export default function BackstagePage() {
  return (
    <PasswordGate>
      <BackstageHome />
    </PasswordGate>
  );
}
