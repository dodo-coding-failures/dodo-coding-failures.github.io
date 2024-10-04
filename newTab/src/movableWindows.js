const titles = document.getElementsByClassName('boxTitle')
let target, offsetX, offsetY;

for (let i = 0; i < titles.length; i++) {
    titles[i].addEventListener('mousedown', (event)=>{
        target = titles[i].parentElement;
        offsetX = event.x-Number(target.style.left.split('px')[0]);
        offsetY = event.y-Number(target.style.top.split('px')[0]);

        target.style.position = 'absolute';
        document.addEventListener('mousemove', moveWindow)
    })

    document.addEventListener('mouseup', ()=>{
        target = titles[i].parentElement;
        document.removeEventListener('mousemove', moveWindow)
    })
    
}


function moveWindow(event){
    target.style.left = (event.x-offsetX)+'px';
    target.style.top = (event.y-offsetY)+'px';
}