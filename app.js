'use strict';
const C=window.MiniCatalog;
const $=s=>document.querySelector(s);
const state={screen:'grades',grade:null,category:null,game:null,round:0,question:null,locked:false,sound:true,matched:[],flipped:[],deck:[],session:0,completed:{}};
try{state.completed=JSON.parse(localStorage.getItem('mini-playroom-completed')||'{}')||{};state.sound=localStorage.getItem('mini-playroom-sound')!=='off';}catch{}
let voice=null,audioContext=null,timers=new Set();
// Music has its own mute preference and gain, independent from Glup and effects.
const backgroundMusic=$('#background-music');
let musicEnabled=true,musicStarted=false,musicContext=null,musicGain=null;
try{musicEnabled=localStorage.getItem('mini-playroom-music')!=='off';}catch{}
backgroundMusic.volume=.1;
function musicUI(){const b=$('#music-button');b.dataset.muted=String(!musicEnabled);b.setAttribute('aria-pressed',String(musicEnabled));b.setAttribute('aria-label',musicEnabled?'Mute music':'Play music');}
function startMusic(){
 if(!musicEnabled||document.hidden||!musicStarted||state.screen==='story')return;
 // A separate gain also keeps music quiet on mobile browsers that ignore media volume.
 if(!musicContext){try{const Context=window.AudioContext||window.webkitAudioContext;if(Context){musicContext=new Context();musicGain=musicContext.createGain();musicGain.gain.value=.1;musicContext.createMediaElementSource(backgroundMusic).connect(musicGain);musicGain.connect(musicContext.destination);backgroundMusic.volume=1;}}catch{musicContext=null;backgroundMusic.volume=.1;}}
 musicContext?.resume().catch(()=>{});
 backgroundMusic.play().catch(()=>{});
}
function toggleMusic(){musicEnabled=!musicEnabled;try{localStorage.setItem('mini-playroom-music',musicEnabled?'on':'off');}catch{}musicUI();if(musicEnabled)startMusic();else{backgroundMusic.pause();musicContext?.suspend().catch(()=>{});}}
// Start only after a real interaction; never compete with browser autoplay rules.
document.addEventListener('click',event=>{musicStarted=true;if(event.target.closest('[data-action="music"], [data-action="story"]'))return;startMusic();});
window.addEventListener('pagehide',()=>{backgroundMusic.pause();musicContext?.suspend().catch(()=>{});});
window.addEventListener('pageshow',()=>{startMusic();});
// Refresh replaced recordings on each visit; reuse them while this page stays open.
const voiceRevision=Date.now().toString(36);
const total=6;
const speaker='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4zM17 8q5 4 0 8"/></svg>';
const escapeHtml=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function sprite(art,extra=''){return `<span class="sprite category-art ${extra}" style="--x:${art%3*50}%;--y:${Math.floor(art/3)*100}%" aria-hidden="true"></span>`;}
function later(fn,ms){const session=state.session;const timer=setTimeout(()=>{timers.delete(timer);if(session===state.session)fn();},ms);timers.add(timer);}
function stopAudio(){if(voice){voice.pause();voice.currentTime=0;voice=null;}window.speechSynthesis?.cancel();}
function leave(){window.MiniStory?.close();state.session++;for(const timer of timers)clearTimeout(timer);timers.clear();stopAudio();state.locked=false;}
function speak(text){stopAudio();if(!state.sound||!('speechSynthesis' in window))return;const utterance=new SpeechSynthesisUtterance(text);utterance.lang='en-US';utterance.rate=.86;utterance.pitch=1.04;const english=window.speechSynthesis.getVoices().find(v=>v.lang==='en-US');if(english)utterance.voice=english;window.speechSynthesis.speak(utterance);}
function recording(file,fallback){stopAudio();if(!state.sound)return;const session=state.session;voice=new Audio(`audio/${file}.mp3?v=${voiceRevision}`);voice.volume=.8;voice.play().catch(()=>{if(session===state.session)speak(fallback);});}
function chime(){if(!state.sound)return;try{audioContext??=new(window.AudioContext||window.webkitAudioContext)();audioContext.resume();const now=audioContext.currentTime;[523,659,784].forEach((frequency,i)=>{const o=audioContext.createOscillator(),g=audioContext.createGain();o.frequency.value=frequency;g.gain.setValueAtTime(.0001,now+i*.085);g.gain.exponentialRampToValueAtTime(.06,now+i*.085+.02);g.gain.exponentialRampToValueAtTime(.0001,now+i*.085+.3);o.connect(g);g.connect(audioContext.destination);o.start(now+i*.085);o.stop(now+i*.085+.31);});}catch{}}
function soundUI(){const b=$('#sound-button');b.dataset.muted=String(!state.sound);b.setAttribute('aria-label',state.sound?'Turn sound off':'Turn sound on');}
function glup(message,pose='idle'){const g=$('#glup');$('#glup-message').textContent=message;g.style.setProperty('--x',pose==='cheer'?'50%':pose==='think'?'100%':'0%');g.className=`sprite glup ${pose}`;}
function focusMain(){document.body.dataset.screen=state.screen;requestAnimationFrame(()=>{$('#main').focus({preventScroll:true});window.scrollTo({top:0,behavior:'instant'});});}
function crumb(){return `<nav class="crumb" aria-label="Back"><button data-action="${state.screen==='games'?'home':'games'}">‹ ${state.screen==='games'?'Levels':'Games'}</button></nav>`;}
function heading(eyebrow,title,sub){return `<h1 class="scene-title">${title}</h1>`;}
function showGrades(){leave();state.screen='grades';state.grade=null;state.category=null;state.game=null;$('.glup-panel').classList.remove('playing');glup("Hi! I'm Glup. Which level shall we explore?");
 $('#main').innerHTML=`<section class="level-panel home-panel"><header class="panel-heading"><svg class="heading-accent" viewBox="0 0 36 34" aria-hidden="true"><path d="M5 29q3-8 12-11" stroke="#f3b63f"/><path d="M21 21q2-9 9-15" stroke="#4aa3dc"/></svg><h1 class="scene-title">Choose your level</h1><p class="panel-note">Big adventures for<br>bright little learners! <svg class="doodle-heart" viewBox="0 0 24 22" aria-hidden="true"><path d="M12 20C5 15 2 11 2 7.2 2 4.3 4.3 2 7.1 2c2 0 3.8 1.1 4.9 2.8C13.1 3.1 14.9 2 16.9 2 19.7 2 22 4.3 22 7.2 22 11 19 15 12 20z"/></svg></p></header><div class="tiles grade-tiles">${C.grades.map(g=>`<button class="tile ${g.color}" data-action="grade" data-grade="${g.id}" aria-label="${g.name}">${sprite(g.art)}<span class="tile-title"><span class="tile-name">${g.name}</span><span class="dot-words" aria-hidden="true">${g.words.map((w,i)=>i?`<span><i></i>${w}</span>`:`<span>${w}</span>`).join('')}</span></span></button>`).join('')}</div></section>`+window.MiniStory.card()+`<p class="home-tagline"><span class="tagline-swoosh" aria-hidden="true"></span><svg class="doodle-heart" viewBox="0 0 24 22" aria-hidden="true"><path d="M12 20C5 15 2 11 2 7.2 2 4.3 4.3 2 7.1 2c2 0 3.8 1.1 4.9 2.8C13.1 3.1 14.9 2 16.9 2 19.7 2 22 4.3 22 7.2 22 11 19 15 12 20z"/></svg><span>Small steps. Brighter tomorrows.</span><span class="tagline-swoosh" aria-hidden="true"></span></p>`;
 focusMain();startMusic();}
