(function(root){
  'use strict';
  const O=root.Oracle;
  const ZODIACS=[
    ['aries','白羊座','♈',321,419],['taurus','金牛座','♉',420,520],['gemini','双子座','♊',521,621],
    ['cancer','巨蟹座','♋',622,722],['leo','狮子座','♌',723,822],['virgo','处女座','♍',823,922],
    ['libra','天秤座','♎',923,1023],['scorpio','天蝎座','♏',1024,1122],['sagittarius','射手座','♐',1123,1221],
    ['capricorn','摩羯座','♑',1222,119],['aquarius','水瓶座','♒',120,218],['pisces','双鱼座','♓',219,320]
  ].map(([id,name,symbol,start,end])=>({id,name,symbol,start,end}));
  const TAGS={
    wood:['gather','prepare'],mine:['gather','explore'],fish:['gather','rest'],
    hunt:['gather','explore','prepare'],thief:['explore','gather','learn'],
    loot:['battle','explore'],open:['explore','rest']
  };
  const GAN_ELEMENT={'甲':'木','乙':'木','丙':'火','丁':'火','戊':'土','己':'土','庚':'金','辛':'金','壬':'水','癸':'水'};
  const HARMONY=['子丑','寅亥','卯戌','辰酉','巳申','午未'];
  const CLASH=['子午','丑未','寅申','卯酉','辰戌','巳亥'];
  function normalizeNickname(s){return String(s||'').normalize('NFKC').trim();}
  // cyrb128: stable 128-bit nickname digest. Not a password or identity mechanism.
  function hashWords(str){let h1=1779033703,h2=3144134277,h3=1013904242,h4=2773480762;for(let i=0;i<str.length;i++){let k=str.charCodeAt(i);h1=h2^Math.imul(h1^k,597399067);h2=h3^Math.imul(h2^k,2869860233);h3=h4^Math.imul(h3^k,951274213);h4=h1^Math.imul(h4^k,2716044179);}h1=Math.imul(h3^(h1>>>18),597399067);h2=Math.imul(h4^(h2>>>22),2869860233);h3=Math.imul(h1^(h3>>>17),951274213);h4=Math.imul(h2^(h4>>>19),2716044179);return [(h1^h2^h3^h4)>>>0,(h2^h1)>>>0,(h3^h1)>>>0,(h4^h1)>>>0];}
  function hash(s){return hashWords(s).map(n=>n.toString(16).padStart(8,'0')).join('');}
  function rng(s){let [a,b,c,d]=hashWords(s);return ()=>{a|=0;b|=0;c|=0;d|=0;let t=(a+b|0)+d|0;d=d+1|0;a=b^b>>>9;b=c+(c<<3)|0;c=(c<<21|c>>>11);c=c+t|0;return (t>>>0)/4294967296;};}
  function zodiacFor(month,day){const n=month*100+day;return ZODIACS.find(z=>z.start>z.end?(n>=z.start||n<=z.end):(n>=z.start&&n<=z.end));}
  function validateProfile(p){const nickname=normalizeNickname(p.nickname);if(!nickname||nickname.length>40)throw new Error('请填写 1–40 个字符的昵称。');const year=Number(p.year);if(!Number.isInteger(year)||year<1901||year>2099)throw new Error('年份请填写 1901–2099 之间的整数。');if(!ZODIACS.some(z=>z.id===p.zodiac))throw new Error('请选择星座。');return {...p,nickname,year};}
  function validateBirth(b){O.parseDate(b.date);if(!/^([01]\d|2[0-3]):[0-5]\d$/.test(b.time))throw new Error('请填写有效的出生时间。');return {date:b.date,time:b.time};}
  function generateBirth(profile){const p=validateProfile(profile),random=rng('birth-v1|'+p.nickname+'|'+p.zodiac+'|'+p.year),dates=[];for(let m=1;m<=12;m++)for(let d=1;d<=new Date(Date.UTC(p.year,m,0)).getUTCDate();d++)if(zodiacFor(m,d).id===p.zodiac)dates.push(`${p.year}-${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}`);const date=dates[Math.floor(random()*dates.length)],minutes=Math.floor(random()*1440);return {date,time:String(Math.floor(minutes/60)).padStart(2,'0')+':'+String(minutes%60).padStart(2,'0')};}
  function birthFor(profile){validateProfile(profile);return profile.birthOverride?validateBirth(profile.birthOverride):generateBirth(profile);}
  function birthChart(profile){const birth=birthFor(profile),[y,m,d]=O.parseDate(birth.date),[h,min]=birth.time.split(':').map(Number),l=root.Solar.fromYmdHms(y,m,d,h,min,0).getLunar(),ec=l.getEightChar();ec.setSect(2);return {birth,pillars:[ec.getYear(),ec.getMonth(),ec.getDay(),ec.getTime()],dayGan:ec.getDayGan(),dayZhi:ec.getDayZhi(),element:GAN_ELEMENT[ec.getDayGan()],hourNumber:l.getTimeZhiIndex()+1,hourName:l.getTimeZhi()+'时',mode:profile.birthOverride?'自定义生辰':'虚构生辰'};}
  function dayKey(date=new Date()){return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;}
  function identityKey(profile){return hash(normalizeNickname(profile.nickname));}
  function contextKey(profile,date){const p=validateProfile(profile),birth=birthFor(p);return JSON.stringify([p.nickname,p.zodiac,p.year,birth.date,birth.time,date]);}
  function tarotSeed(profile){return profile.tarotOverride||hash('tarot-v1|'+normalizeNickname(profile.nickname));}
  function draw(profile,date){O.parseDate(date);const random=rng('draw-v1|'+tarotSeed(profile)+'|'+contextKey(profile,date));const ids=root.Tarot.deck.map(c=>c.id);const cards=[];for(let i=0;i<3;i++){const ix=i+Math.floor(random()*(ids.length-i));[ids[i],ids[ix]]=[ids[ix],ids[i]];const card=root.Tarot.deck[ids[i]],reversed=random()<.5;cards.push({...card,reversed,reading:reversed?card.reverse:card.up});}return cards;}
  function signature(cards){return cards.map(c=>c.id+':'+Number(c.reversed)).join('|');}
  function revealKey(profile,date){return hash(contextKey(profile,date)+'|'+tarotSeed(profile));}
  function matchPair(pairs,a,b){return pairs.some(pair=>pair===a+b||pair===b+a);}
  function daily(profile,date){const natal=birthChart(profile),calendar=O.calculate(date,natal.hourNumber),cards=draw(profile,date);const dayZhi=calendar.dayGanZhi[1];const branch=matchPair(HARMONY,natal.dayZhi,dayZhi)?{name:'六合',text:`日支${natal.dayZhi}与今日${dayZhi}相合，取协同、衔接之象。`}:matchPair(CLASH,natal.dayZhi,dayZhi)?{name:'六冲',text:`日支${natal.dayZhi}与今日${dayZhi}相冲，取调整、检查之象。`}:{name:'平行',text:'本命日支与流日日支未构成本作采用的六合或六冲。'};
    const activities=O.ACTIVITIES.map((a,index)=>{const dayRel=O.relationship(calendar.dayElement,a.element),natalRel=O.relationship(natal.element,a.element),hexRel=O.relationship(calendar.body.element,a.element);const tags=TAGS[a.id];const base=50+dayRel.weight*.3+natalRel.weight*.25+hexRel.weight*.25;const cardParts=cards.map((c,i)=>{const overlap=c.reading.tags.filter(t=>tags.includes(t)).length;const elementBonus=c.element===a.element?1:0;const value=(overlap+elementBonus*.45)*[5,11,-11][i];return {name:c.name,reversed:c.reversed,role:['主运','顺势','留心'][i],value:Math.round(value)};});let branchBonus=branch.name==='六合'&&tags.includes('craft')?4:branch.name==='六冲'?(tags.includes('prepare')?4:tags.includes('battle')?-4:0):0;const score=Math.max(8,Math.min(96,Math.round(base+cardParts.reduce((s,c)=>s+c.value,0)+branchBonus)));return {...a,tags,index,score,dayRel,natalRel,hexRel,base:Math.round(base),cardParts,branchBonus,tieBreak:rng('rank-v1|'+revealKey(profile,date)+'|'+a.id)()};}).sort((a,b)=>b.score-a.score||a.tieBreak-b.tieBreak||a.index-b.index).map((a,i)=>({...a,label:i<3?'宜':i>=4?'忌':'平'}));
    return {date,natal,calendar,cards,branch,activities,good:activities.slice(0,3),bad:activities.slice(-3).reverse(),title:cards[0].reading.key,summary:cards[0].reading.text,key:revealKey(profile,date)};
  }
  function reroll(profile,date,secureRandom=root.crypto){if(!secureRandom?.getRandomValues)throw new Error('浏览器无法生成新的随机种子，请使用现代浏览器。');const old=signature(draw(profile,date));for(let i=0;i<32;i++){const words=new Uint32Array(4);secureRandom.getRandomValues(words);const next={...profile,tarotOverride:Array.from(words,n=>n.toString(16).padStart(8,'0')).join(''),revealed:null};if(signature(draw(next,date))!==old)return next;}throw new Error('未能生成不同的牌组，请稍后再试。');}
  root.Engine={ZODIACS,TAGS,normalizeNickname,hash,rng,zodiacFor,validateProfile,validateBirth,generateBirth,birthFor,birthChart,dayKey,identityKey,contextKey,tarotSeed,draw,signature,revealKey,daily,reroll};
})(typeof window!=='undefined'?window:globalThis);
