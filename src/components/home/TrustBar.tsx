import { Factory, RotateCcw, Truck, Wallet } from "lucide-react";
import Container from "@/components/layout/Container";
import { site } from "@/data/site";

export default function TrustBar() {
  const elemente = [
    { icon: Truck, text: "Livrare în 24–48 h" },
    { icon: RotateCcw, text: `Retur în ${site.zileRetur} zile` },
    { icon: Wallet, text: "Plata la livrare" },
    { icon: Factory, text: "Producție proprie în Moldova" },
  ];

  return (
    <div className="border-y border-chalk-200 bg-suprafata">
      <Container>
        <ul className="grid grid-cols-2 gap-x-6 gap-y-4 py-6 lg:grid-cols-4">
          {elemente.map((element) => (
            <li key={element.text} className="flex items-center gap-3">
              <element.icon
                size={20}
                aria-hidden="true"
                className="shrink-0 text-steel-500"
              />
              <span className="text-sm text-ink-700">{element.text}</span>
            </li>
          ))}
        </ul>
      </Container>
    </div>
  );
}
