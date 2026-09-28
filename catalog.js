/* Grade-specific activities. Rendering and sound live in app.js. */
(function(root){
'use strict';
const categories=[
 {id:'colors',name:'Colors',art:0,color:'peach'}, {id:'shapes',name:'Shapes & logic',art:1,color:'mint'},
 {id:'numbers',name:'Numbers',art:2,color:'lilac'}, {id:'letters',name:'Letters',art:3,color:'pink'},
 {id:'feelings',name:'Feelings',art:4,color:'yellow'}, {id:'animals',name:'Animals',art:5,color:'mint'}
];
const grades=[{id:'prek',name:'Pre-K',tag:'Little discoveries',desc:'Match, notice and count to 5.',words:['Explore','Create','Play'],motto:'Explore, create, and play!',note:['Little learners.','Big possibilities!'],art:0,color:'peach'},
 {id:'kinder',name:'Kindergarten',tag:'Growing explorers',desc:'Build patterns, count and connect.',words:['Build','Think','Discover'],motto:'Build, think, and discover!',note:['Growing minds.','Big ideas!'],art:1,color:'mint'},
 {id:'grade1',name:'1st Grade',tag:'Ready for a challenge',desc:'Solve, spell and discover more.',words:['Learn','Solve','Grow'],motto:'Learn, solve, and grow!',note:['Bright minds.','Bright futures!'],art:3,color:'lilac'}];
const entries={
 prek:[['colors','Color Match','Find a color','colors'],['shapes','Shape Finder','Find shapes and colors','shapes'],['count','Count It!','Count from 1 to 5','numbers'],['letters','Letter Twins','Match capital letters','letters'],['feelings','How Do I Feel?','Happy, sad or surprised?','feelings'],['animals','Animal Sounds','Who says woof?','animals'],['size','Big & Small','Compare two shapes','shapes'],['memory','First Pairs','Find 2 matching pairs','shapes'],['patterns','What Comes Next?','Try a simple pattern','shapes']],
 kinder:[['mix','Color Mix','Discover new colors','colors'],['shapes','Shape Detective','Count the sides','shapes'],['numbers','Number Neighbors','Numbers up to 20','numbers'],['letters','Letter Partners','Match big and small letters','letters'],['feelings','Feeling Stories','Listen to a little story','feelings'],['animals','Animal Homes','Discover where animals live','animals'],['count','Count & Add','Put two groups together','numbers'],['memory','Memory Match','Find 3 matching pairs','shapes'],['patterns','Pattern Builder','Look for a repeating pattern','shapes']],
 grade1:[['math','Math Blast','Add within 20','numbers'],['subtract','Take Away','Subtract within 20','numbers'],['letters','Spell It!','Complete a familiar word','letters'],['feelings','Kind Choices','Think about helping others','feelings'],['animals','Animal Detective','Listen for the clues','animals'],['count','Groups of Ten','Count tens and ones','numbers'],['memory','Memory Challenge','Find 4 matching pairs','shapes'],['patterns','Pattern Puzzles','Discover the missing piece','shapes'],['mix','Color Lab','Explore color combinations','colors']]
};
const games=Object.fromEntries(Object.entries(entries).map(([grade,items])=>[grade,items.map(([kind,name,desc,category])=>({id:kind,kind,name,desc,category,art:categories.find(c=>c.id===category).art}))]));
const colors=[['Red','#eb5859'],['Blue','#489edd'],['Yellow','#f4c84f'],['Green','#67b67f'],['Orange','#f39853'],['Purple','#ae88cc']];
const matchColors=[...colors,['Pink','#f497b6'],['Brown','#9a6a43'],['Black','#34363d'],['White','#fffdf8']];
const shapes=['circle','square','triangle','star'];
const rnd=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
const pick=a=>a[rnd(0,a.length-1)];
function shuffle(a){a=[...a];for(let i=a.length-1;i>0;i--){const j=rnd(0,i);[a[i],a[j]]=[a[j],a[i]];}return a;}
const cap=s=>s[0].toUpperCase()+s.slice(1);
const animalNames=['Dog','Cat','Cow','Duck','Dolphin','Bird','Bee','Fish','Butterfly'];
function animalChoice(name){const i=animalNames.indexOf(name);return choice(name,name,i<0?'':`<span class="sprite animal-art" style="--x:${i%3*50}%;--y:${Math.floor(i/3)*50}%" aria-hidden="true"></span>`);}
const shape=(s,color='#55b7bd',size=64)=>`<span class="shape ${s}" style="--shape-color:${color};--shape-size:${size}px" aria-hidden="true"></span>`;
const blob=(color,size=66)=>`<span class="paint-dot${color==='#fffdf8'?' paint-white':''}" style="--paint:${color};--dot-size:${size}px" aria-hidden="true"></span>`;
const face=(feeling)=>`<span class="face ${feeling}" aria-hidden="true"><i></i><i></i><b></b></span>`;
function choice(label,key=label,visual=''){return {label,key,visual};}
function q(prompt,visual,options,answer){return{prompt,visual,options:shuffle(options),answer};}
function numberOptions(n,min=0,max=40){const pool=Array.from({length:max-min+1},(_,i)=>i+min).filter(v=>v!==n);return shuffle([n,...shuffle(pool).slice(0,3)]).map(n=>choice(String(n),n));}
function counters(n){return `<div class="counters">${Array.from({length:n},(_,i)=>`<span class="counter" style="--i:${i}"></span>`).join('')}</div>`;}
/* Pre-K Shape Finder: a shuffled deck of every shape and color+shape prompt, dealt without repeats. */
const prekShapes=['circle','square','triangle','star','rectangle'];
const prekColors=[...colors,['Pink','#f497b6']];
let shapeDeck=[],lastShape='';
function prekShape(){
 if(!shapeDeck.length){
  const all=[...prekShapes.map(s=>[null,s]),...prekShapes.flatMap(s=>prekColors.map(c=>[c,s]))];
  shapeDeck=shuffle(all);
  if(shapeDeck.length>1&&shapeDeck[shapeDeck.length-1].join()===lastShape)shapeDeck.unshift(shapeDeck.pop());
 }
 const [c,s]=shapeDeck.pop();lastShape=[c,s].join();
 const item=(col,sh)=>choice(cap(col?`${col[0].toLowerCase()} ${sh}`:sh),`${col?col[0]:''}-${sh}`,shape(sh,(col||pick(prekColors))[1]));
 if(!c){
  const others=shuffle(prekShapes.filter(v=>v!==s)).slice(0,3),tints=shuffle(prekColors);
  return q(`Find the ${s}.`,'',[s,...others].map((v,i)=>choice(cap(v),v,shape(v,tints[i][1]))),s);
 }
 const target=`${c[0]}-${s}`,opts=[[c,s]],used=new Set([target]);
 const add=(col,sh)=>{const k=`${col[0]}-${sh}`;if(!used.has(k)&&opts.length<4){used.add(k);opts.push([col,sh]);}};
 add(pick(prekColors.filter(v=>v!==c)),s);
 add(c,pick(prekShapes.filter(v=>v!==s)));
 while(opts.length<4)add(pick(prekColors),pick(prekShapes));
 return q(`Find the ${c[0].toLowerCase()} ${s}.`,'',opts.map(([col,sh])=>item(col,sh)),target);
}
function generate(grade,kind){
 const difficulty={prek:0,kinder:1,grade1:2}[grade];
 if(difficulty===undefined)throw new Error('Unknown grade');
 if(kind==='colors'){
  const opts=shuffle(difficulty?colors:matchColors).slice(0,4),c=pick(opts);
  return q(`Find ${c[0].toLowerCase()}.`,'<span class="question-symbol">?</span>',opts.map(v=>choice(v[0],v[0],blob(v[1]))),c[0]);
 }
 if(kind==='mix'){
  const combos=[['Red','Yellow','Orange'],['Blue','Yellow','Green'],['Red','Blue','Purple']];const [a,b,c]=pick(combos),color=n=>colors.find(v=>v[0]===n)[1];
  if(difficulty===2)return q(`Which paint mixes with ${a.toLowerCase()} to make ${c.toLowerCase()}?`,`<div class="mixing">${blob(color(a))}<span>+</span><span>?</span><span>=</span>${blob(color(c))}</div>`,[colors.find(v=>v[0]===b),...shuffle(colors.filter(v=>v[0]!==b)).slice(0,3)].map(v=>choice(v[0],v[0],blob(v[1],42))),b);
  return q('What color do these paints make?',`<div class="mixing">${blob(color(a))}<span>+</span>${blob(color(b))}</div>`,[colors.find(v=>v[0]===c),...shuffle(colors.filter(v=>v[0]!==c)).slice(0,3)].map(v=>choice(v[0],v[0],blob(v[1],42))),c);
 }
 if(kind==='shapes'){
  if(!difficulty)return prekShape();
  const s=pick(['circle','square','triangle']);
  const prompt=difficulty?({circle:'Find the shape with no straight sides.',square:'Find the shape with 4 equal sides.',triangle:'Find the shape with 3 sides.'}[s]):`Find the ${s}.`;
  return q(prompt,'',shapes.map((v,i)=>choice(cap(v),v,shape(v,colors[i][1]))),s);
 }
 if(kind==='size'){
  const big=Math.random()>.5;return q(`Which circle is ${big?'bigger':'smaller'}?`,'',[choice('This one','small',shape('circle','#56b9ba',40)),choice('This one','big',shape('circle','#56b9ba',90))],big?'big':'small');
 }
 if(kind==='count'){
  if(difficulty===0){const n=rnd(1,5);return q('How many buttons can you count?',counters(n),numberOptions(n,1,5),n);}
  if(difficulty===1){const a=rnd(1,5),b=rnd(1,5);return q('How many buttons altogether?',`<div class="groups">${counters(a)}<span>+</span>${counters(b)}</div>`,numberOptions(a+b,1,10),a+b);}
  const tens=rnd(1,3),ones=rnd(0,9),n=tens*10+ones;
  return q('How many? Each long block is ten.',`<div class="tens">${Array.from({length:tens},()=>'<span class="ten-block">10</span>').join('')}${counters(ones)}</div>`,numberOptions(n,10,39),n);
 }
 if(kind==='numbers'){
  const n=rnd(2,19),before=Math.random()>.5;return q(`What comes ${before?'before':'after'} ${n}?`,`<div class="letter-block">${n}</div>`,numberOptions(before?n-1:n+1,1,20),before?n-1:n+1);
 }
 if(kind==='math'||kind==='subtract'){
  const a=kind==='subtract'?rnd(3,20):rnd(1,10),b=kind==='subtract'?rnd(1,a):rnd(1,10),result=kind==='subtract'?a-b:a+b;
  return q(kind==='subtract'?`What is ${a} minus ${b}?`:`What is ${a} plus ${b}?`,`<div class="equation">${a} ${kind==='subtract'?'−':'+'} ${b} = ?</div>`,numberOptions(result,0,20),result);
 }
 if(kind==='letters'){
  const alphabet='ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  if(difficulty<2){const upper=pick(alphabet),target=difficulty?upper.toLowerCase():upper;
   const opts=shuffle(alphabet.filter(v=>v!==upper)).slice(0,3).map(v=>difficulty?v.toLowerCase():v);
   return q(difficulty?`Find the small letter for ${upper}.`:`Find the matching letter ${upper}.`,`<div class="letter-block">${upper}</div>`,[target,...opts].map(v=>choice(v)),target);}
  const word=pick(['CAT','DOG','SUN','HAT','CUP','BED','PIG','MAP']),index=rnd(0,2),letter=word[index];
  return q(`Complete the word ${word.toLowerCase()}.`,`<div class="word-blocks">${word.split('').map((l,i)=>`<span class="letter-block">${i===index?'_':l}</span>`).join('')}</div>`,[letter,...shuffle(alphabet.filter(v=>v!==letter)).slice(0,3)].map(v=>choice(v)),letter);
 }
 if(kind==='patterns'){
  const items=shuffle(colors).slice(0,3),pattern=difficulty===0?[0,1,0,1]:difficulty===1?pick([[0,0,1,0,0],[0,1,2,0,1]]):pick([[0,1,1,0,1],[0,0,1,1,0]]);
  const next=difficulty===0?0:difficulty===1?(pattern[1]===0?1:2):(pattern[1]===1?1:0);
  return q('Which color comes next?',`<div class="pattern">${pattern.map(i=>blob(items[i][1],42)).join('')}<span>?</span></div>`,items.map(v=>choice(v[0],v[0],blob(v[1],50))),items[next][0]);
 }
 if(kind==='feelings'){
  const opts=['happy','sad','surprised'];
  if(difficulty===0){const answer=pick(opts);return q(`Find the ${answer} face.`,'',opts.map(v=>choice(cap(v),v,face(v))),answer);}
  if(difficulty===1){const stories=[['A friend gives Mia a lovely surprise. How might she feel?','surprised'],['Leo lost his favorite toy. How might he feel?','sad'],['Sam is playing a favorite game with friends. How might Sam feel?','happy']];const [prompt,answer]=pick(stories);return q(prompt,'',opts.map(v=>choice(cap(v),v,face(v))),answer);}
  const stories=[['A friend feels left out. What could you do?','Invite them to play',['Walk away','Hide the toys']],['Your friend drops their crayons. What could you do?','Help pick them up',['Kick them away','Laugh at them']],['Someone is speaking. What is a kind choice?','Listen to them',['Shout over them','Take their book']]];
  const [prompt,answer,wrong]=pick(stories);return q(prompt,face('happy'),[answer,...wrong].map(v=>choice(v)),answer);
 }
 if(kind==='animals'){
  const animals=[['Dog','woof','a dog'],['Cat','meow','a cat'],['Cow','moo','a cow'],['Duck','quack','a duck']];
  if(difficulty===0){const a=pick(animals);return q(`Who says ${a[1]}?`,'<span class="sound-cue" aria-hidden="true">♪</span>',animals.map(v=>animalChoice(v[0])),a[0]);}
  const facts=difficulty===1?[['Which animal lives in the ocean?','Dolphin',['Dog','Cat','Cow']],['Which animal builds a nest for its eggs?','Bird',['Dog','Cat','Cow']],['Which animal lives in a hive?','Bee',['Duck','Cat','Fish']]]:[['I have feathers, wings and a beak. What am I?','Bird',['Cat','Fish','Dolphin']],['I have fins and breathe through gills. What am I?','Fish',['Dog','Bird','Butterfly']],['I have six legs and colorful wings. What am I?','Butterfly',['Cat','Fish','Duck']]];
  const [prompt,answer,wrong]=pick(facts);return q(prompt,'',[answer,...wrong].map(v=>animalChoice(v)),answer);
 }
 if(kind==='memory')return {memory:true,pairs:difficulty+2};
 throw new Error(`Unknown game ${kind}`);
}
const api={categories,grades,games,colors,generate,shuffle,shape,blob};
if(typeof module!=='undefined')module.exports=api;else root.MiniCatalog=api;
})(typeof window!=='undefined'?window:this);
