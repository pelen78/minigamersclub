'use strict';
window.LittleSeedStory={id:'glup-little-seed',title:'Glup and the Little Seed',coverTitle:'Little Seed',theme:'seed',scenes:[
 {id:'tiny-seed',title:'A Tiny Seed',text:'Glup found a tiny seed. What could it become?',success:'A little seed. A big adventure!',task:'discover',hint:'Tap the seed.',items:['seed'],audioIntro:null,audioSuccess:null},
 {id:'plant',title:'Plant the Seed',text:'A cozy home in the soft, warm soil.',success:'All tucked in. Grow, little seed!',task:'plant',hint:'Move the seed into the pot. Or tap it.',items:['seed'],audioIntro:null,audioSuccess:null},
 {id:'water',title:'Give It Water',text:'Our little seed needs a drink.',success:'Drip, drop. Thank you for the water!',task:'water',hint:'Tap the watering can.',items:['water'],audioIntro:null,audioSuccess:null},
 {id:'sun',title:'Hello, Sunshine',text:'Let the warm sunshine peek through.',success:'Hello, sun! A tiny sprout is waking up.',task:'sun',hint:'Tap both clouds.',items:['cloud','cloud'],audioIntro:null,audioSuccess:null},
 {id:'sprout',title:'A Little Sprout',text:'Three little leaves. A little more growing!',success:'Look how our sprout has grown!',task:'grow',hint:'Tap the three leaves.',items:['leaf','leaf','leaf'],audioIntro:null,audioSuccess:null},
 {id:'rain',title:'Rainy Day',text:'Gentle rain gives our plant a drink.',success:'Four raindrops. Fresh and happy!',task:'rain',hint:'Tap each raindrop.',items:['drop','drop','drop','drop'],audioIntro:null,audioSuccess:null},
 {id:'colors',title:'Growing Colors',text:'Yellow, red, blue, green. Hello, garden colors!',success:'So many lovely colors!',task:'colors',hint:'Tap each color.',items:['yellow','red','blue','green'],audioIntro:null,audioSuccess:null},
 {id:'friends',title:'Garden Friends',text:'Bee, Butterfly and Ladybug came to say hello.',success:'Hello, friends. Welcome to our garden!',task:'friends',hint:'Tap each friend.',items:['bee','butterfly','ladybug'],audioIntro:null,audioSuccess:null},
 {id:'bloom',title:'The Big Bloom',text:'Our flower is ready. Let’s help it open!',success:'You helped a tiny seed become a beautiful flower!',task:'bloom',hint:'Tap the flower bud.',items:['flower'],audioIntro:null,audioSuccess:null}
]};
window.SeedScenes={
 actor(scene,count,complete){const a=window.SeedArt;
  if(scene.task==='discover')return `<button class="story-focus-object seed-discovery ${complete?'seed-found':''}" data-story-action="item" data-item="0" aria-label="Discover the tiny seed" ${complete?'disabled':''}>${a.item('seed')}${complete?'<span class="story-sparkles" aria-hidden="true">✦ ✧ ✦</span>':'<span class="tap-rings" aria-hidden="true"></span>'}</button>`;
  if(scene.task==='plant')return `<div class="seed-planting"><div class="planting-pot" role="img" aria-label="Planting pot">${a.plant(0)}</div>${complete?'<span class="planted-spark" aria-hidden="true">✦</span>':`<button class="plant-seed" data-story-action="item" data-item="0" aria-label="Plant seed: drag into pot or tap">${a.item('seed')}</button><span class="plant-guide" aria-hidden="true">↓</span>`}</div>`;
  let stage={water:0,sun:complete?1:0,grow:1+count*.6,rain:3+count*.15,colors:4,friends:4,bloom:4}[scene.task]||0;
  const plant=a.plant(stage,scene.task==='bloom'&&complete,scene.task==='colors'?count:0);
  return `${scene.task==='bloom'&&!complete?`<button class="seed-plant seed-bud-button" data-story-action="item" data-item="0" aria-label="Open the flower bud">${plant}<span class="tap-rings" aria-hidden="true"></span></button>`:`<div class="seed-plant ${complete?'plant-happy':''}">${plant}</div>`}${(scene.task==='water'||scene.task==='rain')&&count?'<div class="plant-water" aria-hidden="true">💧 · 💧</div>':''}${scene.task==='sun'&&!complete?'<span class="seed-cloud-shade" aria-hidden="true"></span>':''}${scene.task==='bloom'&&complete?'<span class="bloom-sparkles" aria-hidden="true">✧ ✦ ✧</span>':''}`;
 },
 items(scene,seen){if(['discover','plant','bloom'].includes(scene.task))return '';const verbs={water:'Water the seed',sun:'Move cloud',grow:'Grow leaf',rain:'Collect raindrop',colors:'Reveal',friends:'Greet'};
 return `<div class="story-items seed-items" role="group" aria-label="${scene.hint}">${scene.items.map((name,i)=>`<button class="story-item ${seen.has(i)?'eaten':''}" data-story-action="item" data-item="${i}" ${seen.has(i)?'disabled':''} aria-label="${verbs[scene.task]} ${name} ${i+1}">${window.SeedArt.item(name)}<span class="food-check" aria-hidden="true">✓</span></button>`).join('')}</div>`;}
};
