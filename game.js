const cv=document.getElementById('c'),g=cv.getContext('2d');
const F=s=>s+'px "Press Start 2P","Courier New",monospace';
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
/* ---------- audio ---------- */
let ac,mg,musOn=true,trk=null,step=0,nextT=0;
try{musOn=localStorage.getItem('mossroad-mus')!=='0'}catch(e){}
function A(){if(!ac){ac=new(window.AudioContext||window.webkitAudioContext)();mg=ac.createGain();mg.gain.value=musOn?.5:0;mg.connect(ac.destination);setInterval(tick,25)}if(ac.state=='suspended')ac.resume();return ac}
function osc(f,t,d,ty,v,dest){const o=ac.createOscillator(),a=ac.createGain();o.type=ty;o.frequency.value=f;a.gain.setValueAtTime(v,t);a.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(a);a.connect(dest);o.start(t);o.stop(t+d+.02)}
function beep(f,d=.05,v=.035,ty='square'){try{A();osc(f,ac.currentTime,d,ty,v,ac.destination)}catch(e){}}
const SC=[0,3,5,7,10,12,15,17,19,22],mtof=m=>440*2**((m-69)/12);
const TR={
title:{bpm:72,root:57,w:'triangle',hat:0,v:.07,lead:'4..2..0.2..3....4..5..4.3.2.0...',bass:'0.......0.......2.......1.......'},
ow:{bpm:104,root:55,w:'square',hat:0,v:.035,lead:'02324232023253201343543413436431',bass:'0...3...0...3...1...4...1...4...'},
b1:{bpm:150,root:52,w:'square',hat:1,v:.045,lead:'5.53.5.65.3.2.3.5.53.5.76.5.3.2.',bass:'0.0.0.0.3.3.3.3.0.0.0.0.2.2.3.3.'},
b2:{bpm:168,root:47,w:'sawtooth',hat:1,v:.035,lead:'7.67.5.37.67.5.67.67.9.87.5.3.2.',bass:'0.0.0.0.0.0.0.0.2.2.2.2.3.3.3.3.'},
bj:{bpm:170,root:45,w:'sawtooth',hat:1,v:.035,lead:'7.7.7.5.7.7.9.8.7.7.7.5.3.5.2.0.',bass:'0.0.0.0.0.0.0.0.2.2.2.2.1.1.1.1.'},
bw:{bpm:120,root:50,w:'triangle',hat:0,v:.08,lead:'4.5.7.9.7.5.4.2.4.5.7.9.8.7.5.4.',bass:'0...0...3...3...2...2...4...4...'},
b4:{bpm:140,root:43,w:'square',hat:1,v:.04,lead:'3.3.5.3.6.5.3.2.3.3.5.3.7.6.5.3.',bass:'0.0.0.0.2.2.2.2.0.0.0.0.3.3.3.3.'},
b5:{bpm:158,root:40,w:'sawtooth',hat:1,v:.035,lead:'6.7.6.5.3.5.6.3.6.7.9.7.6.5.3.2.',bass:'0.0.3.3.0.0.3.3.2.2.4.4.2.2.1.1.'},
vil:{bpm:84,root:53,w:'triangle',hat:0,v:.07,lead:'0.2.3.2.0.2.4.3.5.4.3.2.0.2.3...',bass:'0...3...5...3...0...3...2...1...'},
room:{bpm:70,root:50,w:'sine',hat:0,v:.1,lead:'4...2...3...0...4...5...3.2.0...',bass:'0.......3.......0.......2.......'},
shop:{bpm:124,root:53,w:'triangle',hat:0,v:.06,lead:'4.2.0.2.4.4.4...2.2.2...4.7.7...',bass:'0...3...0...3...0...3...2...2...'},
e0:{bpm:150,root:52,w:'square',hat:1,v:.045,lead:'5.3.5.6.7.6.5.3.5.3.5.6.8.7.6.5.',bass:'0.3.0.3.0.3.0.3.2.4.2.4.2.4.2.4.'},
e1:{bpm:172,root:47,w:'sawtooth',hat:1,v:.035,lead:'7.7.9.7.5.7.9.8.7.7.9.7.5.3.5.7.',bass:'0.0.0.0.2.2.2.2.3.3.3.3.2.2.2.2.'},
e2:{bpm:92,root:55,w:'triangle',hat:0,v:.08,lead:'3...5...6...5...3...2...0...2...',bass:'0.......1.......2.......0.......'},
e3:{bpm:128,root:50,w:'sine',hat:1,v:.1,lead:'4.5.7.5.4.2.4...5.7.9.7.5.4.2...',bass:'0...3...0...3...2...4...2...4...'},
e4:{bpm:148,root:40,w:'sawtooth',hat:1,v:.04,lead:'3.3.5.3.6.5.3...3.3.5.3.7.6.5...',bass:'0.0.0.0.0.0.3.3.2.2.2.2.3.3.3.3.'},
b3:{bpm:132,root:50,w:'square',hat:1,v:.04,lead:'3.5.6.5.3.5.7.5.6.5.3.2.0.2.3...',bass:'0.0.0...3.3.3...2.2.2...0.0.0...'}};
function setTrack(n){if(trk===n)return;trk=n;step=0;if(ac)nextT=ac.currentTime+.08}
function tick(){
  if(!ac||!trk)return;
  if(nextT<ac.currentTime-.5)nextT=ac.currentTime+.05;
  while(nextT<ac.currentTime+.15){
    const T=TR[trk],s=step%32,d=60/T.bpm/2,l=T.lead[s],b=T.bass[s];
    if(l!='.')osc(mtof(T.root+12+SC[+l]),nextT,d*1.7,T.w,T.v,mg);
    if(b!='.')osc(mtof(T.root-12+SC[+b]),nextT,d*1.9,'triangle',.11,mg);
    if(T.hat&&s%2==1)osc(6000+Math.random()*3000,nextT,.03,'square',.012,mg);
    step++;nextT+=d}
}
/* ---------- input ---------- */
const held={};
const map={ArrowLeft:'L',ArrowRight:'R',ArrowUp:'U',ArrowDown:'D',KeyZ:'Z',Enter:'Z',Space:'Z',KeyX:'X',ShiftLeft:'X',ShiftRight:'X',Backspace:'X'};
const WA={KeyW:'U',KeyA:'L',KeyS:'D',KeyD:'R'};let ctl=0;try{ctl=+localStorage.getItem('mossroad-ctl')||0}catch(e){}
function KO(c){if(c.startsWith('Arrow'))return ctl==1?undefined:map[c];if(WA[c])return ctl==0?undefined:WA[c];return map[c]}
function down(k){if(!held[k]){held[k]=1;press(k)}}
function up(k){held[k]=0}
addEventListener('keydown',e=>{if(mode=='name'){if(e.code=='Enter'){if(nm){mode='nameok';cs=1}e.preventDefault();return}if(e.code=='Backspace'){nm=nm.slice(0,-1);e.preventDefault();return}if(/^[a-z0-9]$/i.test(e.key)){if(nm.length<8)nm+=e.key.toUpperCase();beep(500);e.preventDefault();return}}const k=KO(e.code);if(k){e.preventDefault();down(k)}});
addEventListener('keyup',e=>{const k=map[e.code]||WA[e.code];if(k)up(k)});
document.querySelectorAll('#pad button').forEach(b=>{const k=b.dataset.k;b.addEventListener('pointerdown',e=>{e.preventDefault();down(k)});['pointerup','pointerleave','pointercancel'].forEach(ev=>b.addEventListener(ev,()=>up(k)))});
/* ---------- data ---------- */
const WIDE={x:32,y:250,w:576,h:140},WW=4200,EX=[1500,2100,2650,3200,3700],EY=[290,330,260,320,290],SX=[200,1150,2350,3450];
const EN=[
{id:0,n:'Mossbit',hp:30,tr:'b1',dmg:3,pats:[0,1,0,2],bub:["Squish!","*moss noises*","Plip plop!","Leaf... mine..."],fl:["* Mossbit is here, glistening.","* Smells like rain.","* Mossbit's leaf twitches."],
 chk:"MOSSBIT - ATK 2 DEF 0\n* Damp. Very proud of its leaf.",acts:[['Compliment',50,"* You praise Mossbit's leaf.\n* It glows with moss-pride."],['Hum',50,"* You hum a gentle tune.\n* Mossbit sways along."],['Flex',-40,"* You flex. Mossbit is unimpressed."]]},
{id:1,n:'Cinderpuff',hp:36,tr:'b2',dmg:4,pats:[1,3,0,1],bub:["Pfft!","Hot hot hot!","Crackle~","*sparks*"],fl:["* Cinderpuff smolders.","* It smells like toast.","* Embers drift around Cinderpuff."],
 chk:"CINDERPUFF - ATK 4 DEF 1\n* A tiny cloud that learned to burn.",acts:[['Hum',50,"* You hum softly.\n* Cinderpuff's embers calm down."],['Dance',50,"* You dance a little jig.\n* It crackles happily."],['Fan',-40,"* You fan the flames.\n* It flares up angrily!"]]},
{id:2,n:'Gloomoth',hp:44,tr:'b3',dmg:4,pats:[2,3,1,3],bub:["...so bright...","Flutter.","Dark is nice.","Go away?"],fl:["* Gloomoth hides from the light.","* Dust falls from its wings.","* Gloomoth stares at nothing."],
 chk:"GLOOMOTH - ATK 4 DEF 2\n* Hates bright lights, loves quiet.",acts:[['Whisper',40,"* You whisper kindly.\n* Gloomoth flutters closer."],['Dim Light',60,"* You cover the lamps.\n* Gloomoth relaxes."],['Pester',-50,"* You wave your arms.\n* Gloomoth recoils."]]}];
