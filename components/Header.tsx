import Link from "next/link";
import React from "react";
//import Avatar from "./Avatar";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Image from "next/image";
function Header() {
  return (
    <header className="bg-white flex flex-col md:flex-row shadow-sm text-gray-800 justify-between p-5">
      <Link href={"/"}
         className="flex items-center text-4xl font-thin justify-center md:justify-start"
      >
        {/* <Avatar seed="Akasha support Agent" /> */}
       <div className="flex flex-col md:flex-row">
        <Image
        src="https://images.yampi.me/assets/stores/puroouro/uploads/logo/66ef3e9955efc.png"
        alt="Logo"
        width={300} // Defina a largura desejada
        height={300} // Defina a altura desejada
      //  layout="responsive" // Para manter a imagem responsiva
      />
        <div className="space-y-1 flex items-center">
          <div className="flex flex-col pl-4">
        <h1 className="text-gray-800">Assistente AI Agent</h1>
        <h2 className="text-xl text-gray-600">Seu Chat Agente AI personalizável</h2>
        </div>
        </div>
      </div>
      </Link>

      <div className="flex items-center justify-items-end">
        <SignedIn>
          <UserButton showName />
        </SignedIn>

        <SignedOut>
          <SignInButton />
        </SignedOut>
      </div>
    </header>
  );
}

export default Header;
