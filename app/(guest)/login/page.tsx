//import Avatar from "@/components/Avatar";
import { SignIn } from "@clerk/nextjs";
import Image from "next/image";

function LoginPage() {
    return ( 
        <div className="flex flex-col justify-center items-center min-h-screen bg-[#c2c8cc]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center w-full max-w-4xl px-5">
          <div className="flex flex-col items-center justify-center text-white">
            <div className="rounded-full pt-5 md:pt-0 md:p-5">
              {/* <Avatar seed="Akasha Support Agent" className="h-60 w-60" /> bg-[#64B5F5] */}
              <Image
        src="https://images.yampi.me/assets/stores/puroouro/uploads/logo/66ef3e9955efc.png"
        alt="Logo"
        width={500} // Defina a largura desejada
        height={300} // Defina a altura desejada
        layout="responsive" // Para manter a imagem responsiva
      />
   
            </div>
  
            <div className="text-center">
              <h1 className="text-4xl text-black">Assistente AI</h1>
              <h2 className="text-base font-light text-black">
              Seu agente de bate-papo AI personalizável
              </h2>
              <h3 className="my-5 font-bold text-black">
              Faça login para começar</h3>
            </div>
          </div>
  
          <div className="flex justify-center">
            <SignIn routing="hash" fallbackRedirectUrl="/" />
          </div>
        </div>
      </div>
    ); 
}

export default LoginPage