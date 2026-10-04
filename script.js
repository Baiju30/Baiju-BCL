const trackingData = {
  BCL1024:{status:'IN TRANSIT',route:'Ahmedabad → Mumbai',temp:'3.4°C',eta:'5h 20m',vehicle:'REEFER-18',driver:'On route'},
  BCL2048:{status:'AT COLD STORE',route:'Vadodara Cold Store → Pune',temp:'4.1°C',eta:'Tomorrow · 08:30',vehicle:'REEFER-07',driver:'Docked'},
  BCL3090:{status:'OUT FOR DELIVERY',route:'Mumbai Hub → Thane',temp:'2.6°C',eta:'48 min',vehicle:'REEFER-21',driver:'Last-mile run'},
  BCL4001:{status:'DELIVERED',route:'Nashik → Mumbai',temp:'-18.7°C',eta:'Completed',vehicle:'REEFER-11',driver:'Delivered'}
};
const $ = (s) => document.querySelector(s);
const menuBtn = $('#menuBtn');
const nav = $('#nav');
menuBtn?.addEventListener('click',()=>{const open = nav.classList.toggle('open'); menuBtn.setAttribute('aria-expanded',open?'true':'false');});
nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));

function renderTracking(id){
  const key=(id||'').trim().toUpperCase();
  const d=trackingData[key];
  const card=$('#trackingResult');
  if(!d){card.innerHTML='<div class="status-top"><span class="status-pill" style="background:#fff1f1;color:#aa3131">NOT FOUND</span><span class="order">'+(key||'—')+'</span></div><h3>Shipment number not found</h3><p style="color:#b9d4e6;margin:0">Try BCL1024, BCL2048, BCL3090 or BCL4001.</p>';return;}
  card.innerHTML=`<div class="status-top"><span class="status-pill">${d.status}</span><span class="order">${key}</span></div><h3>${d.route}</h3><div class="route-progress"><span class="dot active"></span><span class="line fill"></span><span class="dot active"></span><span class="line ${d.status==='DELIVERED'?'fill':''}"></span><span class="dot ${d.status==='DELIVERED'?'active':''}"></span></div><div class="route-labels"><span>Origin</span><span>Hub</span><span>Destination</span></div><div class="track-metrics"><div><span>Temperature</span><b>${d.temp}</b></div><div><span>ETA</span><b>${d.eta}</b></div><div><span>Vehicle</span><b>${d.vehicle}</b></div><div><span>Driver status</span><b>${d.driver}</b></div></div>`;
}
$('#trackBtn')?.addEventListener('click',()=>renderTracking($('#trackingInput').value));
$('#trackingInput')?.addEventListener('keydown',(e)=>{if(e.key==='Enter'){e.preventDefault();renderTracking(e.currentTarget.value)}});
document.querySelectorAll('[data-track]').forEach(b=>b.addEventListener('click',()=>{$('#trackingInput').value=b.dataset.track;renderTracking(b.dataset.track)}));

$('#quoteForm')?.addEventListener('submit',(e)=>{e.preventDefault();
  const distance=Number($('#distance').value)||0, weight=Number($('#weight').value)||0;
  const service=$('#serviceType').value, load=$('#loadType').value;
  const base={transport:8500,storage:4500,distribution:6500,monitoring:1800}[service];
  const loadFactor={chilled:1,frozen:1.18,pharma:1.25,produce:1.05}[load];
  const amount=Math.max(1800,Math.round((base + distance*9 + weight*.85)*loadFactor/50)*50);
  $('#estimate').innerHTML=`Estimated cost: <strong>₹${amount.toLocaleString('en-IN')}</strong>`;
});
$('#contactForm')?.addEventListener('submit',(e)=>{e.preventDefault();$('#contactMsg').textContent='Thanks. Your enquiry has been captured for this demo website.';e.target.reset();});

const chartData=[91,92,93,94,95,94,96,95];
const chart=$('#chart');
chart.innerHTML=chartData.map((v,i)=>`<div class="bar-wrap"><span class="bar-value">${v}%</span><div class="bar" style="height:${Math.max(22,(v-85)*10)}px"></div><span class="bar-label">W${i+1}</span></div>`).join('');

const observer=new IntersectionObserver(entries=>entries.forEach(e=>e.isIntersecting&&e.target.classList.add('visible')),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

const links=[...document.querySelectorAll('.nav a[href^="#"]')];
const sections=links.map(a=>document.querySelector(a.getAttribute('href'))).filter(Boolean);
const secObs=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){links.forEach(l=>l.classList.remove('active'));const match=links.find(l=>l.getAttribute('href')==='#'+entry.target.id);match?.classList.add('active')}}),{rootMargin:'-30% 0px -55% 0px'});
sections.forEach(s=>secObs.observe(s));
