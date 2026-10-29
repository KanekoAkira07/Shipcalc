/* Prueba exhaustiva del motor: node tools/test_all.js */
global.window={SC:{origins:{},fuel:{},demand:{}}};
var base=__dirname+'/../data/';
['japon.js','corea.js','china.js','destinos.js','motor.js'].forEach(function(f){require(base+f);});
var SC=window.SC,fail=0,checks=0;
function bad(msg){fail++;if(fail<60)console.log('FAIL',msg);}
var W=[0.001,0.05,0.1,0.101,0.25,0.5,0.75,1,1.2,1.5,2,2.01,2.5,3,4,4.5,5,7,10,15,19.6,20,20.4,20.6,25,29.9,30,30.1,31,40,45,60,70,70.5,71,85,99,99.9,100];
var DATES=['2026-10-29','2026-11-05','2027-01-31','2027-02-01','2027-03-01'];
var dests=Object.keys(SC.dest);
var stat={};
Object.keys(SC.origins).forEach(function(o){
 SC.origins[o].services.forEach(function(s){
  dests.forEach(function(d){
   DATES.forEach(function(dt){
    var prev=null;
    W.forEach(function(w){
     checks++;
     var r=SC.quote(o,s,d,{kg:w,date:dt});
     var k=o+'|'+s.id+'|'+r.status;stat[k]=(stat[k]||0)+1;
     if(r.status==='ok'){
       ['base','extra','demand','fuel','total'].forEach(function(f){if(typeof r[f]!=='number'||!isFinite(r[f])||r[f]<0)bad(o+' '+s.id+' '+d+' '+w+' '+dt+' '+f+'='+r[f]);});
       if(prev&&prev.status==='ok'&&r.total+1e-6<prev.total&&r.pkgs===prev.pkgs&&!(s.perKgFrom&&w>20))bad('non-monotonic '+o+' '+s.id+' '+d+' '+dt+' '+prev.w+'kg='+prev.total.toFixed(0)+' > '+w+'kg='+r.total.toFixed(0));
       if(r.perPkgKg>r.maxKg+1e-9)bad('per-pkg over max '+s.id+' '+d+' '+w);
     }
     prev={status:r.status,total:r.total,w:w,pkgs:r.pkgs};
    });
   });
  });
 });
});
/* Aduanas: todas las combinaciones */
var fxr={USD:1,EUR:0.897,GBP:0.752,CAD:1.4,AUD:1.42,MXN:18.65,ARS:1538.47,COP:3146.9,CLP:984.88,PEN:3.45,UYU:40.18,PYG:5808.85,BOB:12,DOP:60.82,GTQ:7.64,CRC:454.55,JPY:157.91,KRW:1340.24,CNY:6.68};
var fx=function(a,f,t){return a/fxr[f]*fxr[t];};
var VALS=[1,20,49,51,100,149,151,199,201,399,401,799,801,999,1001,2001,3001];
dests.forEach(function(d){
 SC.CATS.forEach(function(cat){
  ['postal','courier'].forEach(function(ch){
   VALS.forEach(function(usd){
    [0.5,3.9,4.1,25].forEach(function(kg){
     checks++;
     var D=SC.dest[d],goods=fx(usd,'USD',D.cur),ship=fx(20,'USD',D.cur);
     var ctx={goods:goods,ship:ship,cat:cat.id,origin:'JP',channel:ch,kg:kg,date:'2026-10-29',
      in:function(cur,a){return fx(a,D.cur,cur);},fromEUR:function(a){return fx(a,'EUR',D.cur);},fromUSD:function(a){return fx(a,'USD',D.cur);},fromCAD:function(a){return fx(a,'CAD',D.cur);},fromGBP:function(a){return fx(a,'GBP',D.cur);}};
     var r=D.customs(ctx);
     if(!r||!r.lines||!r.notes)bad('customs shape '+d);
     r.lines.forEach(function(l){if(!isFinite(l.amt)||l.amt<0)bad('customs amt '+d+' '+cat.id+' '+usd+' '+l.es+'='+l.amt);if(!l.es||!l.en)bad('label '+d);});
     r.notes.forEach(function(n){if(!n.es||!n.en)bad('note '+d);});
    });
   });
  });
 });
 if(!D_ok(d))bad('dest meta '+d);
});
function D_ok(d){var D=SC.dest[d];return D.name_es&&D.name_en&&D.cur&&D.sym&&D.region&&D.platforms&&D.platforms.length&&fxr[D.cur];}

