import { LandingPage } from "@/components/marketing/landing-page";
import { getSoftwareApplicationSchema } from "@/lib/marketing/software-schema";

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getSoftwareApplicationSchema()),
        }}
      />
      <LandingPage />
    </>
  );
}
