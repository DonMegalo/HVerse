// ==UserScript==
// @name         HentaiVerse Bot
// @version      1.86.9
// @description  Bot for webgame HentaiVerse
// @match        *://*.hentaiverse.org/*
// @match        *://e-hentai.org/*
// @grant        none
// @updateURL    https://bor-kroll.ru/hentaiverseBot.meta.js
// @downloadURL  https://bor-kroll.ru/hentaiverseBot.user.js
// ==/UserScript==

/*
//////// W A R N I N G ////////
1. You may be banned for using that script or for using it recklessly or constantly. Be careful and cautious.
2. Check in game settings that you have installed and using custom fonts. If you don't use that settings then: (or any you would like).
3. With appropriate settings, bot would work on any level, but it is better to have at least 250 level with most spells opened.
4. Mind the syntax and case! The "melee" and "Melee" are too different things, as well [123] and (123).

//////// L E X I C O N ////////
// >>> [ SPELLS ] <<<
411 : Protection  | 412 : Haste             | 413 : ShadowVeil
421 : Absorb      | 422 : SparkofLife       | 423 : SpiritShield
431 : Heartseeker | 432 : ArcaneFocus       | 312 : Regen

311 : Cure        | 313 : Full-Cure

211 : Drain       | 212 : Weaken            | 213 : Imperil
221 : Slow        | 222 : Sleep             | 223 : Confuse
231 : Blind       | 232 : Silence           | 233 : MagNet

111 : Fiery Blast | 112 : Inferno           | 113 : Flames of Loki
121 : Freeze      | 122 : Blizzard          | 123 : Fimbulvetr
131 : Shockblast  | 132 : Chained Lightning | 133 : Wrath of Thor
141 : Gale        | 142 : Downburst         | 143 : Storms of Njord
151 : Smite       | 152 : Banishment        | 153 : Paradise Lost
161 : Corruption  | 162 : Disintegrate      | 163 : Ragnarok

// >>> [ ITEMS ] <<<
501 : Infusion of Flames   | 502 : Infusion of Frost    | 503 : Infusion of Lightning
504 : Infusion of Storms   | 505 : Infusion of Divinity | 506 : Infusion of Darkness
511 : Scroll of Swiftness  | 512 : Scroll of Protection | 513 : Scroll of the Avatar
514 : Scroll of Absorption | 515 : Scroll of Shadows    | 516 : Scroll of Life
517 : Scroll of the Gods

// >>> [ FAMOUS ENEMIES ] <<<
"Manbearpig" | "White Bunneh"           | "Mithra"         | "Dalek"
"Konata"     | "Mikuru Asahina"         | "Ryouko Asakura" | "Yuki Nagato"
"Yggdrasil"  | "Verdandi"               | "Urd"            | "Skuld"
"Rhaegal"    | "Viserion"               | "Drogon"
"Real Life"  | "Invisible Pink Unicorn" | "Flying Spaghetti Monster"

// >>> [ ARENAS ] <<<
"First Blood"     | "Learning Curves"  | "Graduation"   | "Road Less Traveled"
"A Rolling Stone" | "Fresh Meat"       | "Dark Skies"   | "Growing Storm"
"Power Flux"      | "Killzone"         | "Endgame"      | "Longest Journey"
"Dreamfall"       | "Exile"            | "Sealed Power" | "New Wings"
"To Kill a God"   | "Eve of Death"     | "The Trio and the Tree"
"End of Days"     | "Eternal Darkness" | "A Dance with Dragons"
*/

//////// S E T T I N G S ////////
// >>> [ ITEMS ] <<<
/* Restoratives
@about : __Bot automatically uses items when HP, MP or SP are lower than certain percent
@about : __Here you can define how low these stats should be to make bot use respectful item
@input : 0 ~ never use that item
@input : 1-99 ~ use that item when respectful stat is below this percent
@input : 100 ~ use that item asap. Not very useful, but may be handy if you want, for instance, permanent draught debuff */
var useHPDraughtOn = 75;
var useHPPotionOn = 50;
var useHPElixirOn = 25;
var useMPDraughtOn = 65;
var useMPPotionOn = 40;
var useMPElixirOn = 25;
var useSPDraughtOn = 50;
var useSPPotionOn = 30;
var useSPElixirOn = 10;
/* Gems, 1
@about : __Bot automatically uses gems when he has one
@about : __Here you can define extra conditions to make bot use certain gems when HP, MP or SP are lower than certain percent
@input : 0 ~ bot will never use that gem
@input : 1-99 ~ bot will use that gem when respectful stat is below this percent
@input : 100 ~ bot will use that gem asap */
var useHealthGemOn = 100;
var useManaGemOn = 75;
var useSpiritGemOn = 100;
/* Gems, 2
@about : __Here you can define that bot should not use Mystic Gem when he is already under channeling effect
@input : false ~ bot will not use Mystic Gem if he already has channeling
@input : true ~ bot will use Mystic Gem if he already has channeling */
var useMysticGemOnChanelling = false;
/* Infusions & Scrolls
@about : __Bot automatically uses certain infusions & scrolls
@about : __Here you can define WHAT infusions & scrolls should be used. Further, you can define WHEN said items should be used
@input : [] ~ bot will not use these items
@input : [777] or [777, 888] ~ bot will use appropriate items in given order
@note  : __see codes above */
var useInfusionRow = [];
var useScrollRow = [];

// >>> [ PLAYSTYLE ] <<<
/* Build
@about : __Bot may attack enemies either physically  or magically
@about : __Here you can define your current build
@input : "melee" ~ bot will use physical attacks to attack enemies
@input : "mage" ~ bot will use magical attacks to attack enemies, and if, for some reasons, he cannot use his magic, will use physical attack then
@note  : __that setting defines the using of offensive magic only. Both melee and mage can use buffs and debuffs */
var playstyle = "melee";
/* Selection Mode
@about : __Bot may use different algorithms to find what enemy he should attack next
@about : __Here you can define what algorithms should be used
@input : "first" ~ bot will attack first alive enemy
@input : "lesshp" ~ bot will attack enemy with the least HP
@input : "complex" ~ bot will attack enemy with the least HP, but highest MP and SP (assumes ratio of three)
@input : "none" ~ bot will not attack enemies in his own. Player should select and attack enemies instead
@note  : __WARNING! ~complex~ mode may work incorrectly if your level is lower than 250. Don't use that mode then */
var selectionRule = "complex";
/* Enemies to attack first
@about : __Bot may attack certain enemies before anybody else
@about : __Here you can define what enemies bot should attack first
@input : [] ~ bot would not have any preference and will attack enemies according to selection mode
@input : ["Name of Enemy#1", "Name of Enemy#2", "Name of Enemy#3"] ~ bot will attack these monsters first
@note  : See names of popular monsters above */
var selectionOutOfOrder = ["Konata","Mikuru Asahina","Ryouko Asakura","Yuki Nagato","Yggdrasil"];
/* Chance of random attack
@about : __Bot may select enemies with certain percent of randomness
@about : __Here you can define what percent of randomness should  be in bot's attacks
@input : 0 ~ bot will strictly follow selection mode and will not attack enemies at random
@input : 1-99 ~ bot would have these chance of random attack
@input : 100 ~ bot will attack complexly  randomly with no clear pattern */
var selectionRandomChance = 15;
/* Hoverplay
@about : __Bot may provide you option to attack enemies by hovering mouse cursor over them
@about : __Here you can define, are you need that option or not
@input : false ~ hoverplay will be off
@input : true ~ hoverplay will be on
@note  : __This is very primitive form of hoverplay. It does not work with magic and lacks auto-aiming feature. It is mostly should be used as “nice an addition” */
var hoverPlay = false;

// >>> [ MAGIC ] <<<
/* Cure & Full-Cure Spells
@about : __Bot cures himself with cure and full-cure spells when his HP is lower than certain percent
@about : __Here you can define how low health should be to make bot use respectful spells
@input : 0 ~ never use that spell
@input : 1-99 ~ use that spell when HP is below this percent
@input : 100 ~ use that spell asap */
var useCureOn = 35;
var useFullCureOn = 15;
/* Offensive Spells
@about : __Bot casts offensive magic against enemies if you have selected "Mage" playstyle above
@about : __Here you can define what offensive spells should be cast and in what order
@input : [] ~ bot will not use offensive spells
@input : [777] or [777, 888] ~ bot will use these offensive spells
@note  : see codes above */
var mageSpellsRow = [163, 162, 161, 161];
/* Offensive Spells Mode
@about : __Bot can use one of two different modes of using offensive spells: "line" and "cycle"
@about : __Here you can define what mode bot should using
@input : "cycle" ~ bot at the beginning of every turn will use the very first spell in mageSpellsRow and if that spell is not available, will try to use next spell
@input : "line" ~ bot at the beginning of every turn will use next spell after what he used in previous turn, so bot would use every spell in mageSpellsRow
@note  : __Assuming, you have following row — [111, 112, 113]. First, bot casts ~111~ spell. In next turn, bot can either move to next spell in a row ~112~,
@note  : ...or try to cast the first spell ~111~ again. Former mode is called "line", latter mode is called "cycle" */
var mageSpellsRowType = "line";
/* Buffs & Debuffs Spells
@about : __Bot casts both buffs and debuffs in the battle and keeps them active as long as he has enought MP
@about : __Here you can define what buffs and debuffs should be cast and in what order
@input : [] ~ bot will not use these type of spells
@input : [777, 888, 999] ~ bot will use appropriate spells in given order
@note : see codes above */
var useBuffRow = [312,411,413,431];
var useDebuffRow = [213,233];
/* Debuffs Spells Policy
@about : __Bot may use debuffs against certain enemies only
@about : __Here you can define against what enemies bot should use debuff only
@input : [] ~ bot will use debuff against SINGLE enemy ONLY, which was selected according to selection rule and will keep debuff ONLY on such enemy
@input : ["all"] ~ bot will use debuff against ALL enemies and will keep debuff on ALL enemies
@input : ["Name of Enemy#1", "Name of Enemy#2", "Name of Enemy#3"] ~ bot will use debuff against THESE enemies ONLY and will keep debuff on THESE enemies ONLY
@note : ~["all"]~ is not wise idea for melee, because of limited MP, but best option for mage, who prefer imperil-ing every enemy before spamming magic */
var useDebuffCondEnemy = ["Konata","Mikuru Asahina","Ryouko Asakura","Yuki Nagato","Yggdrasil","Rhaegal","Viserion","Drogon","Real Life", "Invisible Pink Unicorn", "Flying Spaghetti Monster", "Time Trial Mode", "Bottomless Dungeon", "Achievement Grind", "New Game +", "Recycled Boss Rush", "Hardcore Mode"];
/* Debuff Spells Chance of Casting
@about : __Bot can use debuff with certain percent of chance (read: bot can use debuffs not on every occasion, but on some only)
@about : __Here you can define the chance of using debuff spell
@input : 0 ~ bot will never use debuffs
@input : 1-99 ~ bot will use debuffs in this percent of chance
@input : 100 ~ bot will use debuffs in every single time when he has a chance */
var useDebuffCondChance = 100;
/* Channeling Spells
@about : __Bot can automatically cast certain spell when he is under Channeling effect
@about : __Here you can define what spells bot should cast under Channeling effect
@input : [] ~ bot will not use some certain spells under Channeling effect
@input : [777, 888, 999] ~ bot will use these spells in given order under Channeling effect
@note  : __see codes above
@note  : You can define here any spell possible: cure, offensive buff or debuff
@note  : __if first spell is not available (cooldown, for instance), bot casts next spell in row, so be sure to put something like full-cure at the end */
var useChannelingRow = [431, 313];