/* ---------- Maletas: precios nunca por debajo del coste de Yamato (tarifa general, 29-10-2026) ---------- */
require(base+'maletas.js');
var B=window.SC_BAGS;
/* Coste Yamato por par de zonas: [100 cm, 140 cm, 160 cm, 180 cm] (Pequeña, Mediana, Grande, Especial) */
var Y={KK:[1530,2630,3020,3680],KW:[1650,2780,3160,4480],GK:[1790,2930,3320,4900],HK:[2050,3250,3630,5220],KQ:[2050,3250,3630,5220],
 CK:[1530,2630,3020,3680],HW:[2510,3810,4180,6820],CW:[1530,2630,3020,3680],GW:[1530,2630,3020,3680],QW:[1650,2780,3160,4480],
 CH:[2200,3440,3820,6460],CQ:[1790,2930,3320,4900]};
var REP={K:['tokyo','NRT'],W:['osaka','KIX'],C:['nagoya','NGO'],G:['hiroshima'],Q:['fukuoka','FUK'],H:['sapporo','CTS']};
var SZ=['s','m','l','x'];
Object.keys(Y).forEach(function(pair){
 var z1=pair[0],z2=pair[1];
 [[z1,z2],[z2,z1]].forEach(function(zz){
  REP[zz[0]].forEach(function(a){REP[zz[1]].forEach(function(b){
   if(B.place(a).air)return; /* la recogida siempre es en ciudad en esta prueba */
   SZ.forEach(function(k,i){
    checks++;var bags={s:0,m:0,l:0,x:0};bags[k]=1;
    var q=B.quote(a,b,bags);
    if(q.isQuote)return;
    var cost=Y[pair][i]+(q.toAir?660:0);
    if(q.total<cost)bad('maletas '+a+'→'+b+' '+k+': precio '+q.total+' < coste Yamato '+cost);
   });
  });});
 });
});
/* Casos concretos */
function T2(a,b,bags,exp,quote){checks++;var q=B.quote(a,b,bags);if(q.total!==exp||q.isQuote!==!!quote)bad('maletas '+a+'→'+b+' '+JSON.stringify(bags)+' = '+q.total+(q.isQuote?' (a confirmar)':'')+', esperado '+exp);}
T2('tokyo','kyoto',{s:1,m:1,l:1,x:0},10099);
T2('kyoto','KIX',{l:1},5639);
T2('tokyo','sapporo',{l:1},5939);
T2('osaka','sapporo',{l:1},6939);
T2('hiroshima','sapporo',{l:1},4939,true);
T2('tokyo','okinawa',{l:1},4939,true);
T2('tokyo','other',{s:2},4180,true);
T2('tokyo','kyoto',{s:0,m:0,l:0,x:0},0);
T2('tokyo','kyoto',{l:99},4939*B.CFG.maxBags);
checks++;if(B.quote('','kyoto',{l:1}).isQuote)bad('maletas: sin recogida no debe salir "a confirmar"');
console.log('checks',checks,'fails',fail);
var keys=Object.keys(stat).sort();var out={};keys.forEach(function(k){var p=k.split('|');out[p[0]+' '+p[1]]=(out[p[0]+' '+p[1]]||'')+' '+p[2]+':'+stat[k];});
for(var k in out)console.log(k.padEnd(14),out[k]);
process.exit(fail?1:0);
