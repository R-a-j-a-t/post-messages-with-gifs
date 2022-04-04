import React, { useState } from 'react';

import CreatePost from './CreatePost';
import DisplayPosts from './DisplayPosts';

// App component is where we lift the state up from CreatePost component
//  so that we can share it with the sibling component DisplayPosts.

export default function App() {
    const [postList, setPostList] = useState([]);

    return (
        <>
            <CreatePost postList={postList} onPost={setPostList}/>
            <DisplayPosts postList={postList} />
        </>
    );
}