// >>> [ CONDITIONS ] <<<
/* Resource policy
@about : __Bot may either use item or spell if same item or spell is already in use or do not use them to help you save your supply and MP
@about : __Here you can define what type of resource policy for what items and spells should be
@input : -1 ~ bot will NEVER cast ~Buff / Debuff~ or use ~Infusion / Scroll / Draugth~ if effect from same spell / item is not expired yet
@input : 1-999 ~ bot will cast ~Buff / Debuff~ or use ~Infusion / Scroll / Draugth~ if amount of turns left from same spell / item is lower than this value
@input : 0 ~ bot will ALWAYS cast ~Buff / Debuff~ or use ~Infusion / Scroll / Draugth~ EVEN if effect from same spell / item is not expired yet
@note : __Mostly, users do not need to change these options, but if you are using some sort of advanced and weird build of gamestyle, then change them */
var useBuffManagment = 1;
var useDebuffManagment = -1;
var useInfusionManagment = -1;
var useScrollManagment = -1;
var useDraugthManagment = -1;
var useChannelingManagment = -1;
/* Use on Special Enemies Only
@about : __Bot may use ~Infusion / Scroll~ only when there are special enemies in the battle
@about : __Here you can define what enemies should be in battle to make bot use ~Infusion / Scroll~
@input : [] ~ do not use that option
@input : ["Name of Enemy#1", "Name of Enemy#2", "Name of Enemy#3"] ~ bot will use ~Infusion / Scroll~ when these enemies are in battle
@note  : See names of popular monsters above*/
var useInfusionCondEnemy = ["Konata","Mikuru Asahina","Ryouko Asakura","Yuki Nagato","Yggdrasil"];
var useScrollCondEnemy = [];
/* Use on Enough Enemies in the Battle
@about : __Bot may use ~Debuff / Infusion / Scroll~ only when there are enough enemies in the battle
@about : __Here you can define how many enemies should be in the battle to make bot use ~Debuff / Infusion / Scroll~
@input : 0 ~ do not use that option
@input : 1-10 ~ bot will use ~Debuff / Infusion / Scroll~ when there is at least that many enemies it the battle */
var useDebuffCondNum = 0;
var useInfusionCondNum = 0;
var useScrollCondNum = 0;

// >>> [ OFC & SPIRIT STANCE ] <<<
/* OFC
@about : __Bot may use OFC when he has enough charges
@about : __Here you can define how many charges should be to cast OFC
@input : 0 ~ bot will never use OFC
@input : 8-10 ~ bot will use OFC as soon as he has this amount of changes. Decimals (x.5) are accepted
@note : __You should have 21 different ponies to make bot use OFC */
var useOFCCharges = 8;
/* Alive Enemies to launch OFC
@about : __Bot may use OFC when there are enough alive enemies in the battle
@about : __Here you can define how many alive enemies should be to cast OFC
@input : 0 ~ do not use that option
@input : 1-10 ~ bot will use OFC if there are exactly that many alive enemies in the battle
@input : 11-100 ~ bot will use OFC if there is that percent of alive enemies in the battle
@note : __Confused with these two settings? Assuming you have 6 enemies in the battle and 4 of them are alive
@note : __If you input ~5~ in this option, bot will not use OFC, because there is not enough alive enemies in the battle, but will use OFC on values of 4 and below
@note : __If you input ~60~ in this option, bot will use OFC, because 4 out of 6 enemies is 66.6% which is higher than 65%
@note : __If you have problems with converting amount of alive enemies in percent, then this table help you
100%- 1/1 2/2 3/3 4/4 5/5   | 70% - 7/10                 | 34% - 1/3 2/6 3/9
      6/6 7/7 8/8 9/9 10/10 | 67% - 2/3 4/6 6/9          | 30% - 3/10
90% - 9/10                  | 63% - 5/8                  | 29% - 2/7
89% - 8/9                   | 60% - 3/5 6/10             | 25% - 1/4 2/8
88% - 7/8                   | 58% - 4/7                  | 23% - 2/9
86% - 6/7                   | 56% - 5/9                  | 20% - 1/5 2/10
84% - 5/6                   | 50% - 1/2 2/4 3/6 4/8 5/10 | 17% - 1/6
80% - 4/5 8/10              | 45% - 4/9                  | 15% - 1/7
78% - 7/9                   | 43% - 3/7                  | 13% - 1/8
75% - 3/4 6/8               | 40% - 2/5 4/10             | 12% - 1/9
71% - 5/7                   | 38% - 3/8                  | 12% - 1/10 */
var useOFCEnemies = 50;
/* Spirit Stance
@about : __Bot may use Spirit Stance when he has enough charges
@about : __Here you can define how many charges should be to use Spirit Stance
@input : 0 ~ bot will never use Spirit Stance
@input : 2-10 ~ bot will use Spirit Stance as soon as he has this amount of changes. Decimals (x.5) are accepted */
var useSpiritStanceCharges = 8;

// >>> [ RIDDLEMASTER ] <<<
/* Accept Answer From Clicking
@about : __Script may give you an additional point-and-click interface on RiddleMaster screen to accept answers. See this link: https://goo.gl/S32GkK
@input : false ~ do not use that additional interface
@input : true ~ use that additional interface */
var riddleMasterAnswerClick = true;
/* Accept Answer From Keyboard
@about : __Script can tweak the default behavior when player have to select “answer” field first before accepting answer from keyboard
@about : __With that option on, player can give and submit answer without selecting “answer” field first
@input : false ~ do not use that option
@input : true ~ use that option */
var riddleMasterAnswerKeyboard = true;
/* Random Answer on Last Call
@about : __Script may submit the random answer on riddlemaster when certain number of seconds has been passed
@about : __In short, this is more like your last resort — giving the random answer on Riddlemaster with 33% of its success is still better than answering nothing
@input : 0 ~ do not use that option
@input : 1-19 ~ how many seconds should be passed before bot will answer automatically with random guessing */
var riddleMasterAnswerAutoAfter = 15;

// >>> [ AUTO-PLAY ] <<<
/* Auto-Arena
@about : __Bot may automatically advance to next arena after finishing previous one
@about : __Here you can define should bot move to next arena or not
@input : false ~ do not use that option
@input : true ~ use that option
@note  : __Bot takes at least 12 seconds (and few random seconds more) before selecting next arena
@note  : __Bot informs you about his intention to move to next arena and you can cancel it */
var autoArena = true;
/* Arenas to Auto-Play?
@about : __Here you can define a list of arenas that bot should automatically play
@input : [] ~ bot will automatically select all arenas in order
@input : ["Learning Curves", "Exile", "New Wings"] ~ bot will automatically select only these arenas. Do not put here arenas you have not opened yet */
var autoArenaList = ["A Dance with Dragons", "Eternal Darkness", "End of Days", "The Trio and the Tree", "Eve of Death", "To Kill a God", "New Wings", "Sealed Power", "Exile", "Dreamfall", "Longest Journey"];
/* Auto-RE
@about : __Bot may automatically do next Random Encounter when time is ready
@about : __Here you can define should bot move to next Random Encounter or not
@input : false ~ do not use that option
@input : true ~ use that option */
var autoRE = true;
/* Auto-RE delay
@about : __Bot may advance do next Random Encounter with a delay (to mimic human-like behavior)
@about : __Here you can define how long bot should wait before moving to next RE
@input : 0 ~ bot will go to next RE as soon as it is ready.
@input : 1-99999 ~ amount of seconds bot should wait before moving to next RE. Recommended to use 600 - 1000 value
@note  : __Script automatically takes randomness in account, so with value of 800 seconds, bot will wait somewhere in between 8 min and 15 min */
var autoREDelay = 600;
/* Show counter until next auto-RE
@about : __Here you can define should or should not bot show you how many minutes and seconds left until next RE
@input : true ~ bot will show such counter
@input : false ~ bot will not show such counter
@note  : __That counter shows time, according to autoREDelay. When counter hits zero, bot will automatically do next RE */
var autoREShowCounter = true;
/* Energy Drinks
@about : __Bot may automatically use Energy Drink if his current stamina is lower than certain value
@about : __Here you can define what stamina should be (and lower) to make bot to use Energy Drinks
@input : 0 ~ do not use that option
@input : 1-85 ~ use Energy Drink when stamina is lower than this value. After HV's update 0.86, you cannot use any value higher than 85 */
var useEnergyDrinkOn = 70;

// >>> [ PLAY AUDIO ] <<<
/* Auto-Arena
@about : __Bot may play audio on certain conditions
@about : __Here you can define where and what sudio should be played
@input : "" ~ do not play audio on this condition
@input : "default" ~ play default in-build sound file
@input : "https://freesound.org/data/previews/370/370195_5121236-lq.mp3" (any link) ~ play audiofile on that link
@note  : __In case of custom link, browser need to install connection to dedicated server and cache audio file first, so this is possible that audio will not
@note  : ...be playing in first instance and after cleaning of browser's cache. Both http:// and https:// are accepted. Various browsers have different supports
@note  : ...for various audio formats, check this link to find what is best for you: https://goo.gl/Ysre73 (for most modern browsers mp3 is best) */
var riddleMasterPlayAudio = "default";
var arenaFinishedPlayAudio = "default";