function showGames(){leave();state.screen='games';state.category='all';$('.glup-panel').classList.remove('playing');const list=C.games[state.grade];const name=C.grades.find(g=>g.id===state.grade).name;glup('Pick a game. I’ll be right here with you!');
 $('#main').innerHTML=crumb()+heading(C.grades.find(g=>g.id===state.grade).name,name,'Choose an activity. You can come back and try another any time.')+`<div class="tiles">${list.map(g=>{const cat=C.categories.find(c=>c.id===g.category);return `<button class="tile game-tile ${cat.color}" data-action="start" data-game="${g.id}">${state.completed[state.grade+':'+g.id]?'<span class="check-mark" aria-label="Played">✓</span>':''}${sprite(g.art)}<span class="tile-title">${g.name}</span></button>`;}).join('')}</div>`;
 recording('glup-selectgame','Pick a game.');focusMain();}
function play(id){leave();state.screen='play';state.game=C.games[state.grade].find(g=>g.id===id);state.round=0;state.matched=[];state.flipped=[];$('.glup-panel').classList.add('playing');glup('Let’s give it a try!');
 $('#main').innerHTML=crumb()+`<section class="play-panel" aria-label="${state.game.name}"><div class="play-header"><h1>${state.game.name}</h1><span id="round-label" class="round-label"></span></div><div class="progress" id="progress" aria-label="Activity progress"></div><div class="question" id="question"></div><div class="question-visual" id="question-visual"></div><div id="answers"></div><p id="feedback" class="feedback" role="status"></p><div id="play-actions" class="play-actions"><button class="secondary listen" data-action="listen">${speaker} Listen again</button><button class="secondary" data-action="games" data-category="${state.category||'all'}">Back to games</button></div></section>`;
 if(id==='memory')startMemory();else nextQuestion();focusMain();}
