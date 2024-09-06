document.getElementById('resetView').addEventListener('click', ()=>{
    defaultView();
})

function defaultView() {
    let el = document.getElementById('debug');
    el.style.position = 'absolute'
    el.style.top = (window.innerHeight-el.offsetHeight-25)+'px';
    el.style.left = '0px';

    el = document.getElementById('track');
    el.style.position = 'absolute'
    el.style.top = (window.innerHeight-el.offsetHeight-50)+'px';
    el.style.left = (window.innerWidth-el.offsetWidth-50)+'px';

    el = document.getElementById('search');
    el.style.position = 'absolute'
    el.style.top = '10px';
    el.style.left = (window.innerWidth/2-el.offsetWidth/2)+'px';

    el = document.getElementById('shortcuts');
    el.style.position = 'absolute'
    el.style.top = (document.getElementById('search').offsetHeight+20)+'px';
    el.style.left = (window.innerWidth/2-el.offsetWidth/2)+'px';
}