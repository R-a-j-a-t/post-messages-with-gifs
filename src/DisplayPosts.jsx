import React from 'react';

// DisplayPosts deals with displaying posts

let content = [];
const ROOT = process.env.REACT_APP_MEDIA_ROOT; // getting root endpoint
const LEAF = process.env.REACT_APP_MEDIA_LEAF; // getting remaining path

// displayPosts: returns the posts created from the info 
//                  sent from createPost function in CreatePost component 
const displayPosts = postList => {
    let len = postList.length;
    
    if (len === 0) {
        let nopost = (<div className="no-post">Nothing here yet! Add a post...</div>);
        return nopost;
    }
    else {
        let post = postList[len - 1];

        let gifs = document.querySelectorAll('.current-gif');
        if (gifs.length > 0) {
            let l = gifs.length;
            for (let i = 0; i < l; i++) {
                gifs[i].remove();
            }
        }
        let newPost = (
            <div className="post" key={len - 1}>
                <div className="post-text"><pre>{post.text}</pre></div>
                {
                    post.gifSrc.map((elem, idx) => {
                        let src = ROOT + elem + LEAF;
                        return (
                            <img key={idx}
                                    id={elem}
                                    className="post-gif"
                                    src={src} 
                                    alt={post.altTexts[idx]}
                                    />
                        );
                    })
                }
            </div>
        )

        content.unshift(newPost);
        return content;
    }
}

export default function DisplayPosts({ postList }) {
    
    return (
        <div id="display-posts">
            {displayPosts(postList)}
        </div>
    );
}