// >>> [ DROPLOG ] <<<
/* DropLog
@about : __Bot can remember and store all drops and reward he have got during the battle and show this list for you in the menu
@about : __Here you can define do you need to bot keep track of drops
@input : false ~ do not use that option
@input : true ~ use that option
@note  : __You can check all your drops by visiting a link at ~Character screen~. Bot can stores as many as possibly drops, but more drops you have,
@note  : ...the longer it takes to load the list of drops. It is a good idea to clear that list after every 15.000 or so drops. */
var useDropLog = true;
/* Remember enemies' names
@about : __Here you can define should or should not bot remember enemies' names in DropLog
@input : false ~ bot will not store and remember enemies' names
@input : true ~ bot will store and remember enemies' names
@about : __This could help to optimize and trim database a little */
var rememberEnemiesNames = true;

// >>> [ MISC ] <<<
/* Delays
@about : __Bot may wait few milleconds before doing next action. This is very usefull if you want to hide your bot activity
@input : 0 ~ do not use that option. NOT RECOMMENDED
@input : 1-99999 ~ amount of millesconds bot should wait before doing next action.
@note  : __1000 millisconds is 1 second. Script waits proven amount of millesconds plus/minus a little margin. So with 350 value in, bot will wait somewhere
@note  : ...in between 175 ms and 525 ms to give it more "human-like" behavior. Good amount is in between 200 and 500, depending on your paranoia */
var humanlikeDelay = 50;

/* Pause Button
@about : __Bot stops all his activity, when you have pressed certain button
@input : 1-999 ~ programmed code of keyboard button, for example, 27 stands escape button. You can find list of such codes here: https://goo.gl/HFJmjQ */
var stopBotButton = 27;

//////Settings End ////////

