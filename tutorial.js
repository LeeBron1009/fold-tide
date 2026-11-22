/* Foldtide v4 tutorial. Load after the game's script. */
(()=>{
'use strict';
const styles=document.createElement('style');
styles.textContent=`
#ft-guide{position:fixed;inset:0;z-index:10000;background:#020e0ce8;display:flex;align-items:center;justify-content:center;padding:max(16px,env(safe-area-inset-top)) 16px;overflow:auto;color:#f4efe4;font-family:system-ui,"Microsoft JhengHei",sans-serif}
#ft-guide *{box-sizing:border-box}#ft-guide .ft-card{width:min(480px,100%);max-height:92dvh;overflow:auto;border:1px solid #727455;border-radius:24px;background:#102421;padding:22px;box-shadow:0 20px 80px #0008}
#ft-guide .ft-top{display:flex;justify-content:space-between;align-items:center;color:#8fd0c8;font-size:12px;letter-spacing:.12em}#ft-guide button{font:inherit;cursor:pointer;border:1px solid #707154;border-radius:13px;padding:11px 15px;background:#19322b;color:#efe8d7}#ft-guide .ft-skip{padding:6px 10px;background:transparent;font-size:12px}#ft-guide h2{font-size:25px;letter-spacing:.04em;margin:16px 0 10px}#ft-guide p{font-size:15px;line-height:1.8;margin:12px 0;color:#dce5d9;min-height:80px}#ft-guide canvas{display:block;width:100%;height:175px;border-radius:16px;background:#081916;touch-action:auto}#ft-guide .ft-buttons{display:flex;gap:8px;margin-top:16px;flex-wrap:wrap}#ft-guide .ft-next{background:#e7d3a1;color:#16251d;font-weight:700;flex:1}#ft-guide .ft-progress{height:4px;border-radius:9px;background:#28453b;margin-top:17px;overflow:hidden}#ft-guide .ft-progress div{height:100%;background:#8fd0c8;transition:width .2s}#ft-guide button:disabled{opacity:.35;cursor:default}#ft-guide .ft-note{font-size:11px;color:#a7bfb3;margin-top:10px;line-height:1.6}
#ft-help{position:fixed;right:12px;bottom:max(35px,env(safe-area-inset-bottom));z-index:20;padding:8px 12px;border-radius:20px;border:1px solid #727455;background:#102421e8;color:#e7d3a1;font:12px system-ui;cursor:pointer}
`;
document.head.append(styles);
const steps=[
 ['歡迎來到折潮','這裡沒有方向鍵。白色脈衝會自己移動，你要放下金色「折光」，讓它反彈，碰到青色孢子。先看完這幾個步驟，再開始練習。'],
 ['第一步：看懂目標','白色是脈衝，青色圓點是要收集的孢子。碰到孢子就能得分並回復潮息；收完目前所有孢子，就會進入下一潮。'],
 ['第二步：點一下放折光','在遊戲區點一下，就能放下一片折光。快速點擊產生的折光，會垂直於脈衝當下的方向，適合把脈衝反彈回來。'],
 ['第三步：拖曳控制角度','按住畫面，往你想要的方向拉出一條線，再放開。這條線就是折光的方向。脈衝碰到它，會像球碰到牆一樣反彈。'],
 ['第四步：留意折光壽命','折光會慢慢變淡，最後消失。最多同時保留五片；放第六片時，最早的那片會被移除。別太早放，盡量在脈衝靠近時安排路線。'],
 ['第五步：保護潮息','撞到圓形邊界或暗礁會扣潮息，歸零就結束。每一潮開場有三秒護航，這段時間不會受傷。右上角可以暫停，切換分頁也會自動暫停。'],
 ['第六步：認識後續挑戰','金孢子分數較高；有些孢子會移動，有些會分裂。每五潮會出現需要打中多次的潮核。潮間可以選本局強化，結算得到的潮屑則能購買永久強化。'],
 ['準備好了，先練一潮','建議先進入練習模式，實際試試點擊和拖曳。練習不扣潮息，也不發放潮屑。之後可結束本局回封面，再挑戰無盡潮。畫面上的「操作教學」可隨時重看。']
];
let root=null,cv=null,c=null,index=0,raf=0,openedAt=0,previousState=null;
const help=document.createElement('button');help.id='ft-help';help.textContent='操作教學';help.onclick=()=>open();document.body.append(help);
function hasGame(){return typeof g!=='undefined'&&g&&typeof state!=='undefined'}
function open(){if(root)return;previousState=typeof state!=='undefined'?state:null;if(previousState==='play')state='tutorial';if(typeof pointer!=='undefined')pointer=null;index=0;root=document.createElement('section');root.id='ft-guide';root.setAttribute('role','dialog');root.setAttribute('aria-modal','true');root.setAttribute('aria-label','折潮新手教學');document.body.append(root);help.style.display='none';render();}
function close(action){if(!root)return;cancelAnimationFrame(raf);root.remove();root=null;help.style.display='';if(typeof state!=='undefined'&&state==='tutorial')state=previousState;if(action==='practice'&&typeof start==='function')start('practice');if(action==='endless'&&typeof start==='function')start('endless');}
function render(){cancelAnimationFrame(raf);root.innerHTML=`<div class="ft-card"><div class="ft-top"><span>新手教學 ${index+1} / ${steps.length}</span><button class="ft-skip" type="button">跳過教學</button></div><div class="ft-progress"><div style="width:${(index+1)/steps.length*100}%"></div></div><h2>${steps[index][0]}</h2><canvas width="800" height="350" aria-label="操作方式動畫示意"></canvas><p>${steps[index][1]}</p><div class="ft-buttons"><button class="ft-prev" type="button" ${index===0?'disabled':''}>上一步</button><button class="ft-next" type="button">${index===steps.length-1?'開始練習':'下一步'}</button>${index===steps.length-1?'<button class="ft-direct" type="button">直接挑戰</button>':''}</div><div class="ft-note">上方為動畫示意，不會扣血。這份教學會在每次重新載入網站時出現；按「操作教學」也能重看。</div></div>`;
root.querySelector('.ft-skip').onclick=()=>close();root.querySelector('.ft-prev').onclick=()=>{if(index>0){index--;render()}};root.querySelector('.ft-next').onclick=()=>{if(index<steps.length-1){index++;render()}else close('practice')};const direct=root.querySelector('.ft-direct');if(direct)direct.onclick=()=>close('endless');cv=root.querySelector('canvas');c=cv.getContext('2d');openedAt=performance.now();animate(openedAt);root.querySelector('.ft-next').focus();}
function dot(x,y,r,color){c.beginPath();c.arc(x,y,r,0,Math.PI*2);c.fillStyle=color;c.fill()}
function line(x,y,x2,y2,col,width=6){c.beginPath();c.moveTo(x,y);c.lineTo(x2,y2);c.strokeStyle=col;c.lineWidth=width;c.lineCap='round';c.stroke()}
function label(text,x,y,color='#a7bfb3'){c.fillStyle=color;c.font='23px system-ui';c.textAlign='center';c.fillText(text,x,y)}
function animate(now){if(!root)return;const t=(now-openedAt)/1000;c.clearRect(0,0,800,350);c.fillStyle='#081916';c.fillRect(0,0,800,350);const phase=(t%4)/4;
if(index===0||index===1){line(130,175,610,175,'#f0a7b555',3);dot(130+phase*480,175,12,'#fff5e1');dot(620,175,20,'#8fd0c8');label('自主移動的脈衝',235,255);label('孢子',620,255)}
else if(index===2){line(470,85,470,265,'#e7d3a1');const x=phase<.5?150+phase*600:450-(phase-.5)*600;dot(x,175,12,'#fff5e1');dot(470,175,24,'#e7d3a133');label('點一下，放下折光',400,320)}
else if(index===3){const q=Math.min(1,phase*2.5);line(350,235,350+q*130,235-q*130,'#e7d3a1');dot(350+q*130,235-q*130,16,'#f0a7b5');if(phase>.45){const p=(phase-.45)/.55;if(p<.5)dot(160+p*480,175,12,'#fff5e1');else dot(400,175-(p-.5)*240,12,'#fff5e1')}label('按住 → 拖曳 → 放開',400,320)}
else if(index===4){for(let i=0;i<5;i++){c.globalAlpha=Math.max(.12,1-((phase+i*.16)%1));line(160+i*115,115,195+i*115,235,'#e7d3a1')}c.globalAlpha=1;label('最多五片，會逐漸消失',400,310)}
else if(index===5){c.beginPath();c.arc(400,175,120,0,Math.PI*2);c.strokeStyle='#e7d3a166';c.lineWidth=3;c.stroke();dot(400+Math.sin(t*1.4)*107,175,12,'#fff5e1');label('開場護航 3 秒',400,45);label('撞牆會扣潮息',400,330,'#f0a7b5')}
else if(index===6){const colors=['#8fd0c8','#e7d3a1','#8fbae4','#f0a7b5','#c9a5ff'];colors.forEach((v,i)=>dot(170+i*115,100+Math.sin(t+i)*13,17,v));dot(400,220,36,'#d8ae68');label('潮核',400,294);label('多種孢子與潮間強化',400,40)}
else{dot(400,145,18,'#fff5e1');line(320,205,480,205,'#e7d3a1');label('練習不扣潮息，放心試',400,290)}
raf=requestAnimationFrame(animate)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',open,{once:true});else open();
})();
