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
  // Officially announced MI2 roster, checked against the September 2026 roadmap.
  // Combat skills share activity slots; skill coverage is independent of recommendations.
  const SKILLS = [
    ['attack','攻击','Attack'],['strength','力量','Strength'],['defence','防御','Defence'],
    ['hitpoints','生命值','Hitpoints'],['ranged','远程','Ranged'],['magic','魔法','Magic'],
    ['slayer','屠杀','Slayer'],['prayer','祈祷','Prayer'],
    ['woodcutting','伐木','Woodcutting'],['firemaking','生火','Firemaking'],['fishing','钓鱼','Fishing'],
    ['cooking','烹饪','Cooking'],['mining','采矿','Mining'],['smithing','锻造','Smithing'],
    ['fletching','弓箭制作','Fletching'],['crafting','制造','Crafting'],['runecrafting','符文制作','Runecrafting'],
    ['farming','耕种','Farming'],['ranching','牧场','Ranching'],['hunting','狩猎','Hunting'],
    ['herblore','草药学','Herblore'],['thieving','盗窃','Thieving'],['agility','灵巧','Agility'],
    ['beastcrafting','兽材工艺','Beastcrafting'],['astrology','占星术','Astrology'],
    ['summoning','召唤','Summoning'],['construction','建造','Construction'],
    ['archaeology','考古','Archaeology'],['enchantment','附魔','Enchantment']
  ].map(([id,name,en])=>({id,name,en}));
  const ACTIVITY_SKILLS = {
    wood:['woodcutting'],fire:['firemaking'],fish:['fishing'],cook:['cooking'],mine:['mining'],
    smith:['smithing'],fletch:['fletching'],craft:['crafting'],rune:['runecrafting'],farm:['farming'],
    ranch:['ranching'],hunt:['hunting'],herb:['herblore'],thief:['thieving'],agility:['agility'],
    beast:['beastcrafting'],astro:['astrology'],summon:['summoning'],build:['construction'],
    archaeology:['archaeology'],enchant:['enchantment'],
    melee:['attack','strength','defence','hitpoints','prayer'],
    ranged:['ranged','hitpoints','prayer'],magic:['magic','hitpoints','prayer'],
    slayer:['slayer','hitpoints','prayer'],bank:[]
  };
  const ACTIVITIES = [
    {id:'wood',name:'伐木',en:'Woodcutting',element:'木',kind:'gather',icon:'tree',good:'让斧头接班，给下一段冒险攒一仓木料。',bad:'林间宜慢行，今天不必与一棵树较劲。',why:'以树木取象，归入木。'},
    {id:'fish',name:'钓鱼',en:'Fishing',element:'水',kind:'gather',icon:'fish',good:'把鱼竿交给时间，给远行准备一份余粮。',bad:'鱼自有鱼的作息，暂且别催它上钩。',why:'以水域取象，归入水。'},
    {id:'mine',name:'采矿',en:'Mining',element:'土',kind:'gather',icon:'pick',good:'山腹藏珍，适合安静补一补矿石库存。',bad:'矿脉今日宜养，先清点仓库里的旧收藏。',why:'以山石与矿脉取象，归入土。'},
    {id:'farm',name:'耕种',en:'Farming',element:'木',kind:'gather',icon:'leaf',good:'种下今日的从容，让下一次上线有些盼头。',bad:'苗木自有节律，别因心急打乱原来的计划。',why:'以植物生长取象，归入木。'},
    {id:'smith',name:'锻造',en:'Smithing',element:'火',kind:'craft',icon:'anvil',good:'炉火正好，把囤着的矿石写成装备的故事。',bad:'炉前宜留余地，珍贵材料先别一口气用尽。',why:'锻造兼具金火，本作按炉火锤炼取火象。'},
    {id:'cook',name:'烹饪',en:'Cooking',element:'火',kind:'craft',icon:'pot',good:'锅中有余粮，心里才有远方。先备好补给。',bad:'今日宜留存，别让一顿大餐吃空材料库。',why:'以烹煮与火候取象，归入火。'},
    {id:'herb',name:'草药学',en:'Herblore',element:'木',kind:'craft',icon:'flask',good:'草木有灵，把素材整理成下一趟的准备。',bad:'药柜宜盘点，稀有材料不妨多留一份。',why:'以草药生机取象，归入木。'},
    {id:'melee',name:'近战训练',en:'Melee',element:'金',kind:'battle',icon:'sword',good:'锋芒可试，在熟悉的对手身上磨一磨刀。',bad:'锋芒暂敛，先看好装备和补给再动身。',why:'以兵刃肃杀取象，归入金。'},
    {id:'ranged',name:'远程训练',en:'Ranged',element:'木',kind:'battle',icon:'bow',good:'弦上有风，适合慢慢练出手感。',bad:'弓弦宜缓，先补足弹药再想远方。',why:'按木弓取象，归入木；这是本作约定。'},
    {id:'magic',name:'魔法训练',en:'Magic',element:'火',kind:'battle',icon:'wand',good:'让熟悉的法术亮起，给冒险添一点光。',bad:'魔力宜藏，先整理消耗品，再计划施法。',why:'按光与能量取火象；这是游戏化约定。'},
    {id:'thief',name:'盗窃',en:'Thieving',element:'水',kind:'gather',icon:'key',good:'以灵巧取胜，也记得给退路留一点余地。',bad:'口袋先扎紧，今天不必执着于别人的钱袋。',why:'按隐匿与灵活取水象；这是游戏化约定。'},
    {id:'fire',name:'生火',en:'Firemaking',element:'火',kind:'craft',icon:'flame',good:'添一段木，续一炉光。让积下的柴薪派上用场。',bad:'火势宜收，别把备用木料尽数送进余烬。',why:'以燃烧与薪火取象，归入火。'},
    {id:'fletch',name:'弓箭制作',en:'Fletching',element:'木',kind:'craft',icon:'arrow',good:'削木整羽，补一份箭囊，让远行有所依凭。',bad:'弦未张时不必赶工，先数清手边的木料与箭矢。',why:'以木材成弓、成矢取象，归入木。'},
    {id:'craft',name:'制造',en:'Crafting',element:'土',kind:'craft',icon:'needle',good:'细工慢成，挑一件惦记已久的物品做起来。',bad:'针线宜缓，先理清材料，再决定下一件作品。',why:'以材料塑形、器物成形取象，归入土。'},
    {id:'rune',name:'符文制作',en:'Runecrafting',element:'水',kind:'craft',icon:'rune',good:'把魔力刻进石中，为下一次施法攒好底气。',bad:'符石宜藏，先看看常用法术还缺哪一种准备。',why:'以魔力流转与符文蓄能取象，归入水。'},
    {id:'ranch',name:'牧场',en:'Ranching',element:'土',kind:'gather',icon:'fence',good:'圈舍安宁，适合照料牧场，慢慢攒起家底。',bad:'牧场宜守，先照看好已有的伙伴，再添新打算。',why:'以圈养、土地与安居取象，归入土。'},
    {id:'hunt',name:'狩猎',en:'Hunting',element:'金',kind:'gather',icon:'track',good:'循迹入林，耐心等一场恰好的相逢。',bad:'林中风向未定，今天不必追着每一道足迹走。',why:'以追踪、猎获与收敛取象，归入金。'},
    {id:'beast',name:'兽材工艺',en:'Beastcrafting',element:'金',kind:'craft',icon:'claw',good:'兽材在手，巧思成器。给旧日收获一个新去处。',bad:'珍材宜留，动手之前先想好要做成什么。',why:'以兽材加工、裁制成器取象，归入金。'},
    {id:'agility',name:'灵巧',en:'Agility',element:'木',kind:'practice',icon:'steps',good:'步履轻盈，顺着熟悉的节奏再向前一程。',bad:'脚步宜稳，放慢一点，把自己的节奏找回来。',why:'以身法伸展、行动生发取象，归入木。'},
    {id:'astro',name:'占星术',en:'Astrology',element:'水',kind:'practice',icon:'stars',good:'星河有信，适合静下心来，读一读夜空。',bad:'星光暂隐，不必为一时的答案耗尽耐心。',why:'以夜空、静观与洞察取象，归入水。'},
    {id:'summon',name:'召唤',en:'Summoning',element:'木',kind:'practice',icon:'portal',good:'回应远方的呼唤，为冒险结下一段新缘。',bad:'呼唤宜缓，先准备好迎接伙伴的余粮。',why:'以生命相应与伙伴助力取象，归入木。'},
    {id:'build',name:'建造',en:'Construction',element:'土',kind:'craft',icon:'house',good:'一砖一木，宜把心中的蓝图垒成落脚之处。',bad:'动土宜缓，先理一理蓝图与手边的材料。',why:'以筑基、承载与安居取象，归入土。'},
    {id:'archaeology',name:'考古',en:'Archaeology',element:'土',kind:'gather',icon:'relic',good:'拂去尘土，让沉睡的旧故事再见天光。',bad:'旧迹宜细读，别因急着寻宝而略过眼前的线索。',why:'以地层、遗迹与旧物取象，归入土。'},
    {id:'enchant',name:'附魔',en:'Enchantment',element:'火',kind:'craft',icon:'gem',good:'器物待点睛，让一缕魔力照亮手中的收藏。',bad:'魔纹宜静，先选好值得寄托心意的那一件。',why:'以魔力点化与能量注入取象，归入火。'},
    {id:'slayer',name:'屠杀任务',en:'Slayer',element:'金',kind:'battle',icon:'target',good:'循着任务出发，备足补给，给这一程定个目标。',bad:'任务不必赶，先照看生命与祈祷，再赴下一场交锋。',why:'以目标讨伐与兵戈取象，归入金。'},
    {id:'bank',name:'整理银行',en:'Bank',element:'土',kind:'craft',icon:'chest',good:'给宝物安个家，让下次出发少一点翻找。',bad:'仓库宜留白，清理之前多看一眼物品用途。',why:'以储藏与承载取象，归入土；这是日常活动。'}
  ].map(a=>({...a,skills:ACTIVITY_SKILLS[a.id]}));
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
  function calculate(value,hour=5,enabled=ACTIVITIES.map(a=>a.id)){
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
    const activities=ACTIVITIES.filter(a=>enabled.includes(a.id)).map(a=>({...a,...scores.find(s=>s.element===a.element)})).sort((a,b)=>b.score-a.score||ACTIVITIES.indexOf(ACTIVITIES.find(t=>t.id===a.id))-ACTIVITIES.indexOf(ACTIVITIES.find(t=>t.id===b.id)));
    const good=activities.filter(a=>a.score>=60).slice(0,3),bad=activities.filter(a=>a.score<45).reverse().slice(0,3);
    return {date:value,hour,yearNumber,month,day,total,full,moving,primary,changed,body,use,relation,reading:readings[relation.label],dayElement,scores,activities,good,bad,lunarText:lunar.getMonthInChinese()+'月'+lunar.getDayInChinese(),leap:lunar.getMonth()<0,yearGanZhi:lunar.getYearInGanZhi(),dayGanZhi:lunar.getDayInGanZhi(),yearBranch:BRANCHES[yearNumber-1],hourBranch:BRANCHES[hour-1]};
  }
  root.Oracle={TRI,SKILLS,ACTIVITIES,ELEMENTS,COLORS,BRANCHES,GEN,OVER,calculate,parseDate,relationship,hex};
})(typeof window!=='undefined'?window:globalThis);
