'use strict';
window.MiniStory=(()=>{
 const books=[window.MunchyBugStory,window.LittleSeedStory,window.MoonlightStory],art=window.StoryArt;
 let book=books[0],drag=null,ignoreClickUntil=0;
 const icons={back:'‹',next:'›',home:'⌂',replay:'↻'};
 let page=0,progress=[],root=null,events=null,onHome=null;
 const current=()=>book.scenes[page];
 const done=()=>progress[page].size===current().items.length;
 const glup=(cheer=false)=>`<span class="story-glup sprite" style="--x:${cheer?'50%':'0%'};--y:100%" aria-hidden="true"></span>`;
 function card(){return [['play-along','Play-Along Stories'],['read-along','Read-Along Stories']].map(([format,title])=>`<section class="story-library" id="${format}-stories" aria-labelledby="${format}-title"><h2 id="${format}-title" tabindex="-1">${title}</h2><div class="story-shelf">${books.filter(entry=>(entry.format||'play-along')===format).map(entry=>`<button class="story-cover" data-action="story" data-story="${entry.id}" aria-label="Read ${entry.title}"><span class="story-cover-art ${entry.theme==='seed'?'seed-cover':entry.theme==='moonlight'?'moonlight-cover':''}" aria-hidden="true">${glup()}<span class="cover-bug">${entry.theme==='seed'?window.SeedArt.plant(4,true):entry.theme==='moonlight'?window.MoonlightArt.star():art.bug()}</span><span class="cover-spark">✦</span></span><span class="story-cover-title">Glup and the<br>${entry.title.replace('Glup and the ','')}<span class="story-open-icon" aria-hidden="true">▤ <span>›</span></span></span></button>`).join('')}</div></section>`).join('');}

 function open(element,home,id){close();book=books.find(entry=>entry.id===id)||books[0];if(book.format==='read-along'){window.ReadAlongPlayer.open(element,()=>home('read-along'),book);return;}root=element;onHome=()=>home('play-along');page=0;progress=book.scenes.map(()=>new Set());events=new AbortController();root.addEventListener('click',handle,{signal:events.signal});for(const name of ['pointerdown','pointermove','pointerup','pointercancel'])root.addEventListener(name,handlePlantDrag,{signal:events.signal});render(true);}
 function close(){window.ReadAlongPlayer?.close();events?.abort();events=null;root=null;drag=null;ignoreClickUntil=0;}
 function dots(){return `<div class="story-count" role="img" aria-label="${progress[page].size} of ${current().items.length} completed">${current().items.map((_,i)=>`<span class="${i<progress[page].size?'filled':''}" aria-hidden="true">${i<progress[page].size?'✓':'○'}</span>`).join('')}</div>`;}
 function actor(){const scene=current(),complete=done(),eaten=progress[page].size;if(book.theme==='seed')return window.SeedScenes.actor(scene,eaten,complete);
  if(scene.task==='hatch'&&!complete)return `<button class="story-focus-object story-egg" data-story-action="item" data-item="0" aria-label="Tap the egg to hatch it">${art.item('egg')}<span class="tap-rings" aria-hidden="true"></span></button>`;
  if(scene.task==='reveal')return complete?`<div class="story-butterfly">${art.butterfly()}<span class="story-sparkles" aria-hidden="true">✧ ✦ ✧</span></div>`:`<button class="story-focus-object story-cocoon" data-story-action="item" data-item="0" aria-label="Tap the cocoon to reveal the surprise">${art.item('cocoon')}<span class="tap-rings" aria-hidden="true"></span></button>`;
  if(scene.task==='sleep'&&complete)return `<div class="story-focus-object sleeping">${art.item('cocoon')}<span class="sleep-stars" aria-hidden="true">✦ · ✧</span></div>`;
  return `${scene.task==='hatch'&&complete?'<span class="hatch-sparkles" aria-hidden="true">✧ ✦ ✧</span>':''}${scene.task==='sleep'&&eaten?`<div class="cocoon-wrap" style="opacity:${eaten/3}">${art.item('cocoon')}</div>`:''}<div class="story-bug ${eaten?'nibble':''}" style="--bug-scale:${Math.min(1.05,.7+page*.043+eaten*.025)}">${art.bug(scene.task==='leaf'&&!complete)}</div>`;
 }
 function items(){const scene=current();if(book.theme==='seed')return window.SeedScenes.items(scene,progress[page]);if(['hatch','reveal'].includes(scene.task))return '';
  return `<div class="story-items" role="group" aria-label="${scene.task==='sleep'?'Tap each star':'Tap each food to feed Bug'}">${scene.items.map((name,i)=>`<button class="story-item ${progress[page].has(i)?'eaten':''}" data-story-action="item" data-item="${i}" ${progress[page].has(i)?'disabled':''} aria-label="${scene.task==='sleep'?'Light star':`Feed ${name}`} ${i+1}">${art.item(name)}<span class="food-check" aria-hidden="true">✓</span></button>`).join('')}</div>`;
 }
 function render(newPage=false){if(!root)return;const scene=current(),complete=done(),night=scene.task==='sleep';
  root.innerHTML=`<article class="storybook ${night?'story-night':''} ${book.theme==='seed'?'seed-book seed-scene-'+scene.task:''} ${complete?'scene-complete':''}" aria-labelledby="story-page-title">
   <nav class="story-toolbar" aria-label="Story controls"><button class="book-home" data-story-action="home" aria-label="Back to Mini Gamers">${icons.home}<span>Home</span></button><span class="story-book-name">${book.title}</span><button hidden disabled aria-label="Listen to this page">♪</button><span class="story-page-number" aria-label="Page ${page+1} of ${book.scenes.length}">${page+1} / ${book.scenes.length}</span></nav>
   <div class="book-spread ${newPage?'page-arrival':''}"><div class="story-garden ${scene.task==='leaf'?'tummy-scene':''}"><span class="garden-sun" aria-hidden="true"></span><span class="garden-cloud" aria-hidden="true"></span><span class="garden-flower flower-one" aria-hidden="true">✿</span><span class="garden-flower flower-two" aria-hidden="true">✿</span>${glup(complete)}<div class="story-actor">${actor()}</div>${scene.task==='leaf'&&!complete?`<div class="extra-treats" aria-hidden="true">${['cookie','cupcake','candy'].map(x=>art.item(x)).join('')}</div>`:''}</div>
   <div class="story-page-copy"><h1 id="story-page-title">${scene.title}</h1><p>${scene.text}</p><div class="story-interaction">${items()}${dots()}</div><p class="story-response" role="status">${complete?scene.success:scene.hint||(scene.task==='hatch'?'Tap the egg.':scene.task==='reveal'?'Tap the cocoon.':scene.task==='sleep'?'Tap the stars.':'Tap to feed Bug.')}</p></div></div>
   <nav class="book-pager" aria-label="Book pages"><button class="page-arrow previous-page" data-story-action="previous" aria-label="Previous page" ${page===0?'disabled':''}>${icons.back}</button><div class="page-dots" aria-hidden="true">${book.scenes.map((_,i)=>`<span class="${i===page?'current':''} ${progress[i].size===book.scenes[i].items.length?'read':''}"></span>`).join('')}</div>${complete?(page===book.scenes.length-1?`<div class="story-ending"><button class="book-replay" data-story-action="restart" aria-label="Play story again">${icons.replay}</button><button class="page-arrow" data-story-action="home" aria-label="Back to Mini Gamers">${icons.home}</button></div>`:`<button class="page-arrow next-page" data-story-action="next" aria-label="Next page">${icons.next}</button>`):'<span class="next-space" aria-hidden="true"></span>'}</nav>
  </article>`;
  if(newPage){root.focus({preventScroll:true});window.scrollTo({top:0,behavior:'instant'});}
 }
 function handle(event){const button=event.target.closest('button[data-story-action]');if(!button||button.disabled||!root)return;const action=button.dataset.storyAction;
  if(action==='home'){onHome();return;}
  if(action==='restart'){page=0;progress=book.scenes.map(()=>new Set());render(true);return;}
  if(action==='previous'&&page>0){page--;render(true);return;}
  if(action==='next'&&done()&&page<book.scenes.length-1){page++;render(true);return;}
  if(action==='item'&&performance.now()>ignoreClickUntil)completeItem(Number(button.dataset.item));
 }
 function completeItem(index){if(!root||!Number.isInteger(index)||index<0||index>=current().items.length||progress[page].has(index))return;progress[page].add(index);render();root.querySelector(done()?'.next-page, .book-replay':'.story-item:not(:disabled)')?.focus({preventScroll:true});}
 function handlePlantDrag(event){
  if(current().task!=='plant'||done())return;
  if(event.type==='pointerdown'){const seed=event.target.closest('.plant-seed');if(!seed||event.button!==0)return;drag={seed,x:event.clientX,y:event.clientY,id:event.pointerId,moved:false};seed.setPointerCapture(event.pointerId);return;}
  if(!drag||event.pointerId!==drag.id)return;
  if(event.type==='pointermove'){const x=event.clientX-drag.x,y=event.clientY-drag.y;if(Math.hypot(x,y)>8)drag.moved=true;drag.seed.style.translate=`${x}px ${y}px`;return;}
  const currentDrag=drag;drag=null;currentDrag.seed.style.translate='';if(currentDrag.seed.hasPointerCapture(event.pointerId))currentDrag.seed.releasePointerCapture(event.pointerId);
  if(event.type==='pointerup'&&currentDrag.moved){ignoreClickUntil=performance.now()+400;const pot=root.querySelector('.planting-pot').getBoundingClientRect();if(event.clientX>=pot.left-25&&event.clientX<=pot.right+25&&event.clientY>=pot.top+pot.height*.5&&event.clientY<=pot.bottom+25)completeItem(0);}
 }
 return {open,close,card};
})();
