// const redirect_uri = 'http://localhost:5173/callback';
const redirect_uri = 'https://dodo-coding-failures.github.io/';
const client_id = 'e20a72be31d34b419481d0ea396d5a36';
const params = new URLSearchParams(window.location.search);
if (params.get('code') != null){
    localStorage.setItem('code', params.get('code'));
}
const code = localStorage.getItem('code');

const date = new Date().getDate();


// fetches the song only once a day
if(localStorage.getItem('connected') === 'true'){

    document.getElementById('connect').style.display = 'none';
    document.getElementById('spotifyEmbed').style.display = 'inline';

    if(code=='null' || !code) {
        redirectToAuthCodeFlow(client_id);
    } else if(date != Number(localStorage.getItem('date'))){
        localStorage.setItem('date', date); 
        await update();
    }
    displayTrack(JSON.parse(localStorage.getItem('song_of_the_day')));
}
// forced refresh
document.getElementById('refresh').addEventListener('click', async function(){
    await update();
    displayTrack(JSON.parse(localStorage.getItem('song_of_the_day')));
})

// ---------------------
// ------ METHODS ------
// ---------------------

async function update(){
    if(localStorage.getItem('refresh_token')===null){
        const access_token = await getAccessToken(client_id, code);
        const liked_songs = await fetchLikedSong(access_token);
        localStorage.setItem('song_of_the_day', JSON.stringify(liked_songs.items[0].track));
        // console.log(liked_songs)
    } else {
        const access_token = await useRefreshToken(client_id);
        const liked_songs = await fetchLikedSong(access_token);
        localStorage.setItem('song_of_the_day', JSON.stringify(liked_songs.items[0].track));
        // console.log(liked_songs)
    }
}

// redirecting to spotify for authorization
async function redirectToAuthCodeFlow(client_id) {
    const verifier = generateCodeVerifier(128);
    const challenge = await generateCodeChallenge(verifier);

    localStorage.setItem('verifier', verifier)

    const params = new URLSearchParams();
    params.append('client_id', client_id);
    params.append('response_type', 'code');
    params.append('redirect_uri', redirect_uri);
    params.append('scope', 'user-library-read');
    params.append('code_challenge_method', 'S256');
    params.append('code_challenge', challenge);

    document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
}

// no idea what these do, do not touch
function generateCodeVerifier(length) {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
async function generateCodeChallenge(codeVerifier) {
    const data = new TextEncoder().encode(codeVerifier);
    
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}


// gets access token with code
async function getAccessToken(client_id, code){
    const verifier = localStorage.getItem('verifier');

    const params = new URLSearchParams();
    params.append('client_id', client_id);
    params.append('grant_type', 'authorization_code');
    params.append('code', code);
    params.append('redirect_uri', redirect_uri);
    params.append('code_verifier', verifier);

    const res = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {'Content-type': 'application/x-www-form-urlencoded'},
        body: params
    });

    const result = await res.json();
    localStorage.setItem('refresh_token', result.refresh_token);
    return result.access_token;
}


// get access token using refresh token
async function useRefreshToken(client_id){
    const refresh_token=localStorage.getItem('refresh_token');

    const params = new URLSearchParams();
    params.append('client_id', client_id);
    params.append('grant_type', 'refresh_token');
    params.append('refresh_token', refresh_token);

    const res = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params
    });

    const result = await res.json();
    localStorage.setItem('refresh_token', result.refresh_token);
    return result.access_token;

}


// make web api calls
async function fetchLikedSong(token){
    const count = Number(localStorage.getItem('liked_songs'));
    const offset = Math.floor(Math.random()*count);
    const res = await fetch('https://api.spotify.com/v1/me/tracks?limit=1&offset='+offset,{
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token
        }
    });

    const result = await res.json();
    updateSongCount(result.total);
    return await result;
}


function updateSongCount(amount){
    const current = Number(localStorage.getItem('liked_songs'));
    if(amount>current){
        localStorage.setItem('liked_songs', amount);
    }

}


// display the track
function displayTrack(song){
    const el = document.querySelector('#track iframe');
    const track_id = song.external_urls.spotify.substring(31);
    el.src = 'https://open.spotify.com/embed/track/'+track_id+'?utm_source=generator';
}