const BO=[
{id:6,boss:1,n:'The Hollow Judge',hp:70,tr:'bj',dmg:5,spd:.7,dodge:3,pats:[0,3,2,4,1,3],bub:["...","Your hands are not clean.","Again.","Guilty."],fl:["* The air is heavy.","* The Judge watches. It never blinks.","* A scale tips in the dark."],chk:"THE HOLLOW JUDGE - ATK 5 DEF ?\n* It weighs every deed. Yours are heavy.",acts:[['Plead',0,"* You plead.\n* 'Words are cheap.'"],['Remember',0,"* You remember the faces on the road.\n* The Judge lowers its head."],['Stand',0,"* You stand firm.\n* The scale trembles."]]},
{id:7,boss:1,n:'Warden Oakheart',hp:60,tr:'bw',dmg:4,spd:.85,pats:[0,1,4,3,2],bub:["Child of the road...","Be gentle.","I only guard the door.","Hm. Kind hands."],fl:["* Oakheart waits, lantern raised.","* Warm light floods the room.","* Leaves rustle in his beard."],chk:"WARDEN OAKHEART - ATK 4 DEF 3\n* Keeper of the door. He wants peace.",acts:[['Talk',35,"* You talk about the road.\n* Oakheart listens."],['Hum',35,"* You hum the road's tune.\n* The lantern glows warmer."],['Hug',40,"* You hug his big wooden leg.\n* His eyes well up."]]}];
EN.push(
{id:3,n:'Pebblo',hp:40,tr:'b4',dmg:4,pats:[0,2,3,1],bub:["Rumble.","Stone words.","*thud*","Heavy day."],fl:["* Pebblo sits very still. Suspiciously still.","* Pebblo is pretending to be a rock.","* Dust sifts off Pebblo."],chk:"PEBBLO - ATK 4 DEF 5\n* A rock that learned to worry.",acts:[['Polish',50,"* You polish Pebblo.\n* It shines with pride."],['Hum',50,"* You hum a low note.\n* Pebblo hums back, trembling."],['Skip',-40,"* You try to skip Pebblo across the road.\n* Not appreciated."]]},
{id:4,n:'Thornling',hp:48,tr:'b5',dmg:5,pats:[4,3,1,2,0],bub:["Prickle!","Don't touch!","Thorns up!","Water...?"],fl:["* Thornling bristles.","* A tiny flower hides in its thorns.","* Thornling rustles angrily."],chk:"THORNLING - ATK 5 DEF 2\n* Prickly outside. Thirsty inside.",acts:[['Water',60,"* You pour water on Thornling.\n* Its thorns relax."],['Sing',40,"* You sing to the bush.\n* A bud opens."],['Prune',-50,"* You reach for the thorns.\n* It lashes out!"]]});
[["* Mossbit rolls aside, leaving a glowing leaf on the road.","* Mossbit's leaf lies still on the stones.|* The moss around it turns grey."],
["* Cinderpuff drifts upward, a happy cloud of sparks.","* Only a smear of soot remains.|* The nearest torch flickers."],
["* Gloomoth folds its wings around the dark and sighs, content.","* A single wing scale drifts down in the silence."],
["* Pebblo hums a low stone note. The ground hums back.","* Pebblo cracks in two.|* The halves don't move again."],
["* Thornling blooms. Tiny white flowers cover its thorns.","* The thorns wither.|* Nothing grows here now."]].forEach((a,i)=>{EN[i].sp=a[0];EN[i].kl=a[1]});
EN.push({id:5,n:'Mimsy',hp:28,tr:'b1',dmg:3,pats:[0,1,0,3],bub:["Eep! Intruder!","This is MY room...","*floats angrily*","...you're staying?"],fl:["* Mimsy hovers by the bookshelf.","* Her flame flickers nervously.","* Mimsy pretends she is furniture."],chk:"MIMSY - ATK 3 DEF 1\n* The house ghost. No guests in 90 years.",acts:[['Offer Tea',50,"* You mime pouring tea.\n* Mimsy's flame warms to gold."],['Read Poem',50,"* You recite a little poem.\n* Mimsy sniffles happily."],['Boo Back',-40,"* You yell BOO.\n* Mimsy cries a wax tear."]],sp:"* Mimsy bobs happily. 'Y-you can have the house!'|* She leaves a warm candle on the table.",kl:"* The flame goes out.|* The room feels much colder."});
EN.splice(0,5,
{id:0,n:'Pip Pennywhistle',hp:34,tr:'e0',dmg:3,sys:'blue',pats:[0],hint:"* Your soul turns BLUE!|* LEFT/RIGHT to move, UP to jump over bars.",bub:["Ta-daaa!","Catch!","Whoops! My bad!","Clap for me?"],fl:["* Pip juggles three bells. One is his hat.","* Confetti falls. Nobody asked for it.","* Pip bows. His hat bows later."],chk:"PIP PENNYWHISTLE - ATK 3 DEF 0\n* A jester who forgot his audience.\n* Gravity is his favorite trick.",acts:[['Applaud',50,"* You clap. Pip bursts into confetti-tears."],['Juggle',50,"* You juggle Pip's bells. He gasps with joy."],['Heckle',-40,"* You boo. Pip's grin cracks."]],sp:"* Pip bows so deep his hat rolls away.|* 'An audience! At last!'",kl:"* The bells stop ringing.|* Confetti drifts down on nobody."},
{id:1,n:'Captain Brine',hp:42,tr:'e1',dmg:4,sys:'shield',pats:[0],hint:"* Your soul turns GREEN!|* Arrow keys turn your shield. Block every spear!",bub:["ARRR!","SPEARS AWAY!","Ye can't hide!","Hold the line!"],fl:["* Captain Brine clacks both claws.","* 'SOMETHING FISHY HERE!'","* The Captain's hat points at you."],chk:"CAPTAIN BRINE - ATK 4 DEF 2\n* A crab who captains a ship that sank.\n* Respects anyone who blocks.",acts:[['Salute',50,"* You salute smartly.\n* Brine sniffs back a tear."],['Offer Snack',50,"* You offer a snack.\n* 'Fer me? Ye shouldn't have!'"],['Mock',-40,"* You wave your claws like him.\n* He is NOT amused."]],sp:"* Brine salutes you with both claws.|* 'Ye've the heart of a true sailor.'",kl:"* The Captain's hat floats away on a tide that isn't there."},
{id:2,n:'Dr. Hush',hp:48,tr:'e2',dmg:4,sys:'lines',pats:[0],hint:"* BLUE lines: stay completely still.|* ORANGE lines: keep moving!",bub:["Shhhh.","Quiet, please.","Overdue.","...hm."],fl:["* Dr. Hush whispers: shhhh.","* A page turns by itself.","* Dr. Hush adjusts his glasses. Slowly."],chk:"DR. HUSH - ATK 4 DEF 3\n* Librarian of the Hollow.\n* Detests noise and late books.",acts:[['Whisper',50,"* You whisper. Hush nods approvingly."],['Return Book',60,"* You hand back an overdue book.\n* A tear of joy."],['Shout',-50,"* You shout. Every book falls over."]],sp:"* Hush tucks a bookmark in your pocket.|* 'Visit anytime. Quietly.'",kl:"* A single page flutters down.|* It is blank."},
{id:3,n:'Vesper the Weaver',hp:54,tr:'e3',dmg:4,sys:'strings',pats:[0],hint:"* Your soul turns PURPLE!|* UP/DOWN to hop between the three strings.",bub:["Tea, darling?","Mind the threads~","Ohohoho.","Sit. Stay."],fl:["* Vesper pours tea with six hands.","* The strings hum beneath your feet.","* Vesper's eyes blink out of order."],chk:"VESPER THE WEAVER - ATK 4 DEF 2\n* Hosts the Hollow's only tea parties.\n* Nobody leaves hungry.",acts:[['Sip Tea',50,"* You sip. Vesper blushes six times."],['Praise Web',50,"* You admire the web.\n* Vesper preens."],['Spill Tea',-50,"* You spill the tea.\n* A hush falls over eight legs."]],sp:"* Vesper weaves you a tiny scarf.|* 'For the road, darling.'",kl:"* The tea goes cold.|* The web sags, unused."},
{id:4,n:'Kiln',hp:62,tr:'e4',dmg:5,sys:'box',pats:[0,1,3,4],hint:"* The battle box is MOVING!|* Stay inside it, and dodge!",bub:["HMMMMM.","HOT. HOT.","*clang*","Work. Work."],fl:["* Kiln hums, hot to the touch.","* The air shakes around Kiln.","* A puff of smoke leaves the chimney."],chk:"KILN - ATK 5 DEF 5\n* A furnace that learned to walk.\n* Lonely, and very warm.",acts:[['Cool Down',60,"* You fan Kiln with a cloth.\n* Its glow softens."],['Polish',40,"* You polish Kiln's iron.\n* It hums contentedly."],['Kick',-50,"* You kick Kiln.\n* Your foot is on fire."]],sp:"* Kiln lets out a long, warm sigh.|* Its glow becomes a night-light.",kl:"* Kiln cools into a lump of iron.|* The road gets colder."});
BO[0].sysList=['red','lines','blue','shield','box'];BO[1].sysList=['red','shield','red','lines'];
const AC=['#8cff8a','#ff9a4a','#c58cff','#b0b0ff','#ff7aa8','#8ad8ff'],HP_P=[40,65,100],IT_N=['Cinnamon Roll','Honey Tea','Moss Pie'];
const SKIN=['#f0c090','#c68642','#8d5524','#ffdbac'],SHIRT=[['#4aa0e0','#e07090'],['#e8c040','#4a8a50'],['#9a5ad8','#e8e8e8'],['#d84a4a','#202020']],HAIR=['#5a3a22','#1a1a1a','#d8b040','#c0503a'],SCARF=['#d03a3a','#3aa0d0','#4ac060','#e0e0e0'];
const NC=[...'ABCDEFGHIJKLMNOPQRSTUVWXYZ','BACK','DEL','DONE'];
const CP=["Above the world there was a sky full of lamps.","Every lamp was lit by a spark. Every spark was a kindness.","Then, one night, the kindness ran thin. The lamps went out, one by one.","The sparks fell through the cracks of the world, down into the HOLLOW.","Down here, villagers and monsters built a quiet home, waiting for someone to carry a spark back up the road.","You woke in the old lamplighter's house with a spark in your chest. Warm. Flickering. A little judgmental.","The door to the sky lies at the end of MOSS ROAD, guarded by a Warden who has waited a very long time.","Kindness feeds the spark. Cruelty makes it heavy. Everyone you meet will remember which you chose."];
const SH=[['Cinnamon Roll','Heals 40%',25,'h0'],['Honey Tea','Heals 65%',45,'h1'],['Moss Pie','Heals 100%',90,'h2'],['Iron Heart','+4 max HP (x3)',140,'uh'],['Sharp Quill','+2 attack (x3)',110,'ua'],['Soft Boots','-1 dmg taken (x2)',180,'ud']];
const SM=["Not enough coin, pal!","Pleasure doin' business!","You got plenty of that already!"];
const FRL=[["* SPORELLA: Glow-glow! My favorite traveler! Watch for the night bats, they steal my caps.","* SPORELLA: ...oh. It's you. (her glow dims)"],["* FENNICK: Friend, a lantern's advice: the Warden is lonelier than he looks.","* FENNICK: The road is dark enough without your attitude."],["* WREN: You came back! Don't tell the others, but you're my favorite living person.","* WREN: ...I'll just float over here, then."],["* BRAMBLE: Friends get a discount. On advice only. Hah.","* BRAMBLE: The door's that way. Nothing more to say."],["* MARLOW: Ah, my favourite young one! Slow and steady is how towns are built.","* MARLOW: Hmph. Slow, steady, and unimpressed."],["* PIPKIN: Friend! Wanna see my rock collection? It's mostly one rock.","* PIPKIN: ...I'll dig somewhere else."],["* SABLE: The cards say you'll always be welcome at my table, dear.","* SABLE: The cards turned away from you, darling."]];
function meet(p){flags.fr=flags.fr||{};const st=flags.fr[p.n];if(!st)say(talk(p),()=>{mode='choice';cp=p;cs=0},true);else say(FRL[p.k][st-1],null,true)}
function itemList(){const a=[];if(rolls>0)a.push([0,'Cinnamon Roll x'+rolls]);if(bag[0]>0)a.push([1,'Honey Tea x'+bag[0]]);if(bag[1]>0)a.push([2,'Moss Pie x'+bag[1]]);return a}
function buy(){const it=SH[shi];if(gold<it[2]){shmsg=0;beep(120,.2,.06);return}
  if(it[3][0]=='u'){const key=it[3][1],cap={h:3,a:3,d:2}[key];if(upg[key]>=cap){shmsg=2;return}upg[key]++;if(key=='h'){mhp+=4;hp=mhp}}
  else{const j=+it[3][1];if(j==0)rolls++;else bag[j-1]++}
  gold-=it[2];shmsg=1;beep(880,.2,.05,'triangle');sv()}
function cineSet(i){cpg=i;txt=wrap(CP[i],540);ci=0}
function startRoom(){def=[0,0,0,0,0,0];flags={};gold=0;bag=[0,0];upg={h:0,a:0,d:0};mhp=20;hp=20;rolls=3;ar=0;px=320;py=330;inB=false;cool=1;sv();mode='ow';setTrack('room');say("* You wake in a small, dusty room.|* A warm spark flickers in your chest.|* Maybe check the wardrobe. Then find a way out.",null,true)}
const PRO="* Long ago, the surface and the Hollow were one world.|* Then the sky closed. The road beneath it grew moss, and quiet.|* You fell here. Your name doesn't matter anymore.|* The only way up is the door at the end of MOSS ROAD.|* The creatures here are frightened. So are you.|* Whatever you do, the road will remember.";
const CH=[[0,0,"I. THE LAMPLIGHTER'S HOUSE"],[1,60,'II. HOLLOW HAMLET'],[1,1150,'III. MOSS ROAD'],[1,2500,'IV. THE QUIET WALL'],[1,3900,'V. THE DOOR']];
const NP=[{n:'Sporella',x:340,y:345,c:'#c4437a',k:0},{n:'Marlow',x:500,y:292,c:'#c8a060',k:4},{n:'Pipkin',x:820,y:345,c:'#7a6a80',k:5},{n:'Sable',x:960,y:278,c:'#7a4ab0',k:6},{n:'Fennick',x:1250,y:255,c:'#d98a3a',k:1},{n:'Wren',x:2250,y:345,c:'#a8d8f0',k:2},{n:'Bramble',x:4000,y:262,c:'#6a8a4a',k:3}];
const sc=()=>def.filter(d=>d==1).length,kc=()=>def.filter(d=>d==2).length;
function talk(p){
  const k=kc();
  if(p.k==0){if(!flags.roll){flags.roll=1;rolls++;return "* SPORELLA: Oh! A traveler! Glow-glow!|* Pip Pennywhistle is all bells, no bite.|* Here, a Cinnamon Roll. I bake them under my cap.|* (You got a Cinnamon Roll!)"}
    return k?"* SPORELLA: ...your shoes smell like ash. Please, be gentle ahead.":"* SPORELLA: Be kind and the road is kind back! Glow-glow!"}
  if(p.k==1)return "* FENNICK: Lantern-keeper. I light the road so nobody trips over their fear.|* Long ago the Warden, Oakheart, swore to guard the door at the end.|* Not to keep you in. To keep the WEIGHT out.|"+(k?"* ...I smell ash on you. The Weight will notice. It always does.":"* You carry no ghosts. Good. Keep it that way.");
  if(p.k==2){const dead=EN.filter((e,i)=>def[i]==2).map(e=>e.n),sp=EN.filter((e,i)=>def[i]==1).map(e=>e.n);
    return "* WREN: Boo! ...sorry. I'm a ghost. A nice one.|* None of us can leave the road without the Warden's blessing.|"+(dead.length?"* I felt it when "+dead.join(' and ')+" went quiet. Was it necessary?":"* Everyone you met is still here. That means a lot to us.")+(sp.length?"|* "+sp.join(', ')+" said you were kind.":"")}
  if(p.k==4)return "* MARLOW: Welcome to Hollow Hamlet, young one. I am Mayor Marlow. Population: twelve, and one snail.|* We were all sparks once, before we fell. Some of us simply took the scenic route.|* The shop belongs to Mr. Snoot. A crook, but his pie is honest.";
  if(p.k==5)return "* PIPKIN: Hi! I'm Pipkin! I once dug a hole to the surface! It was a very small hole.|* Mr. Snoot says gold comes from fighting. I just wanna dig.|* ...Are you the Sparkborn everyone whispers about?";
  if(p.k==6)return "* MADAME SABLE: Ahh, child of the falling spark. Sit. The cards have waited.|* I see a door. I see a king with a lantern. I see a scale, tipping.|* What you do with your hands weighs more than what you say with your mouth.";
  return "* BRAMBLE: Last stop, traveler. The door answers to the road's mood.|* Spared everyone, and the Warden waits with an open hand.|* Left ghosts behind, and the Judge comes to collect.|"+(!flags.b?(flags.b=1,rolls+=2,"* Take these Cinnamon Rolls. You'll need them.|* (You got 2 Cinnamon Rolls!)"):"* Good luck. Who you are at the door is who you've been.")
}
/* ---------- state ---------- */
let mode='title',inB=false,mi=0,si=0,oi=0,SL=[],slot=0,def=[0,0,0,0,0,0],cl=0,hp=20,mhp=20,E=EN[0],bi=0,ehp=30,emax=30,mercy=0,rolls=3,turn=0,menu=0,sub=0,subList=[],kind='',
pages=[],txt='',ci=0,after=null,dlgOW=false,shake=0,inv=0,t=0,ot=0,hx=320,hy=315,bullets=[],box={...WIDE},tgt={...WIDE},
bar=0,bubble='',spawn=0,gone=0,vanish=false,pat=0,fr=null,now=0,last=0,px=80,py=300,face=1,wt=0,cool=0,endMsg=['',''],fin=0,dust=[],fd='d',flags={},ban={t:0,s:''},ar=0,gold=0,bag=[0,0],upg={h:0,a:0,d:0},ap={sk:0,sh:0,hr:0,sc:0},pname='',nm='',ni=0,lk=0,lookRet=false,cpg=0,shi=0,shmsg=-1,cs=0,cp=null,itL=[],sysNow='red',sd=0,ln=1,vy=0,og=false;
/* ---------- saves ---------- */
const SK='mossroad-v1-';
function ld(i){try{return JSON.parse(localStorage.getItem(SK+i))}catch(e){return null}}
function sv(){try{localStorage.setItem(SK+slot,JSON.stringify({d:def,hp,x:px,y:py,c:cl,f:flags,n:pname,a:ap,g:gold,b:bag,u:upg,r:ar,ro:rolls}))}catch(e){}}
function startGame(i,full){const old=ld(i),d=old||{};slot=i;
  def=d.d||[0,0,0,0,0,0];while(def.length<6)def.push(0);cl=d.c||0;flags=d.f||{};pname=d.n||'';ap=d.a||{sk:0,sh:0,hr:0,sc:0};gold=d.g||0;bag=d.b||[0,0];upg=d.u||{h:0,a:0,d:0};ar=d.r===undefined?0:d.r;rolls=d.ro===undefined?3:d.ro;
  mhp=20+upg.h*4;hp=(full||!old)?mhp:Math.min(mhp,d.hp);px=d.x||320;py=d.y||330;inB=false;cool=1;
  if(!old&&!full){mode='name';nm='';ni=0;return}
  mode='ow';setTrack('ow')}
