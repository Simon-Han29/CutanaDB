import React from 'react'
import Image from "next/image"
import Link from "next/link"
interface CardInfo {
    "key": number | undefined
    "mal_id": number | undefined,
    "title": string | undefined,
    "image": any
}

const Card: React.FC<CardInfo> = ({mal_id, title, image}) => {
    return (
        <div className="w-[200px] m-8 hover:scale-105 transition-transform duration-300 ease-in-out">
            <Link href={`/anime/${mal_id}`}>
                <div>
                    <div className="h-[300px] w-[200px] overflow-hidden">
                        <Image className="rounded-[20px] object-contain"loader={() => image} src={image} width={200} height={325} alt=""/>
                    </div>
                    <p className="text-white text-center">{title}</p>
                </div>
            </Link>
        </div>
    )
}

export default Card
