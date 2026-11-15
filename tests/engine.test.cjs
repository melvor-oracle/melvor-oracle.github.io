const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.resolve(__dirname,'..');
global.Solar=require(path.join(root,'vendor/lunar.js')).Solar;
for(const f of ['calendar.js','tarot.js','engine.js','art.js'])vm.runInThisContext(fs.readFileSync(path.join(root,'js',f),'utf8'),{filename:f});
const E=global.Engine,O=global.Oracle;
const p={nickname:'月下旅人',zodiac:'capricorn',year:2000};
const date='2026-11-15';
test('activities cover the full announced MI2 roster without introducing MI1-only skills',()=>{
  const expected=['Attack','Strength','Defence','Hitpoints','Ranged','Magic','Slayer','Prayer',
    'Woodcutting','Firemaking','Fishing','Cooking','Mining','Smithing','Fletching','Crafting','Runecrafting',
    'Farming','Ranching','Hunting','Herblore','Thieving','Agility','Beastcrafting','Astrology',
    'Summoning','Construction','Archaeology','Enchantment'];
  assert.deepEqual(O.SKILLS.map(s=>s.en).sort(),expected.sort());
  const covered=new Set(O.ACTIVITIES.flatMap(a=>a.skills));
  assert.deepEqual([...covered].sort(),O.SKILLS.map(s=>s.id).sort());
  for(const [id,name] of [['crafting','制造'],['beastcrafting','兽材工艺'],['agility','灵巧']]){
    assert.equal(O.SKILLS.find(s=>s.id===id).name,name);
    assert.equal(O.ACTIVITIES.find(a=>a.skills.includes(id)).name,name);
  }
});
test('combat uses distinct activity slots instead of separate attack, strength, and defence recommendations',()=>{
  const combat=O.ACTIVITIES.filter(a=>a.kind==='battle');
  assert.deepEqual(combat.map(a=>a.id).sort(),['magic','melee','ranged','slayer']);
  for(const id of ['attack','strength','defence'])assert.deepEqual(combat.filter(a=>a.skills.includes(id)).map(a=>a.id),['melee']);
  for(const id of ['hitpoints','prayer'])assert.ok(combat.every(a=>a.skills.includes(id)));
  for(const skill of O.SKILLS.filter(s=>!['hitpoints','prayer'].includes(s.id)))assert.equal(O.ACTIVITIES.filter(a=>a.skills.includes(skill.id)).length,1);
  assert.deepEqual(O.ACTIVITIES.find(a=>a.id==='bank').skills,[]);
  assert.equal(O.ACTIVITIES.length,26);
});
test('every activity has a reachable filter, original icon, complete advice, and supported tarot tags',()=>{
  const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
  const filters=new Set([...html.matchAll(/data-filter="([^"]+)"/g)].map(m=>m[1]));
  const tags=new Set(Tarot.deck.flatMap(c=>[...c.up.tags,...c.reverse.tags]));
  assert.equal(new Set(O.ACTIVITIES.map(a=>a.id)).size,O.ACTIVITIES.length);
  for(const a of O.ACTIVITIES){
    assert.ok(filters.has(a.kind),a.id+' filter');assert.ok(Art.icons[a.icon],a.id+' icon');
    assert.ok(a.good&&a.bad&&a.why,a.id+' readings');assert.ok(O.ELEMENTS.includes(a.element));
    assert.ok(E.TAGS[a.id]?.length,a.id+' tags');assert.ok(E.TAGS[a.id].every(t=>tags.has(t)),a.id+' tag vocabulary');
  }
  assert.deepEqual(new Set(E.daily(p,date).activities.map(a=>a.id)),new Set(O.ACTIVITIES.map(a=>a.id)));
});
test('78 unique cards, 22 major and 56 minor, complete readings',()=>{
  assert.equal(Tarot.deck.length,78);assert.equal(new Set(Tarot.deck.map(c=>c.id)).size,78);assert.equal(Tarot.deck.filter(c=>c.major).length,22);
  for(const c of Tarot.deck)for(const side of ['up','reverse'])assert.ok(c[side].text&&c[side].tags.length);
});
test('nickname and profile reproduce birth and daily cards across fresh objects',()=>{
  assert.deepEqual(E.generateBirth(p),E.generateBirth(JSON.parse(JSON.stringify(p))));
  assert.deepEqual(E.draw(p,date),E.draw({...p},date));
  assert.equal(E.identityKey(p),E.identityKey({...p,nickname:' 月下旅人 '}));
});
test('every zodiac yields a valid date in its specified year, including leap and cross-year ranges',()=>{
  for(const year of [1901,1999,2000,2024,2099])for(const zodiac of E.ZODIACS)for(let i=0;i<20;i++){
    const b=E.generateBirth({nickname:'旅人'+i,zodiac:zodiac.id,year});const [y,m,d]=O.parseDate(b.date);
    assert.equal(y,year);assert.equal(E.zodiacFor(m,d).id,zodiac.id);E.validateBirth(b);
  }
});
test('daily draws are unique within a spread, but vary across names and dates',()=>{
  const signatures=new Set();
  for(let i=1;i<=28;i++){const cards=E.draw(p,'2026-11-'+String(i).padStart(2,'0'));assert.equal(new Set(cards.map(c=>c.id)).size,3);signatures.add(E.signature(cards));}
  assert.ok(signatures.size>25);
  const people=new Set(Array.from({length:50},(_,i)=>E.signature(E.draw({...p,nickname:'旅人'+i},date))));assert.ok(people.size>45);
});
test('reroll changes only tarot seed and spread; generated birth, four pillars, and daily hexagram are unchanged',()=>{
  const before=E.daily(p,date),next=E.reroll(p,date,require('node:crypto').webcrypto),after=E.daily(next,date);
  assert.notEqual(E.signature(before.cards),E.signature(after.cards));assert.deepEqual(before.natal,after.natal);assert.deepEqual(before.calendar,after.calendar);
  assert.deepEqual(after.cards,E.daily(JSON.parse(JSON.stringify(next)),date).cards);
});
test('reroll preserves custom real-or-fictional birth, including leap-day and late 子时',()=>{
  const custom={...p,birthOverride:{date:'2000-02-29',time:'23:30'}};
  const next=E.reroll(custom,date,require('node:crypto').webcrypto);
  assert.deepEqual(E.birthFor(next),custom.birthOverride);assert.deepEqual(E.birthChart(next),E.birthChart(custom));
  assert.equal(E.birthChart(next).hourName,'子时');
});
test('custom birth affects fortune immediately and takes precedence over zodiac/year',()=>{
  const other={...p,birthOverride:{date:'1996-06-01',time:'12:00'}};
  assert.notDeepEqual(E.birthChart(other).pillars,E.birthChart(p).pillars);
  assert.notEqual(E.revealKey(other,date),E.revealKey(p,date));
  assert.equal(E.birthFor({...other,year:2010,zodiac:'aries'}).date,'1996-06-01');
});
test('calendar fixture and hexagram line conventions are consistent',()=>{
  const r=O.calculate(date,5);assert.equal(r.lunarText,'十月初七');assert.equal(r.dayGanZhi,'癸巳');
  assert.equal(r.primary.fullName,'地风升');assert.equal(r.moving,5);assert.equal(r.changed.fullName,'水风井');
  assert.equal(r.primary.bits.filter((b,i)=>b!==r.changed.bits[i]).length,1);
  assert.equal(r.body.name,'巽');assert.equal(r.use.name,'坤');
});
test('four pillars use solar-term year boundary',()=>{
  const before=E.birthChart({...p,birthOverride:{date:'2024-02-03',time:'12:00'}});
  const after=E.birthChart({...p,birthOverride:{date:'2024-02-05',time:'12:00'}});
  assert.equal(before.pillars[0],'癸卯');assert.equal(after.pillars[0],'甲辰');
});
test('invalid dates, times, profiles, and out-of-range years are rejected',()=>{
  for(const d of ['2023-02-29','2000-02-30','2000-13-01','2026-1-1','1900-01-01'])assert.throws(()=>E.validateBirth({date:d,time:'12:00'}));
  for(const t of ['24:00','12:60','0:00',''])assert.throws(()=>E.validateBirth({date:'2000-01-01',time:t}));
  assert.throws(()=>E.generateBirth({...p,nickname:'  '}));assert.throws(()=>E.generateBirth({...p,zodiac:'unknown'}));
});
test('recommendations never overlap; scores are finite and tarot can alter actual recommendations',()=>{
  let changed=0;const initial=E.daily(p,date);for(let i=0;i<80;i++){
    const r=E.daily({...p,tarotOverride:E.hash('test-'+i)},date);
    assert.ok(r.activities.every(a=>Number.isFinite(a.score)&&a.score>=8&&a.score<=96));
    assert.ok(r.good.every(a=>a.score>=60));assert.ok(r.bad.every(a=>a.score<45));
    assert.ok(!r.good.some(a=>r.bad.some(b=>b.id===a.id)));
    if(r.good.map(a=>a.id).join()!==initial.good.map(a=>a.id).join())changed++;
  }assert.ok(changed>50);
});