/* ---------- text ---------- */
function wrap(s,w){g.font=F(14);return s.split('\n').map(p=>{let o=[],l='';p.split(' ').forEach(wd=>{const n=l?l+' '+wd:wd;if(g.measureText(n).width>w&&l){o.push(l);l='  '+wd}else l=n});o.push(l);return o.join('\n')}).join('\n')}
function nextPage(){txt=wrap(pages.shift(),510);ci=0}
function say(s,cb,ow){pages=s.split('|');after=cb||(()=>{mode='ow'});dlgOW=!!ow;nextPage();mode='say'}
function toMenu(){mode='menu';pages=[];tgt={...WIDE};txt=wrap(mercy>=100?"* "+E.n+" looks calm. You can SPARE it.":E.fl[Math.floor(Math.random()*E.fl.length)],520);ci=0}
function startBattle(i){bi=i;E=i<6?EN[i]:BO[i-6];ehp=emax=Math.round(E.hp*1.2);mercy=0;turn=0;menu=0;gone=0;vanish=false;bullets=[];inv=0;box={...WIDE};tgt={...WIDE};inB=true;fin=0;setTrack(E.tr);say((E.boss?"* "+E.n+" stands before you.":"* "+E.n+" blocks the way!")+(E.hint?"|"+E.hint:""),toMenu)}
function startDodge(){mode='dodge';sysNow=E.sysList?E.sysList[turn%E.sysList.length]:(E.sys||'red');
  const S={shield:{x:245,y:240,w:150,h:150},blue:{x:170,y:270,w:300,h:115},lines:{x:235,y:240,w:170,h:150},strings:{x:170,y:265,w:300,h:120},box:{x:245,y:236,w:150,h:150}};
  tgt={...(S[sysNow]||{x:245,y:240,w:150,h:150})};hx=tgt.x+tgt.w/2;hy=tgt.y+tgt.h/2;bullets=[];t=0;spawn=.6;ln=1;sd=0;vy=0;pat=E.pats[turn%E.pats.length];bubble=E.bub[turn%E.bub.length];turn++}
function backOW(){inB=false;vanish=false;mode='ow';setTrack('ow');sv()}
function win(killed){
  if(bi>=6){vanish=true;say(bi==6?"YOU WON!|The Hollow Judge crumbles into dust.|* ...the scale finally stops moving.":killed?"YOU WON!|The Warden falls without a word.|* The lantern flickers out.":"* Oakheart lowers his lantern.|* 'Thank you for your mercy, little one.'|* The door opens to morning light.",()=>endGame(killed));return}
  def[bi]=killed?2:1;const gd=killed?Math.round(E.hp*.9):5;gold+=gd;vanish=true;say(killed?"YOU WON!|You earned "+gd+" gold.|...but it didn't feel good.|"+E.kl:"YOU WON!|You spared "+E.n+".|You earned "+gd+" gold.\nYou feel warm inside.|"+E.sp,backOW)}
function finale(){const k=def.filter(d=>d==2).length;fin=k?1:2;setTrack(null);
  say(k?"* The road falls silent.|* Every torch along the wall goes out.|* Something old turns to look at you.|* 'So. You came all this way.'":"* The moss on the door parts like a curtain.|* Warm lantern light spills out.|* 'Welcome, little one. I have waited a long time.'",()=>startBattle(k?6:7),true)}
function endGame(kb){const s=def.filter(d=>d==1).length,k=def.filter(d=>d==2).length;
  const epi=bi==6?'You climb into a sky that feels too wide.':kb?'You step into the sun. The road remembers.':s==6?'Everyone waves from the road as you step into the sun.':'You step into the sun. Some friends wave. Some cannot.';
  endMsg=[bi==6?'The Judge is gone. The weight stays with you.':kb?'The king is gone. The door stays silent.':'Oakheart smiles. The road is at peace.','Spared '+s+'   Killed '+k,epi];
  cl++;def=[0,0,0,0,0,0];flags={};mhp=20;hp=mhp;px=320;py=330;ar=0;gold=0;bag=[0,0];upg={h:0,a:0,d:0};rolls=3;fin=0;inB=false;sv();mode='end';ot=0;setTrack('title')}
