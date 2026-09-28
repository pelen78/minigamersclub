'use strict';
window.MoonlightStory={
 id:'glup-moonlight-wish',title:'Glup and the Moonlight Wish',format:'read-along',theme:'moonlight',
 scenes:[
  {id:'light',title:'A Little Light',text:'One quiet night, Glup saw a tiny light shining in the grass.',description:'Glup discovers a tiny glowing star on the grass beneath a quiet night sky.'},
  {id:'lost',title:'A Lost Star',text:'Oh! It was a little star. And it was very far from home.',description:'Glup looks gently at a sad little star that has fallen from the sky.'},
  {id:'forest',title:'Into the Forest',text:'Glup promised to help. Together, they walked through the moonlit forest.',description:'Glup carries the little star along a winding path between soft moonlit trees.'},
  {id:'firefly',title:'The Firefly',text:'A tiny firefly joined them and showed them the brightest path.',description:'A friendly glowing firefly lights the forest path for Glup and the star.'},
  {id:'lake',title:'Across the Lake',text:'The moon sparkled on the water like a silver road.',description:'Glup and the little star stand at a calm lake with a silver reflection of the moon.'},
  {id:'hill',title:'Up the Hill',text:'Up, up, up they climbed until the stars seemed very close.',description:'Glup carries the little star up a gentle grassy hill toward the night sky.'},
  {id:'moon',title:'The Moon Helps',text:'The moon smiled down, and the little star began to shine brighter than ever.',description:'A smiling moon shines on Glup and the little star, which glows with warm golden light.'},
  {id:'home',title:'Back Home',text:'Then, with one bright sparkle, the little star floated back home.',description:'Glup watches the little star float up from the hill into the sky.'},
  {id:'goodnight',title:'Goodnight, Little Star',text:'Glup waved goodbye. And every night after that, one little star seemed to shine just for him.',description:'Glup rests on the hill looking up at his little star shining beside the moon.'}
 ].map(scene=>({...scene,audioNarration:null}))
};

/* Non-interactive illustrations: the existing Glup sprite stays unchanged. */
window.MoonlightArt=(()=>{
 const star=(sad=false)=>`<svg viewBox="0 0 120 120" aria-hidden="true"><path fill="#ffdf83" stroke="#fff0b3" stroke-width="3" stroke-linejoin="round" d="M60 10Q64 10 68 21L78 40 102 44Q114 45 105 55L88 72 91 97Q93 109 81 103L60 92 38 103Q27 109 29 97L33 72 15 55Q6 45 18 44L42 40 53 18Q57 10 60 10Z"/><ellipse cx="45" cy="61" rx="4" ry="5" fill="#405165"/><ellipse cx="75" cy="61" rx="4" ry="5" fill="#405165"/><path d="${sad?'M51 79Q60 69 69 79':'M51 74Q60 85 69 74'}" fill="none" stroke="#405165" stroke-width="3" stroke-linecap="round"/><ellipse cx="37" cy="71" rx="6" ry="3" fill="#f4a795" opacity=".6"/><ellipse cx="83" cy="71" rx="6" ry="3" fill="#f4a795" opacity=".6"/></svg>`;
 const moon=`<svg viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="49" fill="#fff1ca"/><circle cx="36" cy="35" r="9" fill="#e7dcb8" opacity=".45"/><circle cx="83" cy="40" r="6" fill="#e7dcb8" opacity=".4"/><path d="M37 61q6-7 12 0m22 0q6-7 12 0M49 76q11 11 22 0" stroke="#7e8588" fill="none" stroke-width="3" stroke-linecap="round"/></svg>`;
 const trees=`<svg class="moon-trees" viewBox="0 0 1000 480" preserveAspectRatio="none" aria-hidden="true"><g fill="#284b61"><path d="M58 420V154h12v266M189 400V90h14v310M889 411V111h13v300M966 440V181h13v259"/><ellipse cx="65" cy="175" rx="84" ry="140"/><ellipse cx="195" cy="123" rx="70" ry="115"/><ellipse cx="892" cy="145" rx="77" ry="139"/><ellipse cx="980" cy="220" rx="70" ry="120"/></g><g fill="#375f70"><ellipse cx="30" cy="230" rx="52" ry="97"/><ellipse cx="154" cy="151" rx="35" ry="67"/><ellipse cx="931" cy="204" rx="38" ry="100"/></g></svg>`;
 function scene(scene){return `<div class="moon-scene moon-${scene.id}" role="img" aria-label="${scene.description}"><div class="moon-sky-stars" aria-hidden="true">${[[8,14],[19,31],[30,12],[45,24],[58,10],[67,33],[84,19],[93,39],[38,42]].map(([x,y],i)=>`<i style="left:${x}%;top:${y}%;--delay:${i*.6}s">${i%3?'·':'✧'}</i>`).join('')}</div><div class="moon-disc">${moon}</div><div class="moon-cloud" aria-hidden="true"></div><div class="moon-distant-hill" aria-hidden="true"></div>${['forest','firefly'].includes(scene.id)?trees:''}<div class="moon-water-surface" aria-hidden="true"><span></span><span></span><span></span></div><div class="moon-ground" aria-hidden="true"></div><div class="moon-path" aria-hidden="true"></div><span class="story-glup moon-glup" style="--x:0%;--y:100%" aria-hidden="true"></span><span class="moon-little-star">${star(scene.id==='lost')}</span>${scene.id==='firefly'?'<span class="moon-firefly" aria-hidden="true"><i></i></span>':''}<div class="moon-foreground" aria-hidden="true"></div></div>`;}
 return {star,scene};
})();

