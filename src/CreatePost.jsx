import React, { useRef, useState } from 'react';

import GifSearchMenu from './GifSearchMenu';

// CreatePost component deals with creating a post

// createPost: returns details for the current post
const createPost = (event, gifSrc, setGifSrc, altTexts, setAltTexts, postList, onPost, textRef) => {
    if (textRef.current.value === '' && gifSrc.length === 0) {
        return;
    }
    let post = {
        text: textRef.current.value,
        gifSrc,
        altTexts,
    };

    onPost([...postList, post]);
    textRef.current.value = "";
    setGifSrc([]);
    setAltTexts([]);
};

// toggleShowSearchMenu: toggle visibility of the gif search menu
const toggleShowSearchMenu = (event, searchGif, setSearchGif) => {
    if (searchGif) {
        setSearchGif(false);
    }
    else {
        setSearchGif(true);
    }
}

export default function CreatePost({ postList, onPost }) {
    const [gifSrc, setGifSrc] = useState([]);
    const [altTexts, setAltTexts] = useState([]);
    const [searchGif, setSearchGif] = useState(false);
    const textRef = useRef("");

    return (
        <div id="create-post">
            <textarea className="textarea-post"
                      ref={textRef}
                      placeholder="Type something here..." />
            <div id="added-gif"></div>
            <button className="add-gif-btn"
                    onClick={(event) => toggleShowSearchMenu(event, searchGif, setSearchGif)}
                    >+&nbsp;GIF</button>
            <GifSearchMenu  searchGif={searchGif}
                            hideSearchMenu={() => setSearchGif(false)}
                            addGifSrc={setGifSrc}
                            addAltTexts={setAltTexts} />
            <hr />
            <button type="submit"
                    onClick={
                        (event) => createPost(event, gifSrc, setGifSrc, altTexts, setAltTexts, postList, onPost, textRef)
                    }
                    className="submit-post">Post</button> 
        </div>
    );
}