function mainBattleScript() {
    var vCurHPBS, vCurMPBS, vCurSPBS, vCurCPBS;
    if ($BS("#dvbh")) {
        vCurHPBS = $BS("#dvbh img")[0].width / 414 * 100;
        vCurMPBS = $BS("#dvbm img")[0].width / 414 * 100;
        vCurSPBS = $BS("#dvbs img")[0].width / 414 * 100;
        vCurCPBS = $BS("#dvbc img")[0].width / 414 * 10;
    } else {
        vCurHPBS = $BS("#vbh img")[0].width / 496 * 100;
        vCurMPBS = $BS("#vbm img")[0].width / 207 * 100;
        vCurSPBS = $BS("#vbs img")[0].width / 207 * 100;
        vCurCPBS = uLengtherBS($BS("#vcp div div:not(#vcr)")) + uLengtherBS($BS("#vcp div #vcr")) * 0.5;
    }
    var eMonTotalBS = $BS("#pane_monster .btm1");
    var eMonTotalNamesBS = $BS("#pane_monster .btm1 .fc2.fal.fcb div");
    var vMonTotalBS = uLengtherBS(eMonTotalBS);
    var eMonAliveBS = $BS("#pane_monster .btm1[onmouseover]");
    var eMonAliveNamesBS = $BS("#pane_monster .btm1[onmouseover] .fc2.fal.fcb div");
    var vMonAliveBS = uLengtherBS(eMonAliveBS);
    var eMonAliveHPBS = $BS("#pane_monster .btm1[onmouseover] img[src='/y/s/nbargreen.png']");
    var eMonAliveMPBS = $BS("#pane_monster .btm1[onmouseover] img[src='/y/s/nbarblue.png']");
    var eMonAliveSPBS = $BS("#pane_monster .btm1[onmouseover] img[src='/y/s/nbarred.png']");
    var eBuffBS = $BS("#pane_effects");
    for (var rv = 0, rvt = $BS("#textlog .tl"), lrv = rvt.length; rv < lrv; rv += 1) {
        var tp = rvt[rv].textContent;
        if (/Round\s\d/.test(tp)) {
            var tr = tp.match(/\s\d+/g);
            var rc = ~~tr[0];
            var rt = (/Item\sWorld/.test(tp))? 0 : ~~tr[1];
            localStorage.setItem("logRoundCurrentBS", rc);
            localStorage.setItem("logRoundTotalBS", rt);
        }
    }
    function uAttackerBS() {
        var m, s, t, h, hm = 101, c, cm = 0;
        if (vMonAliveBS === 0) {return false;}

        if (uNumComparerBS(uRandomerBS(), selectionRandomChance)) {
            s = eMonAliveBS[uRandomerBS(0, vMonAliveBS - 1)];
        } else {
            t = uTextComparerBS(selectionOutOfOrder,eMonAliveNamesBS);
            if (t.locationMonster[0]) {
                s = t.locationMonster[0];
            } else {
                for (var i = 0; i < vMonAliveBS; i += 1) {
                    m = eMonAliveBS[i];
                    if (selectionRule === "first"||selectionRule === "none") {
                        s = m;
                        break;
                    } else if (selectionRule === "lesshp") {
                        h = eMonAliveHPBS[i].width * 100 / 120;
                        if (uNumComparerBS(h, hm)) {
                            hm = h;
                            s = m;
                        }
                    } else if (selectionRule === "complex") {
                        c = Math.pow(100 - eMonAliveHPBS[i].width * 100 / 120, 1.14) + Math.pow(eMonAliveMPBS[i].width * 100 / 120, 1.12) + Math.pow(eMonAliveSPBS[i].width * 100 / 120, 1.17);
                        if (uNumComparerBS(cm, c)) {
                            cm = c;
                            s = m;
                        }
                    }
                }
            }
        }
        s.classList.add("toBeAttacked");
        return s;
    }
    var eTargetBS = uAttackerBS();
    function uDecoderBS(q) {
        //ToDo
        var dbl, db, ct, cw, idTemp, ett, cat, ctr, cmpt, cnpt, ccpt, cept, capt, tr, w, n, k, ce, cn, cc, cm, z = true;

        q = ~~q;
        if (q == 999) {w = "channeling"; n = ""; k = "ch";}

        else if (q == 411) {w = "protection"; n = ""; k = "b";}
        else if (q == 412) {w = "haste"; n = ""; k = "b";}
        else if (q == 413) {w = "shadowveil"; n = ""; k = "b";}
        else if (q == 421) {w = "absorb"; n = ""; k = "b";}
        else if (q == 422) {w = "sparklife"; n = ""; k = "b";}
        else if (q == 423) {w = "spiritshield"; n = ""; k = "b";}
        else if (q == 431) {w = "heartseeker"; n = ""; k = "b";}
        else if (q == 432) {w = "arcanemeditation"; n = ""; k = "b";}
        else if (q == 312) {w = "regen"; n = ""; k = "b";}

        else if (q == 211) {w = "drainhp"; n = ""; k = "db";}
        else if (q == 212) {w = "weaken"; n = ""; k = "db";}
        else if (q == 213) {w = "imperil"; n = ""; k = "db";}
        else if (q == 221) {w = "slow"; n = ""; k = "db";}
        else if (q == 222) {w = "sleep"; n = ""; k = "db";}
        else if (q == 223) {w = "confuse"; n = ""; k = "db";}
        else if (q == 231) {w = "blind"; n = ""; k = "db";}
        else if (q == 232) {w = "silence"; n = ""; k = "db";}
        else if (q == 233) {w = "magnet"; n = ""; k = "db";}

        else if (q == 311) {w = ""; n = ""; k = "cr";}
        else if (q == 313) {w = ""; n = ""; k = "cr";}

        else if (q == 111) {w = ""; n = ""; k = "of";}
        else if (q == 112) {w = ""; n = ""; k = "of";}
        else if (q == 113) {w = ""; n = ""; k = "of";}
        else if (q == 121) {w = ""; n = ""; k = "of";}
        else if (q == 122) {w = ""; n = ""; k = "of";}
        else if (q == 123) {w = ""; n = ""; k = "of";}
        else if (q == 131) {w = ""; n = ""; k = "of";}
        else if (q == 132) {w = ""; n = ""; k = "of";}
        else if (q == 133) {w = ""; n = ""; k = "of";}
        else if (q == 141) {w = ""; n = ""; k = "of";}
        else if (q == 142) {w = ""; n = ""; k = "of";}
        else if (q == 143) {w = ""; n = ""; k = "of";}
        else if (q == 151) {w = ""; n = ""; k = "of";}
        else if (q == 152) {w = ""; n = ""; k = "of";}
        else if (q == 153) {w = ""; n = ""; k = "of";}
        else if (q == 161) {w = ""; n = ""; k = "of";}
        else if (q == 162) {w = ""; n = ""; k = "of";}
        else if (q == 163) {w = ""; n = ""; k = "of";}

        else if (q == 501) {w = "fireinfusion"; n = "InfusionofFlames"; k = "i";}
        else if (q == 502) {w = "coldinfusion"; n = "InfusionofFrost"; k = "i";}
        else if (q == 503) {w = "elecinfusion"; n = "InfusionofLightning"; k = "i";}
        else if (q == 504) {w = "windinfusion"; n = "InfusionofStorms"; k = "i";}
        else if (q == 505) {w = "holyinfusion"; n = "InfusionofDivinity"; k = "i";}
        else if (q == 506) {w = "darkinfusion"; n = "InfusionofDarkness"; k = "i";}

        else if (q == 511) {w = "haste_scroll"; n = "ScrollofSwiftness"; k = "s";}
        else if (q == 512) {w = "protection_scroll"; n = "ScrollofProtection"; k = "s";}
        else if (q == 513) {w = "haste_scroll"; n = "ScrolloftheAvatar"; k = "s";} // need to be fixed
        else if (q == 514) {w = "absorb_scroll"; n = "ScrollofAbsorption"; k = "s";}
        else if (q == 515) {w = "shadowveil_scroll"; n = "ScrollofShadows"; k = "s";}
        else if (q == 516) {w = "sparklife_scroll"; n = "ScrollofLife"; k = "s";}
        else if (q == 517) {w = "shadowveil_scroll"; n = "ScrolloftheGods"; k = "s";}  // need to be fixed

        else if (q == 521) {w = "healthpot"; n = "HealthDraught"; k = "d";}
        else if (q == 522) {w = "manapot"; n = "ManaDraught"; k = "d";}
        else if (q == 523) {w = "spiritpot"; n = "SpiritDraught"; k = "d";}

        else if (q == 531) {w = ""; n = "HealthPotion"; k = "r";}
        else if (q == 532) {w = ""; n = "ManaPotion"; k = "r";}
        else if (q == 533) {w = ""; n = "SpiritPotion"; k = "r";}

        else if (q == 541) {w = ""; n = "HealthElixir"; k = "r";}
        else if (q == 542) {w = ""; n = "ManaElixir"; k = "r";}
        else if (q == 543) {w = ""; n = "SpiritElixir"; k = "r";}

        else if (q == 551) {w = ""; n = "LastElixir"; k = "r";}
        else if (q == 552) {w = ""; n = "EnergyDrink"; k = "r";}

        else if (q == 561) {w = ""; n = "FlowerVase"; k = "r";}
        else if (q == 562) {w = ""; n = "BubbleGum"; k = "r";}

        else {alert(": uDecoderBS [ERR-1]: WARNING! ("+q+") is not a valid number ; check the settings please!");}

        if (k == "ch" || k == "cr" || k == "r" || k == "of") {
            ce = "";
            cn = 0;
            cc = 100;
            cm = 0;
        }
        else if (k == "b") {
            ce = "";
            cn = 0;
            cc = 100;
            cm = useBuffManagment;
        }
        else if (k == "db") {
            ce = useDebuffCondEnemy;
            cn = useDebuffCondNum;
            cc = useDebuffCondChance;
            cm = useDebuffManagment;
        }
        else if (k == "i") {
            ce = useInfusionCondEnemy;
            cn = useInfusionCondNum;
            cc = 100;
            cm = useInfusionManagment;
        }
        else if (k == "s") {
            ce = useScrollCondEnemy;
            cn = useScrollCondNum;
            cc = 100;
            cm = useScrollManagment;
        }
        else if (k == "d") {
            ce = "";
            cn = 0;
            cc = 100;
            cm = useDraugthManagment;
        }

        cnpt = (uNumComparerBS(cn,vMonTotalBS)) ? true : false;
        ccpt = (uNumComparerBS(uRandomerBS(),cc)) ? true : false;

        if (ce[0] === "all" || ce.length === 0 ) {
            cept = true;
        } else {
            cept = ((uTextComparerBS(ce,eMonAliveNamesBS,true)).value === true) ? true : false;
        }

        if (500 <= q && q <= 599) {
            if (localStorage.getItem(n) === "" || localStorage.getItem(n) == "none") {
                z = false;
            }
            ct = (z) ? true : false;
            idTemp = localStorage.getItem(n);
        } else {
            ct = ($BS(q) && !$BS(q).style.opacity) ? true : false;
            idTemp = q;
        }

        if (q == 312 || q == 999 || (400 <= q) && (q <= 499) || (500 <= q) && (q <= 523)) {
            cw = eBuffBS.querySelector("img[src*="+w+"]");
        } else if((200 <= q) && (q <= 299)){
            if (ce.length === 0) {
                db = $BS(".toBeAttacked");
            } else if (ce == "all") {
                db = eMonAliveBS;
            } else {
                db = $BS(".same");
            }
            dbl = uLengtherBS(db);
            for (var i = 0; i < dbl; i += 1) {
                cw = db[i].querySelector("img[src*="+w+"]");
                ett = db[i];
                if (cw) {
                    continue;
                } else {
                    break;
                }
            }
        } else {
            ett = eTargetBS;
            cw = false;
        }

        ctr = (cw) ? cw.getAttribute("onmouseover").replace(/.+\,\s(.+)\)$/g,"$1") : 0;
        ctr = (ctr == "'autocast'" || ctr == "'permanent'") ? 9999 : ~~ctr;

        if (cw) {
            cat = true;
            cm = (cm === 0) ? 9999 : cm;
            if (cm == -1) {
                cmpt = false;
            } else {
                cmpt = (uNumComparerBS(ctr,cm)) ? true : false;
            }
        } else {
            cat = false;
            cmpt = true;
        }

        capt = (cmpt && cept && cnpt && ccpt && ct) ? true : false;

        tr = (200 <= q && q <= 299 || 100 <= q && q <= 199) ? true : false;

        return {
            transfer : tr,
            enemyTarget: ett,
            name: n,
            canuse: ct,
            id: idTemp,
            castedAlready: cat,
            turns: ctr,
            useCondManagPass: cmpt,
            useCondEnemyPass: cept,
            useCondNumPass: cnpt,
            useCondChancePass: ccpt,
            useCondAllPass: capt
        };
    }
    function aUsingItemsSpells(q, a) {
        //ToDo
        if (typeof q != "object") {
            var qq = [];
            qq.push(q);
            q = qq;
        }
        var l = uLengtherBS(q);
        var ch, u, sw, chm;
        for (var i = 0; i < l; i += 1) {
            u = uDecoderBS(q[i]);
            if (u.canuse) {
                if (a === "channeling") {
                    ch = uDecoderBS([999]);
                    if (ch.castedAlready) {
                        if (u.castedAlready) {
                            chm = (useChannelingManagment === 0) ? 9999 : useChannelingManagment;
                            if (chm == -1) {
                                sw = false;
                            } else {
                                sw = (uNumComparerBS(u.turns,chm)) ? true : false;
                            }
                        } else {
                            sw = true;
                        }
                    }
                } else {
                    if (u.useCondAllPass) {
                        sw = true;
                    }
                }
                if (sw) {
                    if ($BS(u.id)) {
                        $BS(u.id).click();
                    }
                    if (u.transfer === true) {
                        u.enemyTarget.click();
                    }
                }
            }
        }
    }
    function aStopButton() {
        window.addEventListener("keydown", function (event) {
            event = event || window.event;
            var key = event.which || event.keyCode || event.charCode;
            if (key === stopBotButton) {
                uFSnotifyBS("Bot is paused.<br>Click <a href='/'>here</a> to continue, or reload the page");
                selectionRule = "none";
                stopBotButton = 121;//ToDo
            }
        }, false);
    }
    function aLogParseBS() {
        // ToDo
        if (useDropLog === true && $BS("#btcp")) {
            for (var dp = 0, dpl = $BS("#textlog .tlb").length ; dp < dpl ; dp += 1) {
                var text = $BS("#textlog .tlb")[dp].textContent;
                var textItem, textEnemy, textType, textValue, textKind;
                if (/(dropped\s|Clear\sBonus\!|You\sobtained|Token\sBonus|You\sgain\s\d+\sCredits!)/i.test(text)) {
                    textItem = text.replace(/.+\[(.+)\]/i,"$1");
                    if (/You\sobtained/i.test(text)) {textEnemy = "Random Encounter Clear Bonus!";}
                    else if (/You\sgain/i.test(text)) {textItem = text.replace(/You\sgain\s(.+)/i,"$1");textEnemy = "Clear Reward";}
                    else {textEnemy = (rememberEnemiesNames) ? text.replace(/(.+)\[.+/i,"$1").replace(/dropped?/i,"").trim() : "";}

                    if (/Credits/i.test(textItem)) {
                        textType = "Credits";
                        textValue = textItem.match(/\d*/i)[0];
                        textKind = "";
                    } else if (/(Crude|Fair|Average|Superior|Exquisite|Magnificent|Legendary|Peerless)/i.test(textItem)) {
                        textType = "Equipment";
                        textValue= "";
                        textKind = textItem.match(/Crude|Fair|Average|Superior|Exquisite|Magnificent|Legendary|Peerless/i)[0].trim();
                    } else if (/Crystal\sof/.test(textItem)) {
                        textType = "Crystal";
                        textValue = textItem.replace(/(\d+).+/i,"$1");
                        textKind = textItem.replace(/.+\sof\s(.+)/i,"$1");
                    } else if (/(Mana|Health|Spirit)/i.test(textItem)) {
                        textType = "Restorative";
                        textValue = "";
                        textKind = textItem.replace(/.+\s(.+)$/i,"$1");
                    } else if (/(Scroll\sof)/i.test(textItem)) {
                        textType = "Scroll";
                        textValue = "";
                        textKind = textItem.replace(/.+of\s(the\s)?(.+)/i,"$2");
                    } else if (/(Infusion\sof)/i.test(textItem)) {
                        textType = "Infusion";
                        textValue = "";
                        textKind = textItem.replace(/.+of\s(.+)/i,"$1");
                    } else if (/(Monster)/i.test(textItem)) {
                        textType = "Monster Food";
                        textValue = "";
                        textKind = "";
                    } else if (/(Happy)/i.test(textItem)) {
                        textType = "Happy Pill";
                        textValue = "";
                        textKind = "";
                    } else if (/(Artifact|Figurine)/i.test(textItem)) {
                        textType = "Artifact";
                        textValue = "";
                        textKind = "";
                    } else if (/Soul\sFragments/i.test(textItem)) {
                        textType = "Soul Fragment";
                        textValue = text.replace(/.+\s(.+)\s\[.+\]/i,"$1");
                        textKind = "";
                    } else if (/Manbearpig\sTail|Holy\sHand\sGrenade\sof\sAntioch|Mithra's\sFlower|Dalek\sVoicebox|Lock\sof\sBlue\sHair|Bunny-Girl\sCostume|Hinamatsuri\sDoll|Broken\sGlasses|Sapling|Black\sT\-Shirt|Unicorn\sHorn|Noodly\sAppendage/i.test(textItem)) {
                        textType = "Trophy";
                        textValue = "";
                        textKind = "";
                    } else if (/Chaos\sToken|Token\sof\sBlood/i.test(textItem)) {
                        textType = "Token";
                        textValue = "";
                        textKind = "";
                    } else {
                        textType = "Misc";
                        textValue = "";
                        textKind = "";
                    }

                    var textRound = (localStorage.getItem("logRoundCurrentBS") === null) ? "-" : ~~localStorage.getItem("logRoundCurrentBS");

                    var textArena = (localStorage.getItem("logRoundTotalBS")   === null) ? 9999 : ~~localStorage.getItem("logRoundTotalBS");

                    var ar = [];
                    ar[0] = "Item World";
                    ar[1] = "Ring of Blood";
                    ar[5] = "First Blood";
                    ar[7] = "Learning Curves";
                    ar[12] = "Graduation";
                    ar[15] = "Road Less Traveled";
                    ar[20] = "A Rolling Stone";
                    ar[25] = "Fresh Meat";
                    ar[30] = "Dark Skies";
                    ar[35] = "Growing Storm";
                    ar[40] = "Power Flux";
                    ar[45] = "Killzone";
                    ar[50] = "Endgame";
                    ar[55] = "Longest Journey";
                    ar[60] = "Dreamfall";
                    ar[65] = "Exile";
                    ar[70] = "Sealed Power";
                    ar[75] = "New Wings";
                    ar[80] = "To Kill A God";
                    ar[90] = "Eve of Death";
                    ar[100] = "The Trio and the Tree";
                    ar[110] = "End of Days";
                    ar[125] = "Eternal Darkness";
                    ar[150] = "A Dance With Dragons";
                    ar[1000] = "Grindfest";
                    ar[9999] = "Random Encounter";

                    var d = new Date();
                    var m = [];
                    m[0] = "01";
                    m[1] = "02";
                    m[2] = "03";
                    m[3] = "04";
                    m[4] = "05";
                    m[5] = "06";
                    m[6] = "07";
                    m[7] = "08";
                    m[8] = "09";
                    m[9] = "10";
                    m[10] = "11";
                    m[11] = "12";
                    var hrs = (d.getHours() < 10) ? "0"+d.getHours() : d.getHours();
                    var mins = (d.getMinutes() < 10) ? "0"+d.getMinutes() : d.getMinutes();
                    var textDate = m[d.getMonth()]+"."+d.getDate()+" "+hrs+":"+mins;

                    var itemReturn = {
                        n : textItem,
                        e : textEnemy,
                        t : textType,
                        v : textValue,
                        k : textKind,
                        r : textRound,
                        a : ar[textArena],
                        d : textDate
                    };

                    var storage = (localStorage.getObj("logDropsBS")) ? localStorage.getObj("logDropsBS") : [];
                    storage.push(itemReturn);
                    localStorage.setObj("logDropsBS", storage);
                }
            }
        }
    }
    function aGoToNextRoundBS() {
        var a = $BS("#btcp");
        if(a){
            localStorage.removeItem("currentSpellBS");
            a.click();
        }
    }
    function aInitParseBS() {
        var vMonAliveBSt = (vMonAliveBS === 0) ? undefined : vMonAliveBS;
        if(eMonAliveHPBS.length != vMonAliveBSt && eMonAliveNamesBS.length != vMonAliveBSt) {
            alert("WARNING! Turn off bot immediately! It appears that admin is using invisible monsters to catch bot-users!");
        }
        // ToDo
        var l = ["Health Draught", "Mana Draught", "Spirit Draught", "Health Potion", "Mana Potion", "Spirit Potion", "Health Elixir", "Mana Elixir", "Spirit Elixir", "Energy Drink", "Last Elixir", "Infusion of Flames", "Infusion of Frost", "Infusion of Lightning", "Infusion of Storms", "Infusion of Divinity", "Infusion of Darkness", "Scroll of Swiftness", "Scroll of Protection", "Scroll of the Avatar", "Scroll of Absorption", "Scroll of Shadows", "Scroll of Life", "Scroll of the Gods", "Flower Vase", "Bubble-Gum"];
        var e = $BS("#pane_item .bti3 div div div");
        var c, r, q, a = [];
        for (var i = 0, li = uLengtherBS(l); i < li; i += 1) {
            c = l[i].replace(/[\s\-]/g, "");
            a = [];
            a.push(l[i]);
            r = uTextComparerBS(a, e);
            q = (r.slot[0]) ? r.slot[0] : "none";
            localStorage.setItem(c, q);
        }
        if (hoverPlay) {
            for (var ii = 0; ii < vMonAliveBS; ii += 1) {
                var em = eMonAliveBS[ii];
                em.setAttribute("onmouseover", em.getAttribute("onclick"));
                em.setAttribute("onmouseout", em.getAttribute("onclick"));
            }
        }

        uCounterREBS();
    }
    function aUseGemsBS(){
        var a = $BS("#ikey_p");
        var at = a.textContent;
        if (a) {
            if (at === "Mystic Gem" && (useMysticGemOnChanelling || uDecoderBS(999).castedAlready === false)) {a.click();}
            if (at === "Health Gem" && uNumComparerBS(vCurHPBS,useHealthGemOn)) {a.click();}
            if (at === "Mana Gem"   && uNumComparerBS(vCurMPBS,useManaGemOn)) {a.click();}
            if (at === "Spirit Gem" && uNumComparerBS(vCurSPBS,useSpiritGemOn)) {a.click();}
        }
    }
    function aUseCureSpellBS()    {if (uNumComparerBS(vCurHPBS,useCureOn))     {aUsingItemsSpells([311]);}}
    function aUseFullCureSpellBS(){if (uNumComparerBS(vCurHPBS,useFullCureOn)) {aUsingItemsSpells([313]);}}
    function aUseHealthDraughtBS(){if (uNumComparerBS(vCurHPBS,useHPDraughtOn)){aUsingItemsSpells([521]);}}
    function aUseManaDraughtBS()  {if (uNumComparerBS(vCurMPBS,useMPDraughtOn)){aUsingItemsSpells([522]);}}
    function aUseSpiritDraughtBS(){if (uNumComparerBS(vCurSPBS,useSPDraughtOn)){aUsingItemsSpells([523]);}}
    function aUseHealthPotionBS() {if (uNumComparerBS(vCurHPBS,useHPPotionOn)) {aUsingItemsSpells([531]);}}
    function aUseManaPotionBS()   {if (uNumComparerBS(vCurMPBS,useMPPotionOn)) {aUsingItemsSpells([532]);}}
    function aUseSpiritPotionBS() {if (uNumComparerBS(vCurSPBS,useSPPotionOn)) {aUsingItemsSpells([533]);}}
    function aUseHealthElixirBS() {if (uNumComparerBS(vCurHPBS,useHPElixirOn)) {aUsingItemsSpells([541]);}}
    function aUseManaElixirBS()   {if (uNumComparerBS(vCurMPBS,useMPElixirOn)) {aUsingItemsSpells([542]);}}
    function aUseSpiritElixirBS() {if (uNumComparerBS(vCurSPBS,useSPElixirOn)) {aUsingItemsSpells([543]);}}
    function aUseChannelingBS(){aUsingItemsSpells(useChannelingRow,"channeling");}
    function aUseBuffsBS()     {aUsingItemsSpells(useBuffRow);}
    function aUseDebuffsBS()   {aUsingItemsSpells(useDebuffRow);}
    function aUseInfusionsBS() {aUsingItemsSpells(useInfusionRow);}
    function aUseScrollsBS()   {aUsingItemsSpells(useScrollRow);}
    function aUseOFCBS() {
        var ch = (useOFCCharges === 0) ? 999 : useOFCCharges;
        var mdl = (useOFCEnemies <= 10) ? 100 : vMonTotalBS;
        if (uNumComparerBS(ch,vCurCPBS) && uNumComparerBS(useOFCEnemies,vMonAliveBS,mdl) && $BS("#1111") && !$BS("#1111").style.opacity) {
            $BS("#1111").click();
        }
    }
    function aUseSpiritStanceBS() {
        var ch = (useSpiritStanceCharges === 0) ? 999 : useSpiritStanceCharges;
        if (uNumComparerBS(ch,vCurCPBS) && ($BS("[src='/y/battle/spirit_n.png']")[0] || $BS("[src='/y/battle/spirit_s.png']")[0])) {
            $BS("#ckey_spirit").click();
        }
    }
    function aAttackEnemy() {
        if (selectionRule !== "none") {
            if (playstyle === "mage") {
                var row = mageSpellsRow;
                var rowl = row.length;
                var mistakes = 0;
                var current;
                if (mageSpellsRowType == "line") {
                    if (localStorage.getItem("currentSpellBS") === null) {
                        current = -1;
                    } else {
                        current = localStorage.getItem("currentSpellBS");
                        current = ~~current;
                    }
                    while (mistakes < rowl) {
                        current += 1;
                        if (current >= rowl){
                            current = 0;
                        }
                        localStorage.removeItem("currentSpellBS");
                        localStorage.setItem("currentSpellBS", current);
                        var u = uDecoderBS(row[current]);
                        if (u.canuse){
                            if (u.useCondAllPass) {
                                $BS(u.id).click();
                                if (u.transfer === true) {
                                    u.enemyTarget.click();
                                    break;
                                }
                            }
                        }
                        mistakes += 1;
                    }
                    eTargetBS.click(); // ToDo
                } else {
                    aUsingItemsSpells(mageSpellsRow);
                    eTargetBS.click(); // ToDo
                }
            } else {
                eTargetBS.click();
            }
        }
    }

    setTimeout(function(){
        aStopButton();
        aLogParseBS();
        aGoToNextRoundBS();
        aInitParseBS();
        aUseGemsBS();
        aUseHealthElixirBS();
        aUseHealthPotionBS();
        aUseHealthDraughtBS();
        aUseChannelingBS();
        aUseFullCureSpellBS();
        aUseCureSpellBS();
        aUseManaElixirBS();
        aUseManaPotionBS();
        aUseManaDraughtBS();
        aUseSpiritElixirBS();
        aUseSpiritPotionBS();
        aUseSpiritDraughtBS();
        aUseBuffsBS();
        aUseDebuffsBS();
        aUseInfusionsBS();
        aUseScrollsBS();
        aUseOFCBS();
        aUseSpiritStanceBS();
        aAttackEnemy();
    }, humanlikeDelay + (uRandomerBS(humanlikeDelay / -2, humanlikeDelay / 2)));
}
function findScreenWeAreInBS() {
    if ($BS("#textlog")) {
        document.title = ".:Bot|In Battle:.";
        var eLog = $BS("#textlog tbody")[0];
        var eLogObserver = new MutationObserver(mainBattleScript);
        eLogObserver.observe(eLog, {childList: true});
        mainBattleScript();
    } else if ($BS("#riddlemaster")) {
        document.title = ".:Bot|Riddlemaster:.";
        var op = ["A", "B", "C"];
        uPlayAudioBS(riddleMasterPlayAudio);
        var solveRiddle = function(q) {
            $BS("riddleanswer").value = q;
            $BS("riddleform").submit();
        };
        if (riddleMasterAnswerAutoAfter !== 0) {
            var timeWhenClick = Date.now() + riddleMasterAnswerAutoAfter * 1000;
            setInterval(function() {
                if (Date.now() >= timeWhenClick) {
                    timeWhenClick = timeWhenClick + 10000000000;
                    solveRiddle(op[uRandomerBS(0, 2)]);
                }
            }, 150);
        }

        if (riddleMasterAnswerClick) {
            var b = document.body.appendChild(document.createElement("div"));
            b.style.cssText = "z-index: 1000;width: 702px;height: 28px;position: absolute;top: 58px;left: 286px;display: table;";
            for (var i = 0; i < 3; i += 1) {
                var bt = b.appendChild(document.createElement("div"));
                bt.style.cssText = "display: table-cell;cursor: pointer;border: ridge 2px red;";
                bt.onmouseover = function() {this.style.background = "rgba(125,0,0,0.3)";};
                bt.onmouseout = function() {this.style.background = "";};
                bt.value = op[i];
                bt.onclick = function() {solveRiddle(this.value);};
            }
        }
        if (riddleMasterAnswerKeyboard) {
            document.addEventListener("keyup", function(e) {
                var k = String.fromCharCode(e.keyCode);
                if (k >= "1" && k <= "3") {
                    solveRiddle(op[k - 1]);
                } else if (k === "A" || k === "B" || k === "C") {
                    solveRiddle(k);
                }
            }, true);
        }
    } else if ($BS("#stamina_readout")){
        localStorage.removeItem("logRoundCurrentBS");
        localStorage.removeItem("logRoundTotalBS");
        uCounterREBS();

        if (useEnergyDrinkOn !== 0 && $BS("img[src='/y/userestorative.png']")) {
            var stamina = ~~$BS("#stamina_readout .fcb")[0].textContent.replace(/\D/g,"");
            if (uNumComparerBS(stamina,useEnergyDrinkOn)) {
                $BS("img[src='/y/userestorative.png']")[0].click();
            }
        }

        if (autoRE) {
            autoArena = false;
            var nextREin = Date.now() + 1850000 + uRandomerBS(autoREDelay * 750, autoREDelay * 1250);
            if (localStorage.getItem("timeWhenNextREbeBS") !== null) {
                setInterval(function() {
                    if (parseInt(localStorage.getItem("timeWhenNextREbeBS")) < Date.now()){
                        localStorage.setItem("timeWhenNextREbeBS", nextREin);
                        uFSnotifyBS("Bot will automatically enter next RE. Click <a href='/'>HERE</a> to cancel it");
                        setTimeout(function(){
                            document.location.href = "https://e-hentai.org/news.php";
                        }, 5000);
                    }
                }, 1000);
            } else {
                localStorage.setItem("timeWhenNextREbeBS", nextREin);
            }
            autoArena = true;
        }

        if ($BS("#attr_outer")) {
            document.title = ".:Bot|Character:.";
            if (useDropLog) {
               var buttonShowDrops = uAppenderBS("button", document.getElementById("prof_outer"));
                buttonShowDrops.innerHTML = "SHOW DROPS";
                buttonShowDrops.onclick = function() {

                    $BS("csp").parentNode.removeChild($BS("csp"));
                    var tableLogsAll = localStorage.getObj("logDropsBS");

                    var DropsStyle = document.body.appendChild(document.createElement("style"));
                    DropsStyle.innerHTML = " div#DropsFilter input[type='submit'] {width: 80%;margin-left: 2em;} #wrapper{display:flex;flex-flow:row wrap}#DropsTotal h3{padding:0;margin:.7em 0 .2em}#DropsTotal div{padding:.5em;border:1px solid lightgray;margin:.25em;background:#fff;box-shadow:0 0 3px silver}#DropsTotal div h3:first-child{text-transform:uppercase;border-bottom:1px solid}#DropsTotal div h3:last-child{font-size:1.5em}table[data-sortable]{border-collapse:collapse;border-spacing:0;width:100%}table[data-sortable] th{vertical-align:bottom;font-weight:700}table[data-sortable] th,table[data-sortable] td{text-align:left;padding:.5em}table[data-sortable] th:not([data-sortable='false']){-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;-o-user-select:none;user-select:none;-webkit-tap-highlight-color:rgba(0,0,0,0);-webkit-touch-callout:none;cursor:pointer}table[data-sortable] th:after{content:'';visibility:hidden;display:inline-block;vertical-align:inherit;height:0;width:0;border-width:5px;border-style:solid;border-color:transparent;margin-right:1px;margin-left:4px;float:right}table[data-sortable] th[data-sorted='true']:after{visibility:visible}table[data-sortable] th[data-sorted-direction='descending']:after{border-top-color:inherit;margin-top:4px}table[data-sortable] th[data-sorted-direction='ascending']:after{border-bottom-color:inherit;margin-top:0}table[data-sortable]{color:#333;background:#fff;border:1px solid #e0e0e0}table[data-sortable] thead th{background-image:-webkit-gradient(linear,50% 0%,50% 100%,color-stop(0%,#fff),color-stop(100%,#eee));background-image:-webkit-linear-gradient(#fff,#eee);background-image:-moz-linear-gradient(#fff,#eee);background-image:-o-linear-gradient(#fff,#eee);background-image:linear-gradient(#fff,#eee);background-color:#f0f0f0;border-bottom:1px solid #e0e0e0}table[data-sortable] tbody td{border-top:1px solid #5C0D11}table[data-sortable] th[data-sorted='true']{-webkit-box-shadow:inset 1px 0 #bce8f1,inset -1px 0 #bce8f1;-moz-box-shadow:inset 1px 0 #bce8f1,inset -1px 0 #bce8f1;box-shadow:inset 1px 0 #bce8f1,inset -1px 0 #bce8f1;color:#3a87ad;background:#d9edf7;border-bottom-color:#bce8f1}table[data-sortable] th[data-sorted='true']:first-child{-webkit-box-shadow:inset -1px 0 #bce8f1;-moz-box-shadow:inset -1px 0 #bce8f1;box-shadow:inset -1px 0 #bce8f1}table[data-sortable] th[data-sorted='true']:last-child{-webkit-box-shadow:inset 1px 0 #bce8f1;-moz-box-shadow:inset 1px 0 #bce8f1;box-shadow:inset 1px 0 #bce8f1}table[data-sortable] th[data-sorted='true'][data-sorted-direction='descending']:after{border-top-color:#3a87ad}table[data-sortable] th[data-sorted='true'][data-sorted-direction='ascending']:after{border-bottom-color:#3a87ad}  #filter{padding:.7em;background:#fff;border:1px solid;color:#000; font-size:1.2em}#filter h3{padding: 0;margin: .2em 0 .5em 0;}#filter ul{padding:0;margin:0;text-align:left;list-style:none;display:table-cell;width:45%;margin-bottom:1em}  #DropsFilter > input[type='submit']:hover, #DropsFilter > input[type='submit']:active, #DropsFilter > input[type='submit']:focus,input[type='submit']:hover, input[type='submit']:active, input[type='submit']:focus {background: #000;color: white;border-color: #5C0D11;}input[type='submit'] {display: block;background: #5C0D11;color: #fff;text-transform: uppercase;}  #DropsFilter > input[type='submit'] {margin: 1em 0 .5em 0; background: rebeccapurple; font-size: 1.4em;}";

                    var wrapper = uAppenderBS("div");
                    wrapper.id = "wrapper";
                    wrapper.innerHTML = "<div id='DropsTotal' style='flex:100%;display:flex;flex-flow:row wrap;justify-content:space-around;border:solid 1px;background:#f5f5f5;padding:1em'><div><input type='submit' id='dropLogExit' style='font-size: 1.5em; margin: 1em 0;' value='Exit DropLog'><a href='/'></a></div><div><h3>Credits</h3><h3 id='totalCr'>0</h3></div><div><h3>Equips</h3><h3 id='totalEq'>0</h3></div><div><h3>Restors</h3><h3 id='totalRe'>0</h3></div><div><h3>Scrolls</h3><h3 id='totalSc'>0</h3></div><div><h3>Crystals</h3><h3 id='totalCs'>0</h3></div><div><h3>Infusions</h3><h3 id='totalIn'>0</h3></div><div><h3>Mon-Foods</h3><h3 id='totalMf'>0</h3></div><div><h3>HPills</h3><h3 id='totalHp'>0</h3></div><div><h3>Artifacts</h3><h3 id='totalAr'>0</h3></div><div><h3>Trophies</h3><h3 id='totalTr'>0</h3></div><div><h3>SoulFrag</h3><h3 id='totalSf'>0</h3></div><div><h3>Tokens</h3><h3 id='totalTk'>0</h3></div><div><h3>Misc</h3><h3 id='totalMs'>0</h3></div></div><div id='DropsTable' style='flex:80%;'><table data-sortable='abc'><thead><tr><th>ID</th><th>Name</th><th>Dropped by</th><th>Type</th><th>Value</th><th>Kind</th><th>Round</th><th>Battle Mode</th><th>Date</th></tr></thead><tbody id='ItemList'></tbody></table></div><div id='DropsFilter' style='flex:20%;'><input type='submit' id='dropLogClear' value='Clear DropLog'><div id='filter'><h3>SHOW ONLY</h3><ul><li><input type='checkbox' name='filter' id='filterCredits' value='credits'><label for='filterCredits'>Credits</label></li><li><input type='checkbox' name='filter' id='filterRestoratives' value='restoratives'><label for='filterRestoratives'>Restoratives</label></li><li><input type='checkbox' name='filter' id='filterInfusions' value='infusions'><label for='filterInfusions'>Infusions</label></li><li><input type='checkbox' name='filter' id='filterScrolls' value='scrolls'><label for='filterScrolls'>Scrolls</label></li><li><input type='checkbox' name='filter' id='filterHappypills' value='happypills'><label for='filterHappypills'>Happy Pills</label></li><li><input type='checkbox' name='filter' id='filterTrophies' value='trophies'><label for='filterTrophies'>Trophies</label></li><li><input type='checkbox' name='filter' id='filterTokens' value='tokens'><label for='filterTokens'>Tokens</label></li></ul><ul><li><input type='checkbox' name='filter' id='filterEquipment' value='equipment'><label for='filterEquipment'>Equipments</label></li><li><input type='checkbox' name='filter' id='filterCrystals' value='crystals'><label for='filterCrystals'>Crystals</label></li><li><input type='checkbox' name='filter' id='filterMonsterfoods' value='monsterfoods'><label for='filterMonsterfoods'>Monster Foods</label></li><li><input type='checkbox' name='filter' id='filterArtifacts' value='artifacts'><label for='filterArtifacts'>Artifacts</label></li><li><input type='checkbox' name='filter' id='filterSoulfragments' value='soulfragments'><label for='filterSoulfragments'>Soul Fragments</label></li><li><input type='checkbox' name='filter' id='filterMisc' value='misc'><label for='filterMisc'>Misc</label></ul><input id='applyFilter' type='submit' value='Apply Filter(s)'><input id='clearFilter' type='submit' value='Clear Filter(s)'></div></div> ";

                    var totalCrCur = 0,totalEqCur= 0,totalCsCur= 0,totalReCur= 0,totalScCur= 0,totalInCur= 0,totalMfCur= 0,totalHpCur= 0,totalArCur= 0,totalSiCur= 0,totalShCur= 0,totalSfCur= 0,totalTrCur= 0,totalTkCur= 0,totalMsCur= 0;
                    for (var i = 0, li = tableLogsAll.length; i < li; i += 1) {
                        if (tableLogsAll[i].t == "Credits")            {totalCrCur += ~~tableLogsAll[i].v;}
                        else if (tableLogsAll[i].t === "Equipment")    {totalEqCur += 1;}
                        else if (tableLogsAll[i].t === "Restorative")  {totalReCur += 1;}
                        else if (tableLogsAll[i].t === "Crystal")      {totalCsCur += ~~tableLogsAll[i].v;}
                        else if (tableLogsAll[i].t === "Scroll")       {totalScCur += 1;}
                        else if (tableLogsAll[i].t === "Infusion")     {totalInCur += 1;}
                        else if (tableLogsAll[i].t === "Monster Food") {totalMfCur += 1;}
                        else if (tableLogsAll[i].t === "Happy Pill")   {totalHpCur += 1;}
                        else if (tableLogsAll[i].t === "Artifact")     {totalArCur += 1;}
                        else if (tableLogsAll[i].t === "Soul Fragment"){totalSfCur += 1;}
                        else if (tableLogsAll[i].t === "Trophy")       {totalTrCur += 1;}
                        else if (tableLogsAll[i].t === "Token")        {totalTkCur += 1;}
                        else if (tableLogsAll[i].t === "Misc")         {totalMsCur += 1;}
                    }
                    $BS("totalCr").innerHTML = totalCrCur;
                    $BS("totalEq").innerHTML = totalEqCur;
                    $BS("totalRe").innerHTML = totalReCur;
                    $BS("totalCs").innerHTML = totalCsCur;
                    $BS("totalSc").innerHTML = totalScCur;
                    $BS("totalIn").innerHTML = totalInCur;
                    $BS("totalMf").innerHTML = totalMfCur;
                    $BS("totalHp").innerHTML = totalHpCur;
                    $BS("totalAr").innerHTML = totalArCur;
                    $BS("totalSf").innerHTML = totalSfCur;
                    $BS("totalTr").innerHTML = totalTrCur;
                    $BS("totalTk").innerHTML = totalTkCur;
                    $BS("totalMs").innerHTML = totalMsCur;

                    (function(){var a,b,c,d,e,f,g;a="table[data-sortable]",d=/^-?[£$¤]?[\d,.]+%?$/,g=/^\s+|\s+$/g,c=["click"],f="ontouchstart"in document.documentElement,f&&c.push("touchstart"),b=function(a,b,c){return null!=a.addEventListener?a.addEventListener(b,c,!1):a.attachEvent("on"+b,c)},e={init:function(b){var c,d,f,g,h;for(null==b&&(b={}),null==b.selector&&(b.selector=a),d=document.querySelectorAll(b.selector),h=[],f=0,g=d.length;g>f;f++)c=d[f],h.push(e.initTable(c));return h},initTable:function(a){var b,c,d,f,g,h;if(1===(null!=(h=a.tHead)?h.rows.length:void 0)&&"true"!==a.getAttribute("data-sortable-initialized")){for(a.setAttribute("data-sortable-initialized","true"),d=a.querySelectorAll("th"),b=f=0,g=d.length;g>f;b=++f)c=d[b],"false"!==c.getAttribute("data-sortable")&&e.setupClickableTH(a,c,b);return a}},setupClickableTH:function(a,d,f){var g,h,i,j,k,l;for(i=e.getColumnType(a,f),h=function(b){var c,g,h,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C,D;if(b.handled===!0)return!1;for(b.handled=!0,m="true"===this.getAttribute("data-sorted"),n=this.getAttribute("data-sorted-direction"),h=m?"ascending"===n?"descending":"ascending":i.defaultSortDirection,p=this.parentNode.querySelectorAll("th"),s=0,w=p.length;w>s;s++)d=p[s],d.setAttribute("data-sorted","false"),d.removeAttribute("data-sorted-direction");if(this.setAttribute("data-sorted","true"),this.setAttribute("data-sorted-direction",h),o=a.tBodies[0],l=[],m){for(D=o.rows,v=0,z=D.length;z>v;v++)g=D[v],l.push(g);for(l.reverse(),B=0,A=l.length;A>B;B++)k=l[B],o.appendChild(k)}else{for(r=null!=i.compare?i.compare:function(a,b){return b-a},c=function(a,b){return a[0]===b[0]?a[2]-b[2]:i.reverse?r(b[0],a[0]):r(a[0],b[0])},C=o.rows,j=t=0,x=C.length;x>t;j=++t)k=C[j],q=e.getNodeValue(k.cells[f]),null!=i.comparator&&(q=i.comparator(q)),l.push([q,k,j]);for(l.sort(c),u=0,y=l.length;y>u;u++)k=l[u],o.appendChild(k[1])}return"function"==typeof window.CustomEvent&&"function"==typeof a.dispatchEvent?a.dispatchEvent(new CustomEvent("Sortable.sorted",{bubbles:!0})):void 0},l=[],j=0,k=c.length;k>j;j++)g=c[j],l.push(b(d,g,h));return l},getColumnType:function(a,b){var c,d,f,g,h,i,j,k,l,m,n;if(d=null!=(l=a.querySelectorAll("th")[b])?l.getAttribute("data-sortable-type"):void 0,null!=d)return e.typesObject[d];for(m=a.tBodies[0].rows,h=0,j=m.length;j>h;h++)for(c=m[h],f=e.getNodeValue(c.cells[b]),n=e.types,i=0,k=n.length;k>i;i++)if(g=n[i],g.match(f))return g;return e.typesObject.alpha},getNodeValue:function(a){var b;return a?(b=a.getAttribute("data-value"),null!==b?b:"undefined"!=typeof a.innerText?a.innerText.replace(g,""):a.textContent.replace(g,"")):""},setupTypes:function(a){var b,c,d,f;for(e.types=a,e.typesObject={},f=[],c=0,d=a.length;d>c;c++)b=a[c],f.push(e.typesObject[b.name]=b);return f}},e.setupTypes([{name:"numeric",defaultSortDirection:"descending",match:function(a){return a.match(d)},comparator:function(a){return parseFloat(a.replace(/[^0-9.-]/g,""),10)||0}},{name:"date",defaultSortDirection:"ascending",reverse:!0,match:function(a){return!isNaN(Date.parse(a))},comparator:function(a){return Date.parse(a)||0}},{name:"alpha",defaultSortDirection:"ascending",match:function(){return!0},compare:function(a,b){return a.localeCompare(b)}}]),setTimeout(e.init,0),"function"==typeof define&&define.amd?define(function(){return e}):"undefined"!=typeof exports?module.exports=e:window.Sortable=e}).call(this); 

                    for (var ii = 0, lii = uLengtherBS(tableLogsAll); ii < lii ; ii += 1) {
                        var currentItem = tableLogsAll[ii];
                        var tableDropsTr = uAppenderBS("tr", $BS("ItemList"));
                        var tableDropsTdId = uAppenderBS("td", tableDropsTr);
                        tableDropsTdId.classList.add("id");
                        tableDropsTdId.innerHTML = ii;
                        var tableDropsTdName = uAppenderBS("td", tableDropsTr);
                        tableDropsTdName.classList.add("Name");
                        tableDropsTdName.innerHTML = currentItem.n;
                        var tableDropsTdEnemy = uAppenderBS("td", tableDropsTr);
                        tableDropsTdEnemy.classList.add("Enemy");
                        tableDropsTdEnemy.innerHTML = currentItem.e;
                        var tableDropsTdType = uAppenderBS("td", tableDropsTr);
                        tableDropsTdType.classList.add("Type");
                        tableDropsTdType.innerHTML = currentItem.t;
                        var tableDropsTdValue = uAppenderBS("td", tableDropsTr);
                        tableDropsTdValue.classList.add("Value");
                        tableDropsTdValue.innerHTML = ~~currentItem.v;
                        var tableDropsTdKind =  uAppenderBS("td", tableDropsTr);
                        tableDropsTdKind.classList.add("Kind");
                        tableDropsTdKind.innerHTML = currentItem.k;
                        var tableDropsTdRound = uAppenderBS("td", tableDropsTr);
                        tableDropsTdRound.classList.add("Round");
                        tableDropsTdRound.innerHTML = currentItem.r;
                        var tableDropsTdBattleMod = uAppenderBS("td", tableDropsTr);
                        tableDropsTdBattleMod.classList.add("BattleMode");
                        tableDropsTdBattleMod.innerHTML = currentItem.a;
                        var tableDropsTdDate = uAppenderBS("td", tableDropsTr);
                        tableDropsTdDate.classList.add("Date");
                        tableDropsTdDate.innerHTML = currentItem.d;
                    }
                    var buttonFilterOne = $BS("applyFilter");
                    buttonFilterOne.onclick = function() {
                        var allTypes = document.querySelectorAll("#DropsTable .Type");
                        for (i = 0, len = allTypes.length; i < len; i++) {
                            var allTypesParent = allTypes[i].parentNode;
                            var allTypesCur = allTypes[i].textContent;
                            if (allTypesCur=="Credits"){if (!$BS('filterCredits').checked) {allTypesParent.style.display="none";} else {allTypesParent.style.display="table-row";}}
                            else if (allTypesCur=="Restorative"){if (!$BS('filterRestoratives').checked) {allTypesParent.style.display="none";} else {allTypesParent.style.display="table-row";}}
                            else if (allTypesCur=="Infusion"){if (!$BS('filterInfusions').checked) {allTypesParent.style.display="none";} else {allTypesParent.style.display="table-row";}}
                            else if (allTypesCur=="Scroll"){if (!$BS('filterScrolls').checked) {allTypesParent.style.display="none";} else {allTypesParent.style.display="table-row";}}
                            else if (allTypesCur=="Happy Pill"){if (!$BS('filterHappypills').checked) {allTypesParent.style.display="none";} else {allTypesParent.style.display="table-row";}}
                            else if (allTypesCur=="Trophy"){if (!$BS('filterTrophies').checked) {allTypesParent.style.display="none";} else {allTypesParent.style.display="table-row";}}
                            else if (allTypesCur=="Token"){if (!$BS('filterTokens').checked) {allTypesParent.style.display="none";} else {allTypesParent.style.display="table-row";}}
                            else if (allTypesCur=="Equipment"){if (!$BS('filterEquipment').checked) {allTypesParent.style.display="none";} else {allTypesParent.style.display="table-row";}}
                            else if (allTypesCur=="Crystal"){ if (!$BS('filterCrystals').checked) {allTypesParent.style.display="none";} else {allTypesParent.style.display="table-row";}}
                            else if (allTypesCur=="Monster Food"){if (!$BS('filterMonsterfoods').checked) {allTypesParent.style.display="none";} else {allTypesParent.style.display="table-row";}}
                            else if (allTypesCur=="Artifact"){if (!$BS('filterArtifacts').checked) {allTypesParent.style.display="none";} else {allTypesParent.style.display="table-row";}}
                            else if (allTypesCur=="Soul Fragment"){if (!$BS('filterSoulfragments').checked) {allTypesParent.style.display="none";} else {allTypesParent.style.display="table-row";}}
                            else if (allTypesCur=="Misc"){if (!$BS('filterMisc').checked) {allTypesParent.style.display="none";} else {allTypesParent.style.display="table-row";}}
                        }
                    };
                    var buttonFilterTwo = $BS("clearFilter");
                    buttonFilterTwo.onclick = function() {
                        var allTypes = document.querySelectorAll("#DropsTable .Type");
                        for (var a = 0,  la = allTypes.length; a < la; a += 1) {
                            var allTypesParent = allTypes[a].parentNode;
                            allTypesParent.style.display="table-row";
                        }
                        for (var b = 0, lb = $BS("input[type='checkbox']").length; b < lb; b += 1){
                            if ($BS("input[type='checkbox']")[b].checked === true) {
                                $BS("input[type='checkbox']")[b].click();
                            }
                        }
                    };
                    var dropLogExit = $BS("dropLogExit");
                    var dropLogClear = $BS("dropLogClear");
                    dropLogExit.onclick = function() {
                        $BS(("[href='/']"))[0].click();
                    };
                    dropLogClear.onclick = function() {
                        localStorage.setItem("logDropsBS", "[]");
                        $BS('[href]')[$BS('[href]').length-1].click();
                    };
                };
            }
        }
        if ($BS("#eqsb"))           {document.title = ".:Bot|Equipment:.";}
        if ($BS("#ability_outer"))  {document.title = ".:Bot|Abilites:.";}
        if ($BS("#train_outer"))    {document.title = ".:Bot|Training:.";}
        if ($BS("#item_outer"))     {document.title = ".:Bot|Item Inventory:.";}
        if ($BS("#eqinv_outer"))    {document.title = ".:Bot|Equip Inventory:.";}
        if ($BS("#settings_outer")) {document.title = ".:Bot|Settings:.";}
        if ($BS("#eqshop_outer"))   {document.title = ".:Bot|Equipment Shop:.";}
        if ($BS("#itshop_outer"))   {document.title = ".:Bot|Item Shop:.";}
        if ($BS("#itembot_outer"))  {document.title = ".:Bot|Item Shop Bot:.";}
        if ($BS("#monster_outer"))  {document.title = ".:Bot|Monster Lab:.";}
        if ($BS("#shrine_outer"))   {document.title = ".:Bot|Shrine:.";}
        if ($BS("#mmail_outer"))    {document.title = ".:Bot|MoogleMail:.";}
        if ($BS("#lottery_eqstat")) {document.title = ".:Bot|Lottery:.";}
        if ($BS("#arena_pages"))    {
            document.title = ".:Bot|The Arena:.";
            if (autoArena) {
                uPlayAudioBS(arenaFinishedPlayAudio);
                        var eArenaNamesBS = $BS("#arena_list td:first-child");
                        var aaa = uTextComparerBS(autoArenaList,eArenaNamesBS);
                        var notice = document.body.appendChild(document.createElement("div"));
                        var sw;
                        if (autoArenaList != "" && aaa.button.length !== 0) {
                            uFSnotifyBS("Bot will automatically enter next arena ~"+aaa.button[0].parentNode.parentNode.querySelector("td").textContent+"~. Click <a href='/'>HERE</a> to cancel it");
                            sw = 1;
                        } else if (autoArenaList == "" && $BS("img[src='/y/arena/startchallenge_d.png']")[0]) {
                            uFSnotifyBS("Bot will automatically enter next arena ~"+$BS("img[src='/y/arena/startchallenge_d.png']")[0].parentNode.parentNode.querySelector("td").textContent+"~. Click <a href='/'>HERE</a> to cancel it");
                            sw = 2;
                        }
                        if (sw <= 2) {
                            setTimeout(function(){
                                if (sw === 1) {
                                    aaa.button[0].click();
                                } else if (sw === 2) {
                                    $BS("img[src='/y/arena/startchallenge_d.png']")[0].click();
                                }
                            } ,25000 + uRandomerBS(-2500, 2500));
                        } else {
                            $BS("img[src='/y/arena/pg2.png'")[0].click();
                        }
            }
        }
        if ($BS("#arena_tokens"))   {document.title = ".:Bot|Ring of Blood:.";}
        if ($BS("#grindfest"))      {document.title = ".:Bot|GrindFest:.";}
        if ($BS("#itemworld_outer")){document.title = ".:Bot|Item World:.";}
        if ($BS("#repairall"))      {document.title = ".:Bot|Repair:.";}
        if ($BS("#upgrade_button")) {document.title = ".:Bot|Upgrade:.";}
        if ($BS("#enchant_button")) {document.title = ".:Bot|Enchant:.";}
        if ($BS("#salvage_button")) {document.title = ".:Bot|Salvage:.";}
        if ($BS("#reforge_button")) {document.title = ".:Bot|Reforge:.";}
        if ($BS("#soulfuse_button")){document.title = ".:Bot|Soulfuse:.";}
    } else if ($BS("#newsinner")){
            document.title = ".:Bot|Front Page:.";
            if ($BS("#eventpane a[onclick]")[0]) {
                $BS("#eventpane a[onclick]")[0].removeAttribute('onclick');
                $BS("#eventpane a")[0].click();
            } else {
                document.location.href = "https://hentaiverse.org/";
            }
    } else {
        //alert("can't parse where we are!");
    }
}
document.title = "Bot active";
window.confirm=function(arg){return true;};
function deb(q) {
    if (q) {
        console.log("! DEBUGGER [Q-T]: ("+q+") is..");
    } else {
        console.log("! DEBUGGER [Q-F]: ("+q+") is...");
    }
    console.log(q);
}
function uLengtherBS(q) {
    var l = (typeof q == "object" && q !== null) ? q.length : 0;
    return (l) ? l : 0;
}
function $BS(q) {
    var a, w, e, s;
    q = (typeof q !== "string") ? String(q) : q;
    if (document.getElementById(q)) {
        return document.getElementById(q);
    } else {
        w = q.replace(/[^0-9a-zA-Z_]+/g, "");
        if (document.getElementById(w)) {
            return document.getElementById(w);
        } else {
            e = q.replace(/\D/g, "");
            if (document.getElementById(e)) {
                return document.getElementById(e);
            } else {
                a = ((/^[0-9]/.test(q)) || (/[\#\.\[][0-9]/.test(q))) ? false : true;
                if (a) {
                    s = uLengtherBS(document.querySelectorAll(q));
                    if (s !== 0) {
                        return document.querySelectorAll(q);
                    }
                }
            }
        }
    }
    return false;
}
function uRandomerBS(q, a) {
    q = (Number.isFinite(q)) ? q : 1;
    a = (Number.isFinite(a)) ? a : 100;
    if (q > a) {q ^= a;a ^= q;q ^= a;}
    return Math.floor(Math.random() * (a - q + 1)) + q;
}
function uNumComparerBS(q, a, z) {
    q = (Number.isFinite(q)) ? q : ~~q;
    a = (Number.isFinite(a)) ? a : ~~a;
    z = (Number.isFinite(z)) ? z : 100;
    return (q <= a * 100 / z) ? true : false;
}
function uTextComparerBS(q, a, z) {
    var l, b, s, v = false, ll = [], aa = [], ss = [], bb = [];
    var ql = uLengtherBS(q);
    var al = uLengtherBS(a);
    for (var i = 0; i < ql; i += 1) {
        for (var ii = 0; ii < al; ii += 1) {
            if (q[i] === a[ii].textContent) {
                v = true;
                if (z) {
                    l = a[ii].parentNode.parentNode.parentNode;
                    l.classList.add("same");
                }
                s = a[ii].parentNode.parentNode.id;
                b = a[ii].parentNode.querySelector("img[onclick]");
                ll.push(l);
                aa.push(a[ii]);
                ss.push(s);
                bb.push(b);
            }
        }
    }
    bb = bb.filter(function(n){return n !== null;});
    return {
        value: v,
        location: aa,
        locationMonster: ll,
        slot: ss,
        button: bb
    };
}
function uPlayAudioBS(q) {
    var audio;
    if (q === "") {
        return false;
    }
    else if (q != "default") {
        audio = new Audio(q);
    }
    else {
        audio = new Audio("data:audio/x-wav;base64, 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");
    }
    audio.volume = 1;
    audio.loop = "true";
    audio.play();
}
function uAppenderBS(q,w) {
    var e = document.createElement(q);
    return (!w) ? document.body.appendChild(e) : w.appendChild(e);
}
function uFSnotifyBS(q) {
    var notifyOut;
    if ($BS("#battle_main")) {
        notifyOut = uAppenderBS("div", $BS("#battle_main"));
    } else if ($BS("#arena_list")) {
        notifyOut = uAppenderBS("div", $BS("#arena_list"));
    } else {
        notifyOut = uAppenderBS("div", $BS("#mainpane"));
    }
    var notifyIn = uAppenderBS("div", notifyOut);
    notifyOut.style.cssText = "z-index:1000;position:absolute;top:0;left:0;background:rgba(0,0,0,.1);right:0;bottom:0;display:flex;align-items:center;justify-content:space-around;pointer-events:none";
    notifyIn.style.cssText = "font-size:2em;background:#fff;padding:.7em;border:2px solid;z-index:1000;pointer-events: all;";
    notifyIn.innerHTML = q;
}
function uCounterREBS() {
    if (autoREShowCounter) {
        var r;
        setInterval(function(){
            if ($BS("#counter")) {$BS("#counter").remove();}
            if ($BS("#battle_top")) {
                r = uAppenderBS("div", $BS("#battle_top"));
                r.style.cssText = "position: absolute;right: 5;font-size: 1.5em; color: red;";
            } else {
                r = uAppenderBS("div", $BS("#navbar"));
                r.style.cssText = "position: absolute;right: 32em;font-size: 1.4em; color: red;";
            }
            var d = parseInt(localStorage.getItem("timeWhenNextREbeBS")) - Date.now();
            r.id = "counter";
            if (d > 0) {
                r.innerHTML = "Next RE in: "+ Math.floor(d / 60000) + ":"+ Math.floor(d / 1000 % 60);
            } else {
                r.innerHTML = "Next RE in: NOW";
            }
        },1000);
    }
}

Storage.prototype.setObj = function(key, obj) {
    return this.setItem(key, JSON.stringify(obj));
};
Storage.prototype.getObj = function(key) {
    return JSON.parse(this.getItem(key));
};

findScreenWeAreInBS();