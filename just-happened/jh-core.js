/* just happened — shared core: i18n, themes, tags, storage, demo feed, sharing */
var JH = (function(){

/* ---------------- i18n ---------------- */
var T = {
en:{
  nav_feed:"Feed", nav_globe:"Globe", nav_rules:"How this works", theme:"Theme",
  h1:"just happened",
  lead:"Someone saw it a minute ago. Put it here: photos or a short clip, a few words, the place and a hashtag. No account, no posting limit.",
  l_media:"What you captured", req:"required",
  opt_photos:"Photos", opt_videos:"Videos",
  hint_photos:"5 to 10 photos, one place, one moment.",
  hint_videos:"2 or 3 clips, 15 to 20 seconds each.",
  add_files:"Choose files", clear_files:"Remove all",
  count_photos:"{n} of 10 photos", count_videos:"{n} of 3 clips",
  l_text:"In a few words", ph_text:"What happened? Keep it to what you saw.",
  l_place:"Where it happened", ph_place:"Street, landmark, city",
  geo_btn:"Use my coordinates", geo_wait:"Reading coordinates…",
  geo_ok:"Coordinates: ", geo_err:"Coordinates unavailable. Type the place instead.",
  l_tags:"Hashtags", tags_hint:"Pick at least one, or write your own.",
  ph_custom:"your own tag", add_tag:"Add",
  l_check:"Prove you are a person",
  check_hint:"Drag the marker into the dashed notch and stop inside it. Arrow keys work too.",
  check_aria:"Human check marker",
  check_done:"Passed. Valid for 5 minutes.",
  check_retry:"Missed. The notch moved — try again.",
  check_stale:"The check expired. Pass it again.",
  publish:"Publish", posted:"Published.",
  feed_h:"Latest", ph_filter:"Filter by place or words", feed_n:"{n} posts",
  empty:"The feed starts with you. Post the first thing.",
  empty_filter:"Nothing matches that filter.",
  all_tags:"All", del:"Delete", del_confirm:"Delete this post?",
  map:"Open map", on_globe:"Show on the globe",
  share:"Share", copy:"Copy link", copied:"Link copied.",
  demo:"example",
  vid_offline:"Playback works in the session where the clip was posted.",
  e_photos:"Add 5 to 10 photos.", e_videos:"Add 2 or 3 clips.",
  e_vlen:"Every clip runs 15 to 20 seconds. Outside that range: ",
  e_text:"Write a few words.", e_place:"Add a place or your coordinates.",
  e_tags:"Pick at least one hashtag.",
  e_check:"Pass the person check first.",
  e_fast:"That went too fast for a person. Take a moment and publish again.",
  e_type_photos:"Photos only here. Some files were skipped.",
  e_type_videos:"Videos only here. Some files were skipped.",
  e_full:"Local storage is full. The oldest posts were dropped.",
  storage_note:"Your posts are kept on this device and the example posts are marked as such.",
  sec:"s",
  g_h1:"Where it happened",
  g_lead:"Every post carries a point. Spin the globe, narrow the period, pick a marker.",
  g_hint:"Drag to spin · scroll to zoom",
  p_1h:"Last hour", p_24h:"24 hours", p_7d:"7 days", p_30d:"30 days", p_all:"All time",
  g_count:"{n} on the map", g_pick:"Pick a marker or a line on the right.",
  g_none:"No posts in this period. Widen the range.",
  g_open:"Open in the feed", g_recent:"In this period",
  back:"Back to the feed"
},
ru:{
  nav_feed:"Лента", nav_globe:"Глобус", nav_rules:"Как это устроено", theme:"Тема",
  h1:"just happened",
  lead:"Кто-то видел это минуту назад. Положите сюда: фото или короткий клип, несколько слов, место и хэштег. Без аккаунта, без лимита на посты.",
  l_media:"Что вы сняли", req:"обязательно",
  opt_photos:"Фото", opt_videos:"Видео",
  hint_photos:"От 5 до 10 фото, одно место, один момент.",
  hint_videos:"2 или 3 клипа, по 15–20 секунд.",
  add_files:"Выбрать файлы", clear_files:"Убрать всё",
  count_photos:"{n} из 10 фото", count_videos:"{n} из 3 клипов",
  l_text:"В нескольких словах", ph_text:"Что произошло? Только то, что вы видели.",
  l_place:"Где это произошло", ph_place:"Улица, ориентир, город",
  geo_btn:"Взять мои координаты", geo_wait:"Читаю координаты…",
  geo_ok:"Координаты: ", geo_err:"Координаты недоступны. Впишите место вручную.",
  l_tags:"Хэштеги", tags_hint:"Выберите хотя бы один или впишите свой.",
  ph_custom:"свой тег", add_tag:"Добавить",
  l_check:"Подтвердите, что вы человек",
  check_hint:"Дотяните маркер до пунктирного выреза и остановитесь внутри него. Стрелки на клавиатуре тоже работают.",
  check_aria:"Маркер проверки на человека",
  check_done:"Пройдено. Действует 5 минут.",
  check_retry:"Мимо. Вырез сместился — попробуйте снова.",
  check_stale:"Проверка устарела. Пройдите её заново.",
  publish:"Опубликовать", posted:"Опубликовано.",
  feed_h:"Последнее", ph_filter:"Фильтр по месту или словам", feed_n:"{n} постов",
  empty:"Лента начинается с вас. Опубликуйте первое.",
  empty_filter:"По фильтру ничего нет.",
  all_tags:"Все", del:"Удалить", del_confirm:"Удалить этот пост?",
  map:"Открыть карту", on_globe:"Показать на глобусе",
  share:"Поделиться", copy:"Скопировать ссылку", copied:"Ссылка скопирована.",
  demo:"пример",
  vid_offline:"Воспроизведение работает в той сессии, где клип опубликован.",
  e_photos:"Добавьте от 5 до 10 фото.", e_videos:"Добавьте 2 или 3 клипа.",
  e_vlen:"Каждый клип длится 15–20 секунд. Вне диапазона: ",
  e_text:"Напишите несколько слов.", e_place:"Укажите место или координаты.",
  e_tags:"Выберите хотя бы один хэштег.",
  e_check:"Сначала пройдите проверку на человека.",
  e_fast:"Слишком быстро для человека. Выдохните и нажмите снова.",
  e_type_photos:"Здесь только фото. Часть файлов пропущена.",
  e_type_videos:"Здесь только видео. Часть файлов пропущена.",
  e_full:"Локальное хранилище заполнено. Самые старые посты удалены.",
  storage_note:"Ваши посты хранятся на этом устройстве, а примеры помечены как примеры.",
  sec:"с",
  g_h1:"Где это происходит",
  g_lead:"У каждого поста есть точка. Крутите глобус, сужайте период, выбирайте маркер.",
  g_hint:"Тяните, чтобы вращать · колесо — масштаб",
  p_1h:"За час", p_24h:"24 часа", p_7d:"7 дней", p_30d:"30 дней", p_all:"За всё время",
  g_count:"{n} на карте", g_pick:"Выберите маркер или строку справа.",
  g_none:"В этом периоде постов нет. Расширьте диапазон.",
  g_open:"Открыть в ленте", g_recent:"В этом периоде",
  back:"Назад в ленту"
},
hy:{
  nav_feed:"Հոսք", nav_globe:"Գլոբուս", nav_rules:"Ինչպես է սա աշխատում", theme:"Թեմա",
  h1:"just happened",
  lead:"Ինչ-որ մեկը դա տեսավ մեկ րոպե առաջ։ Դրեք այստեղ՝ լուսանկարներ կամ կարճ հոլովակ, մի քանի բառ, վայրը և հեշթեգ։ Առանց հաշվի, առանց սահմանափակման։",
  l_media:"Ինչ եք նկարել", req:"պարտադիր",
  opt_photos:"Լուսանկարներ", opt_videos:"Տեսանյութեր",
  hint_photos:"5-ից 10 լուսանկար՝ մեկ վայր, մեկ պահ։",
  hint_videos:"2 կամ 3 հոլովակ՝ յուրաքանչյուրը 15–20 վայրկյան։",
  add_files:"Ընտրել ֆայլեր", clear_files:"Հեռացնել բոլորը",
  count_photos:"{n} 10-ից լուսանկար", count_videos:"{n} 3-ից հոլովակ",
  l_text:"Մի քանի բառով", ph_text:"Ի՞նչ տեղի ունեցավ։ Գրեք միայն այն, ինչ տեսել եք։",
  l_place:"Որտեղ է տեղի ունեցել", ph_place:"Փողոց, ուղենիշ, քաղաք",
  geo_btn:"Վերցնել իմ կոորդինատները", geo_wait:"Կարդում եմ կոորդինատները…",
  geo_ok:"Կոորդինատներ՝ ", geo_err:"Կոորդինատներն անհասանելի են։ Գրեք վայրը ձեռքով։",
  l_tags:"Հեշթեգեր", tags_hint:"Ընտրեք գոնե մեկը կամ գրեք ձերը։",
  ph_custom:"ձեր թեգը", add_tag:"Ավելացնել",
  l_check:"Հաստատեք, որ մարդ եք",
  check_hint:"Քաշեք նշիչը կետագծված բացվածքի մեջ և կանգ առեք հենց այնտեղ։ Սլաքների ստեղներն էլ են աշխատում։",
  check_aria:"Մարդու ստուգման նշիչ",
  check_done:"Անցած է։ Գործում է 5 րոպե։",
  check_retry:"Վրիպեց։ Բացվածքը տեղափոխվեց — փորձեք կրկին։",
  check_stale:"Ստուգումը ժամկետանց է։ Անցեք կրկին։",
  publish:"Հրապարակել", posted:"Հրապարակված է։",
  feed_h:"Վերջինը", ph_filter:"Զտել ըստ վայրի կամ բառերի", feed_n:"{n} գրառում",
  empty:"Հոսքը սկսվում է ձեզնից։ Հրապարակեք առաջինը։",
  empty_filter:"Զտիչին ոչինչ չի համապատասխանում։",
  all_tags:"Բոլորը", del:"Ջնջել", del_confirm:"Ջնջե՞լ այս գրառումը։",
  map:"Բացել քարտեզը", on_globe:"Ցույց տալ գլոբուսի վրա",
  share:"Կիսվել", copy:"Պատճենել հղումը", copied:"Հղումը պատճենվեց։",
  demo:"օրինակ",
  vid_offline:"Նվագարկումն աշխատում է այն սեսիայում, որտեղ հոլովակը հրապարակվել է։",
  e_photos:"Ավելացրեք 5-ից 10 լուսանկար։", e_videos:"Ավելացրեք 2 կամ 3 հոլովակ։",
  e_vlen:"Յուրաքանչյուր հոլովակ տևում է 15–20 վայրկյան։ Այս սահմաններից դուրս՝ ",
  e_text:"Գրեք մի քանի բառ։", e_place:"Նշեք վայրը կամ կոորդինատները։",
  e_tags:"Ընտրեք գոնե մեկ հեշթեգ։",
  e_check:"Նախ անցեք մարդու ստուգումը։",
  e_fast:"Չափազանց արագ եղավ մարդու համար։ Դանդաղեք և կրկին սեղմեք։",
  e_type_photos:"Այստեղ միայն լուսանկարներ են։ Ֆայլերի մի մասը բաց թողնվեց։",
  e_type_videos:"Այստեղ միայն տեսանյութեր են։ Ֆայլերի մի մասը բաց թողնվեց։",
  e_full:"Տեղական պահոցը լցված է։ Ամենահին գրառումները հեռացվեցին։",
  storage_note:"Ձեր գրառումները պահվում են այս սարքում, իսկ օրինակները նշված են որպես օրինակ։",
  sec:"վրկ",
  g_h1:"Որտեղ է դա տեղի ունենում",
  g_lead:"Ամեն գրառում ունի կետ։ Պտտեք գլոբուսը, նեղացրեք ժամանակահատվածը, ընտրեք նշիչ։",
  g_hint:"Քաշեք՝ պտտելու համար · անիվը՝ մասշտաբ",
  p_1h:"Վերջին ժամը", p_24h:"24 ժամ", p_7d:"7 օր", p_30d:"30 օր", p_all:"Ամբողջ ժամանակը",
  g_count:"{n} քարտեզի վրա", g_pick:"Ընտրեք նշիչ կամ տողն աջից։",
  g_none:"Այս ժամանակահատվածում գրառումներ չկան։ Ընդլայնեք միջակայքը։",
  g_open:"Բացել հոսքում", g_recent:"Այս ժամանակահատվածում",
  back:"Վերադառնալ հոսք"
}
};

var lang = 'ru';
function t(k, vars){
  var s = (T[lang] && T[lang][k]) || T.en[k] || k;
  if (vars) for (var v in vars) s = s.replace('{'+v+'}', vars[v]);
  return s;
}

/* ---------------- storage ---------------- */
var store = {
  get:function(k, d){ try{ var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; }catch(e){ return d; } },
  set:function(k, v){ try{ localStorage.setItem(k, JSON.stringify(v)); return true; }catch(e){ return false; } },
  raw:function(k){ try{ return localStorage.getItem(k); }catch(e){ return null; } },
  rawSet:function(k, v){ try{ localStorage.setItem(k, v); }catch(e){} }
};
var OWNER = (function(){
  var id = store.raw('jh_owner');
  if (!id){ id = 'o' + Math.random().toString(36).slice(2) + Date.now().toString(36); store.rawSet('jh_owner', id); }
  return id;
})();
function loadPosts(){ var p = store.get('jh_posts_v2', []); return Array.isArray(p) ? p : []; }
function savePosts(posts, onTrim){
  var copy = posts.slice();
  while (copy.length){
    if (store.set('jh_posts_v2', copy)){ if (copy.length < posts.length && onTrim) onTrim(); return copy; }
    copy = copy.slice(0, copy.length - 1);
  }
  store.set('jh_posts_v2', []);
  return [];
}

/* ---------------- themes ---------------- */
var THEMES = [
  { id:'blue-matte',     dot:'#6E9AD6', en:'Blue matte',   ru:'Синий матовый',      hy:'Կապույտ մատ' },
  { id:'green-matte',    dot:'#6BA582', en:'Green matte',  ru:'Зелёный матовый',    hy:'Կանաչ մատ' },
  { id:'red-matte',      dot:'#C4726C', en:'Red matte',    ru:'Красный матовый',    hy:'Կարմիր մատ' },
  { id:'brown-matte',    dot:'#B9905E', en:'Brown matte',  ru:'Коричневый матовый', hy:'Շագանակագույն մատ' },
  { id:'blue-electric',  dot:'#3D6BFF', en:'Blue electric',  ru:'Синий электрик',      hy:'Կապույտ էլեկտրիկ' },
  { id:'green-electric', dot:'#0FE07C', en:'Green electric', ru:'Зелёный электрик',    hy:'Կանաչ էլեկտրիկ' },
  { id:'red-electric',   dot:'#FF2E55', en:'Red electric',   ru:'Красный электрик',    hy:'Կարմիր էլեկտրիկ' },
  { id:'brown-electric', dot:'#FF9F1C', en:'Brown electric', ru:'Коричневый электрик', hy:'Շագանակագույն էլեկտրիկ' }
];
function themeName(th){ return th[lang] || th.en; }
function applyTheme(id){
  var th = THEMES.filter(function(x){ return x.id === id; })[0] || THEMES[0];
  document.documentElement.setAttribute('data-theme', th.id);
  store.rawSet('jh_theme', th.id);
  var sw = document.querySelector('.themebtn .swatch');
  if (sw) sw.style.background = 'linear-gradient(140deg,' + th.dot + ',rgba(0,0,0,.35))';
  document.querySelectorAll('.thememenu button').forEach(function(b){
    b.setAttribute('aria-pressed', String(b.dataset.theme === th.id));
  });
  fire('theme', th.id);
}

/* ---------------- hashtags (26 built in) ---------------- */
var TAGS = [
  ['fire','Fire','Пожар','Հրդեհ'], ['rescue','Rescue','Спасатели','Փրկարարներ'],
  ['crash','Crash','ДТП','Վթար'], ['police','Police','Полиция','Ոստիկանություն'],
  ['protest','Protest','Протест','Բողոք'], ['crowd','Crowd','Толпа','Ամբոխ'],
  ['flood','Flood','Потоп','Ջրհեղեղ'], ['quake','Quake','Землетрясение','Երկրաշարժ'],
  ['storm','Storm','Шторм','Փոթորիկ'], ['snow','Snow','Снег','Ձյուն'],
  ['heat','Heat','Жара','Շոգ'], ['traffic','Traffic','Пробка','Խցանում'],
  ['blackout','Blackout','Без света','Առանց լույսի'], ['water','Water','Вода','Ջուր'],
  ['construction','Construction','Стройка','Շինարարություն'], ['roadwork','Roadwork','Ремонт дороги','Ճանապարհի վերանորոգում'],
  ['transport','Transport','Транспорт','Տրանսպորտ'], ['queue','Queue','Очередь','Հերթ'],
  ['market','Market','Рынок','Շուկա'], ['prices','Prices','Цены','Գներ'],
  ['concert','Concert','Концерт','Համերգ'], ['festival','Festival','Фестиваль','Փառատոն'],
  ['sport','Sport','Спорт','Սպորտ'], ['streetart','Street art','Стрит-арт','Փողոցային արվեստ'],
  ['animals','Animals','Животные','Կենդանիներ'], ['lostpet','Lost pet','Потеряшка','Կորած ընտանի կենդանի'],
  ['nature','Nature','Природа','Բնություն'], ['sky','Sky','Небо','Երկինք']
];
function tagLabel(key){
  for (var i = 0; i < TAGS.length; i++) if (TAGS[i][0] === key)
    return TAGS[i][lang === 'ru' ? 2 : lang === 'hy' ? 3 : 1];
  return key;
}
function customTags(){ var c = store.get('jh_customtags', []); return Array.isArray(c) ? c : []; }
function addCustomTag(raw){
  var key = String(raw).toLowerCase().replace(/^#+/, '').replace(/[^\p{L}\p{N}_-]/gu, '').slice(0, 24);
  if (key.length < 2) return null;
  if (TAGS.some(function(x){ return x[0] === key; })) return key;
  var c = customTags();
  if (c.indexOf(key) < 0){ c.push(key); store.set('jh_customtags', c); }
  return key;
}

/* ---------------- picture generator for the examples ---------------- */
function rng(seed){ return function(){ seed |= 0; seed = seed + 0x6D2B79F5 | 0; var x = Math.imul(seed ^ seed >>> 15, 1 | seed); x = x + Math.imul(x ^ x >>> 7, 61 | x) ^ x; return ((x ^ x >>> 14) >>> 0) / 4294967296; }; }
var SCENES = {
  city:   { sky:['#7ba3c9','#d6e2ec'], sun:'#fff3d0', far:'#5c728a', near:'#33455a', ground:'#26313d', lit:'#ffe9a8' },
  night:  { sky:['#070d1c','#1b2c4e'], sun:'#dfe8ff', far:'#0d1526', near:'#060a13', ground:'#04070d', lit:'#ffd77a' },
  street: { sky:['#c98f5e','#f2d3a5'], sun:'#fff0c2', far:'#7a5a45', near:'#3d2c22', ground:'#2b1f18', lit:'#ffcf7a' },
  park:   { sky:['#89b6d8','#dcecd8'], sun:'#fdf6d2', far:'#3f6b4a', near:'#27492f', ground:'#1d3823', lit:'#f4f7c8' },
  water:  { sky:['#5b6f80','#aebfc9'], sun:'#e6edf2', far:'#41586a', near:'#2b3c49', ground:'#37596b', lit:'#cfe4ee' },
  fire:   { sky:['#7a2c14','#e2823a'], sun:'#ffcf6b', far:'#4a2415', near:'#26120c', ground:'#1a0d08', lit:'#ff9d3c' },
  snow:   { sky:['#9fb0c2','#e7eef4'], sun:'#ffffff', far:'#8698ab', near:'#5b6c7d', ground:'#e9eff5', lit:'#ffe6b8' },
  market: { sky:['#b98a4e','#f0dcb4'], sun:'#fff2cc', far:'#8a6335', near:'#4a3320', ground:'#332214', lit:'#ffd98a' },
  aurora: { sky:['#04121c','#0d2a3a'], sun:'#c8ffe6', far:'#07202b', near:'#041219', ground:'#020a0f', lit:'#5cffc0' }
};
function scenePhoto(kind, seed){
  var p = SCENES[kind] || SCENES.city, r = rng(seed * 7919 + 13), W = 900, H = 675, s = [];
  s.push('<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="'+p.sky[0]+'"/><stop offset="1" stop-color="'+p.sky[1]+'"/></linearGradient>');
  s.push('<radialGradient id="v" cx="0.5" cy="0.45" r="0.75"><stop offset="0.55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.42"/></radialGradient></defs>');
  s.push('<rect width="'+W+'" height="'+H+'" fill="url(#g)"/>');
  var sx = 120 + r() * 660, sy = 90 + r() * 130;
  s.push('<circle cx="'+sx.toFixed(0)+'" cy="'+sy.toFixed(0)+'" r="'+(28 + r() * 26).toFixed(0)+'" fill="'+p.sun+'" opacity="0.85"/>');
  if (kind === 'aurora'){
    for (var a = 0; a < 4; a++){
      var yy = 120 + a * 46 + r() * 30;
      s.push('<path d="M0 '+yy.toFixed(0)+' C 200 '+(yy-70).toFixed(0)+', 420 '+(yy+60).toFixed(0)+', 900 '+(yy-40).toFixed(0)+'" stroke="'+p.lit+'" stroke-width="'+(14 + r()*22).toFixed(0)+'" fill="none" opacity="'+(0.18 + r()*0.2).toFixed(2)+'"/>');
    }
  }
  if (kind === 'night' || kind === 'aurora'){
    for (var st = 0; st < 60; st++) s.push('<circle cx="'+(r()*W).toFixed(0)+'" cy="'+(r()*H*0.55).toFixed(0)+'" r="'+(0.6 + r()*1.5).toFixed(1)+'" fill="#fff" opacity="'+(0.25 + r()*0.6).toFixed(2)+'"/>');
  }
  var hz = H * (0.56 + r() * 0.08);
  var ridge = 'M0 ' + hz.toFixed(0);
  for (var x = 0; x <= W; x += 60) ridge += ' L' + x + ' ' + (hz - 30 - r() * 90).toFixed(0);
  ridge += ' L' + W + ' ' + H + ' L0 ' + H + ' Z';
  s.push('<path d="' + ridge + '" fill="' + p.far + '" opacity="0.9"/>');
  if (kind === 'city' || kind === 'night' || kind === 'street' || kind === 'fire'){
    var bx = -20;
    while (bx < W){
      var bw = 40 + r() * 90, bh = 70 + r() * 220, by = hz - bh + 40;
      s.push('<rect x="'+bx.toFixed(0)+'" y="'+by.toFixed(0)+'" width="'+bw.toFixed(0)+'" height="'+(bh + 200).toFixed(0)+'" fill="'+p.near+'"/>');
      for (var w = 0; w < 14; w++){
        if (r() > 0.55) continue;
        var wx = bx + 8 + r() * (bw - 18), wy = by + 12 + r() * (bh - 24);
        s.push('<rect x="'+wx.toFixed(0)+'" y="'+wy.toFixed(0)+'" width="7" height="10" fill="'+p.lit+'" opacity="'+(0.35 + r()*0.6).toFixed(2)+'"/>');
      }
      bx += bw + 8 + r() * 16;
    }
  }
  s.push('<rect x="0" y="'+(H*0.82).toFixed(0)+'" width="'+W+'" height="'+(H*0.18).toFixed(0)+'" fill="'+p.ground+'"/>');
  if (kind === 'market'){
    for (var aw = 0; aw < 5; aw++){
      var ax = 30 + aw * 175 + r() * 40, ay = H * 0.6 + r() * 30, aw2 = 120 + r() * 60;
      s.push('<path d="M'+ax.toFixed(0)+' '+ay.toFixed(0)+' l'+(aw2/2).toFixed(0)+' -46 l'+(aw2/2).toFixed(0)+' 46 z" fill="'+p.lit+'" opacity="0.55"/>');
      s.push('<rect x="'+ax.toFixed(0)+'" y="'+ay.toFixed(0)+'" width="'+aw2.toFixed(0)+'" height="'+(H*0.24).toFixed(0)+'" fill="'+p.near+'" opacity="0.85"/>');
    }
  }
  var crowd = { market:14, street:11, city:9, park:7, snow:6, water:5, night:8, fire:6, aurora:3 }[kind] || 6;
  for (var c2 = 0; c2 < crowd; c2++){
    var px = r() * W, sc = 0.7 + r() * 0.9, base = H * (0.86 + r() * 0.1);
    s.push('<g fill="#000" opacity="'+(0.55 + r()*0.3).toFixed(2)+'">'
      + '<circle cx="'+px.toFixed(0)+'" cy="'+(base - 46*sc).toFixed(0)+'" r="'+(8*sc).toFixed(1)+'"/>'
      + '<rect x="'+(px - 9*sc).toFixed(0)+'" y="'+(base - 36*sc).toFixed(0)+'" width="'+(18*sc).toFixed(0)+'" height="'+(36*sc).toFixed(0)+'" rx="'+(7*sc).toFixed(0)+'"/></g>');
  }
  if (kind === 'water' || kind === 'flood'){
    for (var q = 0; q < 8; q++) s.push('<rect x="'+(r()*W).toFixed(0)+'" y="'+(H*0.84 + r()*H*0.14).toFixed(0)+'" width="'+(50+r()*180).toFixed(0)+'" height="2" fill="'+p.lit+'" opacity="0.35"/>');
  }
  for (var f = 0; f < 5; f++){
    var fx = r() * W, fh = 40 + r() * 70;
    s.push('<ellipse cx="'+fx.toFixed(0)+'" cy="'+(H*0.9).toFixed(0)+'" rx="'+(10 + r()*14).toFixed(0)+'" ry="'+fh.toFixed(0)+'" fill="#000" opacity="'+(0.28 + r()*0.3).toFixed(2)+'"/>');
  }
  s.push('<rect width="'+W+'" height="'+H+'" fill="url(#v)"/>');
  return 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '+W+' '+H+'">' + s.join('') + '</svg>');
}

/* ---------------- example posts ---------------- */
var DEMO = [
  { m:8, kind:'city', n:6, lat:40.1776, lng:44.5126, tags:['festival','crowd','music'],
    pl:{en:'Yerevan, Republic Square',ru:'Ереван, площадь Республики',hy:'Երևան, Հանրապետության հրապարակ'},
    tx:{en:'Fountains switched on and a brass band showed up out of nowhere. Half the square is dancing.',ru:'Включили фонтаны, откуда-то пришёл духовой оркестр. Половина площади танцует.',hy:'Շատրվանները միացրին, ինչ-որ տեղից եկավ փողային նվագախումբը։ Հրապարակի կեսը պարում է։'} },
  { m:41, kind:'street', n:5, lat:40.1846, lng:44.4930, tags:['water','queue'],
    pl:{en:'Yerevan, Kond',ru:'Ереван, Конд',hy:'Երևան, Կոնդ'},
    tx:{en:'Water off on the whole street since morning, a tanker at the corner is filling bottles.',ru:'С утра на всей улице нет воды, на углу цистерна разливает по бутылкам.',hy:'Առավոտից ամբողջ փողոցում ջուր չկա, անկյունում ցիստեռնը շշերն է լցնում։'} },
  { m:126, kind:'street', n:5, lat:40.1795, lng:44.4991, tags:['streetart'],
    pl:{en:'Yerevan, Kond stairs',ru:'Ереван, лестница Конда',hy:'Երևան, Կոնդի աստիճաններ'},
    tx:{en:'New mural on the Kond stairs, still wet. Two guys are finishing the top corner.',ru:'Новая роспись на лестнице Конда, ещё сырая. Двое дописывают верхний угол.',hy:'Կոնդի աստիճաններին նոր որմնանկար է, դեռ թաց։ Երկուսը վերևի անկյունն են ավարտում։'} },
  { m:190, kind:'market', n:6, lat:40.7894, lng:43.8475, tags:['queue','market','prices'],
    pl:{en:'Gyumri, Vardanants Square',ru:'Гюмри, площадь Вардананц',hy:'Գյումրի, Վարդանանց հրապարակ'},
    tx:{en:'Queue around the corner for the new bakery, they open in ten minutes.',ru:'Очередь за угол в новую пекарню, открытие через десять минут.',hy:'Հերթը մինչև անկյուն՝ նոր հացատան համար, բացվում են տասը րոպեից։'} },
  { m:305, kind:'water', n:5, lat:41.7151, lng:44.8271, tags:['storm'],
    pl:{en:'Tbilisi, Rustaveli Avenue',ru:'Тбилиси, проспект Руставели',hy:'Թբիլիսի, Ռուսթավելի պողոտա'},
    tx:{en:'Hail the size of peas, five minutes and the street turned white.',ru:'Град размером с горошину, пять минут — и улица побелела.',hy:'Ոլոռի չափ կարկուտ, հինգ րոպե, և փողոցը սպիտակեց։'} },
  { m:1180, kind:'snow', n:7, lat:55.7558, lng:37.6176, tags:['snow','crowd'],
    pl:{en:'Moscow, Tverskaya',ru:'Москва, Тверская',hy:'Մոսկվա, Տվերսկայա'},
    tx:{en:'First snow. Everyone stopped and got their phones out at the same second.',ru:'Первый снег. Все остановились и достали телефоны в одну секунду.',hy:'Առաջին ձյունը։ Բոլորը կանգ առան և հեռախոսները հանեցին միևնույն վայրկյանին։'} },
  { m:1650, kind:'city', n:7, lat:52.5163, lng:13.3777, tags:['protest','crowd','police'],
    pl:{en:'Berlin, Unter den Linden',ru:'Берлин, Унтер-ден-Линден',hy:'Բեռլին, Ունտեր դեն Լինդեն'},
    tx:{en:'Column moving down the boulevard, drums at the front, traffic stopped both ways.',ru:'Колонна идёт по бульвару, барабаны впереди, движение встало в обе стороны.',hy:'Շարասյունը գնում է պողոտայով, թմբուկներն առջևում, երթևեկությունը կանգնել է երկու ուղղությամբ։'} },
  { m:2900, kind:'water', n:5, lat:48.8566, lng:2.3466, tags:['flood','nature'],
    pl:{en:'Paris, Quai de la Tournelle',ru:'Париж, набережная Турнель',hy:'Փարիզ, Տուռնել առափնյակ'},
    tx:{en:'River is up to the lower quay, benches are underwater.',ru:'Река поднялась до нижней набережной, скамейки под водой.',hy:'Գետը բարձրացել է մինչև ստորին առափնյակը, նստարանները ջրի տակ են։'} },
  { m:4300, kind:'city', n:5, lat:51.5099, lng:-0.1180, tags:['roadwork','traffic'],
    pl:{en:'London, Strand',ru:'Лондон, Стрэнд',hy:'Լոնդոն, Սթրենդ'},
    tx:{en:'They opened the whole junction overnight. Detour signs point in circles.',ru:'За ночь вскрыли весь перекрёсток. Знаки объезда водят по кругу.',hy:'Գիշերվա ընթացքում ամբողջ խաչմերուկը բացեցին։ Շրջանցման նշանները շրջան են գծում։'} },
  { m:5800, kind:'market', n:6, lat:41.0175, lng:28.9744, tags:['market','animals'],
    pl:{en:'Istanbul, Karaköy fish market',ru:'Стамбул, рыбный рынок Каракёй',hy:'Ստամբուլ, Կարաքյոյի ձկան շուկա'},
    tx:{en:'Fish market at closing time, eleven cats counted, all of them fed.',ru:'Рыбный рынок перед закрытием, насчитал одиннадцать котов, все накормлены.',hy:'Ձկան շուկան փակվելուց առաջ, հաշվեցի տասնմեկ կատու, բոլորը կուշտ։'} },
  { m:8600, kind:'fire', n:5, lat:30.0444, lng:31.2357, tags:['storm','sky'],
    pl:{en:'Cairo, Downtown',ru:'Каир, Даунтаун',hy:'Կահիրե, կենտրոն'},
    tx:{en:'Sand wall came from the west, the sun went orange in two minutes.',ru:'Стена песка пришла с запада, солнце стало оранжевым за две минуты.',hy:'Ավազի պատը եկավ արևմուտքից, արևը երկու րոպեում նարնջագույն դարձավ։'} },
  { m:11500, kind:'water', n:6, lat:19.0760, lng:72.8777, tags:['flood','transport'],
    pl:{en:'Mumbai, Dadar',ru:'Мумбаи, Дадар',hy:'Մումբայ, Դադար'},
    tx:{en:'Water up to the knee at the underpass, rickshaws are turning back.',ru:'У подземного проезда вода по колено, рикши разворачиваются.',hy:'Ստորգետնյա անցման մոտ ջուրը մինչև ծունկն է, ռիկշաները ետ են դառնում։'} },
  { m:14400, kind:'night', n:5, lat:35.6895, lng:139.6917, tags:['quake'],
    pl:{en:'Tokyo, Shinjuku',ru:'Токио, Синдзюку',hy:'Տոկիո, Շինջուկու'},
    tx:{en:'Phones went off together, the building swayed for about ten seconds.',ru:'Телефоны зазвонили разом, здание качало секунд десять.',hy:'Հեռախոսները միասին ազդանշան տվեցին, շենքը մոտ տասը վայրկյան օրորվեց։'} },
  { m:18700, kind:'fire', n:6, lat:-33.8688, lng:151.2093, tags:['fire','rescue','sky'],
    pl:{en:'Sydney, Circular Quay',ru:'Сидней, Циркулар-Ки',hy:'Սիդնեյ, Սըրքուլար Քի'},
    tx:{en:'Smoke from the west, the sun is a dull red circle over the bay.',ru:'Дым с запада, солнце — тусклый красный круг над заливом.',hy:'Ծուխը արևմուտքից է, արևը ծոցի վրայի աղոտ կարմիր շրջան է։'} },
  { m:23000, kind:'night', n:5, lat:40.7306, lng:-73.9866, tags:['blackout','police'],
    pl:{en:'New York, East Village',ru:'Нью-Йорк, Ист-Виллидж',hy:'Նյու Յորք, Իսթ Վիլիջ'},
    tx:{en:'Four blocks without power, someone is directing traffic with a torch.',ru:'Четыре квартала без света, кто-то регулирует движение фонарём.',hy:'Չորս թաղամաս առանց լույսի, ինչ-որ մեկը լապտերով երթևեկությունն է կարգավորում։'} },
  { m:29000, kind:'street', n:6, lat:-23.5613, lng:-46.6560, tags:['concert','crowd'],
    pl:{en:'São Paulo, Avenida Paulista',ru:'Сан-Паулу, Авенида Паулиста',hy:'Սան Պաուլու, Ավենիդա Պաուլիստա'},
    tx:{en:'Band set up on the corner without asking anyone. The corner is full.',ru:'Группа встала на углу, никого не спросив. Угол забит.',hy:'Խումբը կանգնեց անկյունում՝ առանց որևէ մեկին հարցնելու։ Անկյունը լեփ-լեցուն է։'} },
  { m:36000, kind:'aurora', n:5, lat:64.1466, lng:-21.9426, tags:['sky','nature'],
    pl:{en:'Reykjavík, old harbour',ru:'Рейкьявик, старая гавань',hy:'Ռեյկյավիկ, հին նավահանգիստ'},
    tx:{en:'Green band over the harbour, bright enough to read by.',ru:'Зелёная полоса над гаванью, светло настолько, что можно читать.',hy:'Կանաչ շերտ նավահանգստի վրա, այնքան լույս, որ կարելի է կարդալ։'} },
  { m:41000, kind:'city', n:5, lat:34.0522, lng:-118.2437, tags:['traffic','transport'],
    pl:{en:'Los Angeles, 110 freeway',ru:'Лос-Анджелес, шоссе 110',hy:'Լոս Անջելես, 110 մայրուղի'},
    tx:{en:'Freeway is one long red line, nobody moved in twenty minutes.',ru:'Шоссе — одна длинная красная линия, двадцать минут никто не двигался.',hy:'Մայրուղին մեկ երկար կարմիր գիծ է, քսան րոպե ոչ ոք չշարժվեց։'} }
];
function demoPosts(){
  var now = Date.now();
  return DEMO.map(function(d, i){
    var media = [];
    for (var k = 0; k < d.n; k++) media.push({ src: scenePhoto(d.kind, i * 37 + k * 5 + 1) });
    return {
      id:'demo' + i, ts: now - d.m * 60000, owner:'demo', demo:true, type:'photos',
      text:d.tx, place:{ label:d.pl, lat:d.lat, lng:d.lng }, tags:d.tags, media:media
    };
  });
}

/* text of a post can be a plain string (user) or a per-language object (example) */
function textOf(p){ return typeof p.text === 'string' ? p.text : (p.text[lang] || p.text.en); }
function placeOf(p){
  var l = p.place && p.place.label;
  if (!l) return '';
  return typeof l === 'string' ? l : (l[lang] || l.en);
}

/* ---------------- helpers ---------------- */
function esc(s){ return String(s).replace(/[&<>"]/g, function(c){ return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c]; }); }
function ago(ts){
  var diff = (ts - Date.now()) / 1000;
  var rtf = new Intl.RelativeTimeFormat(lang, { numeric:'auto' });
  var u = [['year',31536000],['month',2592000],['day',86400],['hour',3600],['minute',60],['second',1]];
  for (var i = 0; i < u.length; i++)
    if (Math.abs(diff) >= u[i][1] || u[i][0] === 'second') return rtf.format(Math.round(diff / u[i][1]), u[i][0]);
}
function stamp(ts){
  return new Intl.DateTimeFormat(lang, { day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit' }).format(new Date(ts));
}
function postUrl(id, page){
  var base = location.href.split('#')[0].replace(/[^/]*$/, '');
  return base + (page || 'index.html') + '#' + id;
}
function shareText(p){
  var tags = (p.tags || []).map(function(k){ return '#' + k; }).join(' ');
  return textOf(p) + ' — ' + placeOf(p) + (tags ? ' ' + tags : '');
}
var SHARE = [
  { id:'x',  label:'X',        url:function(u,x){ return 'https://twitter.com/intent/tweet?text=' + x + '&url=' + u; },
    svg:'<path d="M17.5 2h3l-6.6 7.6L21.7 22h-6l-4.7-6.2L5.6 22h-3l7-8.1L2 2h6.2l4.3 5.7L17.5 2zm-1 18h1.7L7.6 3.7H5.8L16.5 20z"/>' },
  { id:'tg', label:'Telegram', url:function(u,x){ return 'https://t.me/share/url?url=' + u + '&text=' + x; },
    svg:'<path d="M21.9 4.3 18.7 20c-.2 1-.9 1.3-1.8.8l-4.9-3.6-2.4 2.3c-.3.3-.5.5-1 .5l.4-5 9-8.1c.4-.3-.1-.5-.6-.2L6.3 13.1 1.5 11.6c-1-.3-1-1 .2-1.5l19-7.3c.9-.3 1.6.2 1.2 1.5z"/>' },
  { id:'wa', label:'WhatsApp', url:function(u,x){ return 'https://wa.me/?text=' + x + '%20' + u; },
    svg:'<path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2zm5.6 14.1c-.2.7-1.3 1.3-1.9 1.3-.5 0-1.1.2-3.6-.8-3-1.3-4.9-4.4-5-4.6-.2-.2-1.2-1.6-1.2-3s.8-2.1 1-2.4c.3-.3.6-.4.8-.4h.6c.2 0 .5-.1.7.5l1 2.4c.1.2.1.4 0 .6l-.4.6c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.2.1.4.1.6-.1l.8-1c.2-.2.4-.2.6-.1l2.2 1c.2.1.4.2.4.3.1.2.1.7-.1 1z"/>' },
  { id:'fb', label:'Facebook', url:function(u){ return 'https://www.facebook.com/sharer/sharer.php?u=' + u; },
    svg:'<path d="M13.5 22v-8h2.7l.4-3.1h-3.1V8.9c0-.9.3-1.5 1.6-1.5h1.6V4.6c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.4-4 4.1v2.3H7.5V14h2.8v8h3.2z"/>' },
  { id:'vk', label:'VK',       url:function(u,x){ return 'https://vk.com/share.php?url=' + u + '&title=' + x; },
    svg:'<path d="M12.8 16.7c-5 0-8-3.5-8.2-9.2h2.6c.1 4.2 2 6 3.4 6.3V7.5h2.4v3.7c1.4-.2 2.9-1.8 3.4-3.7h2.4c-.4 2.3-2 3.9-3.1 4.6 1.1.5 3 2 3.7 4.6h-2.7c-.6-1.7-1.9-3.1-3.7-3.3v3.3h-.2z"/>' }
];
function shareBlock(p, tSelf){
  var u = encodeURIComponent(postUrl(p.id)), x = encodeURIComponent(shareText(p));
  var el = document.createElement('div'); el.className = 'share';
  SHARE.forEach(function(s){
    var a = document.createElement('a');
    a.href = s.url(u, x); a.target = '_blank'; a.rel = 'noopener';
    a.title = tSelf('share') + ' — ' + s.label; a.setAttribute('aria-label', tSelf('share') + ' — ' + s.label);
    a.innerHTML = '<svg viewBox="0 0 24 24">' + s.svg + '</svg>';
    el.appendChild(a);
  });
  var c = document.createElement('button');
  c.type = 'button'; c.title = tSelf('copy'); c.setAttribute('aria-label', tSelf('copy'));
  c.innerHTML = '<svg viewBox="0 0 24 24"><path d="M9 2h9a2 2 0 0 1 2 2v11h-2V4H9V2zM5 6h9a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2zm0 2v12h9V8H5z"/></svg>';
  c.addEventListener('click', function(){
    var url = postUrl(p.id);
    if (navigator.share) { navigator.share({ text: shareText(p), url: url }).catch(function(){}); return; }
    if (navigator.clipboard) navigator.clipboard.writeText(url).catch(function(){});
    c.title = tSelf('copied');
  });
  el.appendChild(c);
  return el;
}

/* ---------------- chrome (header) ---------------- */
var listeners = { lang:[], theme:[] };
function on(ev, fn){ listeners[ev].push(fn); }
function fire(ev, v){ listeners[ev].forEach(function(f){ f(v); }); }

function applyLang(next){
  lang = T[next] ? next : 'en';
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-i18n]').forEach(function(el){ el.textContent = t(el.dataset.i18n); });
  document.querySelectorAll('[data-i18n-ph]').forEach(function(el){ el.placeholder = t(el.dataset.i18nPh); });
  document.querySelectorAll('[data-i18n-aria]').forEach(function(el){ el.setAttribute('aria-label', t(el.dataset.i18nAria)); });
  document.querySelectorAll('.langs button').forEach(function(b){ b.setAttribute('aria-pressed', String(b.dataset.lang === lang)); });
  document.querySelectorAll('.thememenu button').forEach(function(b){
    var th = THEMES.filter(function(x){ return x.id === b.dataset.theme; })[0];
    if (th) b.lastChild.textContent = themeName(th);
  });
  var tb = document.querySelector('.themebtn .lbl'); if (tb) tb.textContent = t('theme');
  store.rawSet('jh_lang', lang);
  fire('lang', lang);
}

function initChrome(page){
  var head = document.querySelector('header.top');
  var pages = [['index.html','nav_feed'],['globe.html','nav_globe'],['how.html','nav_rules']];
  var html = '<div class="wrap wide topbar">'
    + '<a class="brand" href="./index.html"><span class="dot"></span>just happened</a>'
    + '<nav class="tabs">' + pages.map(function(p){
        return '<a href="./' + p[0] + '" data-i18n="' + p[1] + '"' + (p[0] === page ? ' aria-current="page"' : '') + '></a>';
      }).join('') + '</nav>'
    + '<span class="spacer"></span>'
    + '<div class="themebox"><button type="button" class="themebtn" aria-haspopup="true" aria-expanded="false"><span class="swatch"></span><span class="lbl"></span></button>'
    + '<div class="thememenu">' + THEMES.map(function(th){
        return '<button type="button" data-theme="' + th.id + '"><span class="chip" style="background:' + th.dot + '"></span><span></span></button>';
      }).join('') + '</div></div>'
    + '<div class="langs" role="group" aria-label="Language">'
    + '<button type="button" data-lang="en">EN</button><button type="button" data-lang="ru">RU</button><button type="button" data-lang="hy">ՀԱ</button>'
    + '</div></div>';
  head.innerHTML = html;

  head.querySelectorAll('.langs button').forEach(function(b){
    b.addEventListener('click', function(){ applyLang(b.dataset.lang); });
  });
  var btn = head.querySelector('.themebtn'), menu = head.querySelector('.thememenu');
  btn.addEventListener('click', function(e){
    e.stopPropagation();
    var open = menu.classList.toggle('on');
    btn.setAttribute('aria-expanded', String(open));
  });
  menu.querySelectorAll('button').forEach(function(b){
    b.addEventListener('click', function(){ applyTheme(b.dataset.theme); menu.classList.remove('on'); btn.setAttribute('aria-expanded','false'); });
  });
  document.addEventListener('click', function(){ menu.classList.remove('on'); btn.setAttribute('aria-expanded','false'); });

  applyTheme(store.raw('jh_theme') || 'blue-matte');
  var savedLang = store.raw('jh_lang');
  applyLang(savedLang || (navigator.language || 'en').slice(0,2).toLowerCase());
}

return {
  T:T, t:t, get lang(){ return lang; }, applyLang:applyLang, on:on,
  THEMES:THEMES, applyTheme:applyTheme, themeName:themeName,
  TAGS:TAGS, tagLabel:tagLabel, customTags:customTags, addCustomTag:addCustomTag,
  store:store, OWNER:OWNER, loadPosts:loadPosts, savePosts:savePosts,
  demoPosts:demoPosts, scenePhoto:scenePhoto,
  textOf:textOf, placeOf:placeOf, esc:esc, ago:ago, stamp:stamp,
  postUrl:postUrl, shareBlock:shareBlock, shareText:shareText,
  initChrome:initChrome
};
})();