function resolve(pos){const acc=Math.max(0,1-Math.abs(pos-.5)*2.6);fr={dmg:pos>1||(E.dodge&&turn<E.dodge)?0:Math.round(4+acc*14)+upg.a*2,t:0,done:false};mode='slash'}
function choose(i){
  if(i==0){mode='fight';bar=0}
  else if(i==1){mode='sub';kind='act';sub=0;subList=['Check',...E.acts.map(a=>a[0])]}
  else if(i==2){itL=itemList();if(!itL.length)say("* Your pockets are empty.",toMenu);else{mode='sub';kind='item';sub=0;subList=itL.map(x=>x[1])}}
  else{mode='sub';kind='mercy';sub=0;subList=['Spare','Flee']}
}
function select(){
  if(kind=='act'){
    if(sub==0)return say(E.chk,startDodge);
    const a=E.acts[sub-1];mercy=Math.max(0,mercy+a[1]);
    say(a[2]+(mercy>=100&&a[1]>0?"\n* "+E.n+" seems ready to part ways.":""),startDodge)
  }else if(kind=='item'){
    const it=itL[sub][0];if(it==0)rolls--;else bag[it-1]--;const hv=Math.round(mhp*HP_P[it]/100);hp=Math.min(mhp,hp+hv);beep(660,.2,.05,'triangle');say("* You used the "+IT_N[it]+".\n* You recovered "+hv+" HP!"+(hp==mhp?" HP maxed out!":""),startDodge)
  }else if(sub==0){if(mercy>=100)win(false);else say("* You spare "+E.n+".\n* It doesn't feel ready yet.",startDodge)}
  else if(E.boss)say("* There is no escape from this one.",startDodge);else if(Math.random()<.5)say("* You ran away...",()=>{px=Math.max(30,px-110);cool=2;backOW()});
  else say("* Couldn't escape!",startDodge)
}
function nav(k,n,v){return k=='U'?(v+n-1)%n:k=='D'?(v+1)%n:v}
function press(k){
  A();
  if(mode=='name'){let n=ni;
    if(k=='L')n=(n+28)%29;else if(k=='R')n=(n+1)%29;
    else if(k=='U')n=n>=26?19+(n-26)*2:(n>=7?n-7:n);
    else if(k=='D')n=n>=26?n:(n+7<=25?n+7:26+Math.min(2,(n%7)>>1));
    if(n!=ni){ni=n;beep(300)}
    if(k=='X')nm=nm.slice(0,-1);
    if(k=='Z'){const c=NC[ni];beep(500);if(c=='BACK')mode='slots';else if(c=='DEL')nm=nm.slice(0,-1);else if(c=='DONE'){if(nm){mode='nameok';cs=1}}else if(nm.length<8)nm+=c}
    return}
  if(mode=='nameok'){if(k=='L'||k=='R'){cs=1-cs;beep(300)}else if(k=='Z'){beep(500);if(cs){mode='look';lk=0;lookRet=false}else mode='name'}else if(k=='X')mode='name';return}
  if(mode=='look'){
    if(k=='U')lk=(lk+4)%5;else if(k=='D')lk=(lk+1)%5;
    else if((k=='L'||k=='R')&&lk<4){const K=['sk','sh','hr','sc'][lk];ap[K]=(ap[K]+(k=='R'?1:3))%4;beep(400)}
    else if(k=='Z'&&lk==4){beep(600);if(lookRet){mode='ow';sv()}else{pname=nm;mode='cine';cineSet(0);setTrack('title')}}
    return}
  if(mode=='cine'){if(k=='Z'||k=='X'){if(ci<txt.length)ci=txt.length;else if(cpg<CP.length-1)cineSet(cpg+1);else startRoom()}return}
  if(mode=='choice'){if(k!='Z'){cs=1-cs;beep(300)}else{flags.fr[cp.n]=cs?2:1;if(!cs)gold+=10;say(cs?"* "+cp.n+" shrugs. 'Fine. Suit yourself.'":"* You and "+cp.n+" are now friends!\n* (They slip you 10 gold.)",null,true);sv()}return}
  if(mode=='shop'){
    if(k=='U'){shi=(shi+5)%6;beep(300)}else if(k=='D'){shi=(shi+1)%6;beep(300)}else if(k=='Z')buy();else if(k=='X')mode='ow';return}
  if(mode=='title'){setTrack('title');const m=nav(k,3,mi);if(m!=mi){mi=m;beep(300)}
    if(k=='Z'){beep(500);if(mi==0){mode='slots';si=0;SL=[0,1,2].map(ld)}else if(mi==1){mode='opt';oi=0}else mode='cred'}return}
  if(mode=='slots'){const s=nav(k,3,si);if(s!=si){si=s;beep(300)}if(k=='Z'){beep(500);startGame(si)}if(k=='X')mode='title';return}
  if(mode=='opt'){const o=nav(k,4,oi);if(o!=oi){oi=o;beep(300)}
    if(k=='Z'){beep(500);if(oi==0){musOn=!musOn;if(mg)mg.gain.value=musOn?.5:0;try{localStorage.setItem('mossroad-mus',musOn?'1':'0')}catch(e){}}else if(oi==1){ctl=(ctl+1)%3;try{localStorage.setItem('mossroad-ctl',ctl)}catch(e){}}else if(oi==2)mode='how';else mode='title'}
    if(k=='X')mode='title';return}
  if(mode=='how'){if(k=='Z'||k=='X')mode='opt';return}
  if(mode=='cred'){if(k=='Z'||k=='X')mode='title';return}
  if(mode=='over'){if(ot>1)startGame(slot,true);return}
  if(mode=='end'){if(ot>1){mode='title';setTrack('title')}return}
  if(mode=='ow'){
    if(k!='Z')return;
    if(ar==0){
      if(px<190&&py<300){mode='look';lk=0;lookRet=true;return}
      if(Math.abs(px-500)<60&&Math.abs(py-300)<60){say("* A note under the lamp:|* 'To whoever finds the spark: carry it up Moss Road to the sky door.|* Don't let the road make you heavy. -L.'",null,true);return}
      return}
    if(Math.abs(px-630)<60&&py<255){mode='shop';shi=0;shmsg=-1;return}
    for(const p of NP)if(Math.abs(px-p.x)<46&&Math.abs(py-p.y)<50){meet(p);sv();return}
    if(Math.abs(px-430)<50&&Math.abs(py-300)<70){say("* MOSS ROAD\n* Lonely creatures ahead.\n* Maybe they are not hostile.",null,true);return}
    for(const x of SX)if(Math.abs(px-x)<50&&Math.abs(py-300)<70){hp=mhp;sv();beep(880,.3,.05,'triangle');say("* The star's warmth fills you.\n* HP fully restored.\n* (File saved.)",null,true);return}
    return}
  if(mode=='say'){
    if(k=='Z'||k=='X'){if(ci<txt.length)ci=txt.length;else if(pages.length)nextPage();else if(k=='Z'&&after)after()}
    return}
  if(mode=='menu'){
    if(k=='L'){menu=(menu+3)%4;beep(300)}else if(k=='R'){menu=(menu+1)%4;beep(300)}else if(k=='Z'){beep(500);choose(menu)}
    return}
  if(mode=='sub'){
    let s=sub;if(k=='L')s--;else if(k=='R')s++;else if(k=='U')s-=2;else if(k=='D')s+=2;
    if(s>=0&&s<subList.length&&s!=sub){sub=s;beep(300)}
    if(k=='Z'){beep(500);select()}if(k=='X')mode='menu';
    return}
  if(mode=='dodge'&&sysNow=='strings'){if(k=='U')ln=Math.max(0,ln-1);else if(k=='D')ln=Math.min(2,ln+1);return}
  if(mode=='fight'&&k=='Z')resolve(bar);
}
/* ---------- update ---------- */
function update(dt){
  now+=dt*1000;dust.forEach(d=>{d.x+=d.vx*dt;d.y+=d.vy*dt;d.l-=dt});dust=dust.filter(d=>d.l>0);
  for(const k of['x','y','w','h'])box[k]+=(tgt[k]-box[k])*Math.min(1,dt*10);
  if(shake>0)shake=Math.max(0,shake-dt);
  if(vanish&&gone<1)gone=Math.min(1,gone+dt);
  if(mode=='say'||mode=='menu'||mode=='cine'){const p=ci;if(ci<txt.length){ci+=dt*42;if(Math.floor(ci/2)!=Math.floor(p/2)&&txt[Math.floor(ci)]!==' ')beep(180+Math.random()*30,.03,.02)}}
  if(mode=='over'||mode=='end')ot+=dt;
  if(mode=='ow'){
    const dx=(held.R?1:0)-(held.L?1:0),dy=(held.D?1:0)-(held.U?1:0);
    if(dx||dy){const l=Math.hypot(dx,dy);px+=dx/l*115*dt;py+=dy/l*115*dt;wt+=dt;if(dx){face=dx;fd='s'}else fd=dy<0?'u':'d';if(Math.random()<dt*22)dust.push({x:px+(Math.random()-.5)*10,y:py,vx:(Math.random()-.5)*24,vy:-8-Math.random()*14,l:.6})}
    if(ar==0){px=clamp(px,50,595);py=clamp(py,250,420)}else{px=clamp(px,20,WW-20);py=clamp(py,215,410)}setTrack(ar==0?'room':px<1100?'vil':'ow');cool-=dt;ban.t-=dt;CH.forEach((c,i)=>{if(ar==c[0]&&px>=c[1]&&(flags.ch===undefined?-1:flags.ch)<i){flags.ch=i;ban={t:3.5,s:c[2]}}});
        if(ar==0&&mode=='ow'&&px>575){ar=1;px=100;py=330;sv()}
    if(cool<=0)EN.forEach((e,i)=>{if(i<5&&ar==1&&!def[i]&&Math.abs(px-EX[i])<60&&Math.abs(py-EY[i])<75&&mode=='ow'){bi=i;mode='trans';t=0}});
    if(ar==1&&px>WW-70){if(def.slice(0,5).every(d=>d))finale();else{px=WW-120;say("* A door sealed with moss.\n* Someone on the road still needs you.",null,true)}}
  }
  if(mode=='trans'){const p=t;t+=dt;if(p==0)beep(900,.15,.06);if(p<.35&&t>=.35)beep(260,.25,.08,'sawtooth');if(t>.5&&Math.floor(p/.18)!=Math.floor(t/.18))beep(500+t*500,.08,.05);if(t>1.3)startBattle(bi)}
  if(mode=='fight'){bar+=dt*1.05;if(bar>=1.05)resolve(2)}
  if(mode=='slash'){
    fr.t+=dt;
    if(!fr.done&&fr.t>.35){fr.done=true;ehp=Math.max(0,ehp-fr.dmg);if(fr.dmg>0){shake=.6;beep(120,.2,.08,'sawtooth')}}
    if(fr.t>1.5){if(ehp<=0)win(true);else startDodge()}
  }
  if(mode=='dodge'){
    t+=dt;inv-=dt;const sp=135,sy=sysNow,mv=held.L||held.R||held.U||held.D,dm=Math.max(1,E.dmg+1-upg.d);
    if(sy=='box'){tgt.x=245+Math.sin(t*1.3)*140;tgt.y=236+Math.cos(t*1.9)*12}
    if(sy=='shield'){hx=box.x+box.w/2;hy=box.y+box.h/2;if(held.U)sd=0;else if(held.R)sd=1;else if(held.D)sd=2;else if(held.L)sd=3}
    else if(sy=='strings'){hx=box.x+34;hy+=(box.y+box.h/6+ln*box.h/3-hy)*Math.min(1,dt*18)}
    else{if(held.L)hx-=sp*dt;if(held.R)hx+=sp*dt;
      if(sy=='blue'){vy+=620*dt;hy+=vy*dt;const fl=box.y+box.h-9;if(hy>=fl){hy=fl;vy=0;og=true}else og=false;if(held.U&&og)vy=-300;if(!held.U&&vy<-120)vy=-120}
      else{if(held.U)hy-=sp*dt;if(held.D)hy+=sp*dt}}
    hx=clamp(hx,box.x+10,box.x+box.w-10);hy=clamp(hy,box.y+9,box.y+box.h-9);
    spawn-=dt;
    if(t<6.4&&spawn<=0){const b=tgt;
      if(sy=='shield'){bullets.push({sp:1,d:Math.floor(Math.random()*4),r:170,v:150+turn*10+Math.random()*40});spawn=(.62-Math.min(.25,turn*.03))*(E.spd||1)}
      else if(sy=='strings'){const ls=[0,1,2].sort(()=>Math.random()-.5).slice(0,Math.random()<.3?2:1);ls.forEach(l=>bullets.push({x:b.x+b.w+6,y:b.y+b.h/6+l*b.h/3-6,w:12,h:12,vx:-175-turn*8,vy:0,n:1}));spawn=.55}
      else if(sy=='lines'){const c=['b','o','b','o','w'][Math.floor(Math.random()*5)];bullets.push(Math.random()<.5?{x:b.x-8,y:b.y,w:6,h:b.h,vx:125,vy:0,c}:{x:b.x,y:b.y-8,w:b.w,h:6,vx:0,vy:105,c});spawn=.7}
      else if(sy=='blue'){const r=Math.random(),L=Math.random()<.5;if(r<.65)bullets.push({x:L?b.x-14:b.x+b.w+4,y:b.y+b.h-(r<.3?20:44),w:12,h:r<.3?20:44,vx:L?150:-150,vy:0});else bullets.push({x:b.x+10+Math.random()*(b.w-30),y:b.y-20,w:8,h:26,vx:0,vy:170});spawn=.85}
      else{if(pat==0){spawn=.13;bullets.push({x:b.x+6+Math.random()*(b.w-16),y:b.y-12,w:5,h:10,vx:0,vy:155+Math.random()*60})}
      else if(pat==1){spawn=.4;const a=Math.random()*6.283,sx=b.x+b.w/2+Math.cos(a)*130,sy=b.y+b.h/2+Math.sin(a)*130,dx=hx-sx,dy=hy-sy,d=Math.hypot(dx,dy);bullets.push({x:sx-3,y:sy-3,w:6,h:6,vx:dx/d*145,vy:dy/d*145})}
      else if(pat==2){spawn=.95;const gy=b.y+8+Math.random()*(b.h-60);bullets.push({x:b.x-12,y:b.y,w:5,h:gy-b.y,vx:120,vy:0},{x:b.x-12,y:gy+44,w:5,h:b.y+b.h-gy-44,vx:120,vy:0})}
      else if(pat==4){spawn=.9;for(let j=0;j<10;j++){const a=j*.628+turn;bullets.push({x:b.x+b.w/2-3,y:b.y+30,w:5,h:5,vx:Math.cos(a)*105,vy:Math.sin(a)*105})}}else{spawn=.24;const r=Math.random()<.5;bullets.push({x:r?b.x-14:b.x+b.w+4,y:b.y+6+Math.random()*(b.h-16),w:10,h:4,vx:r?150:-150,vy:0})}spawn*=(E.spd||1)*.85;}
    }
    for(const b of bullets){if(b.sp){b.r-=b.v*dt;if(b.r<=24){b.dead=1;if(b.d==sd)beep(760,.06,.05,'triangle');else if(inv<=0){hp-=dm;inv=1;beep(90,.2,.08,'sawtooth')}}}else{b.x+=b.vx*dt;b.y+=b.vy*dt}}
    bullets=bullets.filter(b=>!b.dead&&(b.sp||(b.x<tgt.x+tgt.w+40&&b.y<tgt.y+tgt.h+40&&b.x>tgt.x-40&&b.y>tgt.y-40)));
    if(inv<=0)for(const b of bullets){if(b.sp)continue;const hurt=!b.c||b.c=='w'||(b.c=='b'&&mv)||(b.c=='o'&&!mv);if(hurt&&hx-4<b.x+b.w&&hx+4>b.x&&hy-4<b.y+b.h&&hy+4>b.y){hp-=dm;inv=1;beep(90,.2,.08,'sawtooth');break}}
    if(hp<=0){hp=0;mode='over';ot=0;setTrack(null);return}
    if(t>7){bullets=[];toMenu()}
  }
}
/* ---------- draw helpers ---------- */
const HEART=["01100110","11111111","11111111","01111110","00111100","00011000"];
function heart(cx,cy,s=2,col='#f00'){g.fillStyle=col;HEART.forEach((r,j)=>{for(let i=0;i<8;i++)if(r[i]=='1')g.fillRect(Math.round(cx-4*s+i*s),Math.round(cy-3*s+j*s),s,s)})}
function T(s,x,y,sz=14,col='#fff',al='left'){g.font=F(sz);g.fillStyle=col;g.textAlign=al;g.textBaseline='alphabetic';g.fillText(s,x,y)}
function menuList(items,y0,gap,idx,x=320){items.forEach((s,i)=>{T(s,x,y0+i*gap,16,i==idx?'#ff0':'#fff','center');if(i==idx)heart(x-g.measureText(s).width/2-26,y0+i*gap-6)})}
function enemy(e,s,a){
  const ox=shake>0&&inB?(Math.random()-.5)*16*shake:0,by=Math.sin(now/380)*4,sm=inB&&mercy>=100;
  g.save();g.globalAlpha=a;g.translate(ox,by);g.scale(s,s);g.lineWidth=5;g.strokeStyle=AC[e.id]||'#fff';g.shadowColor=AC[e.id]||'#fff';g.shadowBlur=12;
  if(e.boss){boss(e);g.restore();return}
  if(e.id<5){foe(e);g.restore();return}
  if(e.id==0){
    g.fillStyle='#7f9a6c';g.fillRect(-52,48,34,22);g.fillRect(18,48,34,22);g.strokeRect(-52,48,34,22);g.strokeRect(18,48,34,22);
    g.beginPath();g.ellipse(0,0,82,62,0,0,7);g.fill();g.stroke();
    g.fillStyle='#5f7d52';g.beginPath();g.ellipse(-20,-30,34,16,.3,0,7);g.fill();
    g.fillStyle='#3d5a38';g.beginPath();g.moveTo(0,-60);g.lineTo(14,-96);g.lineTo(34,-62);g.closePath();g.fill();g.lineWidth=3;g.stroke();
  }else if(e.id==1){
    g.fillStyle='#f80';[-50,-10,30].forEach((x,i)=>{g.beginPath();g.moveTo(x,-50);g.lineTo(x+14,-96-8*Math.sin(now/120+i));g.lineTo(x+34,-50);g.closePath();g.fill()});
    const C=[[-55,10,45],[55,10,45],[0,-12,58],[0,25,50]];
    g.fillStyle='#fff';C.forEach(c=>{g.beginPath();g.arc(c[0],c[1],c[2]+4,0,7);g.fill()});
    g.fillStyle='#d9d2d2';C.forEach(c=>{g.beginPath();g.arc(c[0],c[1],c[2],0,7);g.fill()});
  }else if(e.id==3){
    g.fillStyle='#8a8a96';g.beginPath();g.ellipse(0,8,76,58,0,0,7);g.fill();g.stroke();
    g.fillStyle='#a0a0ac';g.beginPath();g.ellipse(-22,-30,26,18,.3,0,7);g.fill();g.beginPath();g.ellipse(34,-24,20,14,-.3,0,7);g.fill();
    g.strokeStyle='#55555f';g.lineWidth=3;g.beginPath();g.moveTo(30,10);g.lineTo(44,34);g.lineTo(34,52);g.moveTo(-50,0);g.lineTo(-36,22);g.stroke();g.strokeStyle='#fff';g.lineWidth=5;
  }else if(e.id==4){
    g.fillStyle='#fff';for(let i=0;i<12;i++){const a=i*.52;g.beginPath();g.moveTo(Math.cos(a)*62,Math.sin(a)*52);g.lineTo(Math.cos(a)*88,Math.sin(a)*74);g.lineTo(Math.cos(a+.3)*62,Math.sin(a+.3)*52);g.fill()}
    g.fillStyle='#3f7a45';g.beginPath();g.ellipse(0,0,68,56,0,0,7);g.fill();g.stroke();
    g.fillStyle='#ff90b8';g.beginPath();g.arc(0,-62,10,0,7);g.fill();g.fillStyle='#ffd040';g.fillRect(-3,-65,6,6);
  }else if(e.id==5){
    g.fillStyle='#dfe8f5';g.beginPath();g.arc(0,-8,58,Math.PI,0);g.lineTo(58,64);for(let i=0;i<5;i++)g.lineTo(58-i*23-12,64+(i%2?0:-14));g.lineTo(-58,64);g.closePath();g.fill();g.stroke();
    g.fillStyle='#ff9a30';g.beginPath();g.moveTo(-8,-62);g.quadraticCurveTo(0,-100-Math.sin(now/110)*6,8,-62);g.closePath();g.fill();
    g.fillStyle='#6ac8ff';g.fillRect(-36,12,6,12);
  }else{
    const w=Math.sin(now/150)*.25;g.fillStyle='#6a4a9a';
    [-1,1].forEach(d=>{g.save();g.scale(d,1);g.rotate(w);g.beginPath();g.ellipse(70,-10,70,48,.3,0,7);g.fill();g.stroke();g.restore()});
    g.fillStyle='#3a2a5a';g.beginPath();g.ellipse(0,5,38,60,0,0,7);g.fill();g.stroke();
    g.beginPath();g.moveTo(-14,-52);g.lineTo(-30,-92);g.moveTo(14,-52);g.lineTo(30,-92);g.stroke();
  }
  const my=[28,32,16,26,24,30][e.id];
  if(e.id==2){g.fillStyle='#ff0';g.fillRect(-20,-24,10,14);g.fillRect(10,-24,10,14)}
  else{g.fillStyle='#111';g.fillRect(-44,-20,24,30);g.fillRect(20,-20,24,30);g.fillStyle='#fff';g.fillRect(-38,-14,8,8);g.fillRect(26,-14,8,8);g.fillRect(-32,0,4,4);g.fillRect(32,0,4,4);g.fillStyle='#e9a0a8';g.fillRect(-58,14,18,8);g.fillRect(40,14,18,8)}
  g.strokeStyle=e.id==2?'#ff0':'#111';g.lineWidth=4;g.beginPath();
  if(sm){g.moveTo(-14,my-6);g.quadraticCurveTo(0,my+8,14,my-6)}else{g.moveTo(-12,my);g.lineTo(12,my)}
  g.stroke();g.restore();
}
function boss(e){
  const n=now;
  if(e.id==6){
    g.fillStyle='#14101c';g.beginPath();g.moveTo(-76,100);g.lineTo(-42,-30);g.quadraticCurveTo(0,-72,42,-30);g.lineTo(76,100);g.closePath();g.fill();g.stroke();
    g.beginPath();g.ellipse(0,-52,44,48,0,0,7);g.fill();g.stroke();
    g.fillStyle='#eee';g.beginPath();g.ellipse(0,-48,28,32,0,0,7);g.fill();
    g.fillStyle='#000';g.fillRect(-18,-58,14,18);g.fillRect(4,-58,14,18);g.fillStyle='#f33';g.fillRect(-13,-52,5,6);g.fillRect(9,-52,5,6);
    g.fillRect(-14,-26,28,3);g.fillStyle='#000';for(let i=-12;i<14;i+=6)g.fillRect(i,-28,2,8);
    const w=Math.sin(n/500)*10;g.lineWidth=4;g.beginPath();g.moveTo(-64,24);g.lineTo(64,24);g.moveTo(0,24);g.lineTo(0,70);g.stroke();
    g.fillStyle='#ccc';[[-64,24+w],[64,24-w]].forEach(c=>{g.fillRect(c[0]-18,c[1]+14,36,6);g.fillRect(c[0]-1,24,2,c[1]-24+14)});
    g.fillStyle='#fff';g.fillRect(-40,20,12,12);g.fillRect(28,20,12,12);
  }else{
    g.fillStyle='#6b4a2e';g.beginPath();g.moveTo(-62,100);g.lineTo(-48,-20);g.lineTo(48,-20);g.lineTo(62,100);g.closePath();g.fill();g.stroke();
    g.beginPath();g.ellipse(0,-52,46,44,0,0,7);g.fill();g.stroke();
    g.fillStyle='#4a9a50';[-30,-10,10,30].forEach((x,i)=>{g.beginPath();g.moveTo(x-12,-24);g.lineTo(x,10+(i%2)*14);g.lineTo(x+12,-24);g.closePath();g.fill()});
    g.fillStyle='#ffd040';[-34,-12,12,34].forEach((x,i)=>{g.beginPath();g.moveTo(x-9,-86);g.lineTo(x,-112+(i%3)*5);g.lineTo(x+9,-86);g.closePath();g.fill()});
    g.fillStyle='#ffb000';g.fillRect(-24,-62,13,12);g.fillRect(11,-62,13,12);
    g.strokeStyle='#2a1a0a';g.lineWidth=4;g.beginPath();if(mercy>=100){g.moveTo(-14,-40);g.quadraticCurveTo(0,-30,14,-40)}else{g.moveTo(-12,-36);g.lineTo(12,-36)}g.stroke();
    g.strokeStyle='#8a6a3a';g.lineWidth=6;g.beginPath();g.moveTo(92,-70);g.lineTo(92,100);g.stroke();
    g.fillStyle='rgba(255,200,80,'+(.35+.15*Math.sin(n/300))+')';g.beginPath();g.arc(92,-84,26,0,7);g.fill();g.fillStyle='#ffd070';g.fillRect(84,-96,16,22);
  }
}
function npc(p){const b=Math.sin(now/400+p.k)*(p.k==2?5:2),near=Math.abs(px-p.x)<46&&Math.abs(py-p.y)<50;
  g.save();g.translate(p.x,p.y+b);
  g.fillStyle='rgba(0,0,0,.4)';g.beginPath();g.ellipse(0,1-b,13,4,0,0,7);g.fill();
  if(p.k==0){g.fillStyle='#f0d8b0';g.fillRect(-6,-18,12,18);g.fillStyle=p.c;g.beginPath();g.arc(0,-20,20,Math.PI,0);g.fill();g.fillStyle='#fff';[-10,2,10].forEach((x,i)=>g.fillRect(x-2,-30+i%2*6,5,5));g.fillStyle='#111';g.fillRect(-4,-14,2,3);g.fillRect(2,-14,2,3)}
  else if(p.k==1){g.fillStyle=p.c;g.fillRect(-8,-24,16,24);g.beginPath();g.moveTo(-9,-36);g.lineTo(-5,-48);g.lineTo(-1,-36);g.fill();g.beginPath();g.moveTo(1,-36);g.lineTo(5,-48);g.lineTo(9,-36);g.fill();g.fillRect(-8,-38,16,14);g.fillStyle='#fff';g.fillRect(-4,-30,8,6);g.fillStyle='#111';g.fillRect(-4,-33,2,3);g.fillRect(2,-33,2,3);g.fillStyle='rgba(255,210,100,'+(.5+.2*Math.sin(now/200))+')';g.beginPath();g.arc(16,-12,10,0,7);g.fill();g.fillStyle='#ffd070';g.fillRect(13,-16,6,8)}
  else if(p.k==2){g.globalAlpha=.75;g.fillStyle=p.c;g.beginPath();g.arc(0,-26,13,Math.PI,0);g.lineTo(13,-4);g.lineTo(6,2);g.lineTo(0,-4);g.lineTo(-6,2);g.lineTo(-13,-4);g.closePath();g.fill();g.fillStyle='#223';g.fillRect(-6,-28,3,5);g.fillRect(3,-28,3,5);g.globalAlpha=1}
  else if(p.k>3)npc2(p);else{g.fillStyle=p.c;g.beginPath();g.ellipse(0,-14,22,16,0,0,7);g.fill();g.fillStyle='#5a3a22';g.fillRect(-14,-36,28,6);g.fillRect(-9,-44,18,10);g.fillStyle='#111';g.fillRect(-7,-18,3,4);g.fillRect(4,-18,3,4);g.fillStyle='#e8d890';g.fillRect(-8,-8,16,3)}
  g.restore();if(near&&Math.floor(now/400)%2==0)T('Z',p.x,p.y-58,12,'#ff0','center')}
