import { create } from "zustand";
import { persist, createJSONStorage} from 'zustand/middleware'

export const usePosts = create()(
    persist(
        (set, get) => (
        {
        posts: [],
        hashydrated: false,
        sethydrated: (val) => set({hashydrated: val}),
        setposts: (post) => set({posts : post}),
        addposts: (post) => set({posts: [...get().posts  , post]}),
        delposts: (corelation_id) => set({posts: (get().posts).filter(post => post.corelation_id != corelation_id)}),
        addlike: (arg)=> set(async () => {
            const postid = arg.corelation_id
            const userid = arg.authorid
            //its a like reques
            const selpost = get().posts.find(post => post.corelation_id == postid)
            const allposts = get().posts.filter(post => post.id != postid)
            if(selpost.myreaction == null){
                selpost.likes++;
                selpost.myreaction='LIKE'
                const body = {
                    topic: 'reactions',
                    key: postid + '-' + userid,
                    message:{
                        reactiontype:'like',
                        postid, userid
                    }
                }
                const prod = await fetch('http://localhost:3000/api/kafka/produce/',{
                    method:'POST',
                    body: JSON.stringify(body)
                })
                console.log(prod);
            }
            else{
                //if post already have a rxn, it can either be liked or disliked
                if(selpost.myreaction == 'LIKE'){
                    selpost.likes--;
                    selpost.myreaction=null
                    const body = {
                        topic: 'reactions',
                        key: postid + '-' + userid,
                        message:{
                            reactiontype:'declike',
                            postid, userid
                        }
                    }
                    const prod = await fetch('http://localhost:3000/api/kafka/produce/',{
                        method:'POST',
                        body: JSON.stringify(body)
                    })
                    console.log(prod);
                }
                else{
                    selpost.dislikes--;
                    selpost.likes++;
                    selpost.myreaction='LIKE'
                    //undislike
                    const body = {
                        topic: 'reactions',
                        key: postid + '-' + userid,
                        message:{
                            reactiontype:'undislike',
                            postid, userid
                        }
                    }
                    const prod = await fetch('http://localhost:3000/api/kafka/produce/',{
                        method:'POST',
                        body: JSON.stringify(body)
                    })
                    console.log(prod);
                }
            }

            return {posts: [...allposts, selpost] }
        }),
        add_dislike: (arg)=> set(async () => {
            const postid = arg.corelation_id
            const userid = arg.authorid
            //its a like reques
            const selpost = get().posts.find(post => post.corelation_id == postid)
            const allposts = get().posts.filter(post => post.id != postid)
            if(selpost.myreaction == null){
                selpost.dislikes++;
                selpost.myreaction='DISLIKE'
                const body = {
                    topic: 'reactions',
                    key: postid + '-' + userid,
                    message:{
                        reactiontype:'dislike',
                        postid, userid
                    }
                }
                const prod = await fetch('http://localhost:3000/api/kafka/produce/',{
                    method:'POST',
                    body: JSON.stringify(body)
                })
                console.log(prod);
            }
            else{
                //if post already have a rxn, it can either be liked or disliked
                if(selpost.myreaction == 'DISLIKE'){
                    selpost.dislikes--;
                    selpost.myreaction=null;
                    const body = {
                        topic: 'reactions',
                        key: postid + '-' + userid,
                        message:{
                            reactiontype:'decdislike',
                            postid, userid
                        }
                    }
                    const prod = await fetch('http://localhost:3000/api/kafka/produce/',{
                        method:'POST',
                        body: JSON.stringify(body)
                    })
                }
                else{
                    //unlike
                    selpost.dislikes++;
                    selpost.likes--;
                    selpost.myreaction='DISLIKE'
                    //undislike
                    const body = {
                        topic: 'reactions',
                        key: postid + '-' + userid,
                        message:{
                            reactiontype:'unlike',
                            postid, userid
                        }
                    }
                    const prod = await fetch('http://localhost:3000/api/kafka/produce/',{
                        method:'POST',
                        body: JSON.stringify(body)
                    })
                    console.log(prod);
                }
            }

            return {posts: [...allposts, selpost] }
        })
        }
        ), {
            name:'posts',
            storage:createJSONStorage(() => sessionStorage),
            onRehydrateStorage: () => (state) => {
                state.sethydrated(true)
            }
        }
    )
)