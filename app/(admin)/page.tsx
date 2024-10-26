import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="p-10 bg-white m-10 rounded-md w-full">
      <h1 className="text-4xl font-light">
        Bem-vindo ao{" "}
        <span className="text-[#64B5F5] font-semibold">Assistente {" "}AI</span>
      </h1>
      <h2 className="mt-2 mb-10">
      Um chatbot de IA poderoso e flexível, que você pode personalizar e treinar
  com informações específicas para atender às suas necessidades de comunicação
  com clientes. Gerencie conversas de forma inteligente e eficaz, oferecendo
  respostas personalizadas e automatizadas que refletem o conhecimento da sua
  marca.
      </h2>

      <Link href="/create-chatbot">
        <Button className="bg-[#64B5F5]">
          Vamos começar criando seu primeiro chatbot
        </Button>
      </Link>
    </main>
  );
}