window.ReadAlongPlayer=(()=>{
 let root=null,book=null,page=0,onHome=null,events=null,narration=null;
 const speaker='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4zM17 8q5 4 0 8M20 5q7 7 0 14"/></svg>';
 function stopNarration(){if(narration){narration.pause();narration=null;}}
 function close(){stopNarration();events?.abort();events=null;root=null;}
 function open(element,home,entry){close();root=element;onHome=home;book=entry;page=0;events=new AbortController();root.addEventListener('click',handle,{signal:events.signal});render();}
 function render(){stopNarration();const scene=book.scenes[page],last=page===book.scenes.length-1;
  root.innerHTML=`<article class="storybook readalong-book" aria-labelledby="readalong-title"><nav class="story-toolbar" aria-label="Story controls"><button class="book-home" data-read-action="home" aria-label="Back to Stories">⌂<span>Stories</span></button><span class="story-book-name">${book.title}</span><button class="narration-replay" data-read-action="narration" aria-label="Replay narration${scene.audioNarration?'':' — audio coming soon'}" title="${scene.audioNarration?'Replay narration':'Audio coming soon'}" ${scene.audioNarration?'':'disabled'}>${speaker}</button></nav><div class="readalong-page page-arrival">${window.MoonlightArt.scene(scene)}<div class="readalong-copy"><h1 id="readalong-title">${scene.title}</h1><p>${scene.text}</p></div></div><nav class="book-pager" aria-label="Book pages"><button class="page-arrow" data-read-action="back" aria-label="Back" ${page===0?'disabled':''}>‹</button><span class="story-page-number" aria-live="polite">${page+1} / ${book.scenes.length}</span>${last?'<div class="readalong-ending"><button class="readalong-again" data-read-action="restart"><span aria-hidden="true">↻</span> Read Again</button><button class="book-home" data-read-action="home" aria-label="Back to Stories">⌂<span>Back to Stories</span></button></div>':'<button class="page-arrow" data-read-action="next" aria-label="Next">›</button>'}</nav></article>`;
  root.querySelector('h1').setAttribute('tabindex','-1');root.querySelector('h1').focus({preventScroll:true});window.scrollTo({top:0,behavior:'instant'});
 }
 function handle(event){const button=event.target.closest('[data-read-action]');if(!button||button.disabled)return;switch(button.dataset.readAction){case 'home':onHome();break;case 'back':if(page>0){page--;render();}break;case 'next':if(page<book.scenes.length-1){page++;render();}break;case 'restart':page=0;render();break;case 'narration':if(book.scenes[page].audioNarration){stopNarration();narration=new Audio(book.scenes[page].audioNarration);narration.play().catch(()=>{});}break;}}
 return {open,close};
})();
