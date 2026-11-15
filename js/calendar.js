(function (root) {
  'use strict';
  const TRI = [null,
    {name:'乾',image:'天',element:'金',bits:[1,1,1],symbol:'☰'},
    {name:'兑',image:'泽',element:'金',bits:[1,1,0],symbol:'☱'},
    {name:'离',image:'火',element:'火',bits:[1,0,1],symbol:'☲'},
    {name:'震',image:'雷',element:'木',bits:[1,0,0],symbol:'☳'},
    {name:'巽',image:'风',element:'木',bits:[0,1,1],symbol:'☴'},
    {name:'坎',image:'水',element:'水',bits:[0,1,0],symbol:'☵'},
    {name:'艮',image:'山',element:'土',bits:[0,0,1],symbol:'☶'},
    {name:'坤',image:'地',element:'土',bits:[0,0,0],symbol:'☷'}];
  // Rows are upper trigrams; columns are lower trigrams, in the classical number order.
  const NAMES = [
    ['乾','履','同人','无妄','姤','讼','遁','否'],
    ['夬','兑','革','随','大过','困','咸','萃'],
    ['大有','睽','离','噬嗑','鼎','未济','旅','晋'],
    ['大壮','归妹','丰','震','恒','解','小过','豫'],
    ['小畜','中孚','家人','益','巽','涣','渐','观'],
    ['需','节','既济','屯','井','坎','蹇','比'],
    ['大畜','损','贲','颐','蛊','蒙','艮','剥'],
    ['泰','临','明夷','复','升','师','谦','坤']];
  const GEN = {'木':'火','火':'土','土':'金','金':'水','水':'木'};
  const OVER = {'木':'土','土':'水','水':'火','火':'金','金':'木'};
  const ELEMENTS = ['木','火','土','金','水'];
  const COLORS = {'木':'#a5bd8c','火':'#dd9a84','土':'#d1b980','金':'#e4d8ae','水':'#8dbcc1'};
  const BRANCHES = '子丑寅卯辰巳午未申酉戌亥';
  const STEM_ELEMENT = {'甲':'木','乙':'木','丙':'火','丁':'火','戊':'土','己':'土','庚':'金','辛':'金','壬':'水','癸':'水'};
  const ACTIVITIES = [
    {id:'wood',name:'伐木',en:'Woodcutting',element:'木',icon:'tree',good:'斧声入林，枝间藏喜。攒些木料，也等一只落下的鸟巢。',bad:'林间的惊喜不必追，今天让斧头歇一歇。',why:'以树木生发取象，归入木。'},
    {id:'mine',name:'采矿',en:'Mining',element:'土',icon:'pick',good:'山腹藏珍，适合挥镐寻矿，攒几枚待开的晶洞。',bad:'矿脉宜养，今天不必追着下一枚晶洞走。',why:'以山石与矿脉取象，归入土。'},
    {id:'fish',name:'钓鱼',en:'Fishing',element:'水',icon:'fish',good:'水面藏着意外之喜，抛一竿，等鱼获之外的惊喜。',bad:'水深鱼静，今天先收一收寻宝的心。',why:'以水域与鱼获取象，归入水。'},
    {id:'hunt',name:'狩猎',en:'Hunting',element:'金',icon:'track',good:'林间有异迹，备好陷阱，去寻一只少见的猎物。',bad:'足迹渐隐，稀有猎物自有来时，不必穷追。',why:'以追踪与猎获取象，归入金。'},
    {id:'thief',name:'盗窃',en:'Thieving',element:'水',icon:'key',good:'巧手逢机，挑个熟悉的目标，寻一份少见的战利品。',bad:'财袋宜远观，今日别为一件稀罕物反复伸手。',why:'以隐匿与灵活取象，归入水。'},
    {id:'loot',name:'刷怪寻宝',en:'Loot Hunting',element:'金',icon:'sword',good:'旧敌也藏新礼，备足补给，去找惦记的那件掉落。',bad:'宝物尚待有缘时，今天别与一张掉落表较劲。',why:'以兵刃与战利品取象，归入金。'},
    {id:'open',name:'开箱',en:'Treasure Opening',element:'土',icon:'chest',good:'封藏之物，今日可启。挑一份积攒的宝藏，揭开它的答案。',bad:'箱盖且缓，晶洞与鸟巢都先收好，留些期待给明日。',why:'以封藏与开启宝物取象，归入土。'}
  ];
  function mod(n,m){return ((n-1)%m+m)%m+1;}
  function relationship(source,target){
    if(source===target)return {label:'比和',text:source+'与'+target+'同气',weight:16};
    if(GEN[source]===target)return {label:'相生',text:source+'生'+target,weight:24};
    if(GEN[target]===source)return {label:'泄气',text:target+'生'+source+'，有所耗泄',weight:-9};
    if(OVER[source]===target)return {label:'受克',text:source+'克'+target,weight:-24};
    return {label:'制约',text:target+'克'+source+'，需费心力',weight:-13};
  }
  function hex(upper,lower){return {upper:TRI[upper],lower:TRI[lower],upperNumber:upper,lowerNumber:lower,name:NAMES[upper-1][lower-1],fullName:upper===lower?TRI[upper].name+'为'+TRI[upper].image:TRI[upper].image+TRI[lower].image+NAMES[upper-1][lower-1],bits:[...TRI[lower].bits,...TRI[upper].bits]};}
  function trigramNumber(bits){return TRI.findIndex(t=>t&&t.bits.every((v,i)=>v===bits[i]));}
  function parseDate(value){
    if(!/^\d{4}-\d{2}-\d{2}$/.test(value))throw new Error('请选择完整的公历日期。');
    const [y,m,d]=value.split('-').map(Number), date=new Date(Date.UTC(y,m-1,d));
    if(y<1901||y>2099||date.getUTCFullYear()!==y||date.getUTCMonth()!==m-1||date.getUTCDate()!==d)throw new Error('请选择 1901–2099 年内的有效日期。');
    return [y,m,d];
  }
  function calculate(value,hour=5){
    const [y,m,d]=parseDate(value);
    if(!Number.isInteger(hour)||hour<1||hour>12)throw new Error('请选择一个有效时辰。');
    const lunar=root.Solar.fromYmd(y,m,d).getLunar();
    const yearNumber=lunar.getYearZhiIndex()+1, month=Math.abs(lunar.getMonth()),day=lunar.getDay();
    const total=yearNumber+month+day, full=total+hour, moving=mod(full,6);
    const primary=hex(mod(total,8),mod(full,8));
    const changedBits=primary.bits.map((bit,i)=>i===moving-1?1-bit:bit);
    const changed=hex(trigramNumber(changedBits.slice(3)),trigramNumber(changedBits.slice(0,3)));
    const body=moving<=3?primary.upper:primary.lower, use=moving<=3?primary.lower:primary.upper;
    const dayElement=STEM_ELEMENT[lunar.getDayGan()];
    const relation=relationship(use.element,body.element);
    const readings={
      '相生':{title:'顺势而行',seal:'得助',poem:'风来恰好，舟行有声。',text:'有来相助，适合把搁置的小目标往前推一推。选一项顺手的技能，让时间替你完成余下的事。'},
      '比和':{title:'稳中有获',seal:'和顺',poem:'山不催人，日积成林。',text:'同气相应，适合守住自己的节奏。今天的好运，也许就是下次上线时多出的那一格进度。'},
      '受克':{title:'蓄力待时',seal:'宜守',poem:'藏锋于鞘，养木成林。',text:'卦象提醒你给冒险留一点余量。补给、采集、整理，都可以是一场漂亮的前进。'},
      '泄气':{title:'细水长流',seal:'缓行',poem:'一炉微火，也照长夜。',text:'付出之象较重，适合小步推进。别把材料与耐心一口气用尽，今天慢慢来就很好。'},
      '制约':{title:'谋定而动',seal:'可为',poem:'磨刃片刻，入山从容。',text:'事情可做，也需要些准备。先看库存、装备与补给，再让今日的计划安稳落地。'}
    };
    const scores=ELEMENTS.map(element=>{const a=relationship(dayElement,element),b=relationship(body.element,element);return {element,score:Math.round(50+a.weight+b.weight*0.65),dayRelation:a,bodyRelation:b};});
    return {date:value,hour,yearNumber,month,day,total,full,moving,primary,changed,body,use,relation,reading:readings[relation.label],dayElement,scores,lunarText:lunar.getMonthInChinese()+'月'+lunar.getDayInChinese(),leap:lunar.getMonth()<0,yearGanZhi:lunar.getYearInGanZhi(),dayGanZhi:lunar.getDayInGanZhi(),yearBranch:BRANCHES[yearNumber-1],hourBranch:BRANCHES[hour-1]};
  }
  root.Oracle={TRI,ACTIVITIES,ELEMENTS,COLORS,BRANCHES,GEN,OVER,calculate,parseDate,relationship,hex};
})(typeof window!=='undefined'?window:globalThis);
