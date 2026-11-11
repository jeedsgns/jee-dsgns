/* ===== JEE.DSGNS — script.js ===== */

/* Portfolio works and categories now live in portfolioData.js (see HOW-TO-ADD-WORKS.md). */
/* TOOLS: only the skills provided. Design tools are plain text labels (no logo images). */
const TOOLS = [
  { n:"Adobe Photoshop", g:"design", d:"Used for digital image editing, photo manipulation, graphic compositions, and visual experimentation." },
  { n:"Adobe Illustrator", g:"design", d:"Used for vector graphics, typography, logos, and scalable design elements." },
  { n:"Blender", g:"design", d:"Used for 3D modeling, three-dimensional visual experimentation, and creative compositions." },
  { n:"Python", g:"code", d:"Knowledge of programming fundamentals and logical problem-solving." },
  { n:"Java",   g:"code", d:"Knowledge of object-oriented programming and software development fundamentals." },
  { n:"C++",    g:"code", d:"Knowledge of programming concepts, logic, and structured problem-solving." },
  { n:"Shopify Website", g:"code", d:"Shopify website design and storefront creation." }
];
/* =============== no need to edit below =============== */
const $ = (s,r=document)=>r.querySelector(s), $$ = (s,r=document)=>[...r.querySelectorAll(s)];
const IMG = "images/portfolio/";
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const pad = n=>String(n).padStart(2,"0");

$("#yr").textContent = new Date().getFullYear();

/* header, progress, active section */
const header = $("#top");
addEventListener("scroll",()=>{
  header.classList.toggle("scrolled",scrollY>40);
  const h = document.documentElement; $("#progress").style.width = (scrollY/(h.scrollHeight-h.clientHeight)*100)+"%";
},{passive:true});
const secs = $$("main section"), links = $$("#menu a");
new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting) links.forEach(a=>a.classList.toggle("active",a.hash==="#"+e.target.id)); }),{rootMargin:"-45% 0px -50% 0px"}).observe && secs.forEach(s=>new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting) links.forEach(a=>a.classList.toggle("active",a.hash==="#"+s.id)); }),{rootMargin:"-45% 0px -50% 0px"}).observe(s));
const rev = new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting){e.target.classList.add("in");rev.unobserve(e.target);} }),{threshold:.08});
$$(".reveal").forEach(el=>rev.observe(el));

/* mobile menu + clock */
const burger=$("#burger"), ov=$("#overlay");
function setMenu(open){ ov.hidden=!open; burger.setAttribute("aria-expanded",open); burger.setAttribute("aria-label",open?"Close menu":"Open menu"); document.body.style.overflow=open?"hidden":""; }
burger.onclick=()=>setMenu(ov.hidden);
$$("a",ov).forEach(a=>a.onclick=()=>setMenu(false));
function tick(){ const d=new Date(); $("#clock").textContent = d.toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric",year:"numeric"})+" · "+d.toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"})+" · Quezon City"; }
tick(); setInterval(tick,30000);

/* cursor */
if(matchMedia("(hover:hover) and (pointer:fine)").matches && !reduced){
  const c=$("#cursor"); document.body.classList.add("cur");
  addEventListener("pointermove",e=>{if(e.pointerType==="touch")return;c.classList.add("on");c.style.transform=`translate3d(${e.clientX}px,${e.clientY}px,0)`;},{passive:true});
  document.addEventListener("pointerover",e=>c.classList.toggle("big",!!e.target.closest("a,button,.work,.chip,.win,.portrait,.commission-dialog")));
}

/* personal photo: shows images/profile/your-photo.jpg; if the file is missing, the framed placeholder stays visible */
(()=>{ const fig=$("#portrait"); if(!fig) return; const img=$("img",fig);
  img.addEventListener("load",()=>fig.classList.add("has-photo")); img.addEventListener("error",()=>fig.classList.remove("has-photo"));
  if(img.complete && img.naturalWidth) fig.classList.add("has-photo"); })();

