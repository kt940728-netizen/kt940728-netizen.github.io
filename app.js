let works=[];
fetch('/works.json').then(r=>r.json()).then(d=>works=d).catch(()=>{});
const reel=document.querySelector('#reel'),sound=document.querySelector('#sound');
sound.addEventListener('click',()=>{reel.muted=!reel.muted;if(!reel.muted){reel.currentTime=0;reel.play().catch(()=>{});}sound.setAttribute('aria-pressed',String(!reel.muted));sound.textContent=reel.muted?'소리 켜기':'소리 끄기';});
if(matchMedia('(prefers-reduced-motion:reduce)').matches){reel.removeAttribute('autoplay');reel.pause();}

// 썸네일에 마우스를 올리면 무음 미리보기
const hover=matchMedia('(hover:hover)').matches;
document.querySelectorAll('.thumb').forEach(t=>{
 const v=t.querySelector('video');
 if(hover){
  t.addEventListener('mouseenter',()=>{if(!v.src)v.src=v.dataset.src;v.play().then(()=>t.classList.add('on')).catch(()=>{});});
  t.addEventListener('mouseleave',()=>{v.pause();t.classList.remove('on');});
 }
 t.addEventListener('click',()=>open(t.dataset.id,t));
});

const dlg=document.querySelector('#player'),pv=document.querySelector('#pv');let back;
function open(id,from){
 const w=works.find(x=>x.id===id);if(!w)return;back=from;
 document.querySelector('#pt').textContent=w.title;
 document.querySelector('#pr').textContent='담당: '+w.role;
 document.querySelector('#pn').textContent=w.audio?'실제 작업의 공개용 영상입니다.':'공개용 발췌본입니다. 음성은 포함하지 않았습니다.';
 pv.style.aspectRatio=w.category==='shorts'?'9/16':'16/9';pv.style.maxWidth=w.category==='shorts'?'420px':'';pv.style.margin=w.category==='shorts'?'0 auto':'';
 pv.src='/'+w.video;pv.poster='/'+w.poster;dlg.showModal();pv.play().catch(()=>{});
 reel.pause();
}
document.querySelector('#close').addEventListener('click',()=>dlg.close());
dlg.addEventListener('click',e=>{if(e.target===dlg)dlg.close();});
dlg.addEventListener('close',()=>{pv.pause();pv.removeAttribute('src');pv.load();if(!matchMedia('(prefers-reduced-motion:reduce)').matches)reel.play().catch(()=>{});back?.focus();});

// 첫 화면을 지나면 떠 있는 문의 버튼
const fl=document.querySelector('.float');
new IntersectionObserver(([e])=>fl.classList.toggle('show',!e.isIntersecting)).observe(document.querySelector('.hero'));

// 예전 링크(/shorts/ 등)로 들어오면 해당 분야로 이동
const route=location.pathname.split('/').filter(Boolean)[0];
if(['shorts','longform','promo'].includes(route)&&!location.hash)document.getElementById(route)?.scrollIntoView();

// 편집몬은 연락처 기재 금지: 문의 버튼을 편집몬 프로필로 돌린다
if(new URLSearchParams(location.search).get('source')==='editmon'){
 document.querySelectorAll('a.kakao').forEach(a=>{a.href='https://www.editmon.com/work/resume_detail.html?no=22163';a.removeAttribute('target');if(!a.classList.contains('sm')&&!a.classList.contains('float'))a.textContent='편집몬 프로필로 문의하기';});
}