function foe(e){
  const n=now,sm=inB&&mercy>=100,ac=AC[e.id];g.lineJoin='round';g.strokeStyle=ac;
  if(e.id==0){
    const sw=Math.sin(n/260)*10;
    g.lineWidth=7;g.beginPath();g.moveTo(-14,40);g.lineTo(-22,88+sw/2);g.moveTo(14,40);g.lineTo(22,88-sw/2);g.stroke();
    g.lineWidth=5;g.fillStyle='#e0345a';g.beginPath();g.moveTo(0,-20);g.lineTo(34,20);g.lineTo(0,56);g.lineTo(-34,20);g.closePath();g.fill();g.stroke();
    g.fillStyle='#2a4ad0';g.beginPath();g.moveTo(0,-20);g.lineTo(34,20);g.lineTo(0,20);g.closePath();g.fill();g.beginPath();g.moveTo(0,20);g.lineTo(-34,20);g.lineTo(0,56);g.closePath();g.fill();
    g.lineWidth=6;g.beginPath();g.moveTo(-30,10);g.lineTo(-64,-20+sw);g.moveTo(30,10);g.lineTo(64,-20-sw);g.stroke();
    [0,1,2].forEach(i=>{const a=n/300+i*2.09;g.fillStyle=['#ffd040','#5af','#f6c'][i];g.beginPath();g.arc(Math.cos(a)*46,-82+Math.sin(a)*14,9,0,7);g.fill()});
    g.lineWidth=5;g.fillStyle='#f4f0ff';g.beginPath();g.arc(0,-52,30,0,7);g.fill();g.stroke();
    g.fillStyle='#2a4ad0';g.beginPath();g.moveTo(-28,-70);g.lineTo(-52,-104+sw/2);g.lineTo(-8,-82);g.lineTo(0,-112);g.lineTo(8,-82);g.lineTo(52,-104-sw/2);g.lineTo(28,-70);g.closePath();g.fill();g.stroke();
    g.fillStyle='#ffd040';[[-52,-104+sw/2],[52,-104-sw/2],[0,-112]].forEach(c=>{g.beginPath();g.arc(c[0],c[1],5,0,7);g.fill()});
    g.fillStyle='#111';g.fillRect(-15,-62,9,13);g.fillRect(6,-62,9,13);g.fillStyle='#e0345a';g.beginPath();g.arc(0,-48,6,0,7);g.fill();
    g.strokeStyle='#111';g.lineWidth=4;g.beginPath();if(sm)g.arc(0,-42,14,.2,2.9);else{g.moveTo(-12,-34);g.lineTo(12,-34)}g.stroke();
  }else if(e.id==1){
    const cl=Math.sin(n/300)*8;g.lineWidth=5;
    for(let i=0;i<3;i++){const y=30+i*14;g.beginPath();g.moveTo(-50,y);g.lineTo(-84,y+14);g.moveTo(50,y);g.lineTo(84,y+14);g.stroke()}
    [-1,1].forEach(d=>{g.save();g.translate(d*78,-24-cl*d);g.fillStyle='#e8663a';g.beginPath();g.arc(0,0,26,0,7);g.fill();g.stroke();g.fillStyle='#000';g.beginPath();g.moveTo(0,0);g.lineTo(d*30,-14);g.lineTo(d*30,12);g.closePath();g.fill();g.restore()});
    g.fillStyle='#d9502a';g.beginPath();g.ellipse(0,20,66,50,0,0,7);g.fill();g.stroke();
    g.beginPath();g.moveTo(-20,-22);g.lineTo(-24,-52);g.moveTo(20,-22);g.lineTo(24,-52);g.stroke();
    g.fillStyle='#fff';[-24,24].forEach(x=>{g.beginPath();g.arc(x,-58,11,0,7);g.fill();g.stroke()});g.fillStyle='#111';[-24,24].forEach(x=>{g.beginPath();g.arc(x+2,-57,5,0,7);g.fill()});
    g.fillStyle='#222';g.beginPath();g.moveTo(-50,-76);g.lineTo(0,-104);g.lineTo(50,-76);g.lineTo(0,-84);g.closePath();g.fill();g.stroke();g.fillStyle='#fff';g.fillRect(-4,-96,8,8);
    g.strokeStyle='#111';g.lineWidth=6;g.beginPath();g.moveTo(-26,-2);g.quadraticCurveTo(-12,-14,0,-4);g.quadraticCurveTo(12,-14,26,-2);g.stroke();
    g.lineWidth=4;g.beginPath();if(sm)g.arc(0,8,12,.2,2.9);else{g.moveTo(-10,18);g.lineTo(10,18)}g.stroke();
  }else if(e.id==2){
    g.lineWidth=5;g.fillStyle='#7a5a3a';g.beginPath();g.ellipse(0,20,56,76,0,0,7);g.fill();g.stroke();
    g.fillStyle='#a07a52';g.beginPath();g.ellipse(0,40,34,48,0,0,7);g.fill();
    g.fillStyle='#7a5a3a';g.beginPath();g.moveTo(-40,-50);g.lineTo(-52,-88);g.lineTo(-18,-60);g.closePath();g.fill();g.stroke();g.beginPath();g.moveTo(40,-50);g.lineTo(52,-88);g.lineTo(18,-60);g.closePath();g.fill();g.stroke();
    g.fillStyle='#fff';[-22,22].forEach(x=>{g.beginPath();g.arc(x,-30,20,0,7);g.fill();g.stroke()});
    g.fillStyle='#111';[-22,22].forEach(x=>{g.beginPath();g.arc(x+Math.sin(n/700)*3,-28,8,0,7);g.fill()});g.fillStyle='#fff';[-22,22].forEach(x=>g.fillRect(x-6,-36,5,5));
    g.fillStyle='#f0b020';g.beginPath();g.moveTo(-8,-8);g.lineTo(8,-8);g.lineTo(0,10);g.closePath();g.fill();
    g.fillStyle='#2a5aa0';g.fillRect(-40,36,80,40);g.strokeRect(-40,36,80,40);T('SHH',0,64,12,'#fff','center');
    if(sm){g.strokeStyle='#111';g.lineWidth=3;g.beginPath();g.arc(0,8,10,.2,2.9);g.stroke()}
  }else if(e.id==3){
    const sw=Math.sin(n/400)*6;g.lineWidth=5;
    for(let i=0;i<4;i++){const y=-10+i*18,q=i%2?1:-1;g.beginPath();g.moveTo(-34,y);g.lineTo(-76,y-26+sw*q);g.lineTo(-100,y+28);g.moveTo(34,y);g.lineTo(76,y-26-sw*q);g.lineTo(100,y+28);g.stroke()}
    g.fillStyle='#5a2a7a';g.beginPath();g.ellipse(0,38,52,58,0,0,7);g.fill();g.stroke();
    g.fillStyle='#d080ff';[[-18,30],[18,30],[0,52],[-12,70],[12,70]].forEach(c=>{g.beginPath();g.arc(c[0],c[1],5,0,7);g.fill()});
    g.fillStyle='#e8dcf4';g.beginPath();g.arc(0,-34,32,0,7);g.fill();g.stroke();
    g.fillStyle='#2a1040';g.fillRect(-36,-62,72,12);g.fillRect(-18,-92,36,32);g.strokeRect(-18,-92,36,32);g.fillStyle='#d080ff';g.fillRect(-18,-72,36,6);
    g.fillStyle='#111';[[-14,-40,5],[14,-40,5],[-6,-26,3],[6,-26,3]].forEach(c=>{g.beginPath();g.arc(c[0],c[1],c[2],0,7);g.fill()});
    g.strokeStyle='#111';g.lineWidth=3;g.beginPath();if(sm)g.arc(0,-18,8,.2,2.9);else{g.moveTo(-6,-12);g.lineTo(6,-12)}g.stroke();
    g.fillStyle='#fff';g.fillRect(104,34,22,18);g.strokeStyle=ac;g.strokeRect(104,34,22,18);
  }else{
    const fl=.6+.4*Math.sin(n/90);g.lineWidth=5;
    g.fillStyle='#4a4048';g.fillRect(-14,-96,28,40);g.strokeRect(-14,-96,28,40);
    for(let i=0;i<3;i++){g.fillStyle='rgba(200,200,210,'+(.5-i*.12)+')';g.beginPath();g.arc(Math.sin(n/500+i)*10,-106-i*14-((n/40)%14),8+i*3,0,7);g.fill()}
    g.fillStyle='#3a3340';g.fillRect(-60,-58,120,130);g.strokeRect(-60,-58,120,130);g.fillStyle='#524a5a';g.fillRect(-52,-50,104,12);g.fillRect(-52,60,104,8);
    g.fillStyle='#3a3340';g.fillRect(-92,-20,30,60);g.strokeRect(-92,-20,30,60);g.fillRect(62,-20,30,60);g.strokeRect(62,-20,30,60);
    g.fillStyle=sm?'#ffe090':'rgb(255,'+Math.round(120+80*fl)+',20)';g.fillRect(-36,2,72,40);g.strokeRect(-36,2,72,40);g.fillStyle='#1a1018';for(let i=-2;i<=2;i++)g.fillRect(i*14-2,2,4,40);
    g.fillStyle='#ff9a30';g.fillRect(-34,-30,22,14);g.fillRect(12,-30,22,14);g.fillStyle='#111';g.fillRect(-26,-27,8,8);g.fillRect(20,-27,8,8);
  }
}
function npc2(p){
  if(p.k==4){g.fillStyle='#8a6a40';g.beginPath();g.ellipse(0,-10,24,12,0,0,7);g.fill();g.fillStyle=p.c;g.beginPath();g.arc(-4,-26,16,0,7);g.fill();g.strokeStyle='#5a3a10';g.lineWidth=3;g.beginPath();g.arc(-4,-26,9,0,5);g.stroke();g.fillStyle='#e8c890';g.fillRect(14,-30,8,14);g.fillRect(12,-34,3,6);g.fillRect(19,-34,3,6)}
  else if(p.k==5){g.fillStyle=p.c;g.beginPath();g.ellipse(0,-14,13,15,0,0,7);g.fill();g.fillStyle='#e8a0a0';g.beginPath();g.arc(0,-18,4,0,7);g.fill();g.fillStyle='#fc4';g.fillRect(-9,-26,7,5);g.fillRect(2,-26,7,5);g.fillStyle='#111';g.fillRect(-7,-25,2,2);g.fillRect(4,-25,2,2)}
  else{g.fillStyle=p.c;g.beginPath();g.ellipse(0,-14,16,16,0,0,7);g.fill();g.beginPath();g.moveTo(-14,-26);g.lineTo(-10,-42);g.lineTo(-3,-28);g.fill();g.beginPath();g.moveTo(3,-28);g.lineTo(10,-42);g.lineTo(14,-26);g.fill();g.fillStyle='#ffd040';g.fillRect(-9,-22,4,4);g.fillRect(5,-22,4,4);g.fillStyle='#e0507a';g.fillRect(-12,-6,24,5)}
}
function dName(){
  T('Name your save.',320,56,16,'#fff','center');
  T(nm,200,130,28,'#fff');if(Math.floor(now/450)%2==0){g.fillStyle='#fff';g.fillRect(200+nm.length*28,134,24,4)}
  NC.forEach((c,i)=>{const w=i>=26,x=w?130+(i-26)*190:118+(i%7)*68,y=w?425:206+Math.floor(i/7)*50;
    T(c,x,y,w?13:20,i==ni?'#ff0':'#fff','center');if(i==ni)heart(x-(w?44:26),y-7)});
  T('type, or pick letters. Enter = done',320,462,8,'#777','center')}