/* Interactive chrome logo: horizontal movement maps to a full 360-degree turn; touch users can drag. */
(()=>{
  const logo=$("#heroLogo"); if(!logo) return;
  let yaw=0,pitch=0,dragging=false,lastX=0,lastY=0,pointerId=null;
  const reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;
  function paint(){logo.style.transform=`rotateX(${pitch}deg) rotateY(${yaw}deg)`;logo.dataset.yaw=String(Math.round((yaw%360+360)%360));}
  function reset(){if(dragging)return;logo.style.transition="transform .65s cubic-bezier(.2,.7,.2,1)";yaw=0;pitch=0;paint();setTimeout(()=>logo.style.removeProperty("transition"),700)}
  logo.addEventListener("pointerdown",e=>{dragging=true;pointerId=e.pointerId;lastX=e.clientX;lastY=e.clientY;logo.style.transition="none";logo.setPointerCapture(e.pointerId);logo.style.cursor="grabbing";e.preventDefault()});
  logo.addEventListener("pointermove",e=>{
    if(dragging&&e.pointerId===pointerId){yaw+=(e.clientX-lastX)*.85;pitch=Math.max(-24,Math.min(24,pitch+(e.clientY-lastY)*-.45));lastX=e.clientX;lastY=e.clientY;paint();return;}
    if(e.pointerType==="mouse"&&!reduced){const r=logo.getBoundingClientRect();yaw=((e.clientX-r.left)/r.width)*360;pitch=((.5-(e.clientY-r.top)/r.height)*18);logo.style.transition="transform .12s ease-out";paint();}
  });
  function end(e){if(!dragging||e.pointerId!==pointerId)return;dragging=false;pointerId=null;logo.style.cursor="grab";if(logo.hasPointerCapture(e.pointerId))logo.releasePointerCapture(e.pointerId);}
  logo.addEventListener("pointerup",end);logo.addEventListener("pointercancel",end);logo.addEventListener("pointerleave",()=>{if(!dragging)reset()});
  logo.addEventListener("keydown",e=>{if(e.key==="ArrowLeft"||e.key==="ArrowRight"){e.preventDefault();yaw+=(e.key==="ArrowRight"?45:-45);logo.style.transition="transform .35s ease-out";paint();}});
})();

/* Portfolio poster opens a book-like commission page. The cover transition also reverses before closing. */
(()=>{
  const poster=$("#portrait"),dialog=$("#commissionBook"),book=$("#commissionBookObject");if(!poster||!dialog||!book)return;
  const motion=matchMedia("(prefers-reduced-motion: reduce)").matches,turnMs=motion?80:1050;
  const cursor=$("#cursor"),cursorHome=cursor&&cursor.parentElement;
  function openBook(){if(dialog.open)return;dialog.showModal();if(cursor)dialog.append(cursor);poster.setAttribute("aria-expanded","true");requestAnimationFrame(()=>requestAnimationFrame(()=>book.classList.add("open")));}
  function closeBook(after){if(!dialog.open)return;poster.setAttribute("aria-expanded","false");book.classList.remove("open");setTimeout(()=>{dialog.close();if(typeof after==="function")after();},turnMs);}
  dialog.addEventListener("close",()=>{if(cursor&&cursorHome)cursorHome.append(cursor);});
  poster.addEventListener("click",openBook);
  poster.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();openBook();}});
  $(".commission-x",dialog).addEventListener("click",()=>closeBook());
  $(".book-close",dialog).addEventListener("click",()=>closeBook());
  dialog.addEventListener("cancel",e=>{e.preventDefault();closeBook()});
  dialog.addEventListener("click",e=>{if(e.target===dialog)closeBook()});
  $("#commissionContact",dialog).addEventListener("click",e=>{e.preventDefault();closeBook(()=>$("#contact")?.scrollIntoView({behavior:motion?"auto":"smooth"}));});
})();

/* creative process */
$$("#process li").forEach(li=>$("button",li).onclick=()=>$$("#process li").forEach(o=>{const on=o===li;o.classList.toggle("open",on);$("button",o).setAttribute("aria-expanded",on);}));

/* toolkit + environment */
const info=$("#info");
TOOLS.forEach(t=>{
  const chipsHost=$(t.g==="design"?"#chipsDesign":"#chipsCode");
  if(chipsHost){
    const li=document.createElement("li"), b=document.createElement("button");
    b.className="chip"+(t.g==="design"?" txt":""); b.setAttribute("aria-pressed","false");
    b.innerHTML=(t.g==="design"?"":`<i>${t.n.slice(0,2)}</i>`)+`<span>${t.n}</span>`;
    b.onclick=()=>{$$(".chip").forEach(x=>x.setAttribute("aria-pressed","false"));b.setAttribute("aria-pressed","true");info.innerHTML=`<b>${t.n}</b><p>${t.d}</p>`;};
    li.append(b);chipsHost.append(li);
  }
  const w=document.createElement("article"); w.className="win"; w.tabIndex=0;
  w.innerHTML=`<header><i></i><i></i><i></i><em>${t.g==="design"?"Creative":"Technical"}</em></header><div class="body"><b>${t.n}</b><p>${t.d}</p></div>`;
  $("#env").append(w);
});

