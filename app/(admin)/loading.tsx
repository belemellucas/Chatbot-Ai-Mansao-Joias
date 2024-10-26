//import Avatar from "@/components/Avatar";
import Image from "next/image";



function Loading() {
    return (
        <div className="flex items-center justify-center h-full w-full">
        <Image
            src="https://images.yampi.me/assets/stores/puroouro/uploads/logo/66ef3e9955efc.png"
            alt="Loading"
            width={200}
            height={100}
            className="animate-pulse"
          />
        </div>
    )
}

export default Loading


 {/*  <div className="mx-auto p-10">
<Avatar seed="Akasha Support Agent" /> */}