function dNameOk(){T('Is this name correct?',320,110,16,'#fff','center');T(nm,320-nm.length*20,250,40,'#fff');
  ['No','Yes'].forEach((q,i)=>{T(q,170+i*300,400,18,cs==i?'#ff0':'#fff');if(cs==i)heart(140+i*300,394)})}
function dLook(){T('WARDROBE',320,50,20,'#fff','center');
  g.save();g.translate(320,215);g.scale(4,4);const ox=px,oy=py,of=fd;px=0;py=0;fd='d';player();px=ox;py=oy;fd=of;g.restore();
  [['SKIN',SKIN.map(c=>[c])],['SHIRT',SHIRT],['HAIR',HAIR.map(c=>[c])],['SCARF',SCARF.map(c=>[c])]].forEach((r,i)=>{const y=290+i*34;T(r[0],130,y+8,12,lk==i?'#ff0':'#fff');
    r[1].forEach((cols,j)=>{const x=260+j*56,m=cols.length>1;cols.forEach((c,q)=>{g.fillStyle=c;g.fillRect(x+q*14,y-8,m?14:28,28)});g.lineWidth=3;g.strokeStyle=ap[['sk','sh','hr','sc'][i]]==j?'#ff0':'#555';g.strokeRect(x-3,y-11,34,34)})});
  T('DONE',320,448,14,lk==4?'#ff0':'#fff','center');if(lk<4)heart(100,290+lk*34+4);else heart(250,444)}
function dCine(){
  g.fillStyle='#000';g.fillRect(0,0,640,480);const n=now;
  for(let i=0;i<60;i++)if(i<(cpg<4?60-cpg*14:6)){g.fillStyle='rgba(255,255,255,'+(.4+.6*Math.abs(Math.sin(n/600+i)))+')';g.fillRect((i*97)%640,(i*53)%240,2,2)}
  if(cpg>=3)for(let i=0;i<14;i++){g.fillStyle='#ffd040';g.fillRect((i*173)%640,(n*.05*(1+i%3)+i*60)%340,3,5)}
  if(cpg>=5){g.fillStyle='#2a1a3a';g.fillRect(200,240,240,100);g.beginPath();g.moveTo(190,240);g.lineTo(320,190);g.lineTo(450,240);g.fill();g.fillStyle='#ffd070';g.fillRect(230,265,36,32);heart(320,160+Math.sin(n/400)*5,4,'#ff0')}
  bodyText(50,390);if(ci>=txt.length&&Math.floor(n/500)%2==0)T('Z',612,462,12,'#ff0','right')}
function dChoice(){g.fillStyle='#000';g.fillRect(32,340,576,120);g.lineWidth=5;g.strokeStyle='#fff';g.strokeRect(32,340,576,120);T('Be friends with '+cp.n+'?',56,385,14);
  ['Be friends','Not now'].forEach((q,i)=>{T(q,120+i*260,430,14,cs==i?'#ff0':'#fff');if(cs==i)heart(96+i*260,425)})}
function dShop(){
  const n=now,ink='#1a0e06';
  g.fillStyle='#e8d6a8';g.fillRect(0,0,640,480);
  const gr=g.createRadialGradient(320,240,120,320,240,420);gr.addColorStop(0,'rgba(60,30,0,0)');gr.addColorStop(1,'rgba(60,30,0,.55)');g.fillStyle=gr;g.fillRect(0,0,640,480);
  g.fillStyle='rgba(40,20,0,.2)';for(let i=0;i<120;i++)g.fillRect(Math.random()*640,Math.random()*480,2,2);
  if(Math.random()<.3){g.fillStyle='rgba(255,255,255,.3)';g.fillRect(Math.random()*640,0,1,480)}
  for(let i=0;i<16;i++){g.fillStyle=i%2?'#f4ecd0':'#c8322a';g.beginPath();g.moveTo(i*40,0);g.lineTo(i*40+40,0);g.lineTo(i*40+40,40);g.arc(i*40+20,40,20,0,Math.PI);g.closePath();g.fill()}
  g.lineWidth=5;g.strokeStyle=ink;
  const bz=Math.sin(n/300)*4;g.save();g.translate(105,320+bz);
  g.fillStyle='#222';g.beginPath();g.ellipse(0,40,36,50,0,0,7);g.fill();g.stroke();
  g.fillStyle='#fff';g.beginPath();g.arc(-42,30,12,0,7);g.fill();g.stroke();g.beginPath();g.arc(42,30+Math.sin(n/200)*8,12,0,7);g.fill();g.stroke();
  g.fillStyle='#222';g.beginPath();g.arc(0,-36,34,0,7);g.fill();g.stroke();
  g.fillStyle='#e8a020';g.beginPath();g.moveTo(8,-34);g.lineTo(48,-26);g.lineTo(8,-18);g.closePath();g.fill();g.stroke();
  g.fillStyle='#fff';g.beginPath();g.arc(-8,-46,11,0,7);g.fill();g.stroke();g.fillStyle='#000';g.beginPath();g.moveTo(-8,-46);g.arc(-8,-46,11,.3,2,false);g.closePath();g.fill();
  g.fillStyle='#c8322a';g.fillRect(-12,-6,24,10);g.fillStyle='#111';g.fillRect(-28,-76,56,10);g.fillRect(-18,-110,36,36);g.fillStyle='#c8322a';g.fillRect(-18,-84,36,8);
  g.restore();
  g.fillStyle='#f6edcf';g.fillRect(200,70,420,340);g.strokeRect(200,70,420,340);
  T("MR. SNOOT'S EMPORIUM",410,98,12,ink,'center');T('COIN: '+gold+'g',604,98,10,'#a02018','right');
  SH.forEach((it,i)=>{const y=124+i*46;if(i==shi){g.fillStyle='#ffd9a0';g.fillRect(208,y-4,404,42)}
    T(it[0],220,y+14,11,ink);T(it[1],220,y+32,9,'#6a4a2a');T(it[2]+'g',604,y+14,11,gold>=it[2]?'#2a6a2a':'#a02018','right');
    const ow=it[3][0]=='h'?[rolls,bag[0],bag[1]][+it[3][1]]:upg[it[3][1]];T('x'+ow,604,y+32,9,'#6a4a2a','right')});
  g.fillStyle=ink;g.fillRect(20,420,600,48);T(shmsg>=0?SM[shmsg]:(kc()?"Heard you've been busy, pal. Business is boomin'!":"Step right up! Heals and goodies!"),34,450,11,'#f6edcf');
  T('Z buy   X leave',410,436,8,'#f6edcf','center')}
