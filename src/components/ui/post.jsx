'use client'
import { Button, Card, Image, Text,Icon, useSafeLayoutEffect } from "@chakra-ui/react"
import { ThumbsUp,ThumbsDown } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { useAuth } from '@clerk/nextjs'
import { Trash2 } from "lucide-react"
import { useState } from "react"
import { Spinner } from "@chakra-ui/react"
import { usePosts } from "@/store"

export const Post = ({media, title, content,likes, dislikes, createdat, author, corelation_id, myreaction }) => {
  console.log('myreaction: ', myreaction);
  
  const [load, setLoad] = useState(false)
  const {delposts, addlike, add_dislike} = usePosts()
    const time = formatDistanceToNow(createdat)
    const {authorId} = useAuth()
    const authorid = author.id;
    //console.log(authorid);
    
    const handledelete = async (corelation_id) => {
      setLoad(true)
      
        delposts(corelation_id)
      const res = await fetch('/api/posts/deletepost', {
        method:'POST',
        body: JSON.stringify({corelation_id})
      })

      setLoad(false)
      // console.log(res)
    }
  return (
    <Card.Root maxW="sm" variant={"elevated"} >
      <Image
        src={media}
        alt="thumbnail"
      />
      <Card.Body gap="2" >
        <Card.Title textAlign={"left"} fontSize={'2xl'} fontWeight={'bold'}>{title}</Card.Title>
        <Card.Description paddingX={'2'} fontSize={'lg'}>
            {content}
        </Card.Description>
      </Card.Body>
      <Card.Footer gap="2" padding={'2'} paddingX={'4'}>
        
        <div className="flex flex-row w-full items-center justify-between">
            <div className="flex flex-row gap-4">
                <Icon size={"lg"}>
                <div className="flex flex-col gap-1 items-center justify-center h-14">
                    <ThumbsUp color={myreaction == 'LIKE' ? '#00ff00' : '#000000'} className="cursor-pointer" onClick={() => addlike({corelation_id, authorid})}/>
                    <p className="text-sm text-zinc-600 font-bold">{likes}</p>
                </div>
                </Icon>
                <Icon size={"lg"}>
                    <div className="flex flex-col gap-1 items-center justify-center h-14">
                        <ThumbsDown color={`${myreaction}` == 'DISLIKE' ? '#ff0000': '#000000'} className="cursor-pointer" onClick={() => add_dislike({corelation_id, authorid})}/>
                        <p className="text-sm text-zinc-600 font-bold">{dislikes}</p>
                    </div>
                </Icon>
            </div>
            <div className="flex flex-row gap-3 text-md text-zinc-600 font-bold">
              <>{time} ago</>
              <div className="cursor-pointer hover:bg-slate-400 rounded-xl" onClick={() => handledelete(corelation_id)}>{authorid === authorId ? <Trash2 color='#ff0000' /> : ''}</div>
            </div>
        </div>
      </Card.Footer>
    </Card.Root>
  )
}
