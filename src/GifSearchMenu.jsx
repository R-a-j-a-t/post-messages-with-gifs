import React, { useState } from 'react';

// GifSearchMenu deals with allowing the user to see and select gifs for a post

const API_KEY = process.env.REACT_APP_API_KEY;
const ENDPOINT = process.env.REACT_APP_ENDPOINT;
const LIMIT = process.env.REACT_APP_LIMIT;
// offset: used to get new gifs for consecutive searches of the same query
let offset = 0;

// fetchGifs: returns the gif elements created from the info provided by the api call
const fetchGifs = (event, setGifsList, setLoading) => {
    // Didn't work for 'enter' on android phone
    // if (event.code !== 'Enter' && event.code !== 'NumpadEnter') {
    //     return;
    // }
    if (event.keyCode !== 13) {
        return;
    }
    setLoading(true);
    const q = event.target.value;
    const url = `${ENDPOINT}/search?api_key=${API_KEY}&q=${q}&limit=${LIMIT}&offset=${offset}&rating=g`;

    fetch(url)
    .then(res => {
        if (res.status === 200) {
            return res.json();
        }
        throw new Error(`Response status: ${res.status}`);
    })
    .then(json => {
        let src;
        let result = json.data.map((elem, idx) => {
            src = process.env.REACT_APP_MEDIA_ROOT + elem.id + process.env.REACT_APP_MEDIA_LEAF;
            
            return (
                <img key={idx}
                     id={elem.id}
                     className="gif-result"
                     src={src} 
                     alt={elem.title}
                    />
            );
        });
        offset = offset + 5;
        setLoading(false);
        setGifsList(result);
    })
    .catch(err => console.log(err));
}

// removeGif: allows user to remove a gif before committing a post
const removeGif = (event, addGifSrc, addAltTexts) => {
    const parent = event.target.parentElement;
    let id = parent.id.split('-')[2];
    addGifSrc(state => state.filter(elem => elem !== id));
    let alt = "";
    for (let child of parent.children) {
        if (child.id === id) {
            alt = child.alt;
            break;
        }
    }
    addAltTexts(state => state.filter(elem => elem !== alt));
    parent.remove();
}

// addGifToPost: appends a copy of the selected gif from the search results onto the create post section
const addGifToPost = (event, hideSearchMenu, addGifSrc, addAltTexts, setGifsList) => {
    let {target} = event;
    if (target.className === 'gif-result') {
        setGifsList([]);

        let gif = document.getElementById(target.id); // querySelector will not work for id starting with digits
        let cloneGif = gif.cloneNode(true);
        cloneGif.id = 'tmp-' + cloneGif.id;
        cloneGif.className = cloneGif.className
                                .replace('gif-result', 'post-gif-result');
                                     

        const removeGifBtn = document.createElement('button');
        removeGifBtn.className = 'remove-gif';
        removeGifBtn.style.position = 'absolute';
        removeGifBtn.onclick = event => removeGif(event, addGifSrc, addAltTexts);
        removeGifBtn.textContent = 'X';

        const wrappedGif = document.createElement('div');
        wrappedGif.id = `wrapper-gif-${target.id}`;
        wrappedGif.className = 'current-gif';
        
        wrappedGif.append(cloneGif, removeGifBtn);

        let parent = document.querySelector('#added-gif');
        parent.append(wrappedGif);
        addGifSrc(state => [...state, target.id]);
        addAltTexts(state => [...state, target.alt])
        hideSearchMenu();
    }

}

export default function GifSearchMenu({ searchGif, hideSearchMenu, addGifSrc, addAltTexts }) {
    const [gifsList, setGifsList] = useState([]);
    const [loading, setLoading] = useState(false);

    return (
        <div id="gif-search-menu" 
             className={searchGif ? 'menuVisible' : 'menuHidden'}
            >
            <input type="text" 
                   onBlur={event => event.target.value = ""} 
                   className="gif-search-box"
                   onKeyDown={event => fetchGifs(event, setGifsList, setLoading)}
                   placeholder="Press enter to search" />
            <div className="gifs-list" 
                 onClick={event => addGifToPost(event, hideSearchMenu, addGifSrc, addAltTexts, setGifsList)}>
                { <p id="loading-sign" className={loading ? 'showLoading' : 'hideLoading'}>Loading...</p> }
                { gifsList }
            </div>
        </div>
    );
}