function dRoom(){
  const n=now;
  g.fillStyle='#2a1c30';g.fillRect(0,0,640,235);g.fillStyle='#1c1424';g.fillRect(0,190,640,45);
  g.fillStyle='#0a0a22';g.fillRect(260,46,110,100);
  for(let i=0;i<8;i++){g.fillStyle='rgba(255,255,255,'+(.4+.6*Math.abs(Math.sin(n/500+i)))+')';g.fillRect(268+(i*37)%92,54+(i*29)%80,2,2)}
  g.strokeStyle='#d8b890';g.lineWidth=6;g.strokeRect(260,46,110,100);g.beginPath();g.moveTo(315,46);g.lineTo(315,146);g.moveTo(260,96);g.lineTo(370,96);g.stroke();
  for(let y=235;y<480;y+=26){g.fillStyle=((y-235)/26|0)%2?'#523624':'#4a3020';g.fillRect(0,y,640,26)}
  g.fillStyle='#7a2a3a';g.fillRect(230,305,180,95);g.strokeStyle='#e8c070';g.lineWidth=3;g.strokeRect(238,313,164,79);g.beginPath();g.moveTo(320,313);g.lineTo(370,352);g.lineTo(320,392);g.lineTo(270,352);g.closePath();g.stroke();
  g.strokeStyle='#1a0e06';g.lineWidth=4;
  g.fillStyle='#6a4428';g.fillRect(40,100,90,150);g.strokeRect(40,100,90,150);g.beginPath();g.moveTo(85,100);g.lineTo(85,250);g.stroke();g.fillStyle='#e8c070';g.fillRect(78,170,4,14);g.fillRect(88,170,4,14);
  g.fillStyle='#4a3020';g.fillRect(150,90,80,145);g.strokeRect(150,90,80,145);
  for(let r=0;r<3;r++){g.fillStyle='#2a1a10';g.fillRect(153,126+r*36,74,4);['#c0504a','#4a80c0','#c0b04a','#4ac080','#a050c0'].forEach((c,i)=>{g.fillStyle=c;g.fillRect(156+i*14,98+r*36,10,26)})}
  g.fillStyle='#8a5a3a';g.fillRect(430,150,150,90);g.fillStyle='#e8e0d0';g.fillRect(438,156,40,30);g.fillStyle='#4a6aa8';g.fillRect(480,158,92,76);g.strokeRect(430,150,150,90);
  g.fillStyle='#6a4428';g.fillRect(470,300,60,8);g.fillRect(478,308,6,30);g.fillRect(516,308,6,30);g.fillStyle='#ffd070';g.fillRect(494,284,12,16);
  g.fillStyle='#3a2414';g.fillRect(600,245,40,160);g.strokeRect(600,245,40,160);g.fillStyle='#e8c070';g.fillRect(606,325,6,6);
  g.globalCompositeOperation='lighter';g.globalAlpha=.1;g.fillStyle='#8aa0ff';g.beginPath();g.moveTo(260,146);g.lineTo(370,146);g.lineTo(420,400);g.lineTo(220,400);g.fill();
  g.globalAlpha=1;const lg=g.createRadialGradient(500,290,2,500,290,110);lg.addColorStop(0,'rgba(255,190,90,.3)');lg.addColorStop(1,'rgba(255,190,90,0)');g.fillStyle=lg;g.fillRect(390,180,220,220);g.globalCompositeOperation='source-over';
  g.fillStyle='#aaa';dust.forEach(d=>{g.globalAlpha=d.l;g.fillRect(d.x,d.y,3,3)});g.globalAlpha=1;
  player();
  if(Math.floor(n/400)%2==0){if(px<190&&py<300)T('Z',85,92,12,'#ff0','center');if(Math.abs(px-500)<60&&Math.abs(py-300)<60)T('Z',500,274,12,'#ff0','center')}
  if(mode=='trans'){const p=Math.min(1,t/.35);g.save();g.translate(px+90,330);enemy(EN[bi],.55*(1-Math.pow(1-p,3)),1);g.restore();if(t<.5)T('!',px,py-52-Math.abs(Math.sin(t*14))*6,24,'#f33','center')}
}
function drawBox(){g.fillStyle='#000';g.fillRect(box.x,box.y,box.w,box.h);g.lineWidth=5;g.strokeStyle='#fff';g.strokeRect(box.x,box.y,box.w,box.h)}
function bodyText(x,y){txt.slice(0,Math.floor(ci)).split('\n').forEach((l,i)=>T(l,x,y+i*30))}
function player(){
  const mv=held.L||held.R||held.U||held.D,ph=wt*11,sw=mv?Math.sin(ph):0,bob=mv?Math.abs(Math.sin(ph))*2:Math.sin(now/500)*.7,sd=fd=='s';
  g.save();g.translate(Math.round(px),Math.round(py));
  g.fillStyle='rgba(0,0,0,.4)';g.beginPath();g.ellipse(0,1,11,4,0,0,7);g.fill();
  if(sd)g.scale(face,1);g.translate(0,-bob);
  const L=sd?sw*4:0,R=sd?-sw*4:0,ly=sd?0:sw*2;
  g.fillStyle='#2f3b73';g.fillRect(-5+L,-10,4,8+ly);g.fillRect(1+R,-10,4,8-ly);
  g.fillStyle='#eee';g.fillRect(-5+L,-2+ly,5,3);g.fillRect(1+R,-2-ly,5,3);
  g.fillStyle=SKIN[ap.sk];g.fillRect(-10-(sd?R/2:0),-19+(sd?0:sw*2),3,6);g.fillRect(7+(sd?L/2:0),-19-(sd?0:sw*2),3,6);
  for(let i=0;i<4;i++){g.fillStyle=SHIRT[ap.sh][i%2];g.fillRect(-7,-20+i*3,14,3)}
  g.fillStyle=SCARF[ap.sc];g.fillRect(-7,-23,14,4);
  const fl=Math.sin(now/120)*2;g.fillRect(sd?-12:-9,-22+fl/2,sd?5:4,sd?3:7+fl);
  g.fillStyle=SKIN[ap.sk];g.fillRect(-6,-34,12,11);
  g.fillStyle=HAIR[ap.hr];
  if(fd=='u'){g.fillRect(-7,-36,14,13)}
  else{g.fillRect(-7,-37,14,5);g.fillRect(-7,-33,3,5);if(sd)g.fillRect(-7,-32,5,9);g.fillRect(2,-33,5,2)}
  g.fillStyle='#111';
  if(fd=='d'){g.fillRect(-3,-29,2,3);g.fillRect(2,-29,2,3);g.fillStyle='#e08a8a';g.fillRect(-5,-26,2,2);g.fillRect(3,-26,2,2)}
  else if(sd){g.fillRect(2,-29,2,3);g.fillStyle='#e0a070';g.fillRect(6,-27,2,2)}
  g.restore();
}
function dOW(){
  if(ar==0)return dRoom();
  const cx=Math.round(clamp(px-320,0,WW-640)),n=now;
  g.save();g.translate(-cx,0);
  const gr=g.createLinearGradient(0,0,0,170);gr.addColorStop(0,'#0a0716');gr.addColorStop(1,'#1a1030');g.fillStyle=gr;g.fillRect(cx,0,640,170);
  g.fillStyle='#e8e4ff';g.beginPath();g.arc(cx+540,44,20,0,7);g.fill();g.fillStyle='#0c0818';g.beginPath();g.arc(cx+548,40,18,0,7);g.fill();
  const off=cx*.6;g.fillStyle='#120c20';
  for(let x=Math.floor((cx-off)/110)*110;x<cx-off+760;x+=110){const X=x+off,h=70+((x*13%50)+50)%50;g.beginPath();g.moveTo(X-40,170);g.lineTo(X,170-h-30);g.lineTo(X+40,170);g.fill();g.fillRect(X-5,150,10,20)}
  g.fillStyle='#1b1328';g.fillRect(cx,170,640,260);
  for(let x=Math.floor(cx/64)*64;x<cx+704;x+=64)for(let y=170;y<430;y+=64)if(((x/64+(y-170)/64)|0)%2==0){g.fillStyle='#20172f';g.fillRect(x,y,64,64)}
  g.strokeStyle='#2d2142';g.lineWidth=2;
  for(let x=Math.floor(cx/64)*64;x<cx+704;x+=64){g.beginPath();g.moveTo(x,170);g.lineTo(x,430);g.stroke()}
  [234,298,362].forEach(y=>{g.beginPath();g.moveTo(cx,y);g.lineTo(cx+640,y);g.stroke()});
  for(let x=1000;x<WW;x+=300){g.fillStyle='#241a38';g.fillRect(x,60,40,110);g.strokeStyle='#cfc8e8';g.lineWidth=3;g.strokeRect(x,60,40,110);
    if(fin!=1){const tx=x+150,fl=Math.sin(n/90+x)*2;g.fillStyle='#5a4030';g.fillRect(tx-3,100,6,24);g.fillStyle='#ffa030';g.beginPath();g.moveTo(tx-7,100);g.lineTo(tx,80+fl);g.lineTo(tx+7,100);g.fill();g.fillStyle='#ffe080';g.fillRect(tx-2,92,4,8)}}
  g.strokeStyle='#2d6a3a';g.lineWidth=3;
  for(let x=Math.floor(cx/60)*60;x<cx+700;x+=60){const Lh=25+(((x*7)%55)+55)%55,s=Math.sin(n/700+x)*4;g.beginPath();g.moveTo(x,0);g.quadraticCurveTo(x+s,Lh/2,x+s*1.6,Lh);g.stroke();g.fillStyle='#3a8a4a';g.fillRect(x+s*1.6-3,Lh,6,5)}
  [[250,120,'#7a4a6a'],[420,110,'#4a6a8a'],[780,130,'#8a6a3a'],[950,110,'#4a8a6a']].forEach(h=>{if(h[0]>cx+640||h[0]+h[1]<cx)return;g.fillStyle=h[2];g.fillRect(h[0],96,h[1],74);g.fillStyle='#2a1a2a';g.beginPath();g.moveTo(h[0]-10,96);g.lineTo(h[0]+h[1]/2,50);g.lineTo(h[0]+h[1]+10,96);g.fill();g.fillStyle='#ffd070';g.fillRect(h[0]+14,112,22,22);g.fillRect(h[0]+h[1]-36,112,22,22);g.fillStyle='#3a2414';g.fillRect(h[0]+h[1]/2-9,130,18,40)});
  g.fillStyle='#e8d6a8';g.fillRect(560,84,140,86);for(let i=0;i<7;i++){g.fillStyle=i%2?'#f4ecd0':'#c8322a';g.fillRect(556+i*20,70,20,26)}g.fillStyle='#1a0e06';g.fillRect(618,118,30,52);T('SHOP',630,62,10,'#fff','center');
  for(let x=150;x<1100;x+=230){g.fillStyle='#2a2030';g.fillRect(x,120,6,60);g.fillStyle='#ffd070';g.fillRect(x-4,112,14,10);g.globalAlpha=.18;g.beginPath();g.arc(x+3,118,30,0,7);g.fill();g.globalAlpha=1}
  g.fillStyle='#4a8a50';for(let i=0;i<60;i++)g.fillRect((i*137)%WW,250+((i*61)%160),12,4);
  for(let i=0;i<WW/150;i++){const x=60+i*150+(i*37%40),y=182+(i*29%26),p=.6+.4*Math.sin(n/500+i);g.fillStyle=i%2?'#5af':'#f6c';g.globalAlpha=p;g.beginPath();g.arc(x,y,8,Math.PI,0);g.fill();g.fillRect(x-2,y,4,6);g.globalAlpha=.15*p;g.beginPath();g.arc(x,y,28,0,7);g.fill();g.globalAlpha=1}
  g.fillStyle='#000';g.fillRect(cx,430,640,50);
  g.fillStyle='#6a4a30';g.fillRect(420,278,26,18);g.fillRect(430,296,6,14);g.fillStyle='#d8c8a0';g.fillRect(424,282,18,2);g.fillRect(424,287,14,2);
  SX.forEach(x=>{g.save();g.translate(x,290+Math.sin(n/300)*3);g.rotate(n/900);g.fillStyle='#ff0';g.fillRect(-9,-9,18,18);g.rotate(.785);g.fillRect(-9,-9,18,18);g.restore()});
  const open=def.slice(0,5).every(d=>d);g.fillStyle=open?'#ddb040':'#2a3a2a';g.fillRect(WW-50,200,50,200);g.strokeStyle='#fff';g.lineWidth=3;g.strokeRect(WW-50,200,50,200);
  if(open){g.globalAlpha=.2+.1*Math.sin(n/300);g.fillStyle='#ffe080';g.fillRect(WW-130,200,80,200);g.globalAlpha=1}
  g.globalCompositeOperation='lighter';
  if(fin!=1)for(let x=1000;x<WW;x+=300){const tx=x+150;if(tx<cx-160||tx>cx+800)continue;const r=140+Math.sin(n/90+x)*8,g2=g.createRadialGradient(tx,100,4,tx,100,r);g2.addColorStop(0,'rgba(255,150,50,.28)');g2.addColorStop(1,'rgba(255,150,50,0)');g.fillStyle=g2;g.fillRect(tx-r,100-r,r*2,r*2)}
  g.globalCompositeOperation='source-over';
  for(let i=0;i<45;i++){const x=(i*211+Math.sin(n/1700+i)*50+n*.004*(1+i%4))%WW,y=185+((i*97)%230)+Math.sin(n/900+i*2)*14,a=.5+.5*Math.sin(n/350+i*3);g.globalAlpha=.18*a;g.fillStyle='#cf6';g.beginPath();g.arc(x,y,9,0,7);g.fill();g.globalAlpha=.5+.5*a;g.fillRect(x-1,y-1,3,3)}
  g.fillStyle='#aaa';dust.forEach(d=>{g.globalAlpha=d.l;g.fillRect(d.x,d.y,3,3)});g.globalAlpha=1;
  NP.forEach(npc);player();
  if(mode=='trans'){const p=Math.min(1,t/.35);g.save();g.translate(px+90,300);enemy(EN[bi],.55*(1-Math.pow(1-p,3)),1);g.restore();
    if(t<.5)T('!',px,py-52-Math.abs(Math.sin(t*14))*6,24,'#f33','center')}
  g.restore();
  if(fin==1){g.fillStyle='rgba(0,0,0,.6)';g.fillRect(0,0,640,480)}else if(fin==2){g.fillStyle='rgba(255,200,100,.16)';g.fillRect(0,0,640,480)}
}
function dlg(){g.fillStyle='#000';g.fillRect(32,340,576,120);g.lineWidth=5;g.strokeStyle='#fff';g.strokeRect(32,340,576,120);bodyText(56,380)}
function stats(){
  T(pname||'YOU',32,424);T('LV 1',165,424);T('HP',250,424,10);
  g.fillStyle='#c00';g.fillRect(285,408,mhp*3,18);g.fillStyle='#ff0';g.fillRect(285,408,hp*3,18);
  T(hp+' / '+mhp,285+mhp*3+14,424);
  ['FIGHT','ACT','ITEM','MERCY'].forEach((n,i)=>{
    const x=32+i*148,sel=(mode=='menu'||mode=='fight'&&i==0)&&i==menu,col=sel?'#ff0':'#f80';
    g.lineWidth=3;g.strokeStyle=col;g.strokeRect(x,436,128,36);T(n,x+68,460,13,col,'center');
    if(sel&&mode=='menu')heart(x+16,454,2)});
}
function draw(){
  g.fillStyle='#000';g.fillRect(0,0,640,480);
  if(mode=='title'){
    heart(320,100,5);T('MOSS ROAD',320,190,40,'#fff','center');
    menuList(['START GAME','OPTIONS','CREDITS'],270,46,mi);
    T('made by Adnane mouchti',320,440,10,'#888','center');
    if(!ac&&Math.floor(now/600)%2==0)T('press any key for sound',320,466,9,'#ff0','center');return}
  if(mode=='slots'){
    T('CHOOSE A FILE',320,70,18,'#fff','center');
    for(let i=0;i<3;i++){const y=110+i*95,d=SL[i];g.lineWidth=4;g.strokeStyle=i==si?'#ff0':'#fff';g.strokeRect(60,y,520,76);
      T(d&&d.n?d.n:'FILE '+(i+1),90,y+32,16,i==si?'#ff0':'#fff');
      T(d?(d.r===0?'Room':'Road '+Math.round(d.x/WW*100)+'%')+'  Spared '+d.d.filter(v=>v==1).length+'  Killed '+d.d.filter(v=>v==2).length+(d.c?'  Clears '+d.c:''):'- NEW GAME -',90,y+58,10,'#ccc');
      if(i==si)heart(40,y+38)}
    T('Z: play   X: back',320,430,10,'#888','center');return}
  if(mode=='opt'){
    T('OPTIONS',320,90,24,'#fff','center');
    menuList(['MUSIC: '+(musOn?'ON':'OFF'),'MOVE: '+['ARROWS','WASD','BOTH'][ctl],'HOW TO PLAY','BACK'],185,52,oi);return}
  if(mode=='how'){
    T('HOW TO PLAY',320,52,18,'#fff','center');
    ['ROAD: arrows or WASD walk. Z reads signs,','talks to friends, touches stars (save).','Monsters hide on the road. They pop up!','','MENU: left/right pick, Z confirm, X back.','FIGHT: press Z when the bar is centered.','ACT: be kind. When a monster calms down,','its name glows. Then use MERCY > Spare.','','DODGE: every monster has its own rules.','Blue lines: stay still. Orange: keep moving.','Win by fighting or sparing. Clear all three','monsters to open the door. Your choices','decide who waits behind it.','Kills give more gold. Spend it at the shop!'].forEach((l,i)=>T(l,50,100+i*22,11,i<3?'#ff0':'#fff'));
    T('Z / X: back',320,450,10,'#888','center');return}
  if(mode=='cred'){T('MOSS ROAD',320,90,28,'#fff','center');T('DEMO VERSION',320,122,10,'#ff0','center');
    [['Developer','Adnane mouchti'],['Music','adnane mouchti'],['Game design','adnane mouchti']].forEach((r,i)=>{T(r[0],320,190+i*80,12,'#aaa','center');T(r[1],320,222+i*80,18,'#ff0','center')});
    T('Thanks for playing!',320,440,12,'#fff','center');return}
  if(mode=='over'){
    T('GAME OVER',320,210,40,'#fff','center');T('You cannot give up just yet...',320,270,12,'#fff','center');
    if(ot>1&&Math.floor(now/500)%2==0)T('- press Z to retry from your last save -',320,350,10,'#ff0','center');return}
  if(mode=='end'){
    heart(320,110,5);T('THE END',320,200,36,'#fff','center');T(endMsg[0],320,260,12,'#fff','center');T(endMsg[1],320,295,14,'#ff0','center');T(endMsg[2],320,328,10,'#ccc','center');
    T('Your file was reset. Play again!',320,350,10,'#aaa','center');
    if(ot>1&&Math.floor(now/500)%2==0)T('- press Z -',320,410,12,'#ff0','center');return}
  if(!inB){
    dOW();if(ban.t>0&&mode=='ow'){g.globalAlpha=Math.max(0,Math.min(1,ban.t,(3.5-ban.t)*2));T(ban.s,320,60,16,'#fff','center');g.globalAlpha=1}
    if(mode=='trans'&&t>.5){const f=Math.floor(t/.18)%2;g.fillStyle=f?'rgba(255,255,255,.35)':'rgba(0,0,0,.6)';g.fillRect(0,0,640,480);heart(ar?clamp(px-clamp(px-320,0,WW-640),0,640):px,py-14,3)}
    if(mode=='say')dlg();if(mode=='choice')dChoice();return}
  enemy(E,1,1-gone)||0;
}
/* battle drawing is separate so the enemy is placed correctly */
const _draw=draw;
draw=function(){
  if(mode=='shop')return dShop();if(mode=='name')return dName();if(mode=='nameok')return dNameOk();if(mode=='look')return dLook();if(mode=='cine')return dCine();
  if(inB&&!['title','slots','opt','how','cred','over','end'].includes(mode)){
    g.fillStyle='#000';g.fillRect(0,0,640,480);
    if(gone<1){g.save();g.translate(320,150);enemy(E,1,1-gone);g.restore()}
    if(mode=='slash'&&fr){
      if(fr.dmg>0&&fr.t>.2&&fr.t<.6){g.strokeStyle='#f33';g.lineWidth=6;const p=Math.min(1,(fr.t-.2)/.2);for(let i=0;i<3;i++){g.beginPath();g.moveTo(270+i*28,80);g.lineTo(270+i*28+50*p,80+130*p);g.stroke()}}
      if(fr.t>.35&&fr.t<1.4){g.fillStyle='#555';g.fillRect(220,36,200,16);g.fillStyle='#0f0';g.fillRect(220,36,200*ehp/emax,16);T(fr.dmg?String(fr.dmg):'MISS',320,28,20,fr.dmg?'#f33':'#aaa','center')}}
    if(mode=='dodge'&&t<2.4&&gone<1){g.fillStyle='#fff';g.fillRect(410,60,206,56);g.beginPath();g.moveTo(410,90);g.lineTo(392,98);g.lineTo(410,104);g.fill();T(bubble,422,94,11,'#000')}
    drawBox();
    if(mode=='say'||mode=='menu')bodyText(box.x+24,box.y+38);
    if(mode=='sub')subList.forEach((s,i)=>{const x=box.x+64+(i%2)*270,y=box.y+44+Math.floor(i/2)*36;T('* '+s,x,y,14,(kind=='mercy'&&i==0&&mercy>=100)?'#ff0':'#fff');if(i==sub)heart(x-24,y-5)});
    if(mode=='fight'){const x0=box.x+20,w=box.w-40,cy=box.y+box.h/2;
      g.fillStyle='#333';g.fillRect(x0,cy-44,w,88);g.fillStyle='#665500';g.fillRect(x0+w*.2,cy-44,w*.6,88);g.fillStyle='#0a0';g.fillRect(x0+w*.44,cy-44,w*.12,88);
      g.strokeStyle='#fff';g.lineWidth=3;g.strokeRect(x0,cy-44,w,88);g.fillStyle='#fff';g.fillRect(x0+Math.min(1,bar)*w-5,cy-52,10,104)}
    if(mode=='dodge'){g.save();g.beginPath();g.rect(box.x+3,box.y+3,box.w-6,box.h-6);g.clip();g.fillStyle='#fff';bullets.forEach(b=>{if(b.sp)return;g.fillStyle=b.c=='b'?'#3cf':b.c=='o'?'#f90':b.n?'#c6f':'#fff';g.fillRect(Math.round(b.x),Math.round(b.y),b.w,b.h)});
      if(sysNow=='strings'){g.strokeStyle='#a0f';g.lineWidth=3;[0,1,2].forEach(l=>{const y=box.y+box.h/6+l*box.h/3;g.beginPath();g.moveTo(box.x+4,y);g.lineTo(box.x+box.w-4,y);g.stroke()})}
      g.restore();
      bullets.forEach(b=>{if(!b.sp)return;const dx=[0,1,0,-1][b.d],dy=[-1,0,1,0][b.d];g.strokeStyle='#3cf';g.lineWidth=5;g.beginPath();g.moveTo(hx+dx*b.r,hy+dy*b.r);g.lineTo(hx+dx*(b.r+20),hy+dy*(b.r+20));g.stroke()});
      if(sysNow=='shield'){g.strokeStyle='#0f0';g.lineWidth=5;const dx=[0,1,0,-1][sd],dy=[-1,0,1,0][sd];g.beginPath();if(dx){g.moveTo(hx+dx*22,hy-16);g.lineTo(hx+dx*22,hy+16)}else{g.moveTo(hx-16,hy+dy*22);g.lineTo(hx+16,hy+dy*22)}g.stroke()}
      if(inv<=0||Math.floor(inv*14)%2==0)heart(hx,hy,2,{shield:'#0f0',blue:'#36f',strings:'#c0f'}[sysNow]||'#f00')}
    stats();return}
  _draw();
};
function loop(ts){const dt=Math.min(.05,(ts-last)/1000||0);last=ts;update(dt);draw();T('DEMO VERSION',632,18,9,'#ff0','right');requestAnimationFrame(loop)}
const go=()=>{if(!go.d){go.d=1;requestAnimationFrame(loop)}};
try{document.fonts.load(F(14)).then(go,go)}catch(e){go()}
setTimeout(go,1500);cv.focus();
