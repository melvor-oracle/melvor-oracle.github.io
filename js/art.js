(function(root){
  'use strict';
  const motifs={
    star:'<path d="M100 43l13 43 45 1-36 27 13 43-35-26-35 26 13-43-36-27 45-1z"/><path d="M100 169v22M63 176l-8 13M137 176l8 13"/>',
    sun:'<circle cx="100" cy="111" r="37"/><path d="M100 49V27m0 146v22M38 111H16m146 0h22M56 67L40 51m104 104l16 16M56 155l-16 16M144 67l16-16"/><path d="M84 108h4m24 0h4M88 126q12 12 24 0"/>',
    moon:'<path d="M125 52a63 63 0 1 0 0 118 66 66 0 0 1 0-118z"/><path d="M148 79v22m-11-11h22M146 133l7 7-7 7-7-7zM32 42l5 5-5 5-5-5z"/>',
    wand:'<path d="M68 177l65-119m-61 120l65-119M111 62l38 20M129 41l5-20 7 21 20 6-20 7-6 20-6-20-21-7zM57 144l-18-8 9 22M100 107l19-6-8 19"/>',
    cup:'<path d="M58 71h84v23a42 42 0 0 1-84 0zM100 136v37m-29 12q29-25 58 0zM58 83H43q-13 36 22 38M142 83h15q13 36-22 38"/><path d="M100 39v17m-21-9 6 12m36-12-6 12"/>',
    sword:'<path d="M100 29l13 29-7 91H94l-7-91zM66 151q34-18 68 0M95 149v39h10v-39M90 192h20M100 43v100"/>',
    coin:'<circle cx="100" cy="111" r="61"/><circle cx="100" cy="111" r="52"/><path d="M100 66l11 33 35 1-28 21 10 33-28-20-28 20 10-33-28-21 35-1z"/>',
    road:'<path d="M35 184l46-103 19 30 24-53 43 126zM88 185l22-34-15-21 11-18M24 186h152"/><circle cx="57" cy="54" r="15"/><path d="M155 41v17m-8-8h16"/>',
    leaf:'<path d="M100 190V83M100 123Q37 116 43 66q53 4 57 57M100 150q59-9 57-57-51 4-57 57M100 95q-29-31 0-66 31 34 0 66"/><path d="M100 120L62 86m38 62 39-38M67 193h66"/>',
    crown:'<path d="M49 89l20 67h62l20-67-31 23-20-45-20 45zM69 165h62M73 175h54"/><circle cx="47" cy="80" r="6"/><circle cx="100" cy="57" r="6"/><circle cx="153" cy="80" r="6"/>',
    key:'<circle cx="86" cy="79" r="28"/><circle cx="86" cy="79" r="11"/><path d="M104 102l48 48-11 11-11-11-10 10-11-11 10-10-26-26"/>',
    heart:'<path d="M100 161l-51-50c-43-47 18-85 51-42 33-43 94-5 51 42zM66 182h68M100 41V23"/>',
    chariot:'<path d="M55 83h90l-9 61H64zM67 83V61h66v22M100 61V34M100 34l30 12-30 10M77 144v17m46-17v17"/><circle cx="67" cy="170" r="14"/><circle cx="133" cy="170" r="14"/>',
    lion:'<circle cx="100" cy="111" r="61"/><path d="M63 88l-7-28 30 14m51 14 7-28-30 14M69 101q31-29 62 0v31q-31 44-62 0zM83 110h4m26 0h4M92 127h16l-8 11zM100 139v12M88 151q12 9 24 0"/>',
    lantern:'<path d="M70 77h60l9 86H61zM75 77V62q25-37 50 0v15M79 163l-4 15h50l-4-15M100 94l8 20 20 8-20 8-8 20-8-20-20-8 20-8zM100 178v16"/>',
    wheel:'<circle cx="100" cy="111" r="62"/><circle cx="100" cy="111" r="48"/><circle cx="100" cy="111" r="12"/><path d="M100 49v50m0 24v50M38 111h50m24 0h50M56 67l35 35m18 18 35 35M56 155l35-35m18-18 35-35"/>',
    scales:'<path d="M100 45v133M75 187h50M47 81h106M54 82l-24 49h48zM146 82l-24 49h48zM30 131q24 34 48 0M122 131q24 34 48 0"/><circle cx="100" cy="69" r="9"/>',
    hourglass:'<path d="M59 48h82M59 178h82M66 49q-5 42 34 64-39 22-34 64M134 49q5 42-34 64 39 22 34 64M73 78h54l-27 27zM76 164l24-38 24 38z"/>',
    rose:'<path d="M100 190v-67m0 37q35-32 46-13-14 26-46 13m0-11q-33-28-42-11 12 24 42 11"/><path d="M100 49q28-27 37 12 38-1 20 32 17 33-20 33-9 37-37 10-28 27-37-10-37 0-20-33-18-33 20-32 9-39 37-12z"/><circle cx="100" cy="92" r="25"/><path d="M84 92q16-27 32 0-16 27-32 0z"/>',
    chain:'<rect x="53" y="53" width="48" height="77" rx="24" transform="rotate(-30 77 91)"/><rect x="99" y="104" width="48" height="77" rx="24" transform="rotate(-30 123 142)"/><path d="M84 98l32 36M125 62l15-22m-6 43 26-8M65 170l-18 16"/>',
    tower:'<path d="M63 187l11-104h52l11 104M67 84V63h13v11h13V63h14v11h13V63h13v21M89 186v-31h22v31M91 104h18v20H91zM128 25l-25 22h19l-20 24M38 187h124"/>',
    horn:'<path d="M59 91l67-30v95l-67-29zM59 98H43v22h16M126 61q29 47 0 95M72 133l-5 30 18 6 10-27M154 89l22-12m-18 34h23m-28 21 21 13"/>',
    world:'<ellipse cx="100" cy="111" rx="55" ry="75"/><ellipse cx="100" cy="111" rx="28" ry="75"/><path d="M46 111h108M54 77h92M54 145h92M100 36v150M29 35l6 6-6 6-6-6zM171 177l6 6-6 6-6-6z"/>'
  };
  function art(card){let shape=motifs[card.motif]||motifs.star;if(!card.major&&card.number>1&&card.number<=10){const marks=Array.from({length:card.number},(_,i)=>{let a=i/card.number*Math.PI*2;return `<circle cx="${100+72*Math.cos(a)}" cy="${111+86*Math.sin(a)}" r="2.2" fill="currentColor"/>`;}).join('');shape+=marks;}return `<svg viewBox="0 0 200 220" class="tarot-art${card.reversed?' is-reversed':''}" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.45" stroke-linecap="round" stroke-linejoin="round">${shape}</g><g fill="currentColor" opacity=".5"><circle cx="29" cy="73" r="1.5"/><circle cx="163" cy="40" r="1.5"/><circle cx="173" cy="166" r="1.5"/><circle cx="42" cy="167" r="1.5"/></g></svg>`;}
  const back=`<svg viewBox="0 0 200 250" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width=".9"><circle cx="100" cy="118" r="65"/><circle cx="100" cy="118" r="54"/><circle cx="100" cy="118" r="29"/><path d="M100 36v164M18 118h164M42 60l116 116M42 176L158 60M100 53l46 19 19 46-19 46-46 19-46-19-19-46 19-46zM100 53l46 111-111-46 111-46-46 111-46-111 111 46-111 46z" opacity=".55"/><path d="M86 106h28M86 118h11m6 0h11M86 130h28" stroke-width="3"/></g><path d="M100 12l3 8 8 3-8 3-3 8-3-8-8-3 8-3zM100 211l3 8 8 3-8 3-3 8-3-8-8-3 8-3z" fill="currentColor"/></svg>`;
  const icons={
    tree:'M12 2 5 11h3l-4 6h6v5h4v-5h6l-4-6h3z',fish:'M3 12c5-8 12-8 16 0-4 8-11 8-16 0Zm16 0 4-5v10z',
    pick:'M3 7c7-6 13-3 17 3M12 6 4 21M11 9 8 6',leaf:'M3 21 15 9M5 17C0 4 11 1 22 2c-1 11-4 21-17 15Z',
    anvil:'M2 6h20l-5 7H8L2 9Zm7 7v5H6v3h14v-3h-5v-5',pot:'M4 9h16v5c0 8-16 8-16 0Zm-2 1h2m16 0h2M6 5h12M12 2v3',
    flask:'M8 2h8m-6 0v7l-6 10q-1 3 3 3h10q4 0 3-3l-6-10V2M7 15h10',sword:'m17 2 5 0v5L9 20l-5-5zM3 12l9 9M2 22l4-4',
    bow:'M5 2q22 10 0 20L16 12zM2 12h20m-4-4 4 4-4 4',wand:'M4 21 18 7M14 2v6m-3-3h6m3 10v6m-3-3h6',
    key:'M15 9a5 5 0 1 0-5 5L2 22l-1-5 4-1 1-4',chest:'M3 9q0-7 9-7t9 7v12H3Zm0 0h18M10 9v5h4V9',
    flame:'M13 2c1 6 7 8 7 13a8 8 0 0 1-16 0c0-3 2-5 4-7 0 4 2 4 2 4s4-5 3-10ZM12 13c-5 5-2 8 0 8s5-3 0-8Z',
    arrow:'M3 21 20 4M14 4h6v6M3 15v6h6M6 12v6h6',
    needle:'M6 20 17 3c2-2 4 0 2 2ZM16 7c9 2 4 10-1 9s-7 3-2 5',
    rune:'m12 2 7 5v11l-7 4-7-4V7ZM12 6v12M9 9l6 6M15 9l-6 6',
    fence:'M3 22V5l2-3 2 3v17M17 22V5l2-3 2 3v17M7 8h10M7 12h10M7 16h10M7 20h10',
    track:'M8 13c-1 2-4 4-3 6s4 1 7 1 6 1 7-1-2-4-3-6c-2-2-6-2-8 0ZM4 7a2 3 0 1 0 0 6 2 3 0 1 0 0-6ZM9 2a2 3 0 1 0 0 6 2 3 0 1 0 0-6ZM15 2a2 3 0 1 0 0 6 2 3 0 1 0 0-6ZM20 7a2 3 0 1 0 0 6 2 3 0 1 0 0-6Z',
    claw:'M5 3C1 13 3 19 6 21L9 5M12 2c-3 9-3 16 0 20l3-19M19 3c-2 8-2 13 0 17l3-13',
    steps:'M7 2c-4 0-4 8-1 9s5-9 1-9ZM4 14l4 1-1 4-4-1ZM18 6c-4 0-4 8-1 9s5-9 1-9ZM15 18l4 1-1 3-4-1Z',
    stars:'m9 2 2 5 5 2-5 2-2 5-2-5-5-2 5-2ZM18 13l1 3 3 1-3 1-1 3-1-3-3-1 3-1ZM19 2v4m-2-2h4M4 18v4m-2-2h4',
    portal:'M3 21h18M5 21V10a7 7 0 0 1 14 0v11M8 21V10a4 4 0 0 1 8 0v11M12 11v7m-3-3h6',
    house:'M2 11 12 2l10 9M5 9v13h14V9M10 22v-8h4v8M16 5V2h3v6',
    relic:'M7 2h10M8 2v5c0 3-5 5-5 9s4 6 9 6 9-2 9-6-5-6-5-9V2M8 7h8M4 13h16M5 18h14M9 13l3 5 3-5',
    gem:'m3 9 4-6h10l4 6-9 13ZM3 9h18M7 3l2 6 3 13 3-13 2-6M9 9l3-6 3 6',
    target:'M12 3a9 9 0 1 0 9 9M12 7a5 5 0 1 0 5 5M12 12l9-9M16 3h5v5'
  };
  function icon(name){return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${icons[name]||icons.wand}"/></svg>`;}
  root.Art={art,back,icon,icons};
})(typeof window!=='undefined'?window:globalThis);