function progress(n,max=total){$('#round-label').textContent=`${Math.min(n+1,max)} of ${max}`;$('#progress').innerHTML=Array.from({length:max},(_,i)=>`<span class="${i<n?'done':''}"></span>`).join('');$('#progress').setAttribute('aria-label',`${n} of ${max} completed`);}
function nextQuestion(){state.locked=false;state.question=C.generate(state.grade,state.game.kind);const q=state.question;progress(state.round);$('#question').textContent=q.prompt;$('#question-visual').innerHTML=q.visual;$('#answers').className=`answers ${q.options.length===2?'two':''}`;$('#answers').innerHTML=q.options.map((o,i)=>`<button class="answer" data-action="answer" data-option="${i}" aria-label="${escapeHtml(o.label)}">${o.visual||''}<span class="answer-label">${escapeHtml(o.label)}</span></button>`).join('');$('#feedback').textContent='';speak(q.prompt);}
function answer(index,button){if(state.locked)return;const option=state.question.options[index];if(!option)return;
 if(option.key===state.question.answer){state.locked=true;$('#answers').querySelectorAll('button').forEach(b=>b.disabled=true);button.classList.add('correct');$('#feedback').textContent='You found it!';glup('You found it! Nice thinking.','cheer');chime();state.round++;progress(state.round);later(()=>{if(state.round===total)win();else{glup('Ready for the next one?');nextQuestion();}},1250);}
 else{state.locked=true;button.classList.add('wrong');$('#feedback').textContent='Let’s try another one. You can do it!';glup('Take another look. You can do it!','think');speak('Try another one.');later(()=>{button.classList.remove('wrong');state.locked=false;},700);}}
