'use client'
import React, { useEffect } from 'react'
import { useAuth } from '@clerk/nextjs'
import { usePosts } from '@/store'

export default function Hidden() {
  const {delposts} = usePosts()
const { userId } = useAuth()
  useEffect(() => {
    if (!userId) return;
    const eventSource = new EventSource(`http://localhost:8080/stream?userId=${userId}`);
    eventSource.onmessage = (event) => {
      console.log("New message:",  event, event.data + " " + event.type);
    }
    eventSource.onmessage = (event) => {
        console.log(event);
        const msg = JSON.parse(event.data)
        
        if(msg.type == 'connection'){
          console.log('checking...');
          
            // const msg = JSON.parse(event.data)
            // const coreid = msg.corelation_id
            // delposts(coreid)
            // alert(`Your post with title ${msg.title} was removed`)
        }
        else if(msg.type == 'revert'){
            const coreid = msg.corelation_id
            console.log(coreid);
            
            delposts(coreid)
            alert(`Your post with title ${msg.title} was removed`)
        }
    }
    eventSource.onerror = (err) => {
      console.error("SSE error:", err);
      eventSource.close();
    }
    return () => {
      eventSource.close();
    }
  }, [userId]);
  return null;
}
