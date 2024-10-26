import Avatar from "@/components/Avatar";
import { SignIn } from "@clerk/nextjs";

function LoginPage() {
    return ( 
        <div className="flex flex-col justify-center items-center min-h-screen bg-[#64B5F5]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center w-full max-w-4xl px-5">
          <div className="flex flex-col items-center justify-center space-y-5 text-white">
            <div className="rounded-full bg-white p-5">
              <Avatar seed="Akasha Support Agent" className="h-60 w-60" />
            </div>
  
            <div className="text-center">
              <h1 className="text-4xl">Assistente AI</h1>
              <h2 className="text-base font-light">
              Seu agente de bate-papo AI personalizável
              </h2>
              <h3 className="my-5 font-bold">
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