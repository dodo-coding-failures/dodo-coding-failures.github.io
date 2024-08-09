const titles = document.getElementsByClassName('boxTitle')
let target;

for (let i = 0; i < titles.length; i++) {
    titles[i].addEventListener('mousedown', ()=>{
        target = titles[i].parentElement;
        
        target.style.position = 'absolute';
        document.addEventListener('mousemove', moveWindow)
    })

    titles[i].addEventListener('mouseup', ()=>{
        target = titles[i].parentElement;
        document.removeEventListener('mousemove', moveWindow)
    })
    
}


function moveWindow(event){
    target.style.top = (event.y-30)+'px';
    target.style.left = (event.x-30)+'px';
}