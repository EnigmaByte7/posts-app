'use client'
import React, { useState,useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useAuth } from '@clerk/nextjs'
import { Spinner, StepsTitle } from "@chakra-ui/react"
import { Post } from '@/components/ui/post'
import { useRef } from 'react'
import { usePosts } from '@/store'
import { isEqual } from 'lodash'
import { v4 } from 'uuid'
import Hidden from '@/components/ui/hidden'
import { useUser } from '@clerk/nextjs'

export default  function page() {
  //const { userId, sessionId, getToken } = await auth()
  
const { posts, hashydrated, setposts, addposts } = usePosts()
  const ref = useRef()
  const {userId,} = useAuth()
  const {user} = useUser()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [file, setFile] = useState()
  const [load, setLoad] = useState(false)
  const [uploading, setUploading] = useState(false)
console.log(posts);


  //console.log(file)

  // const handle = async () => {
  //       setLoad(true)
  //       if(sessionStorage.getItem('posts') != null){
  //         console.log('hello', sessionStorage.getItem('posts'));
  //         setPosts(p)
  //         setLoad(false)
  //       }
  //       else{
  //         const res = await fetch('/api/posts/getposts')
  //         const data = await res.json();
  //         // const resp = await fetch('/api/kafka/produce', {
  //         //   method: 'POST',
  //         //   body: JSON.stringify({
  //         //     topic: 'test',
  //         //     message: { name: 'John', age: 23 },
  //         //   }),
  //         // });
  //         // console.log(resp)
  //         setPosts(data)
  //         setposts(data)
  //         setLoad(false)
  //         console.log(data)
  //       }
  // }

  const handlesubmit = async () => {
    setUploading(true)
    const corelation_id = v4();
    const  formData = new FormData()
    formData.append('title', title)
    formData.append('content', content)
    formData.append('userId', userId)
    formData.append('corelation_id', corelation_id)
    if (file) {
      formData.append('file', file)
    }

    const res = await fetch('/api/posts/createposts',{
      method: 'POST',
      body: formData,
    })
    let imgurl = await res.json()
    imgurl = imgurl.src
    //imgurl  = imgurl.replace('http://localhost:4566/', 'https://cf97-2401-4900-1c83-57cc-d92a-95a5-1c0f-e5a3.ngrok-free.app/')
    console.log(imgurl);
    
    const newpost = {
      id:corelation_id, authorId: userId, corelation_id, title, content, likes:0, dislikes:0, media:imgurl.src, createdAt: new Date().toISOString(),
      author:{
        id:userId,
        email:user.emailAddresses,
        name:user.fullName,
        role:'USER'
      }
    }
    addposts(newpost)

    setTitle('') 
    setContent('')
    setFile(null)
    ref.current.value = ''
    console.log('ref', ref)
    

    setUploading(false)
  }

  useEffect(() => {
    const handle = async () => {      
      setLoad(true)
      console.log('here...');
      const res =  await fetch('/api/posts/getposts')
      const data = await res.json()
      console.log(data);
      setposts(data)
      setLoad(false)
    }
    //if (!hashydrated) return
    handle()
    if ( posts == []) {
      handle()
    }
  }, [hashydrated])

  
  return (
    <div className='flex flex-col items-center justify-center  gap-4'>
      <h1 className='text-4xl font-bold'>Welcome to the Posts Page</h1>
      <p className='mt-4 text-lg'>This is posts page.</p>   
      
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="title">Post Title</Label>
        <Input type="title" id="title" placeholder="Title..." value={title} onChange={(e) => {setTitle(e.target.value)}}/>
        <Label htmlFor="content">Post Content</Label>
        <Input type="content" id="content" placeholder="Content..." value={content} onChange={(e) => {setContent(e.target.value)}} />
        <Label htmlFor="picture">Picture</Label>
        <Input id="picture" type="file" ref={ref} onChange={(e) => setFile(e.target.files[0])} />
        <Button variant="outline" onClick={handlesubmit}>{uploading ? 'Uploading...' : 'Post'}</Button>
      </div>
      {
       (isEqual(posts, {}) || load) && (  
      <div className="flex justify-center items-center h-32">
        <Spinner size="lg" borderTopColor={'#09090b'} borderWidth={'4px'}/>
      </div>)
      }
      {
        posts && posts.length > 0 &&
        posts.map((post, _) => {
          return (
            <Post  corelation_id={post.corelation_id} media={post.media} content={post.content} title={post.title} key={post.id} likes={post.likes} dislikes={post.dislikes} createdat={post.createdAt} author={post.author} myreaction={post.myreaction}/>
          )
        })
      }
    </div>
  )
}
