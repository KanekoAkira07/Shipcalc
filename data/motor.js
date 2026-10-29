/* =====================================================================
   ShipCalc · MOTOR DE CÁLCULO (sin acceso al DOM: se puede probar en Node)
   Reglas:
   · Tablas "hasta X kg": se cobra el primer tramo cuyo límite es >= peso.
   · Peso de cobro = max(real, volumétrico) cuando el servicio usa volumétrico.
   · Correo (split:true): si el peso supera el máximo por paquete, se divide
     en N paquetes iguales (N = ceil(peso / máximo)) y se suman.
   · Couriers: por encima de la tabla, kg redondeado hacia arriba × tarifa/kg
     (o 30 kg + kg extra, según la regla de cada courier).
   · Combustible y recargo por demanda según la fecha de envío.
   ===================================================================== */
(function(SC){
'use strict';
var EPS=1e-9;
function r2(x){return Math.round(x*100)/100;}
function esn(x){return String(x).replace('.',',');}
function today(){var d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
SC.today=today;

/* Tabla de precios vigente para una fecha */
function periodFor(svc,date){
  var ps=svc.periods||[];
  for(var i=0;i<ps.length;i++){
    var p=ps[i];
    if((!p.from||date>=p.from)&&(!p.until||date<=p.until))return p;
  }
  return ps.length?ps[ps.length-1]:null;
}
SC.periodFor=periodFor;

/* Precio "hasta X kg" (null si el peso supera la tabla) */
function lookup(tbl,w){
  if(!tbl||!tbl.length)return null;
  for(var i=0;i<tbl.length;i++){if(w<=tbl[i][0]+EPS)return {kg:tbl[i][0],price:tbl[i][1]};}
  return null;
}
SC.lookup=lookup;

/* Recargo de combustible vigente: {pct, stale} */
function fuelFor(key,date){
  var s=SC.fuel[key];if(!s||!s.length)return {pct:0,stale:false,missing:true};
  var cur=null;
  for(var i=0;i<s.length;i++){if(date>=s[i].from)cur=s[i];}
  if(!cur)return {pct:s[0].pct,stale:true};
  var last=s[s.length-1];
  var stale=(cur===last&&!!last.until&&date>last.until);
  return {pct:cur.pct,stale:stale,from:cur.from};
}
SC.fuelFor=fuelFor;

/* Recargo por demanda vigente para una región */
function demandFor(key,region,date){
  var s=SC.demand&&SC.demand[key];if(!s)return null;
  for(var i=0;i<s.length;i++){
    var p=s[i];
    if(date>=p.from&&(!p.until||date<=p.until)){
      var pk=p.perKg[region];if(pk==null)return null;
      return {perKg:pk,min:p.min||0,fuelApplies:!!p.fuelApplies,until:p.until||null};
    }
  }
  return null;
}
SC.demandFor=demandFor;

function svcDays(svc,dest){return typeof svc.days==='function'?svc.days(dest):svc.days;}
SC.svcDays=svcDays;

/* Precio de un paquete de peso w (kg) en una zona, con las reglas del servicio */
function priceOne(svc,tbl,zone,w){
  var hit=lookup(tbl,w);
  if(hit)return {base:hit.price,bracketKg:hit.kg};
  var lastKg=tbl[tbl.length-1][0];
  if(svc.perKgFrom&&w>lastKg){
    var kg=Math.ceil(w-EPS);
    if(kg<svc.perKgFrom.at)kg=svc.perKgFrom.at;
    var tiers=svc.perKgFrom.tiers,rates=svc.perKgFrom.rates[zone],idx=tiers.length-1;
    for(var i=0;i<tiers.length;i++){if(kg<=tiers[i]){idx=i;break;}}
    return {base:kg*rates[idx],bracketKg:kg,perKg:rates[idx]};
  }
  if(svc.over&&w>svc.over.at){
    var kg2=Math.ceil(w-EPS),pk=svc.over.perKg(zone,kg2);
    if(svc.over.mode==='mult')return {base:kg2*pk,bracketKg:kg2,perKg:pk,estimate:!!svc.over.estimate};
    var p30=lookup(tbl,svc.over.at);
    return {base:p30.price+(kg2-svc.over.at)*pk,bracketKg:kg2,perKg:pk,estimate:!!svc.over.estimate};
  }
  return null;
}

/* Cotización completa de un servicio.
   opts: {kg (peso real total), dims:{l,w,h} (cm, opcional), date:'YYYY-MM-DD'} */
SC.quote=function(origin,svc,dest,opts){
  var date=opts.date||today(),kg=opts.kg,res={svc:svc,status:'ok',notes:[],estimate:false};
  if(svc.suspended){res.status='suspended';return res;}
  if(svc.unavailable&&svc.unavailable(dest)){res.status='unavailable';return res;}
  if(svc.quoteOnly||(svc.quoteFor&&svc.quoteFor(dest))){res.status='quote';return res;}
  var zone=svc.zone(dest);
  if(!zone){res.status='unavailable';return res;}
  var per=periodFor(svc,date);
  var tbl=per&&per.zones[zone];
  if(!tbl){res.status='unavailable';return res;}
  var maxKg=svc.maxKg(dest);
  /* peso volumétrico */
  var volKg=0;
  if(svc.volDiv&&opts.dims&&opts.dims.l>0&&opts.dims.w>0&&opts.dims.h>0){
    volKg=opts.dims.l*opts.dims.w*opts.dims.h/svc.volDiv;
  }
  var billKg=Math.max(kg,volKg);
  res.volKg=volKg;res.billKg=billKg;
  var pkgs=1,perKg=billKg;
  if(billKg>maxKg+EPS){
    if(svc.split){pkgs=Math.ceil(billKg/maxKg-EPS);perKg=billKg/pkgs;}
    else{res.status='overmax';res.maxKg=maxKg;return res;}
  }
  var one=priceOne(svc,tbl,zone,perKg);
  if(!one){res.status='overmax';res.maxKg=maxKg;return res;}
  if(one.estimate)res.estimate=true;
  res.pkgs=pkgs;res.perPkgKg=perKg;res.bracketKg=one.bracketKg;res.maxKg=maxKg;res.zone=zone;
  res.base=one.base*pkgs;
  /* recargo propio del operador (p. ej. 추가운송수수료 de Korea Post) */
  res.extra=0;
  if(svc.extra){var ex=svc.extra(dest,one.bracketKg);res.extra=(ex.amt||0)*pkgs;res.extraLabel={es:ex.es,en:ex.en};}
  /* recargo por demanda */
  res.demand=0;
  var region=SC.dest[dest]&&SC.dest[dest].region;
  if(svc.demand){
    var dm=demandFor(svc.demand,region,date);
    if(dm){res.demand=Math.max(dm.perKg*one.bracketKg*pkgs,dm.min);res.demandInfo=dm;}
  }
  /* combustible */
  res.fuel=0;
  if(svc.fuel){
    var f=fuelFor(svc.fuel,date);
    var fuelBase=res.base+((res.demandInfo&&res.demandInfo.fuelApplies)?res.demand:0);
    res.fuelPct=f.pct;res.fuelStale=f.stale;res.fuel=fuelBase*f.pct/100;
  }
  res.total=res.base+res.extra+res.demand+res.fuel;
  /* Aviso: en tarifas por tramos de kg, a veces el tramo siguiente sale más barato */
  if(svc.perKgFrom&&pkgs===1&&one.perKg){
    var tiers=svc.perKgFrom.tiers;
    for(var ti=0;ti<tiers.length-1;ti++){
      if(one.bracketKg<=tiers[ti]){
        var nk=tiers[ti]+1,alt=priceOne(svc,tbl,zone,nk);
        if(alt&&alt.base<one.base-0.5)res.notes.push({es:'Truco: por tramos de peso, declarar '+nk+' kg costaría menos en flete base ('+Math.round(alt.base).toLocaleString('es')+' vs '+Math.round(one.base).toLocaleString('es')+').',en:'Tip: due to weight breaks, '+nk+' kg would cost less in base freight ('+Math.round(alt.base).toLocaleString('en')+' vs '+Math.round(one.base).toLocaleString('en')+').'});
        break;
      }
    }
  }
  if(res.estimate)res.notes.push({es:'Más de '+(svc.over?svc.over.at:30)+' kg: el operador no detalla la fórmula en su guía, así que es una estimación. Confirma en su calculadora oficial.',en:'Over '+(svc.over?svc.over.at:30)+' kg: the carrier\'s guide does not detail the formula, so this is an estimate. Confirm in its official calculator.'});
  if(svc.pieceKg&&billKg>svc.pieceKg)res.notes.push({es:'Se enviaría en varias cajas (máx. '+svc.pieceKg+' kg por caja); el precio es por el peso total.',en:'It would ship as several boxes (max '+svc.pieceKg+' kg each); price is for the total weight.'});
  if(pkgs>1)res.notes.push({es:'Supera el máximo de '+maxKg+' kg por paquete: se calcula como '+pkgs+' paquetes de '+esn(Math.round(perKg*1000)/1000)+' kg.',en:'Over the '+maxKg+' kg per-parcel limit: priced as '+pkgs+' parcels of '+(Math.round(perKg*1000)/1000)+' kg.'});
  if(volKg>kg+EPS)res.notes.push({es:'Se cobra por peso volumétrico ('+esn(Math.round(volKg*100)/100)+' kg).',en:'Charged by volumetric weight ('+(Math.round(volKg*100)/100)+' kg).'});
  if(res.fuelStale)res.notes.push({es:'Recargo de combustible pendiente de actualizar: usamos el último publicado ('+esn(res.fuelPct)+' %).',en:'Fuel surcharge pending update: using the last published value ('+res.fuelPct+'%).'});
  return res;
};

/* Conversión de divisas con tabla de tipos base→X */
SC.makeFx=function(rates,base){
  return function(amount,from,to){
    if(from===to)return amount;
    var rf=(from===base)?1:rates[from],rt=(to===base)?1:rates[to];
    if(!rf||!rt)return NaN;
    return amount/rf*rt;
  };
};

/* Cálculo total: envío + aduana + comisión */
SC.calcTotal=function(p){
  /* p: {origin,svcRes,dest,goodsOrig,fx,cat,kg,date,sellPrice,platform} */
  var D=SC.dest[p.dest],oc=SC.origins[p.origin].currency,fx=p.fx;
  var goods=fx(p.goodsOrig,oc,D.cur),ship=fx(p.svcRes.total,oc,D.cur);
  var ctx={goods:goods,ship:ship,cat:p.cat,origin:p.origin,channel:p.svcRes.svc.courier?'courier':'postal',kg:p.kg,date:p.date,
    in:function(cur,a){return fx(a,D.cur,cur);},
    fromEUR:function(a){return fx(a,'EUR',D.cur);},fromUSD:function(a){return fx(a,'USD',D.cur);},
    fromCAD:function(a){return fx(a,'CAD',D.cur);},fromGBP:function(a){return fx(a,'GBP',D.cur);}};
  var cu=D.customs(ctx);
  var tax=0;cu.lines.forEach(function(l){tax+=l.amt;});
  var pfee=0;
  if(p.sellPrice>0&&p.platform)pfee=p.sellPrice*p.platform.fee+(p.platform.fixed||0);
  var total=goods+ship+tax+pfee;
  return {goods:goods,ship:ship,customs:cu,tax:tax,pfee:pfee,total:total,
    profit:p.sellPrice>0?p.sellPrice-total:null,cur:D.cur,sym:D.sym};
};
})(window.SC);
