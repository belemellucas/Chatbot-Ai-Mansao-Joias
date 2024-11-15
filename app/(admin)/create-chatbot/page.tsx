"use client"
import Avatar from '@/components/Avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CREATE_CHATBOT } from '@/graphql/mutations/mutations'
import { useMutation } from '@apollo/client'
import { useUser } from '@clerk/nextjs'
//import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { FormEvent, useState } from 'react'

function CreateChatbot() {
    const { user }= useUser();
    const [name, setName] = useState("");
      const router = useRouter();

    const [createChatbot, { loading }] = useMutation(
    CREATE_CHATBOT, {
       variables: {
        clerk_user_id: user?.id,
        name,
        created_at: new Date().toISOString()
       }
    })
  

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        try {
         const data = await createChatbot();
         setName(""); 
         router.push(`/edit-chatbot/${data.data.insertChatbots.id}`);
        } catch(err) {
           console.error(err)
        }
    };

    if (!user) {
        return null;
    }
 
    
  return (
    <div className="flex flex-col items-center justify-center md:flex-row
    md:space-x-10 bg-white p-10 rounded-md m-10">
       <Avatar seed="create-chatbot" /> 
     {/* <Image
  src="/download.png" // Corrigido o caminho para referenciar corretamente
  alt="Logo"
  width={50} // Defina a largura desejada
  height={50} // Defina a altura desejada
  // layout="responsive" // Para manter a imagem responsiva
/>*/}
   
      <div>
         <h1 className="text-xl lg:text-3xl font-semibold">Criar</h1>
         <h2 className="font-ligth">
           Crie um novo chatbot para auxiliá-lo nas conversas com seus clientes.
         </h2>
         <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-2 mt-5">
              <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
               placeholder="Nome Chatbot..."
              className="max-w-lg" 
              required
              />
              <Button type="submit" disabled={loading || !name}>
                {loading ? "Criando Chatbot..." : "Criar Chatbot"}
                </Button>
         </form>
         <p className="text-gray-300 mt-5">Exemplo: Suporte ao Cliente</p>

      </div>
    </div>
  )
}

export default CreateChatbot