/* portfolio: everything is built from portfolioData.js */
const gal=$("#gallery"), fl=$("#filters"), CATS=window.PORTFOLIO_CATEGORIES||[], ITEMS=window.PORTFOLIO_DATA||[];
let cur="all", shown=[], idx=0, lastFocus;
const esc=s=>String(s==null?"":s).replace(/[&<>"]/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[m]));
const catLabel=id=>(CATS.find(c=>c.id===id)||{}).label||id;
[{id:"all",label:"All works"},...CATS].forEach(c=>{
  const b=document.createElement("button"); b.textContent=c.label; b.className=c.id===cur?"on":"";
  b.onclick=()=>{ if(cur===c.id)return; cur=c.id; $$("button",fl).forEach(x=>x.classList.toggle("on",x===b)); gal.classList.add("out"); setTimeout(()=>{render();gal.classList.remove("out");},reduced?0:220); };
  fl.append(b);
});
function render(){
  shown=cur==="all"?ITEMS.slice():ITEMS.filter(w=>w.category===cur); gal.innerHTML="";
  if(!shown.length){ gal.innerHTML='<p class="empty">'+(ITEMS.length?"No works in this category yet.":"No works registered yet. Add images to images/portfolio/ and register them in portfolioData.js (see HOW-TO-ADD-WORKS.md).")+'</p>'; return; }
  shown.forEach((w,i)=>{
    const t=w.title||catLabel(w.category), b=document.createElement("button"); b.className="work";
    b.setAttribute("aria-label","Open "+t+", "+(i+1)+" of "+shown.length); b.style.animationDelay=Math.min(i,12)*50+"ms";
    b.innerHTML=`<div class="frame loading"${w.ratio?` style="aspect-ratio:${esc(w.ratio)}"`:""}><img${w.ratio?' class="cover"':""} loading="lazy" decoding="async" src="${esc(w.src)}" alt="${esc(w.title||catLabel(w.category)+" by JEE.DSGNS")}"><div class="over"><b>${esc(t)}</b><span>${esc(w.description)}</span></div></div><div class="cap"><span>${pad(i+1)} / ${pad(shown.length)}</span><span>${esc(catLabel(w.category))}${w.year?" · "+esc(w.year):""}</span></div>`;
    const img=$("img",b), fr=$(".frame",b); img.onload=()=>fr.classList.remove("loading");
    img.onerror=()=>{fr.classList.remove("loading");fr.innerHTML=`<div class="missing">Image not found<small>${esc(w.src)}</small></div>`;};
    b.onclick=()=>open(i); gal.append(b);
  });
}
render();

/* lightbox */
const lb=$("#lb"), fig=$("#lbFig");
function show(){
  const w=shown[idx], t=w.title||catLabel(w.category);
  fig.style.animation="none"; fig.offsetWidth; fig.style.animation="";
  fig.innerHTML=`<img src="${esc(w.src)}" alt="${esc(t)}"><figcaption>${w.title?`<b>${esc(w.title)}</b>`:""}${w.description?esc(w.description)+"<br>":""}${pad(idx+1)} / ${pad(shown.length)} · ${esc(catLabel(w.category))}${w.year?" · "+esc(w.year):""}</figcaption>`;
  $("img",fig).onerror=function(){this.outerHTML=`<div class="missing">Image not found<small>${esc(w.src)}</small></div>`;};
}
function open(i){lastFocus=document.activeElement;idx=i;lb.hidden=false;document.body.style.overflow="hidden";show();$(".lb-x").focus();}
function close(){lb.hidden=true;document.body.style.overflow="";lastFocus&&lastFocus.focus();}
function step(d){idx=(idx+d+shown.length)%shown.length;show();}
$(".lb-x").onclick=close; $(".prev").onclick=()=>step(-1); $(".next").onclick=()=>step(1);
lb.addEventListener("click",e=>{if(e.target===lb||e.target===fig)close();});
addEventListener("keydown",e=>{
  if(e.key==="Escape"){ if(!lb.hidden)close(); else if(!ov.hidden)setMenu(false); }
  if(lb.hidden)return; if(e.key==="ArrowLeft")step(-1); if(e.key==="ArrowRight")step(1);
});
let sx=0; lb.addEventListener("touchstart",e=>sx=e.touches[0].clientX,{passive:true});
lb.addEventListener("touchend",e=>{const d=e.changedTouches[0].clientX-sx;if(Math.abs(d)>50)step(d<0?1:-1);});

/* contact form: front-end demo only (no backend) */
$("#form").addEventListener("submit",e=>{
  e.preventDefault(); const f=e.target, m=$("#formMsg");
  if(!f.checkValidity()){f.reportValidity();return;}
  m.textContent="This form is a front-end demo and has no server, so nothing was sent. Please email maganojerrooo@gmail.com or message @jjerro_ on Instagram.";
});
