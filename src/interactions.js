export function initPortfolio() {
 const cleanups=[];
 const frames=new Set();
 function listen(target,type,fn,options){target.addEventListener(type,fn,options);cleanups.push(()=>target.removeEventListener(type,fn,options));}
 function nextFrame(fn){const id=window.requestAnimationFrame(time=>{frames.delete(id);fn(time);});frames.add(id);return id;}
 let observer;
 const root=document.documentElement;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const button=document.getElementById('motion');
 const hero=document.getElementById('home');
 const stage=document.querySelector('.story-stage');
 const visual=document.querySelector('.story-visual');
 const viewer=document.getElementById('akhil-model');
 const fallback=document.querySelector('.model-fallback');
 const reset=document.getElementById('reset-model');
 const play=document.getElementById('play');
 const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
 let paused=reduced.matches,pending=false,portraitProgress=0,ready=Boolean(viewer.loaded),scrollOwnsCamera=true,lastCamera='';
 function rotation(t){return t<.25? -25+25*t/.25 : t<.9?360*(t-.25)/.65:360;}
 function setCamera(t){
   if(!ready||!scrollOwnsCamera||paused)return;
   const pulse=Math.sin(Math.PI*t);
   const orbit=`${rotation(t).toFixed(2)}deg ${(85-8*Math.sin(t*Math.PI*2)).toFixed(2)}deg ${(120-25*pulse).toFixed(2)}%`;
   if(orbit!==lastCamera){viewer.cameraOrbit=orbit;lastCamera=orbit;}
 }
 function update(){
   pending=false;
   const total=root.scrollHeight-innerHeight;
   root.style.setProperty('--progress',total>0?scrollY/total:0);
   if(paused)return;
   const top=parseFloat(getComputedStyle(visual).top)||85;
   const travel=Math.max(1,stage.offsetHeight-visual.offsetHeight);
   const target=clamp((top-stage.getBoundingClientRect().top)/travel,0,1);
   portraitProgress+=(target-portraitProgress)*.16;
   const t=portraitProgress;
   root.style.setProperty('--portrait-progress',t);
   root.style.setProperty('--ring-turn',(-24+180*t)+'deg');
   root.style.setProperty('--hero-scroll',clamp(scrollY/hero.offsetHeight,0,1));
   root.style.setProperty('--game-turn',clamp((innerHeight/2-play.getBoundingClientRect().top)/play.offsetHeight,-1,1));
   setCamera(t);
   if(Math.abs(target-t)>.0004)queue();
 }
 function queue(){if(!pending){pending=true;nextFrame(update)}}
 function setPause(){
   document.body.classList.toggle('paused',paused);
   button.setAttribute('aria-pressed',String(paused));
   button.textContent=paused?'Resume motion':'Pause motion';
   if(paused&&ready)viewer.jumpCameraToGoal();
   queue();
 }
 function resetView(){scrollOwnsCamera=false;lastCamera='';viewer.cameraOrbit='0deg 85deg 115%';if(ready)viewer.jumpCameraToGoal();}
 if('IntersectionObserver'in window){document.body.classList.add('js-motion');observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}),{threshold:.12});document.querySelectorAll('.reveal').forEach(e=>observer.observe(e))}
 listen(button,'click',()=>{paused=!paused;setPause()});
 listen(reduced,'change',e=>{paused=e.matches;setPause()});
 listen(window,'scroll',()=>{scrollOwnsCamera=true;queue()},{passive:true});
 listen(window,'resize',queue);
 listen(hero,'pointermove',e=>{if(paused||e.pointerType==='touch')return;const r=hero.getBoundingClientRect();root.style.setProperty('--mx',clamp((e.clientX-r.left)/r.width*2-1,-1,1));root.style.setProperty('--my',clamp((e.clientY-r.top)/r.height*2-1,-1,1))});
 listen(hero,'pointerleave',()=>{root.style.setProperty('--mx',0);root.style.setProperty('--my',0)});
 listen(viewer,'pointerdown',()=>{scrollOwnsCamera=false});
 listen(viewer,'keydown',()=>{scrollOwnsCamera=false});
 listen(viewer,'camera-change',e=>{if(e.detail?.source==='user-interaction')scrollOwnsCamera=false;});
 listen(viewer,'load',()=>{ready=true;fallback.hidden=true;viewer.style.visibility='visible';lastCamera='';setCamera(portraitProgress);queue();});
 listen(viewer,'error',()=>{ready=false;viewer.style.visibility='hidden';fallback.hidden=false;});
 listen(reset,'click',resetView);
 listen(document.getElementById('retry-model'),'click',()=>{fallback.hidden=true;viewer.style.visibility='visible';const src=viewer.getAttribute('src');viewer.removeAttribute('src');nextFrame(()=>viewer.setAttribute('src',src));});
 setPause();
 return () => {cleanups.forEach(remove=>remove());frames.forEach(id=>window.cancelAnimationFrame(id));observer?.disconnect();document.body.classList.remove('js-motion','paused');};
}