function startMemory(){const pairs=C.generate(state.grade,'memory').pairs;state.question={prompt:'Turn over two cards. Can you find the matching pictures?'};state.deck=C.shuffle(Array.from({length:pairs},(_,i)=>[i,i]).flat());state.pairs=pairs;progress(0,pairs);$('#question').textContent=state.question.prompt;$('#question-visual').innerHTML='';$('#answers').className='memory-grid';renderMemory();speak(state.question.prompt);}
function renderMemory(){const focusIndex=document.activeElement?.dataset?.card;$('#answers').innerHTML=state.deck.map((art,i)=>{const matched=state.matched.includes(art),open=state.flipped.includes(i)||matched;return `<button class="memory-card ${open?'open':''} ${matched?'matched':''}" data-action="flip" data-card="${i}" ${matched?'disabled':''} aria-label="${open?C.categories[art].name+(matched?', matched':''):'Turn over card '+(i+1)}">${open?sprite(art,'memory-art'):'★'}</button>`;}).join('');if(focusIndex!==undefined)$('#answers').querySelector(`[data-card="${focusIndex}"]:not(:disabled)`)?.focus({preventScroll:true});}
function flip(index){if(state.locked||state.flipped.includes(index)||state.matched.includes(state.deck[index]))return;state.flipped.push(index);renderMemory();if(state.flipped.length<2)return;state.locked=true;const [a,b]=state.flipped;
 if(state.deck[a]===state.deck[b]){state.matched.push(state.deck[a]);$('#feedback').textContent='A matching pair!';glup('Two of a kind!','cheer');chime();progress(state.matched.length,state.pairs);later(()=>{state.flipped=[];state.locked=false;if(state.matched.length===state.pairs)win();else renderMemory();},900);}
 else{$('#feedback').textContent='Remember those pictures. Try another pair.';glup('Let’s remember where those pictures are.','think');later(()=>{state.flipped=[];state.locked=false;renderMemory();},1250);}}
function confetti(){if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;for(let i=0;i<22;i++){const e=document.createElement('span');e.className='confetti';e.style.cssText=`--left:${Math.random()*100}%;--delay:${Math.random()*.4}s;--confetti:${C.colors[i%6][1]}`;$('#celebration').append(e);setTimeout(()=>e.remove(),2200);}}
function win(){stopAudio();state.screen='win';state.locked=true;state.completed[state.grade+':'+state.game.id]=true;try{localStorage.setItem('mini-playroom-completed',JSON.stringify(state.completed));}catch{}glup('Look what you discovered! I’m proud of you.','cheer');$('#main').innerHTML=crumb()+`<section class="play-panel"><div class="win-star" aria-hidden="true">★</div><h1>You did it!</h1><p class="win-copy">${state.game.name} complete.</p><p class="subtitle">A little practice makes a big difference.</p><div class="play-actions"><button class="primary" data-action="start" data-game="${state.game.id}">Play again</button><button class="secondary" data-action="games" data-category="${state.category||'all'}">More games →</button></div></section>`;confetti();speak('You did it! Great exploring!');focusMain();}
document.addEventListener('click',event=>{const button=event.target.closest('button[data-action]');if(!button||button.disabled)return;switch(button.dataset.action){
 case 'home':showGrades();break;
 case 'story':leave();state.screen='story';backgroundMusic.pause();musicContext?.suspend().catch(()=>{});focusMain();window.MiniStory.open($('#main'),format=>{showGrades();requestAnimationFrame(()=>{const section=document.getElementById('stories-library');section?.scrollIntoView({block:'start'});section?.querySelector('h2')?.focus({preventScroll:true});});},button.dataset.story);break;
 case 'story-filter':window.MiniStory.filter(button.dataset.filter);break;
 case 'grade':state.grade=button.dataset.grade;showGames();break;
 case 'games':showGames();break;
 case 'start':play(button.dataset.game);break;
 case 'answer':answer(Number(button.dataset.option),button);break;
 case 'flip':flip(Number(button.dataset.card));break;
 case 'listen':speak(state.question.prompt);break;
 case 'music':toggleMusic();break;
 case 'sound':state.sound=!state.sound;stopAudio();if(!state.sound)audioContext?.suspend();else audioContext?.resume();try{localStorage.setItem('mini-playroom-sound',state.sound?'on':'off');}catch{}soundUI();break;
 case 'hello':if(state.sound)document.body.classList.add('glup-greeted');glup('Hi, friend! Let’s discover something together.','cheer');recording('glup-welcome','Hi, friend! Let’s discover something together.');break;
 case 'welcome':glup('Pick your level. Let’s have some fun!','cheer');recording('glup-welcome2','Pick your level.');break;
}});
document.addEventListener('visibilitychange',()=>{if(document.hidden){stopAudio();audioContext?.suspend();backgroundMusic.pause();musicContext?.suspend().catch(()=>{});}else{if(state.sound)audioContext?.resume();startMusic();}});
soundUI();musicUI();showGrades();
