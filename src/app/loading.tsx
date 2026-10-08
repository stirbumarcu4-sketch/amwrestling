import Container from "@/components/layout/Container";
import Section from "@/components/layout/Section";

export default function Loading() {
  return (
    <Section>
      <Container>
        <p className="type-eticheta" role="status">
          Se încarcă…
        </p>
      </Container>
    </Section>
  );
}
