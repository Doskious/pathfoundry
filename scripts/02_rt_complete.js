/* jshint -W104 */
var realTypeOf = function(obj) {
    return Object.prototype.toString.call(obj).slice(8, -1);
};

const CASTING_CLASSES = {
    Alchemist: {attr: "Intelligence"},
    Arcanist: {attr: "Intelligence"},
    Antipaladin: {attr: "Charisma"},
    Bard: {attr: "Charisma"},
    Bloodrager: {attr: "Charisma"},
    Cleric: {attr: "Wisdom"},
    Druid: {attr: "Wisdom"},
    Hunter: {attr: "Wisdom"},
    Inquisitor: {attr: "Wisdom"},
    Investigator: {attr: "Intelligence"},
    Kineticist: {attr: "Constitution"},
    Magus: {attr: "Intelligence"},
    Medium: {attr: "Charisma"},
    Mesmerist: {attr: "Charisma"},
    Occultist: {attr: "Intelligence"},
    Oracle: {attr: "Wisdom"},
    Paladin: {attr: "Wisdom"},
    Psychic: {attr: "Intelligence"},
    Ranger: {attr: "Wisdom"},
    Shaman: {attr: "Wisdom"},
    Skald: {attr: "Charisma"},
    Sorcerer: {attr: "Charisma"},
    Spiritualist: {attr: "Wisdom"},
    Summoner: {attr: "Charisma"},
    Warpriest: {attr: "Wisdom"},
    Witch: {attr: "Intelligence"},
    Wizard: {attr: "Intelligence"},
};

//=====================================================

var sheetConfig = {
    sheetStyle: "styleAncientOnes",
    panelHeaderStyle: "roundedTopFlatBottom",
    pageOrientation: "portrait",
    colorCoding: true,
    displayOnSheetControls: false,
    editItemText: false,
    displayLogos: true,
    populateFont: "",

    movementLayout: "Traditional",
    skillsLayout: "Traditional",
    languagesLayout: "List",
    weaponsLayout: "Traditional",
    traitsLayout: "List",
    specialAbilityLayout: "List",
    featsLayout: "List",
    gearLayout: "List",
    minionsLayout: "Beastiary",
    spellSummaryLayout: "Traditional",

    featsIncluded: "featsShowAll",
    showMagicItemDescriptions: true,
    resourcesLocation: "resourcesAboveGear",
    resourcesLayout: "tabular",
    spellsLocation: "spellsSeparatePage",
    showSpellDescriptions: true,
    showMinions: true,

    hideUnarmedInWeapons: false,
    alwaysPrintTwoWeaponAttacks: false,
    hideAmmoInWeapons: false,
    hideUnusableSkills: true,
    hideBackgroundDetails: false,
    showFeatAbilityDescriptions: true
};

var heroLabInfo = {
    programInfo : "",
    version : {
        build : "0",
        tertiary : "0",
        secondary : "0",
        primary : "0",
        version : "0"
    }
};

var dataRoot = {
    characters: [],
    numNonMinionCharacters: function() {
       var num = 0;
       for (var i = 0; i < dataRoot.characters.length; i++) {
          if (!dataRoot.characters[i].isMinion) {
             num++;
          }
       }
       return num;
    },

    skillGlossary: [],
    specialMovementGlossary: [],

    containerGlossary: [
        "efficient quiver",
        "glove of storing",
        "handy haversack",
        "bag of holding",
        "portable hole",
        "backpack",
        "barrel",
        "basket",
        "chest",
        "pouch",
        "bag,",
        "sack"
    ],

    weaponGlossary: [
    {weaponName:"Sword, tri-point double-edged", weaponEncumbrance: "2-handed"},
    {weaponName:"Katana, double walking stick", weaponEncumbrance: "double"},
    {weaponName:"Crossbow, Repeating Heavy", weaponEncumbrance: "2-handed"},
    {weaponName:"Crossbow, Repeating Light", weaponEncumbrance: "2-handed"},
    {weaponName:"Shotgun, double-barreled", weaponEncumbrance: "2-handed"},
    {weaponName:"Stitched Sling, Halfling", weaponEncumbrance: "light"},
    {weaponName:"Musket, double-barreled", weaponEncumbrance: "2-handed"},
    {weaponName:"Double Sling, Halfling", weaponEncumbrance: "double"},
    {weaponName:"Broadsword, nine ring", weaponEncumbrance: "1-handed"},
    {weaponName:"Pistol, Double Barrel", weaponEncumbrance: "1-handed"},
    {weaponName:"Sling Staff, Halfling", weaponEncumbrance: "light"},
    {weaponName:"Sword, Aldori Dueling", weaponEncumbrance: "1-handed"},
    {weaponName:"Sword, seven-branched", weaponEncumbrance: "2-handed"},
    {weaponName:"Double chicken saber", weaponEncumbrance: "1-handed"},
    {weaponName:"Hammer, Gnome Hooked", weaponEncumbrance: "double"},
    {weaponName:"Kama, double-chained", weaponEncumbrance: "double"},
    {weaponName:"Crossbow, Launching", weaponEncumbrance: "2-handed"},
    {weaponName:"Dwarven dorn-dergar", weaponEncumbrance: "2-handed"},
    {weaponName:"Ranged Touch Attack", weaponEncumbrance: "light"},
    {weaponName:"Shortbow, Composite", weaponEncumbrance: "2-handed"},
    {weaponName:"Shrillshaft Javelin", weaponEncumbrance: "1-handed"},
    {weaponName:"Swordbreaker Dagger", weaponEncumbrance: "light"},
    {weaponName:"Battle Aspergillum", weaponEncumbrance: "light"},
    {weaponName:"Curve blade, elven", weaponEncumbrance: "2-handed"},
    {weaponName:"Knife, Switchblade", weaponEncumbrance: "light"},
    {weaponName:"Longbow, Composite", weaponEncumbrance: "2-handed"},
    {weaponName:"Pistol, Sword Cane", weaponEncumbrance: "1-handed"},
    {weaponName:"Poisoned sand tube", weaponEncumbrance: "1-handed"},
    {weaponName:"Tube arrow shooter", weaponEncumbrance: "1-handed"},
    {weaponName:"Whip, Nine-section", weaponEncumbrance: "1-handed"},
    {weaponName:"Musket, warhammer", weaponEncumbrance: "2-handed"},
    {weaponName:"Sword, Two-Bladed", weaponEncumbrance: "double"},
    {weaponName:"Crossbow, Double", weaponEncumbrance: "2-handed"},
    {weaponName:"Dagger, Punching", weaponEncumbrance: "light"},
    {weaponName:"Gauntlet, Locked", weaponEncumbrance: "light"},
    {weaponName:"Gauntlet, Spiked", weaponEncumbrance: "light"},
    {weaponName:"Knife, Butterfly", weaponEncumbrance: "1-handed"},
    {weaponName:"Maulaxe, Dwarven", weaponEncumbrance: "light"},
    {weaponName:"Rifle, pepperbox", weaponEncumbrance: "2-handed"},
    {weaponName:"Sword, Butterfly", weaponEncumbrance: "light"},
    {weaponName:"Urgrosh, Dwarven", weaponEncumbrance: "double"},
    {weaponName:"Axe, Orc Double", weaponEncumbrance: "double"},
    {weaponName:"Combat scabbard", weaponEncumbrance: "1-handed"},
    {weaponName:"Crossbow, Heavy", weaponEncumbrance: "2-handed"},
    {weaponName:"Crossbow, Light", weaponEncumbrance: "2-handed"},
    {weaponName:"Glaive-Guisarme", weaponEncumbrance: "2-handed"},
    {weaponName:"Terbutje, great", weaponEncumbrance: "2-handed"},
    {weaponName:"Terbutje, steel", weaponEncumbrance: "1-handed"},
    {weaponName:"Waraxe, Dwarven", weaponEncumbrance: "1-handed"},
    {weaponName:"Brass Knuckles", weaponEncumbrance: "light"},
    {weaponName:"Crossbow, Hand", weaponEncumbrance: "light"},
    {weaponName:"Double hackbut", weaponEncumbrance: "2-handed"},
    {weaponName:"Gauntlet, Rope", weaponEncumbrance: "light"},
    {weaponName:"Kyoketsu shoge", weaponEncumbrance: "2-handed"},
    {weaponName:"Lucerne Hammer", weaponEncumbrance: "2-handed"},
    {weaponName:"Lungchuan tamo", weaponEncumbrance: "light"},
    {weaponName:"Pistol, Dagger", weaponEncumbrance: "1-handed"},
    {weaponName:"Pistol, Dragon", weaponEncumbrance: "1-handed"},
    {weaponName:"Sawtooth Sabre", weaponEncumbrance: "1-handed"},
    {weaponName:"Spear, Syringe", weaponEncumbrance: "2-handed"},
    {weaponName:"Sword, Bastard", weaponEncumbrance: "1-handed"},
    {weaponName:"Unarmed Strike", weaponEncumbrance: "light"},
    {weaponName:"Whip, Scorpion", weaponEncumbrance: "light"},
    {weaponName:"Axe, Throwing", weaponEncumbrance: "light"},
    {weaponName:"Barbazu Beard", weaponEncumbrance: "light"},
    {weaponName:"Battle Ladder", weaponEncumbrance: "double"},
    {weaponName:"Bec de Corbin", weaponEncumbrance: "2-handed"},
    {weaponName:"Bola, Shoanti", weaponEncumbrance: "light"},
    {weaponName:"Chain, Spiked", weaponEncumbrance: "2-handed"},
    {weaponName:"Earth Breaker", weaponEncumbrance: "2-handed"},
    {weaponName:"Flask Thrower", weaponEncumbrance: "light"},
    {weaponName:"Hammer, Light", weaponEncumbrance: "light"},
    {weaponName:"Lance, Hooked", weaponEncumbrance: "2-handed"},
    {weaponName:"Madu, Leather", weaponEncumbrance: "1-handed"},
    {weaponName:"Meteor Hammer", weaponEncumbrance: "double"},
    {weaponName:"Ripsaw Glaive", weaponEncumbrance: "2-handed"},
    {weaponName:"Scarf, Bladed", weaponEncumbrance: "2-handed"},
    {weaponName:"Spade, Monk's", weaponEncumbrance: "double"},
    {weaponName:"Emei piercer", weaponEncumbrance: "light"},
    {weaponName:"Fighting Fan", weaponEncumbrance: "light"},
    {weaponName:"Flail, Heavy", weaponEncumbrance: "2-handed"},
    {weaponName:"Flying Blade", weaponEncumbrance: "2-handed"},
    {weaponName:"Horsechopper", weaponEncumbrance: "2-handed"},
    {weaponName:"Pistol, Coat", weaponEncumbrance: "1-handed"},
    {weaponName:"Quarterstaff", weaponEncumbrance: "double"},
    {weaponName:"Switchscythe", weaponEncumbrance: "2-handed"},
    {weaponName:"Temple Sword", weaponEncumbrance: "1-handed"},
    {weaponName:"Tepoztopilli", weaponEncumbrance: "2-handed"},
    {weaponName:"Touch Attack", weaponEncumbrance: "light"},
    {weaponName:"Wooden Stake", weaponEncumbrance: "1-handed"},
    {weaponName:"Atlatl Dart", weaponEncumbrance: "light"},
    {weaponName:"Axe, Hooked", weaponEncumbrance: "1-handed"},
    {weaponName:"Blunderbuss", weaponEncumbrance: "2-handed"},
    {weaponName:"Buckler gun", weaponEncumbrance: "1-handed"},
    {weaponName:"Chain Spear", weaponEncumbrance: "double"},
    {weaponName:"Flail, Dire", weaponEncumbrance: "double"},
    {weaponName:"Hunga Munga", weaponEncumbrance: "1-handed"},
    {weaponName:"Knuckle Axe", weaponEncumbrance: "1-handed"},
    {weaponName:"Mace, Heavy", weaponEncumbrance: "1-handed"},
    {weaponName:"Mace, Light", weaponEncumbrance: "light"},
    {weaponName:"Madu, Steel", weaponEncumbrance: "1-handed"},
    {weaponName:"Morningstar", weaponEncumbrance: "1-handed"},
    {weaponName:"Musket, Axe", weaponEncumbrance: "2-handed"},
    {weaponName:"Pick, Heavy", weaponEncumbrance: "1-handed"},
    {weaponName:"Pick, Light", weaponEncumbrance: "light"},
    {weaponName:"Piston Maul", weaponEncumbrance: "2-handed"},
    {weaponName:"Sansetsukon", weaponEncumbrance: "2-handed"},
    {weaponName:"Sling Glove", weaponEncumbrance: "light"},
    {weaponName:"Battle Poi", weaponEncumbrance: "light"},
    {weaponName:"Blade Boot", weaponEncumbrance: "light"},
    {weaponName:"Boar Spear", weaponEncumbrance: "2-handed"},
    {weaponName:"Fire Lance", weaponEncumbrance: "2-handed"},
    {weaponName:"Greatsword", weaponEncumbrance: "2-handed"},
    {weaponName:"Iron Brush", weaponEncumbrance: "light"},
    {weaponName:"Kusarigama", weaponEncumbrance: "double"},
    {weaponName:"Mancatcher", weaponEncumbrance: "2-handed"},
    {weaponName:"Shortspear", weaponEncumbrance: "1-handed"},
    {weaponName:"Shortsword", weaponEncumbrance: "light"},
    {weaponName:"Stingchuck", weaponEncumbrance: "1-handed"},
    {weaponName:"Sword Cane", weaponEncumbrance: "1-handed"},
    {weaponName:"Tekko-kagi", weaponEncumbrance: "light"},
    {weaponName:"Wushu dart", weaponEncumbrance: "light"},
    {weaponName:"Battleaxe", weaponEncumbrance: "1-handed"},
    {weaponName:"Boomerang", weaponEncumbrance: "1-handed"},
    {weaponName:"Dogslicer", weaponEncumbrance: "light"},
    {weaponName:"Flailpole", weaponEncumbrance: "2-handed"},
    {weaponName:"Flickmace", weaponEncumbrance: "1-handed"},
    {weaponName:"Greatclub", weaponEncumbrance: "2-handed"},
    {weaponName:"Longspear", weaponEncumbrance: "2-handed"},
    {weaponName:"Longsword", weaponEncumbrance: "1-handed"},
    {weaponName:"Mere Club", weaponEncumbrance: "1-handed"},
    {weaponName:"Ogre Hook", weaponEncumbrance: "2-handed"},
    {weaponName:"Pepperbox", weaponEncumbrance: "1-handed"},
    {weaponName:"Rhomphaia", weaponEncumbrance: "2-handed"},
    {weaponName:"Rope dart", weaponEncumbrance: "1-handed"},
    {weaponName:"Shang gou", weaponEncumbrance: "light"},
    {weaponName:"Starknife", weaponEncumbrance: "light"},
    {weaponName:"Thorn Bow", weaponEncumbrance: "2-handed"},
    {weaponName:"Wakizashi", weaponEncumbrance: "light"},
    {weaponName:"War Razor", weaponEncumbrance: "light"},
    {weaponName:"Warhammer", weaponEncumbrance: "1-handed"},
    {weaponName:"Bardiche", weaponEncumbrance: "2-handed"},
    {weaponName:"Bo staff", weaponEncumbrance: "double"},
    {weaponName:"Culverin", weaponEncumbrance: "2-handed"},
    {weaponName:"Dan bong", weaponEncumbrance: "light"},
    {weaponName:"Falchion", weaponEncumbrance: "2-handed"},
    {weaponName:"Fangfile", weaponEncumbrance: "light"},
    {weaponName:"Flambard", weaponEncumbrance: "2-handed"},
    {weaponName:"Gauntlet", weaponEncumbrance: "light"},
    {weaponName:"Greataxe", weaponEncumbrance: "2-handed"},
    {weaponName:"Guisarme", weaponEncumbrance: "2-handed"},
    {weaponName:"Kerambit", weaponEncumbrance: "light"},
    {weaponName:"Naginata", weaponEncumbrance: "2-handed"},
    {weaponName:"Nunchaku", weaponEncumbrance: "light"},
    {weaponName:"Quadrens", weaponEncumbrance: "light"},
    {weaponName:"Revolver", weaponEncumbrance: "1-handed"},
    {weaponName:"Scimitar", weaponEncumbrance: "1-handed"},
    {weaponName:"Shortbow", weaponEncumbrance: "2-handed"},
    {weaponName:"Shuriken", weaponEncumbrance: "light"},
    {weaponName:"Siangham", weaponEncumbrance: "light"},
    {weaponName:"Terbutje", weaponEncumbrance: "1-handed"},
    {weaponName:"Amentum", weaponEncumbrance: "1-handed"},
    {weaponName:"Bayonet", weaponEncumbrance: "2-handed"},
    {weaponName:"Blowgun", weaponEncumbrance: "light"},
    {weaponName:"Chakram", weaponEncumbrance: "1-handed"},
    {weaponName:"Falcata", weaponEncumbrance: "1-handed"},
    {weaponName:"Garrote", weaponEncumbrance: "2-handed"},
    {weaponName:"Gladius", weaponEncumbrance: "light"},
    {weaponName:"Halberd", weaponEncumbrance: "2-handed"},
    {weaponName:"Handaxe", weaponEncumbrance: "light"},
    {weaponName:"Harpoon", weaponEncumbrance: "2-handed"},
    {weaponName:"Javelin", weaponEncumbrance: "light"},
    {weaponName:"Kestros", weaponEncumbrance: "1-handed"},
    {weaponName:"Khopesh", weaponEncumbrance: "1-handed"},
    {weaponName:"Longbow", weaponEncumbrance: "2-handed"},
    {weaponName:"Mattock", weaponEncumbrance: "2-handed"},
    {weaponName:"Nodachi", weaponEncumbrance: "2-handed"},
    {weaponName:"Ranseur", weaponEncumbrance: "2-handed"},
    {weaponName:"Shotgun", weaponEncumbrance: "2-handed"},
    {weaponName:"Tetsubo", weaponEncumbrance: "2-handed"},
    {weaponName:"Trident", weaponEncumbrance: "1-handed"},
    {weaponName:"Wahaika", weaponEncumbrance: "1-handed"},
    {weaponName:"Atlatl", weaponEncumbrance: "1-handed"},
    {weaponName:"Cestus", weaponEncumbrance: "light"},
    {weaponName:"Dagger", weaponEncumbrance: "light"},
    {weaponName:"Glaive", weaponEncumbrance: "2-handed"},
    {weaponName:"Katana", weaponEncumbrance: "1-handed"},
    {weaponName:"Musket", weaponEncumbrance: "2-handed"},
    {weaponName:"Pistol", weaponEncumbrance: "1-handed"},
    {weaponName:"Rapier", weaponEncumbrance: "1-handed"},
    {weaponName:"Scizor", weaponEncumbrance: "1-handed"},
    {weaponName:"Scythe", weaponEncumbrance: "2-handed"},
    {weaponName:"Shotel", weaponEncumbrance: "1-handed"},
    {weaponName:"Sickle", weaponEncumbrance: "light"},
    {weaponName:"Taiaha", weaponEncumbrance: "double"},
    {weaponName:"Aklys", weaponEncumbrance: "light"},
    {weaponName:"Bolas", weaponEncumbrance: "light"},
    {weaponName:"Flail", weaponEncumbrance: "1-handed"},
    {weaponName:"Hanbo", weaponEncumbrance: "light"},
    {weaponName:"Jutte", weaponEncumbrance: "light"},
    {weaponName:"Kukri", weaponEncumbrance: "light"},
    {weaponName:"Lance", weaponEncumbrance: "2-handed"},
    {weaponName:"Lasso", weaponEncumbrance: "1-handed"},
    {weaponName:"Pilum", weaponEncumbrance: "1-handed"},
    {weaponName:"Rhoka", weaponEncumbrance: "1-handed"},
    {weaponName:"Rifle", weaponEncumbrance: "2-handed"},
    {weaponName:"Sibat", weaponEncumbrance: "2-handed"},
    {weaponName:"Sling", weaponEncumbrance: "1-handed"},
    {weaponName:"Spear", weaponEncumbrance: "2-handed"},
    {weaponName:"Tonfa", weaponEncumbrance: "1-handed"},
    {weaponName:"Urumi", weaponEncumbrance: "1-handed"},
    {weaponName:"Bill", weaponEncumbrance: "2-handed"},
    {weaponName:"Club", weaponEncumbrance: "1-handed"},
    {weaponName:"Dart", weaponEncumbrance: "light"},
    {weaponName:"Kama", weaponEncumbrance: "light"},
    {weaponName:"Klar", weaponEncumbrance: "light"},
    {weaponName:"Pata", weaponEncumbrance: "light"},
    {weaponName:"Sica", weaponEncumbrance: "light"},
    {weaponName:"Whip", weaponEncumbrance: "1-handed"},
    {weaponName:"Net", weaponEncumbrance: "light"},
    {weaponName:"Sai", weaponEncumbrance: "light"},
    {weaponName:"Sap", weaponEncumbrance: "light"}]
};



function determineweaponEncumbrance( weaponName ) {
    for (var i = 0; i < dataRoot.weaponGlossary.length; i++) {
        if (weaponName.indexOf( dataRoot.weaponGlossary[i].weaponName ) !== -1) {
            return dataRoot.weaponGlossary[i].weaponEncumbrance;
        }
    }

    return "Unknown";
}
// ===========================================================
// ===========================================================
// ===========================================================


var uniqueIdCounter = 1;

function createUniqueId() {
    var tmpCounter = uniqueIdCounter;
    uniqueIdCounter++;
    return "uid_" + tmpCounter;
}

function getAttr( srcObj, attributeName ) {
    var attrValue = "";

    if (srcObj !== null && srcObj !== undefined) {
        attrValue = srcObj.attr(attributeName);
        if (attrValue === undefined || attrValue === null) {
            attrValue = "";
        }
    }
    return attrValue;
}



function getSituationalModifiers( srcObj ) {
    var modifiers = [];

    if (srcObj === undefined || srcObj === null || srcObj.length === 0) {
        return modifiers;
    }

    $(srcObj).children('situationalmodifiers').children('situationalmodifier').each(function() {
        var _text = getAttr( $(this), 'text' );
        var _source = getAttr( $(this), 'source' );
        modifiers.push({text:_text, source:_source});
    });

    return modifiers;
}


function parsePathfinderXML() {
    var programXml = $('#program-xml').html();
    var programXmlDoc = $.parseXML( programXml );
    var programVersion = $(programXmlDoc).find('version');

    heroLabInfo.programInfo = $(programXmlDoc).find('programinfo').text();
    heroLabInfo.version.build = programVersion.attr('build');
    heroLabInfo.version.tertiary = programVersion.attr('tertiary');
    heroLabInfo.version.secondary = programVersion.attr('secondary');
    heroLabInfo.version.primary = programVersion.attr('primary');
    heroLabInfo.version.version = programVersion.attr('version');

    $('.character-xml').each(function() {
        var characterXml = $(this).html();
        characterXml = characterXml.replace(/&/g, "&amp;");
        //console.log( "parsing xml")
        var characterXmlDoc = $.parseXML( characterXml );
        //console.log( "done parsing xml")
        var characterSrc = $(characterXmlDoc).children('character');

        var characterObj = parsePathfinderCharacter( characterSrc, false );
        dataRoot.characters.push( characterObj );
    });
}



function parsePathfinderCharacter( characterSrc, isMinion ) {
    // console.log( '===== ' + getAttr(characterSrc,'name') );
    var characterObj = new PathfinderCharacter( getAttr(characterSrc,'name') );
    characterObj.isMinion = isMinion;
    characterObj.uniqueId = createUniqueId();
    characterObj.role = getAttr(characterSrc,'role');
    characterObj.playerName = getAttr(characterSrc,'playername');
    characterObj.type = getAttr(characterSrc,'type');
    characterObj.relationship = getAttr(characterSrc,'relationship');
    characterObj.nature = getAttr(characterSrc,'nature');
    characterObj.active = getAttr(characterSrc,'active');
    characterObj.monsterType = characterSrc.children('types').children('type').first().attr('name');

    if (characterSrc.children('pathfindersociety').length > 0) {
        var pfsSrc = characterSrc.children('pathfindersociety');
        var factionSrc = characterSrc.children('factions').children('faction').first();

        characterObj.pfsPlayerNumber = getAttr(pfsSrc,'playernum');
        characterObj.pfsCharacterNumber = getAttr(pfsSrc,'characternum');
        characterObj.pfsFaction = getAttr(factionSrc,'name');
        characterObj.pfsFame = getAttr(factionSrc,'tpa');
        characterObj.pfsCurrentPrestige = getAttr(factionSrc,'cpa');
    }

    var raceSrc = characterSrc.children('race');
    characterObj.race = getAttr(raceSrc,'name');
    characterObj.ethnicity = getAttr(raceSrc,'ethnicity');
    characterObj.raceText = getAttr(raceSrc,'racetext');

    characterObj.alignment = characterSrc.children('alignment').attr('name');

    var sizeSrc = characterSrc.children('size');
    characterObj.size = getAttr(sizeSrc,'name');
    characterObj.space_value = sizeSrc.children('space').attr('value');
    characterObj.space_text = sizeSrc.children('space').attr('text');
    characterObj.reach_value = sizeSrc.children('reach').attr('value');
    characterObj.reach_text = sizeSrc.children('reach').attr('text');

    characterObj.deity = getAttr(characterSrc.children('deity'),'name');

    characterObj.challengeRating = getAttr(characterSrc.children('challengerating'),'text');
    characterObj.xpAward = getAttr(characterSrc.children('xpaward'),'value');

    var classesSrc = characterSrc.children('classes');
    characterObj.classesSummary = getAttr(classesSrc,'summary');
    characterObj.classesSummaryAbbreviation = getAttr(classesSrc,'summaryabbr');
    characterObj.classesLevel = getAttr(classesSrc,'level');

    classesSrc.children('class').each(function() {
        var classSrc = $(this);
        // console.log( getAttr(classSrc,'name') );

        var classObj = new PathfinderClass( getAttr(classSrc,'name') );
        classObj.level = getAttr(classSrc,'level');
        classObj.casterSource = getAttr(classSrc,'castersource');
        classObj.casterLevel = getAttr(classSrc,'casterlevel');
        classObj.castingType = getAttr(classSrc,'spells');

        if (characterSrc.children('arcanespellfailure').length > 0) {
            classObj.arcaneSpellFailure_value = characterSrc.children('arcanespellfailure').attr('value');
            classObj.arcaneSpellFailure_text = characterSrc.children('arcanespellfailure').attr('text');
        }


        characterSrc.children('spellclasses').children('spellclass[name="' + classObj.className + '"]').children('spelllevel').each(function() {
            var spellLevelSrc = $(this);
            // console.log("Adding spell level " + getAttr(spellLevelSrc, 'level' ) + " for " + classObj.className );
            var spellLevelObj =  new PathfinderSpellLevel( getAttr(spellLevelSrc, 'level' ) );
            spellLevelObj.used = getAttr(spellLevelSrc, 'used' );
            spellLevelObj.unlimited = getAttr(spellLevelSrc, 'unlimited' );
            spellLevelObj.maxCasts = getAttr(spellLevelSrc, 'maxcasts' );

            classObj.spellLevels.push( spellLevelObj );
        });


        characterSrc.children('spellsknown').children('spell[class="' + classObj.baseClassName + '"]').each(function() {
            var spellSrc = $(this);
            var spellObj = parsePathfinderSpell( spellSrc );

            classObj.spellsKnown.push( spellObj );
        });


        characterSrc.children('spellsmemorized').children('spell[class="' + classObj.baseClassName + '"]').each(function() {
            var spellSrc = $(this);
            var spellObj = parsePathfinderSpell( spellSrc );

            classObj.spellsPrepared.push( spellObj );
        });


        characterSrc.children('spellbook').children('spell[class="' + classObj.baseClassName + '"]').each(function() {
            var spellSrc = $(this);
            var spellObj = parsePathfinderSpell( spellSrc );

            classObj.spellbook.push( spellObj );
        });

        characterObj.characterClasses.push( classObj );
        characterObj.charClassBaseNames.push( classObj.baseClassName );
    });


    // Attempt to fix domain/specialist spells.
    characterSrc.children('spellsmemorized').children('spell').each(function() {
        var spellSrc = $(this);
        var spellClass = getAttr(spellSrc,'class');
        if (characterObj.charClassBaseNames.indexOf(spellClass) < 0) {
            var spellObj = parsePathfinderSpell( spellSrc );
            spellObj.isSpecialSpell = true;

            characterObj.specialSpells.push( spellObj );
        }
    });


    // Attempt to fix domain/specialist spells.
    characterSrc.children('spellsknown').children('spell').each(function() {
        var spellSrc = $(this);
        var spellClass = getAttr(spellSrc,'class');
        if (characterObj.charClassBaseNames.indexOf(spellClass) < 0) {
            var spellObj = parsePathfinderSpell( spellSrc );
            spellObj.isSpecialSpell = true;

            characterObj.specialSpells.push( spellObj );
        }
    });

    characterObj.fixSpecialSpells();

    characterObj.heroPoints = characterSrc.children('heropoints').attr('total');

    characterSrc.children('favoredclasses').children('favoredclass').each(function() {
        var favoredClassSrc = $(this);
        characterObj.favoredClasses.push( favoredClassSrc.attr('name') );
    });

    var healthSrc = characterSrc.children('health');
    characterObj.hpCurrent = getAttr(healthSrc,'currenthp');
    characterObj.hpTotal = getAttr(healthSrc,'hitpoints');
    characterObj.hitDice = getAttr(healthSrc,'hitdice');

    characterObj.currentXP = characterSrc.children('xp').attr('total');

    var moneySrc = characterSrc.children('money');
    characterObj.moneyTotal = getAttr(moneySrc,'total');
    characterObj.moneyValuables = getAttr(moneySrc,'valuables');
    characterObj.moneyCopper = getAttr(moneySrc,'cp');
    characterObj.moneySilver = getAttr(moneySrc,'sp');
    characterObj.moneyGold = getAttr(moneySrc,'gp');
    characterObj.moneyPlatinum = getAttr(moneySrc,'pp');

    var personalSrc = characterSrc.children('personal');
    characterObj.skin = getAttr(personalSrc,'skin');
    characterObj.eyes = getAttr(personalSrc,'eyes');
    characterObj.hair = getAttr(personalSrc,'hair');
    characterObj.age = getAttr(personalSrc,'age');
    characterObj.gender = getAttr(personalSrc,'gender');
    characterObj.description = personalSrc.children('description').text();
    characterObj.height_value = personalSrc.children('charheight').attr('value');
    characterObj.height_text = personalSrc.children('charheight').attr('text');
    characterObj.weight_value = personalSrc.children('charweight').attr('value');
    characterObj.weight_text = personalSrc.children('charweight').attr('text');

    characterSrc.children('languages').children('language').each(function() {
        var languageSrc = $(this);
        // console.log( languageSrc.attr('name') );
        characterObj.languages.push( languageSrc.attr('name') );
    });

    characterSrc.children('attributes').children('attribute').each(function() {
        var attributeSrc = $(this);
        var attributeValueSrc = attributeSrc.children('attrvalue');
        var attributeBonusSrc = attributeSrc.children('attrbonus');

        var attributeName = getAttr(attributeSrc,'name');
        // console.log( attributeName );

        characterObj[attributeName] = {};
        characterObj[attributeName].value_text = getAttr(attributeValueSrc,'text');
        characterObj[attributeName].value_modified = getAttr(attributeValueSrc,'modified');
        characterObj[attributeName].value_base = getAttr(attributeValueSrc,'base');
        characterObj[attributeName].bonus_text = getAttr(attributeBonusSrc,'text');
        characterObj[attributeName].bonus_modified = getAttr(attributeBonusSrc,'modified');
        characterObj[attributeName].bonus_base = getAttr(attributeBonusSrc,'base');
    });

    var savesSrc = characterSrc.children('saves');
    var fortitudeSaveSrc = savesSrc.children('save[name="Fortitude Save"]');
    var reflexSaveSrc = savesSrc.children('save[name="Reflex Save"]');
    var willSaveSrc = savesSrc.children('save[name="Will Save"]');

    characterObj.fortitudeSave_base = fortitudeSaveSrc.attr('base');
    characterObj.fortitudeSave_fromMisc = fortitudeSaveSrc.attr('frommisc');
    characterObj.fortitudeSave_fromResist = fortitudeSaveSrc.attr('fromresist');
    characterObj.fortitudeSave_fromAttribute = fortitudeSaveSrc.attr('fromattr');
    characterObj.fortitudeSave_total = fortitudeSaveSrc.attr('save');
    characterObj.fortitudeSave_situationalMods = getSituationalModifiers( fortitudeSaveSrc );

    characterObj.reflexSave_base = reflexSaveSrc.attr('base');
    characterObj.reflexSave_fromMisc = reflexSaveSrc.attr('frommisc');
    characterObj.reflexSave_fromResist = reflexSaveSrc.attr('fromresist');
    characterObj.reflexSave_fromAttribute = reflexSaveSrc.attr('fromattr');
    characterObj.reflexSave_total = reflexSaveSrc.attr('save');
    characterObj.reflexSave_situationalMods = getSituationalModifiers( reflexSaveSrc );

    characterObj.willSave_base = willSaveSrc.attr('base');
    characterObj.willSave_fromMisc = willSaveSrc.attr('frommisc');
    characterObj.willSave_fromResist = willSaveSrc.attr('fromresist');
    characterObj.willSave_fromAttribute = willSaveSrc.attr('fromattr');
    characterObj.willSave_total = willSaveSrc.attr('save');
    characterObj.willSave_situationalMods = getSituationalModifiers( willSaveSrc );

    characterObj.allSaves_situationalMods = getSituationalModifiers( savesSrc.children('allsaves') );

    var attackSrc = characterSrc.children('attack');
    characterObj.baseAttack = getAttr(attackSrc,'baseattack');
    characterObj.rangedAttack = getAttr(attackSrc,'rangedattack');
    characterObj.meleeAttack = getAttr(attackSrc,'meleeattack');
    characterObj.attackBonus = getAttr(attackSrc,'attackbonus');

    var resistancesSrc = characterSrc.children('resistances');
    if (resistancesSrc.children('special[name^="Spell Resistance ("]').length > 0) {
        var spellResistanceSrc = resistancesSrc.children('special[name^="Spell Resistance ("]');
        var srName = spellResistanceSrc.attr('name');
        var srOpenPos = srName.indexOf( '(' );
        var srClosePos = srName.indexOf( ')' );
        characterObj.spellResistance = srName.substring( srOpenPos+1, srClosePos );
    }

    var armorClassSrc = characterSrc.children('armorclass');
    characterObj.ac = getAttr(armorClassSrc,'ac');
    characterObj.acTouch = getAttr(armorClassSrc,'touch');
    characterObj.acFlatFooted = getAttr(armorClassSrc,'flatfooted');
    characterObj.acFromMisc = getAttr(armorClassSrc,'frommisc');
    characterObj.acFromDodge = getAttr(armorClassSrc,'fromdodge');
    characterObj.acFromDeflect = getAttr(armorClassSrc,'fromdeflect');
    characterObj.acFromNatural = getAttr(armorClassSrc,'fromnatural');
    characterObj.acFromSize = getAttr(armorClassSrc,'fromsize');
    characterObj.acFromDexterity = getAttr(armorClassSrc,'fromdexterity');
    characterObj.acFromShield = getAttr(armorClassSrc,'fromshield');
    characterObj.acFromArmor = getAttr(armorClassSrc,'fromarmor');


    characterSrc.children('penalties').children('penalty').each(function() {
        var penaltySrc = $(this);
        // console.log( getAttr(penaltySrc,'name') );
        var penaltyObj =  new PathfinderPenalty( getAttr(penaltySrc,'name') );
        penaltyObj.value = getAttr(penaltySrc,'value');
        penaltyObj.text = getAttr(penaltySrc,'text');
        characterObj.penalties.push( penaltyObj );
    });


    var maneuversSrc = characterSrc.children('maneuvers');
    characterObj.cmb = maneuversSrc.attr('cmb');
    characterObj.cmd = maneuversSrc.attr('cmd');
    characterObj.cmdFlatFooted = maneuversSrc.attr('cmdflatfooted');

    maneuversSrc.children('maneuvertype').each(function() {
        var maneuverTypeSrc = $(this);
        // console.log( maneuverTypeSrc.attr('name') );
        var maneuverTypeObj = new PathfinderCombatManeuver( maneuverTypeSrc.attr('name') );
        maneuverTypeObj.cmb = maneuverTypeSrc.attr('cmb');
        maneuverTypeObj.cmd = maneuverTypeSrc.attr('cmd');
        maneuverTypeObj.bonus = maneuverTypeSrc.attr('bonus');
        characterObj.maneuvers.push( maneuverTypeObj );
    });

    var initiativeSrc = characterSrc.children('initiative');
    characterObj.initiativeTotal = initiativeSrc.attr('total');
    characterObj.initiativeAttribute = initiativeSrc.attr('attrname');
    characterObj.initiativeMiscText = initiativeSrc.attr('misctext');
    characterObj.initiativeAttributeText = initiativeSrc.attr('attrtext');

    var movementSrc = characterSrc.children('movement');
    characterObj.speed_value = movementSrc.children('speed').attr('value');
    characterObj.speed_text = movementSrc.children('speed').attr('text');
    characterObj.baseSpeed_value = movementSrc.children('basespeed').attr('value');
    characterObj.baseSpeed_text = movementSrc.children('basespeed').attr('text');

    movementSrc.children('special').each(function() {
        var movementSpecialSrc = $(this);
        // console.log( getAttr(movementSpecialSrc,'name') );
        var movementSpecialObj = new PathfinderSpecialMovement( getAttr(movementSpecialSrc,'name') );
        movementSpecialObj.uniqueId = createUniqueId();
        movementSpecialObj.type = getAttr(movementSpecialSrc,'type');
        movementSpecialObj.shortName = getAttr(movementSpecialSrc,'shortname');
        movementSpecialObj.sourceText = getAttr(movementSpecialSrc,'sourcetext');
        movementSpecialObj.description = movementSpecialSrc.children('description').text();

        characterObj.specialMovement.push( movementSpecialObj );
        addMovementToGlossary( movementSpecialObj );
    });


    var encumbranceSrc = characterSrc.children('encumbrance');
    characterObj.encumbranceHeavy   = encumbranceSrc.attr('heavy');
    characterObj.encumbranceMedium  = encumbranceSrc.attr('medium');
    characterObj.encumbranceLight   = encumbranceSrc.attr('light');
    characterObj.encumbranceCarried = encumbranceSrc.attr('carried');


    characterSrc.children('skills').children('skill').each(function() {
        var skillSrc = $(this);
        // console.log( getAttr(skillSrc,'name') );
        var skillObj = new PathfinderSkill( getAttr(skillSrc,'name') );
        skillObj.uniqueId = createUniqueId();
        skillObj.value = getAttr(skillSrc,'value');
        skillObj.attribute = getAttr(skillSrc,'attrname');
        skillObj.attributeBonus = getAttr(skillSrc,'attrbonus');
        skillObj.armorCheck = getAttr(skillSrc,'armorcheck');
        skillObj.ranks = getAttr(skillSrc,'ranks');
        skillObj.classSkill = getAttr(skillSrc,'classskill');
        skillObj.tools = getAttr(skillSrc,'tools');
        skillObj.trainedOnly = getAttr(skillSrc,'trainedonly');
        skillObj.usable = getAttr(skillSrc,'usable');
        skillObj.description = skillSrc.children('description').text();

        characterObj.skills.push( skillObj );
        skillObj.character = characterObj;

        addSkillToGlossary( skillObj );
    });


    characterSrc.children('feats').children('feat').each(function() {
        var featSrc = $(this);
        // console.log( featSrc.attr('name') );
        var featObj = new PathfinderFeat( featSrc.attr('name') );
        featObj.uniqueId = createUniqueId();
        featObj.categoryText = featSrc.attr('categorytext');
        featObj.description = featSrc.children('description').text();

        characterObj.feats.push( featObj );
    });


    characterSrc.children('traits').children('trait').each(function() {
        var traitSrc = $(this);
        // console.log( traitSrc.attr('name') );
        var traitObj = new PathfinderTrait( traitSrc.attr('name') );
        traitObj.uniqueId = createUniqueId();
        traitObj.categoryText = traitSrc.attr('categorytext');
        traitObj.description = traitSrc.children('description').text();

        characterObj.traits.push( traitObj );
    });



    characterSrc.children('melee').children('weapon').add( characterSrc.children('ranged').children('weapon') ).each(function(index) {

        var weaponSrc = $(this);
        // console.log( getAttr(weaponSrc,'name') );

        var weaponObj = new PathfinderWeapon( getAttr(weaponSrc,'name') );
        weaponObj.uniqueId = createUniqueId();
        weaponObj.category = weaponSrc.parent().prop('tagName');
        weaponObj.damage = getAttr(weaponSrc,'damage');
        weaponObj.categoryText = getAttr(weaponSrc,'categorytext');
        weaponObj.quantity = getAttr(weaponSrc,'quantity');
        weaponObj.flurryAttack = getAttr(weaponSrc,'flurryattack');
        weaponObj.crit = getAttr(weaponSrc,'crit');
        weaponObj.attackBonus = getAttr(weaponSrc,'attack');
        weaponObj.typeText = getAttr(weaponSrc,'typetext');
        weaponObj.equipped = getAttr(weaponSrc,'equipped');
        weaponObj.size = getAttr(weaponSrc,'size');
        weaponObj.weight_value = weaponSrc.children('weight').attr('value');
        weaponObj.weight_text = weaponSrc.children('weight').attr('text');
        weaponObj.cost_value = weaponSrc.children('cost').attr('value');
        weaponObj.cost_text = weaponSrc.children('cost').attr('text');
        weaponObj.description = weaponSrc.children('description').text();

        var rangedAttackSrc = weaponSrc.children('rangedattack');
        if (rangedAttackSrc.length > 0) {
            weaponObj.rangedAttack = rangedAttackSrc.attr('attack');
            weaponObj.rangedIncrement_value = rangedAttackSrc.attr('rangeincvalue');
            weaponObj.rangedIncrement_text = rangedAttackSrc.attr('rangeinctext');
            if (weaponObj.category === 'ranged') {
               weaponObj.flurryAttack = getAttr(rangedAttackSrc,'flurryattack');
            }
        }

        weaponSrc.children('itempower').each(function() {
            var itemPowerSrc = $(this);
            // console.log( getAttr(itemPowerSrc,'name') );
            var itemPowerObj = new PathfinderItemPower( getAttr(itemPowerSrc,'name') );
            itemPowerObj.priceCash_text = getAttr(itemPowerSrc,'pricecashtext');
            itemPowerObj.priceCash_value = getAttr(itemPowerSrc,'pricecashvalue');
            itemPowerObj.priceBonus_text = getAttr(itemPowerSrc,'pricebonustext');
            itemPowerObj.priceBonus_value = getAttr(itemPowerSrc,'pricebonusvalue');
            itemPowerObj.description = itemPowerSrc.children('description').text();

            weaponObj.powers.push( itemPowerObj );
        });

        characterObj.weapons.push( weaponObj );
        weaponObj.owner = characterObj;
    });


     characterSrc.children('defenses').children('armor').each(function() {
         var armorSrc = $(this);

         var armorObj = new PathfinderArmor( getAttr(armorSrc,'name') );
         armorObj.ac = getAttr(armorSrc,'ac');
         armorObj.quantity = getAttr(armorSrc,'quantity');
         armorObj.equipped = getAttr(armorSrc,'equipped');
         armorObj.natural = getAttr(armorSrc,'natural');

         var weightSrc = armorSrc.children('weight');
         armorObj.weight_value = getAttr(weightSrc,'value');
         armorObj.weight_text = getAttr(weightSrc,'text');

         var costSrc = armorSrc.children('cost');
         armorObj.cost_value = getAttr(costSrc,'value');
         armorObj.cost_text = getAttr(costSrc,'text');

         characterObj.defenses.push( armorObj );
     });


    characterSrc.children('magicitems').children('item').add( characterSrc.children('gear').children('item') ).each(function() {
        var itemSrc = $(this);
        // console.log( getAttr(itemSrc,'name') );
        var itemObj = new PathfinderGear( getAttr(itemSrc,'name'), itemSrc.parent().prop('tagName') );
        itemObj.uniqueId = createUniqueId();
        itemObj.quantity = getAttr(itemSrc,'quantity');
        itemObj.weight_value = itemSrc.children('weight').attr('value');
        itemObj.weight_text = itemSrc.children('weight').attr('text');
        itemObj.cost_value = itemSrc.children('cost').attr('value');
        itemObj.cost_text = itemSrc.children('cost').attr('text');
        itemObj.description = itemSrc.children('description').text();
        itemObj.bodySlot = itemSrc.children('itemslot').text();

        itemSrc.children('itempower').each(function() {
            var itemPowerSrc = $(this);
            // console.log( getAttr(itemPowerSrc,'name') );
            var itemPowerObj = new PathfinderItemPower( getAttr(itemPowerSrc,'name') );
            itemPowerObj.priceCash_text = getAttr(itemPowerSrc,'pricecashtext');
            itemPowerObj.priceCash_value = getAttr(itemPowerSrc,'pricecashvalue');
            itemPowerObj.priceBonus_text = getAttr(itemPowerSrc,'pricebonustext');
            itemPowerObj.priceBonus_value = getAttr(itemPowerSrc,'pricebonusvalue');
            itemPowerObj.description = itemPowerSrc.children('description').text();

            itemObj.powers.push( itemPowerObj );
        });

        characterObj.gear.push( itemObj );
    });


    var magicItemsSrc = characterSrc.children('magicitems').children('item');
    var allSpecials = characterSrc.find('special');


    allSpecials.each(function() {
        var specialAbilitySrc = $(this);
        // console.log( "Special Ability: " + getAttr(specialAbilitySrc,'name') );

        var isMinionSpecialAbility = specialAbilitySrc.parents('minions').length > 0;
        if (isMinionSpecialAbility && !characterObj.isMinion) {
            return;
        }

        var specialAbilityName = getAttr(specialAbilitySrc,'name');
        for (var i = 0; i < magicItemsSrc.length; i++) {
            if ($(magicItemsSrc[i]).attr('name') === specialAbilityName) {
                return;
            }
        }

        var specialAbilityObj = new PathfinderSpecialAbility( specialAbilityName );
        specialAbilityObj.uniqueId = createUniqueId();
        specialAbilityObj.category = specialAbilitySrc.parent().prop('tagName');
        specialAbilityObj.shortName = getAttr(specialAbilitySrc,'shortname');
        specialAbilityObj.description = specialAbilitySrc.children('description').text();


        characterObj.specialAbilities.push( specialAbilityObj );
    });


    characterSrc.children('trackedresources').children('trackedresource').each(function() {
        var trackedResourceSrc = $(this);
        // console.log( 'Tracked Resource: ' + getAttr(trackedResourceSrc,'name') );
        var trackedResourceObj = new PathfinderTrackedResource( getAttr(trackedResourceSrc,'name') );
        trackedResourceObj.text = getAttr(trackedResourceSrc,'text');
        trackedResourceObj.max = getAttr(trackedResourceSrc,'max');
        trackedResourceObj.min = getAttr(trackedResourceSrc,'min');
        trackedResourceObj.left = getAttr(trackedResourceSrc,'left');
        trackedResourceObj.used = getAttr(trackedResourceSrc,'used');

        characterObj.trackedResources.push( trackedResourceObj );
    });


    characterSrc.children('images').children('image').each(function() {
        var imageSrc = $(this);
        characterObj.portraits.push( imageSrc.attr('filename') );
    });

    characterObj.populateSettings( characterSrc.children('settings').attr('summary') );


    if (characterSrc.children('npc').length > 0) {
        var npcSrc = characterSrc.children('npc');
        var npcObj = new PathfinderNpc();

        if (npcSrc.children('description').length > 0) {
           npcObj.description = npcSrc.children('description').text();
           if ((npcObj.description === null) || ((npcObj.description === undefined))) {
               npcObj.description = "";
           }
        }

        characterObj.npc = npcObj;
    }

    characterSrc.children('minions').children('character').each(function() {
        var minionSrc = $(this);
        var minionObj = parsePathfinderCharacter( minionSrc, true );

        minionObj.minionOwner = characterObj;
        characterObj.minions.push( minionObj );
    });
    // console.log( '===================================================' );

    return characterObj;
}


function parsePathfinderSpell( spellSrc ) {
    // console.log( getAttr(spellSrc,'name') );
    var spellObj = new PathfinderSpell( getAttr(spellSrc,'name') );
    spellObj.uniqueId = createUniqueId();
    spellObj.level = getAttr(spellSrc,'level');
    spellObj.casterLevel = getAttr(spellSrc,'casterlevel');
    spellObj.save = getAttr(spellSrc,'save');
    spellObj.descriptorText = getAttr(spellSrc,'descriptortext');
    spellObj.subSchoolText = getAttr(spellSrc,'subschooltext');
    spellObj.schoolText = getAttr(spellSrc,'schooltext');
    spellObj.componentText = getAttr(spellSrc,'componenttext');
    spellObj.saveDC = getAttr(spellSrc,'dc');
    spellObj.spellResistance = getAttr(spellSrc,'resist');
    spellObj.duration = getAttr(spellSrc,'duration');
    spellObj.effect = getAttr(spellSrc,'effect');
    spellObj.area = getAttr(spellSrc,'area');
    spellObj.target = getAttr(spellSrc,'target');
    spellObj.range = getAttr(spellSrc,'range');
    spellObj.castingTime = getAttr(spellSrc,'casttime');
    spellObj.description = spellSrc.children('description').text();

    return spellObj;
}

// ===========================================================
// ===========================================================
// ===========================================================

function PathfinderCharacter( characterName ) {
    this.characterName = characterName;
    this.isMinion = false;
    this.characterClasses = [];
    this.charClassBaseNames = [];
    this.favoredClasses = [];
    this.languages = [];
    this.spellResistance = "";
    this.maneuvers = [];
    this.weapons = [];
    this.defenses = [];
    this.portraits = [];
    this.skills = [];
    this.feats = [];
    this.traits = [];
    this.specialAbilities = [];
    this.specialMovement = [];
    this.trackedResources = [];
    this.gear = [];
    this.penalties = [];
    this.specialSpells = []; // domain/specialist spells
    this.minions = [];
    this.settings = [];
}




PathfinderCharacter.prototype.fixSpecialSpells = function() {
    // If the character has only 1 spellcasting class, assign the spell to that class.
    //
    // If the character has a spellbook, see if the spell is in the spellbook. If it is, assign the spell to
    // the class that provides the spellbook.
    //
    // If all else fails, assign the spell to all spellcasting classes that don't have a spellbook.

    var spellPreparingClasses = [];
    var spellbookClasses = [];
    var nonSpellbookClasses = [];

    var i;

    for (i = 0; i < this.characterClasses.length; i++) {
        var characterClassObj = this.characterClasses[i];
        if (characterClassObj.castingType !== 'Spontaneous') {
            spellPreparingClasses.push( characterClassObj );

            if (characterClassObj.castingType === 'Spellbook') {
                spellbookClasses.push( characterClassObj );
            } else {
                nonSpellbookClasses.push( characterClassObj );
            }
        }
    }

    spell_loop:
    for (i = 0; i < this.specialSpells.length; i++) {
        var spellObj = this.specialSpells[i];

       if (spellPreparingClasses.length === 1) {
          spellPreparingClasses[0].spellsPrepared.push( spellObj );

       } else {
          for (var b = 0; b < spellbookClasses.length; b++) {
              if (spellbookClasses[b].isSpellInBook( spellObj.spellName )) {
                  spellbookClasses[b].spellsPrepared.push( spellObj );
                  continue spell_loop;
              }
          }

          for (var c = 0; c < nonSpellbookClasses.length; c++) {
              nonSpellbookClasses[c].spellsPrepared.push( spellObj );
          }
       }

    }

};


PathfinderCharacter.prototype.getAlignmentAbbrev = function() {
   switch (this.alignment) {
      case "Lawful Good":
         return "LG";
      case "Neutral Good":
         return "NG";
      case "Chaotic Good":
         return "CG";
      case "Lawful Neutral":
         return "LN";
      case "True Neutral":
         return "N";
      case "Chaotic Neutral":
         return "CN";
      case "Lawful Evil":
         return "LE";
      case "Neutral Evil":
         return "NE";
      case "Chaotic Evil":
         return "CE";
   }
};



PathfinderCharacter.prototype.isSpellCaster = function() {
    for (var i = 0; i < this.characterClasses.length; i++) {
        if (this.characterClasses[i].isSpellCastingClass()) {
            return true;
        }
    }
    return false;
};


PathfinderCharacter.prototype.getSpellCastingClasses = function() {
    var casterClasses = [];

    for (var i = 0; i < this.characterClasses.length; i++) {
        if (this.characterClasses[i].isSpellCastingClass()) {
            casterClasses.push( this.characterClasses[i] );
        }
    }
    return casterClasses;
};


PathfinderCharacter.prototype.getPrimarySpellCastingClass = function() {
    var primarySpellCastingClass = null;

    for (var i = 0; i < this.characterClasses.length; i++) {
        if (this.characterClasses[i].isSpellCastingClass()) {
            if ((primarySpellCastingClass === null) || (this.characterClasses[i].getMaxSpellLevel() > primarySpellCastingClass.getMaxSpellLevel())) {
                primarySpellCastingClass = this.characterClasses[i];
            }
        }
    }
    return primarySpellCastingClass;
};


PathfinderCharacter.prototype.populateSettings = function( allSettings ) {
   var tmpSettings = allSettings.split(";");
   for (var i = 0; i < tmpSettings.length; i++) {
       var firstColonPos = tmpSettings[i].indexOf( ':' );
       var categoryName = tmpSettings[i].substring( 0, firstColonPos ).trim();
       var optionValues = tmpSettings[i].substring( firstColonPos+1 ).trim();
       this.settings.push( {
           category: categoryName,
           options: optionValues
       } );
   }
};

PathfinderCharacter.prototype.isOptionSet = function( categoryName, optionValue ) {
    for (var i = 0; i < this.settings.length; i++) {
        var settingsEntry = this.settings[i];
        if ((settingsEntry.category === categoryName) && (settingsEntry.options.indexOf(optionValue) !== -1)) {
            return true;
        }
    }

    return false;
};



PathfinderCharacter.prototype.getMeleeWeapons = function() {
   var attacks = [];
   for (var i = 0; i < this.weapons.length; i++) {
      if (this.weapons[i].category === 'melee') {
         attacks.push( this.weapons[i] );
      }
   }

   return attacks;
};


PathfinderCharacter.prototype.getRangedWeapons = function() {
   var attacks = [];
   for (var i = 0; i < this.weapons.length; i++) {
      if (this.weapons[i].category === 'ranged') {
         attacks.push( this.weapons[i] );
      }
   }

   return attacks;
};


PathfinderCharacter.prototype.getSpecialMovement = function( movementName ) {

    for (var i = 0; i < this.specialMovement.length; i++) {
        if (this.specialMovement[i].movementName.indexOf( movementName ) !== -1) {
            return this.specialMovement[i];
        }
    }

    return null;
};


PathfinderCharacter.prototype.hasSpecialMovement = function( movementName ) {
    var specialMove = this.getSpecialMovement( movementName );
    return specialMove !== null;
};

PathfinderCharacter.prototype.getSpecialMovementAmount = function( movementName ) {
    var specialMove = this.getSpecialMovement( movementName );
    return (specialMove === null) ? "" : specialMove.getAmount();
};


PathfinderCharacter.prototype.getFlightManeuverability = function() {
    var specialMove = this.getSpecialMovement( "Flight" );
    var maneuverability = "";

    if (specialMove !== null) {
        var commaPos = specialMove.movementName.indexOf( ',' );
        var closeParenPos = specialMove.movementName.indexOf( ')', commaPos);
        maneuverability = specialMove.movementName.substring(commaPos+1,closeParenPos).trim();
    }

    return maneuverability;
};

PathfinderCharacter.prototype.getFlightManeuverabilityAbbrev = function() {
    var maneuverability = this.getFlightManeuverability();

    if (maneuverability === "Clumsy") {
        maneuverability = "Cl";
    } else if (maneuverability === "Poor") {
        maneuverability = "Pr";
    } else if (maneuverability === "Average") {
        maneuverability = "Avg";
    } else if (maneuverability === "Good") {
        maneuverability = "Gd";
    } else if (maneuverability === "Perfect") {
        maneuverability = "Pfct";
    }

    return maneuverability;
};



PathfinderCharacter.prototype.hasSkillsForAttribute = function( attributeName ) {
    for (var i = 0; i < this.skills.length; i++) {
        var skillObj = this.skills[i];
        if (skillObj.attribute === attributeName && skillObj.isDisplayable()) {
            return true;
        }
    }

    return false;
};


PathfinderCharacter.prototype.displayableSkillsForAttribute = function( attributeName ) {
    var displayableSkills = [];

    for (var i = 0; i < this.skills.length; i++) {
        var skillObj = this.skills[i];
        if (skillObj.attribute === attributeName && skillObj.isDisplayable()) {
            displayableSkills.push( skillObj );
        }
    }

    return displayableSkills;
};



PathfinderCharacter.prototype.getSkill = function( skillName ) {
    for (var i = 0; i < this.skills.length; i++) {
        var skillObj = this.skills[i];
        if (skillObj.skillName === skillName) {
            return skillObj;
        }
    }

    return null;
};



PathfinderCharacter.prototype.hasFeat = function( featName ) {
    for (var i = 0; i < this.feats.length; i++) {
        var featObj = this.feats[i];
        if (featObj.featName === featName) {
            return true;
        }
    }

    return false;
};



PathfinderCharacter.prototype.hasTrait = function( traitName ) {
    for (var i = 0; i < this.traits.length; i++) {
        var traitObj = this.traits[i];
        if (traitObj.traitName === traitName) {
            return true;
        }
    }

    return false;
};


PathfinderCharacter.prototype.gearInNoContainer = function() {
    var uncontainedGear = [];

    for (var i = 0; i < this.gear.length; i++) {
        if (this.gear[i].container === null) {
            uncontainedGear.push( this.gear[i] );
        }
    }

    return uncontainedGear;
};


PathfinderCharacter.prototype.findGearByUniqueId = function( uniqueId ) {
    for (var i = 0; i < this.gear.length; i++) {
        if (this.gear[i].uniqueId === uniqueId) {
            return this.gear[i];
        }
    }

    return null;
};

PathfinderCharacter.prototype.getGearQuantity = function( gearName ) {

    var qty = 0;

    for (var i = 0; i < this.gear.length; i++) {
        if (this.gear[i].gearName.indexOf( gearName ) !== -1) {
            if (this.gear[i].quantity.length > 0) {
               qty += parseInt( this.gear[i].quantity, "10" );
            }
        }
    }

    return qty;
};



PathfinderCharacter.prototype.magicItems = function() {
    var magicItemList = [];

    for (var i = 0; i < this.gear.length; i++) {
        if (this.gear[i].category === "magicitems") {
            magicItemList.push( this.gear[i] );
        }
    }

    return magicItemList;
};


PathfinderCharacter.prototype.isCombatGear = function( gearName ) {
    var i;
    for (i = 0; i < this.weapons.length; i++) {
        if (this.weapons[i].weaponName === gearName) {
            return true;
        }
    }

    for (i = 0; i < this.defenses.length; i++) {
        if (this.defenses[i].armorName === gearName) {
            return true;
        }
    }

    return false;
};


PathfinderCharacter.prototype.getCombatGear = function() {
    var gearList = [];

    for (var i = 0; i < this.gear.length; i++) {
        if (this.isCombatGear( this.gear[i].gearName )) {
            gearList.push( this.gear[i] );
        }
    }

    return gearList;
};


PathfinderCharacter.prototype.getNonCombatGear = function() {
    var gearList = [];

    for (var i = 0; i < this.gear.length; i++) {
        if (!this.isCombatGear( this.gear[i].gearName )) {
            gearList.push( this.gear[i] );
        }
    }

    return gearList;
};


PathfinderCharacter.prototype.getNumSpecialAbilities = function( category ) {
   var numFound = 0;

   for (var i = 0; i < this.specialAbilities.length; i++) {
      if (this.specialAbilities[i].category === category) {
         numFound++;
      }
   }

   return numFound;
};


PathfinderCharacter.prototype.getSpecialAbilities = function( category ) {
   var abilities = [];

   for (var i = 0; i < this.specialAbilities.length; i++) {
      if (this.specialAbilities[i].category === category) {
         abilities.push( this.specialAbilities[i] );
      }
   }

   return abilities;
};


PathfinderCharacter.prototype.getCmbExceptions = function() {
    var exceptions = [];
    for (var i = 0; i < this.maneuvers.length; i++) {
        if (this.maneuvers[i].cmb !== this.cmb) {
            exceptions.push( this.maneuvers[i] );
        }
    }
    return exceptions;
};

PathfinderCharacter.prototype.getCmdExceptions = function() {
    var exceptions = [];
    for (var i = 0; i < this.maneuvers.length; i++) {
        if (this.maneuvers[i].cmd !== this.cmd) {
            exceptions.push( this.maneuvers[i] );
        }
    }
    return exceptions;
};


var slowAdvancementTable = [
   3000,
   7500,
   14000,
   23000,
   35000,
   53000,
   77000,
   115000,
   160000,
   235000,
   330000,
   475000,
   665000,
   955000,
   1350000,
   1900000,
   2700000,
   3850000,
   5350000
];

var mediumAdvancementTable = [
   2000,
   5000,
   9000,
   15000,
   23000,
   35000,
   51000,
   75000,
   105000,
   155000,
   220000,
   315000,
   445000,
   635000,
   890000,
   1300000,
   1800000,
   2550000,
   3600000
];

var fastAdvancementTable = [
   1300,
   3300,
   6000,
   10000,
   15000,
   23000,
   34000,
   50000,
   71000,
   105000,
   145000,
   210000,
   295000,
   425000,
   600000,
   850000,
   1200000,
   1700000,
   2400000
];

PathfinderCharacter.prototype.getNextLevelXP = function() {
    var nextLevelXP = "";

    if (this.isOptionSet('Advancement Speed', 'Pathfinder Society Advancement')) {
        nextLevelXP = this.classesLevel * 3;

    } else if (this.isOptionSet('Advancement Speed', 'Slow Advancement')) {
        nextLevelXP = (this.classesLevel-1 < slowAdvancementTable.length) ? slowAdvancementTable[ this.classesLevel-1 ] : "Unknown";

    } else if (this.isOptionSet('Advancement Speed', 'Medium Advancement')) {
        nextLevelXP = (this.classesLevel-1 < mediumAdvancementTable.length) ? mediumAdvancementTable[ this.classesLevel-1 ] : "Unknown";

    } else if (this.isOptionSet('Advancement Speed', 'Fast Advancement')) {
        nextLevelXP = (this.classesLevel-1 < fastAdvancementTable.length) ? fastAdvancementTable[ this.classesLevel-1 ] : "Unknown";

    } else {
        nextLevelXP = "Unknown";
    }

    return nextLevelXP;
};



PathfinderCharacter.prototype.getPenalty = function( penaltyName ) {

    for (var i = 0; i < this.penalties.length; i++) {
        if (this.penalties[i].penaltyName === penaltyName) {
            return this.penalties[i];
        }
    }

    return null;
};


PathfinderCharacter.prototype.getPenaltyText = function( penaltyName ) {
   var penaltyObj = this.getPenalty( penaltyName );
   if (penaltyObj === null) {
       return "";
   }

   return penaltyObj.text;
};





function getSpellAbility( className ) {
    return (CASTING_CLASSES[className]) ? CASTING_CLASSES[className].attr : "Unknown";
}


function PathfinderClass( className ) {
    this.className = className;
    this.baseClassName = className;
    this.archetypes = [];
    this.spellLevels = [];
    this.spellsKnown = [];
    this.spellsPrepared = [];
    this.spellbook = [];

    // console.log( "className=" + className );
    var openParenPos = className.indexOf('(' );
    if (openParenPos !== -1) {
        if (className.indexOf("Summoner") !== -1 && className.indexOf("Unchained") !== -1) {
            this.baseClassName = "Summoner (Unchained)";

        } else {
            if (className.includes("Shadow Magus")) {
                this.baseClassName = "Magus";
            } else {
                this.baseClassName = className.substring(0, openParenPos ).trim();
            }
            var closeParenPos = className.indexOf( ')' );
            var allArchetypesStr = className.substring( openParenPos+1, closeParenPos );
            this.archetypes = allArchetypesStr.split( ',' );

            for (var i = 0; i < this.archetypes.length; i++) {
                this.archetypes[i] = this.archetypes[i].trim();
            }
            if (className.includes("Shadow Magus")) {
                this.archetypes.push("shadow magus");
            }
        }
    }

    if (this.isWizardSpecialist()) {
        this.baseClassName = "Wizard";
    }

    this.spellAbility = getSpellAbility( this.baseClassName );
}



PathfinderClass.prototype.isWizardSpecialist = function() {
    return (this.className.includes("Abjurer")     ||
            this.className.includes("Conjurer")    ||
            this.className.includes("Diviner")     ||
            this.className.includes("Enchanter")   ||
            this.className.includes("Evoker")      ||
            this.className.includes("Illusionist") ||
            this.className.includes("Necromancer") ||
            this.className.includes("Transmuter"));
};



PathfinderClass.prototype.isSpellCastingClass = function() {
    // console.log( this.className + " -- #spellLevels =" + this.spellLevels.length );
    return this.spellLevels.length > 0;
};

PathfinderClass.prototype.getAvailableSpells = function() {
    switch (this.castingType) {
        case "Memorized":
            return this.spellsPrepared;

        case "Spellbook":
        case "Flexible Book":
            return this.spellbook;

        case "Spontaneous":
            return this.spellsKnown;

        default:
            return [];
    }
};

PathfinderClass.prototype.getReadySpells = function() {
    switch (this.castingType) {
        case "Memorized":
        case "Spellbook":
            // console.log("returning prepared spells; count = " + this.spellsPrepared.length );
            return this.spellsPrepared;

        case "Spontaneous":
            // console.log("returning known spells");
            return this.spellsKnown;

        default:
            // console.log("returning empty spell list");
            return [];
    }
};

PathfinderClass.prototype.getReadySpellsTag = function() {
    switch (this.castingType) {
        case "Memorized":
        case "Spellbook":
        case "Flexible Book":
            return "Prepared";

        case "Spontaneous":
            return "Known";

        default:
            return "???";
    }
};


PathfinderClass.prototype.getMaxSpellLevel = function() {
    var maxSpellLevel = -1;
    for (var i = 0; i < this.spellLevels.length; i++) {
        if (this.spellLevels[i].level > maxSpellLevel) {
            maxSpellLevel = this.spellLevels[i].level;
        }
    }

    return maxSpellLevel;
};



PathfinderClass.prototype.canCastSpellsOfLevel = function( spellLevel ) {

   for (var i = 0; i < this.spellLevels.length; i++) {
        if (this.spellLevels[i].level == spellLevel) {
            // console.log("CAN cast spells of level " + spellLevel );
            return true;
        }
    }

    // console.log("CANNOT cast spells of level " + spellLevel );
    return false;
};


PathfinderClass.prototype.getSpellsOfLevel = function( spellLevel ) {
    var availableSpells = this.getAvailableSpells();

    var spellsOfLevel = [];
    for (var i = 0; i < availableSpells.length; i++) {
        if (availableSpells[i].level == spellLevel) {
            spellsOfLevel.push( availableSpells[i] );
        }
    }

    return spellsOfLevel;
};


PathfinderClass.prototype.getReadySpellsOfLevel = function( spellLevel ) {
    var readySpells = this.getReadySpells();

    var spellsOfLevel = [];
    if (this.canCastSpellsOfLevel( spellLevel )) {
       for (var i = 0; i < readySpells.length; i++) {
          if (readySpells[i].level == spellLevel) {
              spellsOfLevel.push( readySpells[i] );
          }
       }
    }
    return spellsOfLevel;
};




PathfinderClass.prototype.getMaxCastsOfSpellLevel = function( spellLevel ) {

    var maxCasts = "0";
    for (var i = 0; i < this.spellLevels.length; i++) {
        if (this.spellLevels[i].level == spellLevel) {
            if (this.spellLevels[i].maxCasts) {
                return this.spellLevels[i].maxCasts;
            } else if (this.spellLevels[i].unlimited === 'yes') {
                return "unlimited";
            }
        }
    }

    return maxCasts;
};




PathfinderClass.prototype.getSpellSaveDCs = function( spellLevel ) {
    var availableSpells = this.getSpellsOfLevel( spellLevel );
    if (availableSpells.length === 0) {
        return "";
    }

    var a = [];
    var u = {};
    for (var i = 0; i < availableSpells.length; i++) {
        var saveDC = availableSpells[i].saveDC;
        if (saveDC.length === 0) {
            continue;
        }

        if (!u.hasOwnProperty(saveDC)) {
            u[saveDC] = 1;
            a.push( saveDC );
        }
    }

    a.sort();

    var dcStr = "";
    for (var j = 0; j < a.length; j++) {
        if (dcStr.length > 0) {
            dcStr += ',';
        }
        dcStr += a[j];
    }

    return dcStr;
};



PathfinderClass.prototype.isSpellInBook = function( spellName ) {
    for (var i = 0; i < this.spellbook.length; i++) {
        if (this.spellbook[i].spellName === spellName) {
            return true;
        }
    }

    return false;
};





function PathfinderSpellLevel( level ) {
    this.level = level;
}



function PathfinderSpell( spellName ) {
    this.spellName = spellName;
    this.isSpecialSpell = false;
}

PathfinderSpell.prototype.hasMeaningfulSave = function() {
    return (this.saveDC.length > 0) && (this.save !== "None") && (this.save.toLowerCase().indexOf('harmless') === -1);
};



function PathfinderCombatManeuver( maneuverName ) {
    this.maneuverName = maneuverName;
}





function PathfinderWeapon( weaponName ) {
    this.weaponName = weaponName;
    this.weaponEncumbrance = determineweaponEncumbrance( weaponName );
    this.powers = [];
}

PathfinderWeapon.prototype.getFirstAttackValue = function() {
    var slashPos = this.attackBonus.indexOf( '/' );

    var attackValue = "";
    if (slashPos === -1) {
        attackValue = this.attackBonus;
    } else {
       attackValue = this.attackBonus.substring(0, slashPos);
    }

    if (attackValue.charAt(0) === '+') {
        attackValue = attackValue.substring(1);
    }

    return attackValue;
};


PathfinderWeapon.prototype.getPrimaryAttackWithLightOffHand = function() {
    var firstAttackValue = this.getFirstAttackValue();
    var adjustedAttackValue = this.owner.hasFeat('Two-weapon Fighting') ? firstAttackValue-2: firstAttackValue-4;
    if (this.owner.hasTrait('Serpent Runner (Two Weapons)')) {
        adjustedAttackValue -= 1;
    }
    return adjustedAttackValue;
};

PathfinderWeapon.prototype.getPrimaryAttackWithNonLightOffHand = function() {
    var firstAttackValue = this.getFirstAttackValue();
    var adjustedAttackValue = this.owner.hasFeat('Two-weapon Fighting') ? firstAttackValue-4: firstAttackValue-6;
    if (this.owner.hasTrait('Serpent Runner (Two Weapons)')) {
        adjustedAttackValue -= 1;
    }
    return adjustedAttackValue;
};

PathfinderWeapon.prototype.getOffHandAttack = function() {
    var firstAttackValue = this.getFirstAttackValue();
    var hasTwoWeaponFightingFeat = this.owner.hasFeat('Two-weapon Fighting');

    if (hasTwoWeaponFightingFeat && (this.weaponEncumbrance === 'light' || this.weaponEncumbrance === 'double')) {
        return firstAttackValue - 2;

    } else if (hasTwoWeaponFightingFeat) {
        return firstAttackValue - 4;

    } else if (this.weaponEncumbrance === 'light' || this.weaponEncumbrance === 'double') {
        return firstAttackValue - 8;

    } else {
        return firstAttackValue - 10;
    }
};

PathfinderWeapon.prototype.isProjectileWeapon = function() {
    return this.categoryText.indexOf('Projectile Weapon') !== -1;
};

PathfinderWeapon.prototype.getAmmunition = function() {
    var ammo = "";

    if (this.weaponName.indexOf('Crossbow') !== -1) {
        ammo = this.owner.getGearQuantity('Bolt') + " bolts";

    } else if (this.weaponName.indexOf('Longbow') !== -1) {
        ammo = this.owner.getGearQuantity('Arrow') + " arrows";

    } else if (this.weaponName.indexOf('Shortbow') !== -1) {
        ammo = this.owner.getGearQuantity('Arrow') + " arrows";

    } else if (this.weaponName.indexOf('Sling') !== -1) {
        ammo = this.owner.getGearQuantity('Bullets') + " bullets";
    }

    return ammo;
};



function PathfinderArmor( armorName ) {
    this.armorName = armorName;
}


function PathfinderItemPower( powerName ) {
    this.powerName = powerName;
}



function PathfinderSkill( skillName ) {
    this.skillName = skillName;
}

PathfinderSkill.prototype.isDisplayable = function() {
    return (this.ranks > 0) || (this.trainedOnly !== 'yes') || !sheetConfig.hideUnusableSkills;
};




function PathfinderTrait( traitName ) {
    this.traitName = traitName;
}


function PathfinderSpecialAbility( specialAbilityName ) {
    this.specialAbilityName = specialAbilityName;
    this.category = "";
}



var commonFeats = [
    "Armor Proficiency (Light)",
    "Armor Proficiency (Medium)",
    "Armor Proficiency (Heavy)",
    "Shield Proficiency",
    "Simple Weapon Proficiency - All",
    "Martial Weapon Proficiency - All"
];

function PathfinderFeat( featName ) {
    this.featName = featName;
    this.isCommon = ($.inArray( featName, commonFeats ) !== -1);
}




function PathfinderSpecialMovement( movementName ) {
    this.movementName = movementName;
}

PathfinderSpecialMovement.prototype.getAmount = function() {
    var openParenPos = this.movementName.indexOf( '(' );
    var spacePos = this.movementName.indexOf( ' ', openParenPos );
    var distance = this.movementName.substring( openParenPos+1, spacePos );
    return distance;
};




function PathfinderGear( gearName, category ) {
    this.gearName = gearName;
    this.category = category;
    this.isContainer = false;
    this.powers = [];
    this.containedItems = [];
    this.container = null;

    var emptyPos = gearName.indexOf( " (empty)" );
    var amountWeightPos = gearName.search(/\s\(\d+\s@\s\d+(\.\d+)*\slbs\)/i);

    if (emptyPos !== -1) {
       this.isContainer = true;
       this.gearName = gearName.substring(0, emptyPos);

    } else if (amountWeightPos !== -1) {
       this.isContainer = true;
       this.gearName = gearName.substring(0, amountWeightPos);

    } else {

        for (var i = 0; i < dataRoot.containerGlossary.length; i++) {
            if (gearName.toLowerCase().indexOf( dataRoot.containerGlossary[i] ) !== -1) {
                this.isContainer = true;
                break;
            }
        }
    }
}


function PathfinderTrackedResource( resourceName ) {
    this.resourceName = resourceName;
}


function PathfinderPenalty( penaltyName ) {
    this.penaltyName = penaltyName;
}

function PathfinderNpc() {
    this.description = "";
}


// ===========================================================
// ===========================================================
// ===========================================================


function fixBulletedList( str ) {
    var bulletChar = String.fromCharCode( 8226 );
    var bulletPos = str.indexOf( bulletChar );

    if (bulletPos === -1) {
        return str;
    }

    var segments = str.split( bulletChar );

    str = segments[0];
    str += "<UL>";
    for (var i = 1; i < (segments.length-1); i++) {
        str += "<LI>";
        str += segments[i];
        str += "</LI>";
    }

    var lastSegment = segments[ segments.length-1 ];
    var elementPos = lastSegment.indexOf( '<' );
    if (elementPos === -1) {
        str += "<LI>";
        str += lastSegment;
        str += "</LI></UL>";
    } else {
        var lastListItem = lastSegment.substring( 0, elementPos );
        var remainingText = lastSegment.substring( elementPos );
        str += "<LI>";
        str += lastListItem;
        str += "</LI></UL>";
        str += remainingText;

    }

    // console.log( str );
    return str;
}

// ===========================================================
// ===========================================================
// ===========================================================

function formatSpecialMovementDescription( nameOnly, specialMovement ) {

    var description = "<B><U>" + nameOnly + "</U></B><P>";
    description += specialMovement.description;
    description += "</P>";

    return description;
}



function addMovementToGlossary( specialMovement ) {
   var nameOnly = specialMovement.movementName.split(" ")[0];
   var entry = {
       movementName: nameOnly,
       description: formatSpecialMovementDescription( nameOnly, specialMovement )
   };

   for (var i = 0; i < dataRoot.specialMovementGlossary.length; i++) {
       if (dataRoot.specialMovementGlossary[i].movementName === nameOnly) {
           return;
       }
   }
   dataRoot.specialMovementGlossary.push( entry );
}



function getMovementDescription( movementName ) {
    for (var i = 0; i < dataRoot.specialMovementGlossary.length; i++) {
        if (dataRoot.specialMovementGlossary[i].movementName === movementName) {
           return dataRoot.specialMovementGlossary[i].description;
        }
    }

    return "You do not have this form of movement: " + movementName;
}

// ===========================================================
// ===========================================================
// ===========================================================


function addSkillToGlossary( pathfinderSkill ) {
    var skillName = pathfinderSkill.skillName;

    // If the skill is already in the glossary, don't add it again
    for (var i = 0; i < dataRoot.skillGlossary.length; i++) {
        if (dataRoot.skillGlossary[i].skillName === skillName) {
            return;
        }
    }

    pathfinderSkill.description = formatSkillDescription( pathfinderSkill );

    dataRoot.skillGlossary.push( pathfinderSkill );
}





function markupSubHeading( str, subHeading ) {
    return str.replace( subHeading, "<span class='text-part-subheader'>" + subHeading + "</span>" );
}



function formatSkillDescription( pathfinderSkill ) {
    var description = "<B><U>" + pathfinderSkill.skillName + "</U></B><P>";
    description += pathfinderSkill.description;
    description += "</P>";

    description = description.replace(/\n/g, "</p><p>");
    description = description.replace("Action:", "<span class='text-part-header'>Action:</span>" );
    description = description.replace("Check:", "<span class='text-part-header'>Check:</span>" );
    description = description.replace("Continued - ", "<span class='text-part-header'>Continued</span> - " );
    description = description.replace("Special:", "<span class='text-part-header'>Special:</span>" );
    description = description.replace("Try Again:", "<span class='text-part-header'>Try Again:</span>" );

    switch (pathfinderSkill.skillName) {
        case "Bluff":
            description = markupSubHeading(description, "Feint:");
            break;
        case "Escape Artist":
            description = markupSubHeading(description, "Grappler:");
            description = markupSubHeading(description, "Manacles and Masterwork Manacles:");
            description = markupSubHeading(description, "Ropes:");
            description = markupSubHeading(description, "Tight Space:");
            break;
        case "Heal":
            description = markupSubHeading(description, "First Aid:");
            break;
        case "Intimidate":
            description = markupSubHeading(description, "Demoralize:");
            break;
        case "Ride":
            description = markupSubHeading(description, "Fight with a Combat-Trained Mount:");
            description = markupSubHeading(description, "Guide with Knees:");
            description = markupSubHeading(description, "Stay in Saddle:");
            break;
        case "Sense Motive":
            description = description.replace("Hunch: This", "<span class='text-part-subheader'>Hunch:</span> This" );
            description = markupSubHeading(description, "Sense Enchantment:");
            break;
    }

    description = fixBulletedList( description );

    return description;
}


function getSkillDescription( skillName ) {
    for (var i = 0; i < dataRoot.skillGlossary.length; i++) {
        if (dataRoot.skillGlossary[i].skillName === skillName) {
           return dataRoot.skillGlossary[i].description;
        }
    }

    return "No description for skill " + skillName;
}

// ===========================================================
// ===========================================================
// ===========================================================

/*$.views.converters({
    spaceIfNull:function(value){
        return (value.length === 0) ? "&nbsp;" : value;
    },

    newLineToBreak:function(value) {
        if (value.length > 0) {
            value = value.replace(/\n/g, "<br/>");
        }
        return value;
    },

    removePlus:function(value){
        if (realTypeOf(value) === 'String' && value.length > 0 && value.charAt(0) === '+') {
            value = value.substring( 1 );
        }
        return value;
    },

    addIntegerPlus:function(value){
        if (realTypeOf(value) === 'String') {
           if (value.length > 0 && value.charAt(0) !== '+' && value.charAt(0) !== '-') {
              value = "+".concat(value);
           }
        } else {
            if (value >= 0) {
                value = "+" + value;
            }
        }
        return value;
    },

    forceWeight:function(value) {
        return (value.length === 0) ? "0 lb" : value;
    },

    truncateWeightText:function(value) {
        if (value.length > 0) {
            var spacePos = value.indexOf(' ');
            if (spacePos > 0) {
                value = value.substring( 0, spacePos );
            }
        }

        return value;
    },

    forceCost:function(value) {
        return (value.length === 0) ? "0 gp" : value;
    },

    formatFeat:function(value) {
        // value = value.replace(/\n\n/g, "<br/>");
        // value = value.replace(/\n/g, "<br/>");
        value = value.replace(/\n/g, "</p><p>");
        value = value.replace(/Act Out of Turn\:/g, "<span class='text-part-header'>Act Out of Turn:</span>");
        value = value.replace(/Benefit\:/g, "<span class='text-part-header'>Benefit:</span>");
        value = value.replace(/Bonus\:/g, "<span class='text-part-header'>Bonus:</span>");
        value = value.replace(/Cheat Death\:/g, "<span class='text-part-header'>Cheat Death:</span>");
        value = value.replace(/Extra Action\:/g, "<span class='text-part-header'>Extra Action:</span>");
        value = value.replace(/Inspiration\:/g, "<span class='text-part-header'>Inspiration:</span>");
        value = value.replace(/Normal\:/g, "<span class='text-part-header'>Normal:</span>");
        value = value.replace(/Note\:/g, "<span class='text-part-header'>Note:</span>");
        value = value.replace(/Prerequisite\:/g, "<span class='text-part-header'>Prerequisite:</span>");
        value = value.replace(/Prerequisites\:/g, "<span class='text-part-header'>Prerequisites:</span>");
        value = value.replace(/Recall\:/g, "<span class='text-part-header'>Recall:</span>");
        value = value.replace(/Reroll\:/g, "<span class='text-part-header'>Reroll:</span>");
        value = value.replace(/Special\:/g, "<span class='text-part-header'>Special:</span>");
        return value;
    },

    formatMagicItem:function(value) {
        // value = value.replace(/\n\n/g, "<br/>");
        // value = value.replace(/\n/g, "<br/>");
        value = value.replace(/Construction\s+Requirements/g, "Construction Requirements" );
        value = value.replace(/CONSTRUCTION\s+Requirements/g, "Construction Requirements" );
        value = value.replace(/\n/g, "</p><p>");
        value = value.replace(/Note\:/g, "<span class='text-part-header'>Note:</span>");
        return value;
    },

    formatSpellDescription:function(value) {
        value = value.replace(/\n/g, "</p><p>");
        value = value.replace(/Material\:/g, "<span class='text-part-header'>Material:</span>");
        return value;
    }
});*/



// ===========================================================
// ===========================================================
// ===========================================================

function fixFontSize() {
    $( '.auto-size-font' ).each(function ( i, box ) {

        var width = $( box ).width();
        var html = '<span class="populated" style="white-space:nowrap"></span>';
        var line = $( box ).wrapInner( html ).children()[ 0 ];
        var fontSize = parseInt( $(box).css('font-size') );

        $( box ).css( 'font-size', fontSize );

        while ( $( line ).width() > width ) {
            $( box ).css( 'font-size', --fontSize );
        }

        $( box ).text( $( line ).text() );

    });
}


function fixInfoLinks() {
   // Display information if an info-link is clicked
   $('.info-link').click(function(){
      var infoId = $(this).attr( 'data-info-id' );
      var infoType = $(this).attr( 'data-info-type' );
      var infoName = $(this).attr( 'data-info-name' );

      var infoText = "No info found";

      if (infoId && infoId.length > 0) {
         infoText = $('#' + infoId).html();
      } else {
          if (infoType === "skill") {
              infoText = getSkillDescription( infoName );

          } else if (infoType === "movement") {
              infoText = getMovementDescription( infoName );
          }
      }


      displayInfo( infoText );
      return false;
   });
}





function fixOnSheetControls() {
    fixTextEditing();

    if (sheetConfig.displayOnSheetControls) {
       $('.on-sheet-control-toolbar').show();
       $('.hide-item-button').html('X').show();
       $('.portrait-panel-toolbar').show();
       $('.character-portrait').draggable();

       $('.portrait-panel').resizable({handles: "s"});

       $('.hide-item-button').click(function() {
           $(this).parent().hide();
       });

       $('.sheet-region').sortable({
           connectWith: '.sheet-region',
           cursor: 'move'
       });

       $('.gear-list-rows').sortable({
           axis: 'y',
           connectWith: '.gear-list-rows',
           cursor: 'ns-resize',
           receive: function(e, ui) {
              var receivingContainerGearId = $(this).attr('data-gear-id');
              var sendingContainerGearId = $(ui.sender).attr('data-gear-id');
              var itemGearId = $(ui.item).attr('data-gear-id');

              var characterId = $(this).parents('.pathfinder-character').attr('id');
              var characterIndex = characterId.split('_')[1];
              var characterObj = dataRoot.characters[characterIndex];

              var receivingContainerObj = (receivingContainerGearId === null) ? null : characterObj.findGearByUniqueId( receivingContainerGearId );
              var sendingContainerObj = (sendingContainerGearId === null) ? null : characterObj.findGearByUniqueId( sendingContainerGearId );
              var itemObj = characterObj.findGearByUniqueId( itemGearId );

              itemObj.container = receivingContainerObj;

              if (receivingContainerObj !== null) {
                  receivingContainerObj.containedItems.push( itemObj );
              }

              if (sendingContainerObj !== null) {
                  sendingContainerObj.containedItems.splice( $.inArray( itemObj, sendingContainerObj.containedItems ), 1 );
              }



              $(this).find('.gear-empty-container-indicator-row').remove();

              if ($(ui.sender).find('tr').length === 0) {
                  $(ui.sender).append( '<tr class="gear-empty-container-indicator-row"><td></td><td>empty</td><td></td><td></td></tr>' );
              }
           },
           update: function(e, ui) {
    //               alert( $(this).attr('id') );
           }
        });

    } else {
       $('.on-sheet-control-toolbar').hide();
       $('.hide-item-button').hide();
       $('.portrait-panel-toolbar').hide();
       $('.character-portrait').draggable( 'destroy' );
       $('.portrait-panel').resizable('destroy');
       $('.gear-list-rows').sortable("destroy");
       $('.sheet-region').sortable('destroy');
    }
}



function fixTextEditing() {
    if (sheetConfig.editItemText) {
       $( '.editable-text' ).addClass( 'text-editing-enabled' )
                            .attr( 'contenteditable', 'true' );
    } else {
       $( '.editable-text' ).removeClass( 'text-editing-enabled' )
                            .attr( 'contenteditable', 'false' );
    }
}



function drawStandardPanelTitle( titlePlaceholder, parentWidth ) {
   var title = titlePlaceholder.attr('data-title').toUpperCase();


   $('#text-size-finder').html( title );
   var textHeight = $('#text-size-finder').height();

   var titleBarWidth = parentWidth;
   var titleBarHeight = textHeight + 2;

   var curveWidth = 20;
   var curveXOffset = Math.floor(curveWidth * 0.75);
   var curveYOffset = Math.floor( (titleBarHeight/2) * 0.75 );

   var pathStr = "<path d='";
   pathStr += "M0 " + (titleBarHeight/2);
   pathStr += " S"
           + " " + curveXOffset + " " + curveYOffset
           + " " + curveWidth + " 0";
   pathStr += " H" + (titleBarWidth-curveWidth);
   pathStr += " S"
           + " " + (titleBarWidth-curveXOffset) + " " + curveYOffset
           + " " + titleBarWidth + " " + (titleBarHeight/2);
   pathStr += " C " + titleBarWidth + " " + (titleBarHeight/2)
           + " " + (titleBarWidth-curveXOffset) + " " + (titleBarHeight-curveYOffset)
           + " " + (titleBarWidth-curveWidth) + " " + titleBarHeight;
   pathStr += " H" + curveWidth;
   pathStr += " S"
           + " " + curveXOffset + " " + (titleBarHeight-curveYOffset)
           + " 0 " + (titleBarHeight/2);
   pathStr += " z";
   pathStr += "'/>";

    //               pathStr += "<rect x='" + curveWidth + "' y='0' width='" + (titleBarWidth - (curveWidth*2)) + "' height='" + titleBarHeight + "' stroke='white'/>"
    //               pathStr += "<line x1='0' y1='" + (titleBarHeight/2) + "' x2='" + titleBarWidth + "' y2='" + (titleBarHeight/2) + "' stroke='white'/>";

   var textStr = "<text x='" + (titleBarWidth/2) + "' y='77%' text-anchor='middle'>" + title + "</text>";

   var str = "<svg width='" + parentWidth + "' height='" + titleBarHeight + "' xmlns='http://www.w3.org/2000/svg'>";
   str += pathStr;
   str += textStr;
   str += "</svg>";

   titlePlaceholder.html(str);
}


function fixPanelHeaders( panelSet, isPanelBordered ) {
    if (sheetConfig.panelHeaderStyle === 'standard') {
        panelSet.find('.standard-panel-header').each(function() {
           var placeholderObj = $(this);
           drawStandardPanelTitle( placeholderObj, placeholderObj.width() );

           if (isPanelBordered) {
              var topAdjust = (placeholderObj.height() / 2);
              $(this).css('top', -topAdjust);
           }
        });
    }
}


function displayInfo( infoHtml ) {
   $('#info-panel').html( infoHtml );

   if (!infoPanelDialog.dialog( 'isOpen' )) {
      infoPanelDialog.dialog( 'open' );
   }
}




function regenerateMovement() {
   for (var i = 0; i < dataRoot.characters.length; i++) {
       if (sheetConfig.movementLayout === "Traditional") {
          $.link.movementTraditionalTemplate( "#movement-placeholder-" + i, dataRoot.characters[i] );

       } else if (sheetConfig.movementLayout === "Compact") {
          $.link.movementCompactTemplate( "#movement-placeholder-" + i,  dataRoot.characters[i] );

       } else {
          $.link.movementSimpleTemplate( "#movement-placeholder-" + i, dataRoot.characters[i] );
       }
    }

    $('.movement-panel .on-screen-control-button').button({text: false, icons: {primary: "ui-icon-refresh"}});

    $('.movement-panel .switch-style-button').click(function() {
        switch (sheetConfig.movementLayout) {
            case "Traditional":
                sheetConfig.movementLayout = "Compact";
                break;
            case "Compact":
                sheetConfig.movementLayout = "Simple";
                break;
            case "Simple":
            default:
                sheetConfig.movementLayout = "Traditional";
                break;
        }
        $.cookie( 'a1-movement-layout', sheetConfig.movementLayout, {expires: 365, path: '/'} );
        doRedrawingWork( regenerateMovement );
    });

    fixPanelHeaders( $('.movement-panel'), false );
    fixInfoLinks();
    fixOnSheetControls();
}




function regenerateSkills() {
   for (var i = 0; i < dataRoot.characters.length; i++) {
       switch (sheetConfig.skillsLayout) {
           case "Traditional":
               $.link.skillsTraditionalTemplate( "#skills-placeholder-" + i, dataRoot.characters[i] );
               break;
           case "Standard":
               $.link.skillsStandardTemplate( "#skills-placeholder-" + i, dataRoot.characters[i] );
               break;
           case "Compact":
               $.link.skillsCompactTemplate( "#skills-placeholder-" + i, dataRoot.characters[i] );
               break;
           case "Series":
           default:
               $.link.skillsSeriesTemplate( "#skills-placeholder-" + i, dataRoot.characters[i] );
               break;
       }
    }

    $('.skills-panel .on-screen-control-button').button({text: false, icons: {primary: "ui-icon-refresh"}});

    $('.skills-panel .switch-style-button').click(function() {
        switch (sheetConfig.skillsLayout) {
            case "Traditional":
                sheetConfig.skillsLayout = "Compact";
                break;
            case "Compact":
                sheetConfig.skillsLayout = "Standard";
                break;
            case "Standard":
                sheetConfig.skillsLayout = "Series";
                break;
            case "Series":
            default:
                sheetConfig.skillsLayout = "Traditional";
                break;
        }
        $.cookie( 'a1-skill-layout', sheetConfig.skillsLayout, {expires: 365, path: '/'} );
        doRedrawingWork( regenerateSkills );
    });

    fixPanelHeaders( $('.skills-panel'), false );
    fixInfoLinks();
    fixOnSheetControls();
}




function regenerateWeapons() {
   for (var i = 0; i < dataRoot.characters.length; i++) {
       if (sheetConfig.weaponsLayout === "Traditional") {
          $.link.weaponsTraditionalTemplate( "#weapons-placeholder-" + i, dataRoot.characters[i] );

       } else {
          $.link.weaponsCompactTemplate( "#weapons-placeholder-" + i, dataRoot.characters[i] );
       }
    }

    $('.weapon-panel .on-screen-control-button').button({text: false, icons: {primary: "ui-icon-refresh"}});

    $('.weapon-panel .switch-style-button').click(function() {
        switch (sheetConfig.weaponsLayout) {
            case "Traditional":
                sheetConfig.weaponsLayout = "Compact";
                break;
            case "Compact":
            default:
                sheetConfig.weaponsLayout = "Traditional";
                break;
        }
        $.cookie( 'a1-weapon-layout', sheetConfig.weaponsLayout, {expires: 365, path: '/'} );
        doRedrawingWork( regenerateWeapons );
    });



    fixInfoLinks();
    handleColorCoding( sheetConfig.colorCoding );
    fixFontSize();
    fixOnSheetControls();
}




function regenerateTraits() {
   for (var i = 0; i < dataRoot.characters.length; i++) {
       if (sheetConfig.traitsLayout === "List") {
          $.link.traitsListTemplate( "#traits-placeholder-" + i, dataRoot.characters[i] );

       } else {
          $.link.traitsCommaSeparatedTemplate( "#traits-placeholder-" + i, dataRoot.characters[i] );
       }
    }

    $('.traits-summary-panel .on-screen-control-button').button({text: false, icons: {primary: "ui-icon-refresh"}});

    $('.traits-summary-panel .switch-style-button').click(function() {
        switch (sheetConfig.traitsLayout) {
            case "List":
                sheetConfig.traitsLayout = "CommaSeparated";
                break;
            case "CommaSeparated":
            default:
                sheetConfig.traitsLayout = "List";
                break;
        }
        $.cookie( 'a1-trait-layout', sheetConfig.traitsLayout, {expires: 365, path: '/'} );
        doRedrawingWork( regenerateTraits );
    });

    fixPanelHeaders( $('.traits-summary-panel'), false );
    fixInfoLinks();
    fixOnSheetControls();
}




function regenerateSpecialAbilities() {
   for (var i = 0; i < dataRoot.characters.length; i++) {
       if (sheetConfig.specialAbilityLayout === "List") {
          $.link.specialAbilitiesListTemplate( "#special-abilities-placeholder-" + i, dataRoot.characters[i] );

       } else {
          $.link.specialAbilitiesCommaSeparatedTemplate( "#special-abilities-placeholder-" + i, dataRoot.characters[i] );
       }
    }

    $('.special-abilities-panel .on-screen-control-button').button({text: false, icons: {primary: "ui-icon-refresh"}});

    $('.special-abilities-panel .switch-style-button').click(function() {
        switch (sheetConfig.specialAbilityLayout) {
            case "List":
                sheetConfig.specialAbilityLayout = "CommaSeparated";
                break;
            case "CommaSeparated":
            default:
                sheetConfig.specialAbilityLayout = "List";
                break;
        }
        $.cookie( 'a1-special-ability-layout', sheetConfig.specialAbilityLayout, {expires: 365, path: '/'} );
        doRedrawingWork( regenerateSpecialAbilities );
    });

    fixPanelHeaders( $('.special-abilities-panel'), false );
    fixPanelHeaders( $('.standard-special-abilities-panel'), false );
    fixInfoLinks();
    fixOnSheetControls();
}




function regenerateFeats() {
   for (var i = 0; i < dataRoot.characters.length; i++) {
       if (sheetConfig.featsLayout === "List") {
          $.link.featsListTemplate( "#feats-placeholder-" + i, dataRoot.characters[i] );

       } else {
          $.link.featsCommaSeparatedTemplate( "#feats-placeholder-" + i, dataRoot.characters[i] );
       }
    }

    $('.feats-panel .on-screen-control-button').button({text: false, icons: {primary: "ui-icon-refresh"}});

    $('.feats-panel .switch-style-button').click(function() {
        switch (sheetConfig.featsLayout) {
            case "List":
                sheetConfig.featsLayout = "CommaSeparated";
                break;
            case "CommaSeparated":
            default:
                sheetConfig.featsLayout = "List";
                break;
        }
        $.cookie( 'a1-feat-layout', sheetConfig.featsLayout, {expires: 365, path: '/'} );
        doRedrawingWork( regenerateFeats );
    });

    fixPanelHeaders( $('.feats-panel'), false );
    fixPanelHeaders( $('.standard-feats-panel'), false );
    fixInfoLinks();
    fixOnSheetControls();
}




function regenerateLanguages() {
   for (var i = 0; i < dataRoot.characters.length; i++) {
       if (sheetConfig.languagesLayout === "List") {
          $.link.languagesListTemplate( "#languages-placeholder-" + i, dataRoot.characters[i] );

       } else if (sheetConfig.languagesLayout === "Standard") {
          $.link.languagesStandardTemplate( "#languages-placeholder-" + i, dataRoot.characters[i] );

       } else {
          $.link.languagesCommaSeparatedTemplate( "#languages-placeholder-" + i, dataRoot.characters[i] );
       }
    }

    $('.languages-panel .on-screen-control-button').button({text: false, icons: {primary: "ui-icon-refresh"}});

    $('.languages-panel .switch-style-button').click(function() {
        switch (sheetConfig.languagesLayout) {
            case "List":
                sheetConfig.languagesLayout = "Standard";
                break;
            case "Standard":
                sheetConfig.languagesLayout = "CommaSeparated";
                break;
            case "CommaSeparated":
            default:
                sheetConfig.languagesLayout = "List";
                break;
        }
        $.cookie( 'a1-language-layout', sheetConfig.languagesLayout, {expires: 365, path: '/'} );
        doRedrawingWork( regenerateLanguages );
    });

    fixPanelHeaders( $('.languages-panel'), false );
    fixOnSheetControls();
}




function regenerateGear() {
   for (var i = 0; i < dataRoot.characters.length; i++) {
       if (sheetConfig.gearLayout === "List") {
          $.link.gearListTemplate( "#gear-placeholder-" + i, dataRoot.characters[i] );

       } else {
          $.link.gearCommaSeparatedTemplate( "#gear-placeholder-" + i, dataRoot.characters[i] );
       }
    }

    $('.gear-panel .on-screen-control-button').button({text: false, icons: {primary: "ui-icon-refresh"}});

    $('.gear-panel .switch-style-button').click(function() {
        switch (sheetConfig.gearLayout) {
            case "List":
                sheetConfig.gearLayout = "CommaSeparated";
                break;
            case "CommaSeparated":
            default:
                sheetConfig.gearLayout = "List";
                break;
        }
        $.cookie( 'a1-gear-layout', sheetConfig.gearLayout, {expires: 365, path: '/'} );
        doRedrawingWork( regenerateGear );
    });

    fixPanelHeaders( $('.standard-gear-panel'), true );
    fixOnSheetControls();
}








function regenerateFullDetails() {
   if (sheetConfig.showFeatAbilityDescriptions || sheetConfig.showMagicItemDescriptions || !sheetConfig.hideBackgroundDetails) {
       $('.full-details-placeholder').show();

       for (var i = 0; i < dataRoot.characters.length; i++) {
          $.link.fullDetailsTemplate( "#full-details-placeholder-" + i, dataRoot.characters[i] );
       }
   } else {
       $('.full-details-placeholder').hide();
   }

   fixPanelHeaders( $('.full-details-placeholder'), false );
}




function regenerateSpellSummary() {
    $('.spell-summary-page').remove();
    $('.spell-summary-panel').remove();

   for (var i = 0; i < dataRoot.characters.length; i++) {
      if (dataRoot.characters[i].isSpellCaster()) {
          var selectedPlaceholder = "";

          switch (sheetConfig.spellsLocation) {
              case "spellsBelowLanguages":
                  selectedPlaceholder = "#spell-summary-below-languages-placeholder-";
                  break;
              case "spellsAboveGear":
                  selectedPlaceholder = "#spell-summary-above-gear-placeholder-";
                  break;
              case "spellsBeforeDescriptions":
                  selectedPlaceholder = "#spell-summary-before-descriptions-placeholder-";
                  break;
              case "spellsSeparatePage":
              default:
                  $.link.spellSummaryPageTemplate( "#spell-summary-separate-page-placeholder-" + i, dataRoot.characters[i] );
                  selectedPlaceholder = "#spell-summary-page-";
                  break;
          }

          if (sheetConfig.spellSummaryLayout === 'Traditional') {
             $.link.spellSummaryTableTemplate( selectedPlaceholder + i, dataRoot.characters[i] );
          } else {
             $.link.spellSummarySeriesTemplate( selectedPlaceholder + i, dataRoot.characters[i] );
          }
      }
   }


    $('.spell-summary-panel .on-screen-control-button').button({text: false, icons: {primary: "ui-icon-refresh"}});

    $('.spell-summary-panel .switch-style-button').click(function() {
        switch (sheetConfig.spellSummaryLayout) {
            case "Traditional":
                sheetConfig.spellSummaryLayout = "Simple";
                break;
            case "Simple":
            default:
                sheetConfig.spellSummaryLayout = "Traditional";
                break;
        }
        $.cookie( 'a1-spell-summary-layout', sheetConfig.spellSummaryLayout, {expires: 365, path: '/'} );
        doRedrawingWork( regenerateSpellSummary );
    });


    fixPanelHeaders( $('.spell-summary-panel'), false );
    fixInfoLinks();
    fixOnSheetControls();
}


function regenerateSpellDescriptions() {
   $('.spell-descriptions-placeholder').hide();

   for (var i = 0; i < dataRoot.characters.length; i++) {
      if (sheetConfig.showSpellDescriptions && dataRoot.characters[i].isSpellCaster()) {
          $.link.spellDescriptionsTemplate( "#spell-descriptions-placeholder-" + i, dataRoot.characters[i] );
          $("#spell-descriptions-placeholder-" + i).show();
      }
   }

   if (sheetConfig.spellsLocation === "spellsBeforeDescriptions") {
       regenerateSpellSummary();
   }

    fixPanelHeaders( $('.spell-descriptions-placeholder'), false );
}


function regenerateTrackedResources() {
    $('.tracked-resources-panel').remove();

    var resourcesLocation = null;

    switch (sheetConfig.resourcesLocation) {
        case "resourcesNotDisplayed":
            break;
        case "resourcesBelowLanguages":
            resourcesLocation = "#tracked-resources-page1-placeholder-";
            break;
        case "resourcesAboveGear":
        default:
            resourcesLocation = "#tracked-resources-page2-placeholder-";
            break;
    }

    if (resourcesLocation !== null) {
        for (var i = 0; i < dataRoot.characters.length; i++) {
            if (sheetConfig.resourcesLayout === "tabular") {
                $.link.tabularResourcesTemplate( resourcesLocation + i, dataRoot.characters[i] );
            } else {
                $.link.trackingBoxResourcesTemplate( resourcesLocation + i, dataRoot.characters[i] );
            }
        }
    }

    $('.tracked-resources-panel .on-screen-control-button').button({text: false, icons: {primary: "ui-icon-refresh"}});

    $('.tracked-resources-panel .switch-style-button').click(function() {
        switch (sheetConfig.resourcesLayout) {
            case "tabular":
                sheetConfig.resourcesLayout = "trackingBox";
                break;
            case "trackingBox":
            default:
                sheetConfig.resourcesLayout = "tabular";
                break;
        }
        $.cookie( 'a1-resources-layout', sheetConfig.resourcesLayout, {expires: 365, path: '/'} );
        doRedrawingWork( regenerateTrackedResources );
    });

   fixPanelHeaders( $('.tracked-resources-panel'), false );
   fixOnSheetControls();
}



function regenerateMinions() {
   $('.minions-placeholder').empty();

   if (!sheetConfig.showMinions) {
      return;
   }

   for (var i = 0; i < dataRoot.characters.length; i++) {
      $.link.allMinionsStatblockTemplate( "#minions-placeholder-" + i, dataRoot.characters[i] );
   }

   $('.page-breakable').addClass( 'page-break' );
}





function doRedrawingWork( redrawingFn ) {
    var viewportHeight = $(window).height();
    var viewportWidth = $(window).width();


    var redrawingMsg = $('#redrawing-message-panel');
    var msgHeight = $(redrawingMsg).height();
    var msgWidth = $(redrawingMsg).width();
    $(redrawingMsg).css( 'left', ((viewportWidth - msgWidth) / 2) );
    $(redrawingMsg).css( 'top', ((viewportHeight - msgHeight) / 2) );
    $(redrawingMsg).show();

    setTimeout( function() {
        redrawingFn();

        if (sheetConfig.populateFont.length > 0) {
             $('.populated').css('font-family', '"' + sheetConfig.populateFont + '"' );
        }

        $('#redrawing-message-panel').hide();
    }, 1 );
}



function regenerateCharacterSheets() {

    var contextHelpers = {
        heroLabInfo: heroLabInfo,
        sheetConfig: sheetConfig,
        characterPortraitChoiceClass: function(portraitIndex) {
            return (portraitIndex === 0) ? "chosen-portrait" : "not-chosen-portrait";
        }
    };

    $.link.characterTemplate( "#character-sheets", dataRoot.characters, contextHelpers );

    $('.page-breakable').addClass( 'page-break' );

    regenerateWeapons();
    regenerateMovement();
    regenerateSkills();
    regenerateLanguages();
    regenerateTraits();
    regenerateSpecialAbilities();
    regenerateFeats();
    regenerateTrackedResources();
    regenerateGear();
    regenerateSpellSummary();
    regenerateMinions();
    regenerateFullDetails();
    regenerateSpellDescriptions();

    fixPanelHeaders( $('.combat-maneuver-detail-panel'), false );
    fixPanelHeaders( $('.encumbrance-panel'), false );
    fixPanelHeaders( $('.experience-panel'), false );
    fixPanelHeaders( $('.money-panel'), false );
    fixPanelHeaders( $('.notes-panel'), false );
    if (sheetConfig.sheetStyle === 'styleStandard') {
       fixPanelHeaders( $('.standard-base-attack-panel .standard-header-wrapper'), false );
       fixPanelHeaders( $('.standard-money-panel'), true );
       fixPanelHeaders( $('.standard-spells-summary-panel'), false );
    }

    fixFontSize();
    handleColorCoding( sheetConfig.colorCoding );
    handleDisplayLogos( sheetConfig.displayLogos );
    fixInfoLinks();





   // Configure controls related to portrait editing
   $('.portrait-first-button').button({text:false, icons: {primary: "ui-icon-seek-start"}});
   $('.portrait-prev-button').button({text:false, icons: {primary: "ui-icon-seek-prev"}});
   $('.portrait-next-button').button({text:false, icons: {primary: "ui-icon-seek-next"}});
   $('.portrait-last-button').button({text:false, icons: {primary: "ui-icon-seek-end"}});

   $('.portrait-fit-width-button').button();
   $('.portrait-fit-height-button').button();
   $('.portrait-full-size-button').button();
   $('.portrait-default-position-button').button();


   $( '.portrait-default-position-button' ).click( function() {
      var button = $(this);
      var portraitFrame = button.parents( '.portrait-panel' );

      var portrait = portraitFrame.find( '.chosen-portrait' );
      portrait.css( 'left', "0px" );
      portrait.css( 'top', "0px" );
   } );


   $( '.portrait-fit-width-button' ).click( function() {
      var button = $(this);
      var portraitFrame = button.parents( '.portrait-panel' );
      var currentPortrait = portraitFrame.find( '.chosen-portrait' );

      var frameWidth = portraitFrame.css( 'width' );
      currentPortrait.css( 'width', frameWidth );
      currentPortrait.css( 'height', 'auto' );
   } );


   $( '.portrait-fit-height-button' ).click( function() {
      var button = $(this);
      var portraitFrame = button.parents( '.portrait-panel' );
      var currentPortrait = portraitFrame.find( '.chosen-portrait' );

      var frameHeight = portraitFrame.css( 'height' );
      currentPortrait.css( 'width', 'auto' );
      currentPortrait.css( 'height', frameHeight );
   } );


   $( '.portrait-full-size-button' ).click( function() {
      var button = $(this);
      var portraitFrame = button.parents( '.portrait-panel' );
      var currentPortrait = portraitFrame.find( '.chosen-portrait' );

      currentPortrait.css( 'width', 'auto' );
      currentPortrait.css( 'height', 'auto' );
   } );


   $( '.portrait-first-button' ).click( function() {
      var button = $(this);
      var portraitFrame = button.parents( '.portrait-panel' );
      var currentPortraitLabel = portraitFrame.find( '.current-portrait-number' );

      portraitFrame.find( '.character-portrait' ).removeClass( 'chosen-portrait' )
                                                 .addClass( 'not-chosen-portrait' )
                                                 .draggable( 'disable' );


      var firstPortrait = portraitFrame.find( '.character-portrait' ).first();
      firstPortrait.removeClass( 'not-chosen-portrait' )
                   .addClass( 'chosen-portrait' )
                   .draggable( 'enable' );

      var selectedPortraitIndex = firstPortrait.index()+1;
      currentPortraitLabel.text( selectedPortraitIndex );
   } );



   $( '.portrait-prev-button' ).click( function() {
      var button = $(this);
      var portraitFrame = button.parents( '.portrait-panel' );
      var currentPortraitLabel = portraitFrame.find( '.current-portrait-number' );

      var startingPortrait = portraitFrame.find( '.chosen-portrait' );


      portraitFrame.find( '.character-portrait' ).removeClass( 'chosen-portrait' )
                                                 .addClass( 'not-chosen-portrait' )
                                                 .draggable( 'disable' );


      var prevPortrait = startingPortrait.prev( '.character-portrait' );
      if (prevPortrait.length === 0) {
         prevPortrait = portraitFrame.find( '.character-portrait' ).last();
      }

      prevPortrait.removeClass( 'not-chosen-portrait' )
                  .addClass( 'chosen-portrait' )
                  .draggable( 'enable' );

      var selectedPortraitIndex = prevPortrait.index()+1;
      currentPortraitLabel.text( selectedPortraitIndex );
   } );



   $( '.portrait-next-button' ).click( function() {
      var button = $(this);
      var portraitFrame = button.parents( '.portrait-panel' );
      var currentPortraitLabel = portraitFrame.find( '.current-portrait-number' );

      var startingPortrait = portraitFrame.find( '.chosen-portrait' );


      portraitFrame.find( '.character-portrait' ).removeClass( 'chosen-portrait' )
                                                 .addClass( 'not-chosen-portrait' )
                                                 .draggable( 'disable' );


      var nextPortrait = startingPortrait.next( '.character-portrait' );
      if (nextPortrait.length === 0) {
         nextPortrait = portraitFrame.find( '.character-portrait' ).first();
      }

      nextPortrait.removeClass( 'not-chosen-portrait' )
                  .addClass( 'chosen-portrait' )
                  .draggable( 'enable' );

      var selectedPortraitIndex = nextPortrait.index()+1;
      currentPortraitLabel.text( selectedPortraitIndex );
   } );



   $( '.portrait-last-button' ).click( function() {
      var button = $(this);
      var portraitFrame = button.parents( '.portrait-panel' );
      var currentPortraitLabel = portraitFrame.find( '.current-portrait-number' );

      portraitFrame.find( '.character-portrait' ).removeClass( 'chosen-portrait' )
                                                 .addClass( 'not-chosen-portrait' )
                                                 .draggable( 'disable' );


      var lastPortrait = portraitFrame.find( '.character-portrait' ).last();
      lastPortrait.removeClass( 'not-chosen-portrait' )
                  .addClass( 'chosen-portrait' )
                  .draggable( 'enable' );

      var selectedPortraitIndex = lastPortrait.index()+1;
      currentPortraitLabel.text( selectedPortraitIndex );
   } );


}

// ===========================================================
// ===========================================================
// ===========================================================


function handleSheetStyleSelection() {

   $('#control-panel-accordion .sheet-control').prop('disabled', false);

   switch (sheetConfig.sheetStyle) {
       case 'styleStatblock':
          $('#display-logos-checkbox').prop('disabled', true);
          $('#spells-location-select').prop('disabled', true);
          $('#populate-font-field').prop('disabled', true);
          $('#apply-populate-font-button').prop('disabled', true);
          break;
       case 'styleStandard':
          $('.ctrl_orientation_radio').prop('disabled', true);
          $('#spells-location-select').prop('disabled', true);
          sheetConfig.panelHeaderStyle = 'standard';
          break;
       case 'styleAncientOnes':
       default:
          sheetConfig.panelHeaderStyle = 'roundedTopFlatBottom';
   }
}

function handlePageOrientationChange( orientation ) {
    sheetConfig.pageOrientation = orientation;
    $.cookie( 'a1-page-orientation', orientation, {expires: 365, path: '/'} );
}


function handleColorCoding( isColorCoded ) {
   sheetConfig.colorCoding = isColorCoded;
   $.cookie( 'a1-color-code-style', isColorCoded, {expires: 365, path: '/'} );

   if (isColorCoded) {
      $( '.attack-colorable' ).addClass( 'attack-color' );
      $( '.saving-throw-colorable' ).addClass( 'saving-throw-color' );
      $( '.initiative-colorable' ).addClass( 'initiative-color' );
      $( '.armor-class-colorable' ).addClass( 'armor-class-color' );
   } else {
      $( '.attack-colorable' ).removeClass( 'attack-color' );
      $( '.saving-throw-colorable' ).removeClass( 'saving-throw-color' );
      $( '.initiative-colorable' ).removeClass( 'initiative-color' );
      $( '.armor-class-colorable' ).removeClass( 'armor-class-color' );
   }
}


function handleDisplayLogos( isDisplayLogos ) {
   sheetConfig.displayLogos = isDisplayLogos;
   $.cookie( 'a1-logo-style', isDisplayLogos, {expires: 365, path: '/'} );

   if (isDisplayLogos) {
      $( '.logo-panel' ).show();
   } else {
      $( '.logo-panel' ).hide();
   }
}


// ===========================================================
// ===========================================================
// ===========================================================

var controlPanelDialog;
var infoPanelDialog;



function layoutCharacterSheet() {
    var optionMovementLayout = $.cookie( 'a1-movement-layout' );
    if (optionMovementLayout !== null && optionMovementLayout.length > 0) {
        sheetConfig.movementLayout = optionMovementLayout;
    }

    var optionLanguageLayout = $.cookie( 'a1-language-layout' );
    if (optionLanguageLayout !== null && optionLanguageLayout.length > 0) {
        sheetConfig.languagesLayout = optionLanguageLayout;
    }

    var optionSkillLayout = $.cookie( 'a1-skill-layout' );
    if (optionSkillLayout !== null && optionSkillLayout.length > 0) {
        sheetConfig.skillsLayout = optionSkillLayout;
    }

    var optionWeaponLayout = $.cookie( 'a1-weapon-layout' );
    if (optionWeaponLayout !== null && optionWeaponLayout.length > 0) {
        sheetConfig.weaponsLayout = optionWeaponLayout;
    }

    var optionTraitLayout = $.cookie( 'a1-trait-layout' );
    if (optionTraitLayout !== null && optionTraitLayout.length > 0) {
        sheetConfig.traitsLayout = optionTraitLayout;
    }

    var optionSpecialAbilityLayout = $.cookie( 'a1-special-ability-layout' );
    if (optionSpecialAbilityLayout !== null && optionSpecialAbilityLayout.length > 0) {
        sheetConfig.specialAbilityLayout = optionSpecialAbilityLayout;
    }

    var optionFeatLayout = $.cookie( 'a1-feat-layout' );
    if (optionFeatLayout !== null && optionFeatLayout.length > 0) {
        sheetConfig.featsLayout = optionFeatLayout;
    }

    var optionResourcesLayout = $.cookie( 'a1-resources-layout' );
    if (optionResourcesLayout !== null && optionResourcesLayout.length > 0) {
        sheetConfig.resourcesLayout = optionResourcesLayout;
    }

    var optionGearLayout = $.cookie( 'a1-gear-layout' );
    if (optionGearLayout !== null && optionGearLayout.length > 0) {
        sheetConfig.gearLayout = optionGearLayout;
    }

    var optionSpellSummaryLayout = $.cookie( 'a1-spell-summary-layout' );
    if (optionSpellSummaryLayout !== null && optionSpellSummaryLayout.length > 0) {
        sheetConfig.spellSummaryLayout = optionSpellSummaryLayout;
    }

    sheetConfig.alwaysPrintTwoWeaponAttacks = dataRoot.characters[0].isOptionSet("Output Options", "Always Print 2-Weapon Attacks");
    sheetConfig.hideAmmoInWeapons           = dataRoot.characters[0].isOptionSet("Output Options", "Hide Ammo (in weapons)");
    sheetConfig.hideBackgroundDetails       = dataRoot.characters[0].isOptionSet("Output Options", "Hide Background Details");
    sheetConfig.hideUnarmedInWeapons        = dataRoot.characters[0].isOptionSet("Output Options", "Hide Unarmed (in weapons)");
    sheetConfig.hideUnusableSkills          = dataRoot.characters[0].isOptionSet("Output Options", "Hide Unusable Skills");
    sheetConfig.showFeatAbilityDescriptions = dataRoot.characters[0].isOptionSet("Output Options", "Show Feat / Ability Descriptions");

    $.views.helpers({
       counter:function(maxValue) {
           var counterArray = [];
           for (var i = 0; i < maxValue; i++) {
               counterArray[i] = i;
           }
           return counterArray;
       },

       fixedArray:function(fixedLength,originalArray) {
           var arr = [];
           for (var i = 0; i < fixedLength; i++) {
               if (i < originalArray.length) {
                   arr[i] = originalArray[i];
               } else {
                   arr[i] = null;
               }
           }
           return arr;
       },

       commaListSeparator:function(){
          var view = this;
          var text = "";
          if (view.index < view.parent.data.length - 1) {
              text = ", ";
          }
          return text;
       },

       semicolonListSeparator:function(){
          var view = this;
          var text = "";
          if (view.index < view.parent.data.length - 1) {
            text = "; ";
          }
          return text;
       },

        shrinkQualifiedSkill: function(skillName) {
            var openParenPos = skillName.indexOf( '(' );
            if (openParenPos === -1) {
                return skillName;
            }

            var tmpSkillName = skillName.substring( 0, openParenPos );
            tmpSkillName += "<small>";
            tmpSkillName += skillName.substring( openParenPos );
            tmpSkillName += "</small>";
            return tmpSkillName;
        },

        determineGearClass: function( gearObj ) {
            var classStr = "";

            if (gearObj.category === "magicitems") {
                if (classStr.length > 0) {
                    classStr += ' ';
                }

                classStr += 'gear-magic-item';
            }

            return classStr;
        },

        getReadySpellsOfLevel:function( characterClass, spellLevel) {
            var spells = [];
            if (characterClass !== null) {
                spells = characterClass.getReadySpellsOfLevel( spellLevel );
            }

            return spells;
        }
    });

    $.templates({
        controlPanelTemplate: "#tmpl_controlPanel",
        characterTemplate: "#tmpl_character",
        weaponsTraditionalTemplate: "#tmpl_character_WeaponsTraditional",
        weaponsCompactTemplate: "#tmpl_character_WeaponsCompact",
        movementTraditionalTemplate: "#tmpl_character_MovementTraditional",
        movementCompactTemplate: "#tmpl_character_MovementCompact",
        movementSimpleTemplate: "#tmpl_character_MovementSimple",
        skillsTraditionalTemplate: "#tmpl_character_SkillsTraditional",
        skillsStandardTemplate: "#tmpl_character_SkillsStandard",
        skillsCompactTemplate: "#tmpl_character_SkillsCompact",
        skillsSeriesTemplate: "#tmpl_character_SkillsSeries",
        languagesListTemplate: "#tmpl_character_LanguagesList",
        languagesStandardTemplate: "#tmpl_character_LanguagesStandard",
        languagesCommaSeparatedTemplate: "#tmpl_character_LanguagesCommaSeparated",
        traitsListTemplate: "#tmpl_character_TraitsList",
        traitsCommaSeparatedTemplate: "#tmpl_character_TraitsCommaSeparated",
        specialAbilitiesListTemplate: "#tmpl_character_SpecialAbilitiesList",
        specialAbilitiesCommaSeparatedTemplate: "#tmpl_character_SpecialAbilitiesCommaSeparated",
        featsListTemplate: "#tmpl_character_FeatsList",
        featsCommaSeparatedTemplate: "#tmpl_character_FeatsCommaSeparated",
        tabularResourcesTemplate: "#tmpl_character_TrackedResourcesTabular",
        trackingBoxResourcesTemplate: "#tmpl_character_TrackedResourcesTrackingBox",
        gearListTemplate: "#tmpl_character_GearList",
        gearCommaSeparatedTemplate: "#tmpl_character_GearCommaSeparated",
        spellSummarySeriesTemplate: "#tmpl_character_SpellSummarySeries",
        spellSummaryTableTemplate: "#tmpl_character_SpellSummaryTable",
        spellSummaryPageTemplate: "#tmpl_character_SpellSummarySeparatePage",
        fullDetailsTemplate: "#tmpl_characterFullDetails",
        spellDescriptionsTemplate: "#tmpl_character_SpellDescriptions",
        allMinionsStatblockTemplate: "#tmpl_character_AllMinionsStatblock"
    });

    $.link.controlPanelTemplate( "#control-panel", dataRoot );
    $('#control-panel-accordion').accordion({autoHeight:false});
    $('#two-weapon-checkbox').attr( 'checked', sheetConfig.alwaysPrintTwoWeaponAttacks ? "checked" : null );
    $('#hide-ammo-checkbox').attr( 'checked', sheetConfig.hideAmmoInWeapons ? "checked" : null );
    $('#hide-background-checkbox').attr( 'checked', sheetConfig.hideBackgroundDetails ? "checked" : null );
    $('#hide-unarmed-checkbox').attr( 'checked', sheetConfig.hideUnarmedInWeapons ? "checked" : null );
    $('#hide-unusable-skills-checkbox').attr( 'checked', sheetConfig.hideUnusableSkills ? "checked" : null );
    $('#feat-ability-descriptions-checkbox').attr( 'checked', sheetConfig.showFeatAbilityDescriptions ? "checked" : null );
    $('#spell-descriptions-checkbox').attr( 'checked', sheetConfig.showSpellDescriptions ? "checked" : null );
    $('#show-minions-checkbox').attr( 'checked', sheetConfig.showMinions ? "checked" : null );

    if (sheetConfig.hideUnarmedInWeapons) {
        $('#hide-unarmed-checkbox').prop('disabled', true);
    }

   // If a character is selected in the control-panel, jump to that character
   $('#ctrl_CharacterSelect').change(function(){
      var characterId = $(this).find('option:selected').val();
      var characterPosition = $('#' + characterId).offset();
      window.scrollTo( characterPosition.left, characterPosition.top );
   });




   // re-render the character sheets if the page orientation is changed
   $('.ctrl_orientation_radio').change(function() {
       var orientation = $('#portraitLayoutRadio').attr('checked') ? "portrait" : "landscape";
       handlePageOrientationChange( orientation );
       doRedrawingWork( regenerateCharacterSheets );
   });

    var optionPageOrientation = $.cookie( 'a1-page-orientation' );
    if (optionPageOrientation !== null) {
       handlePageOrientationChange( optionPageOrientation );
       if (optionPageOrientation === 'portrait') {
           $('#portraitLayoutRadio').attr('checked', 'checked');
       } else {
           $('#landscapeLayoutRadio').attr('checked', 'checked');
       }
    }




    // Turn color-coding on/off
    $( '#color-code-checkbox' ).change( function() {
       var checkbox = $(this);
       handleColorCoding( checkbox.is( ':checked' ) );
    } );

    var optionColorCode = $.cookie( 'a1-color-code-style' );
    if (optionColorCode !== null) {
       var colorCheckedValue = (optionColorCode=='true') ? 'checked' : null;
       $( '#color-code-checkbox' ).attr( 'checked', colorCheckedValue ).change();
    }




    // Display logos or not...
    $( '#display-logos-checkbox' ).change( function() {
       var checkbox = $(this);
       handleDisplayLogos( checkbox.is( ':checked' ) );
    } );

    var optionLogoDisplay = $.cookie( 'a1-logo-style' );
    if (optionLogoDisplay !== null) {
       var logoCheckedValue = (optionLogoDisplay=='true') ? 'checked' : null;
       $( '#display-logos-checkbox' ).attr( 'checked', logoCheckedValue ).change();
    }


    var optionPopulateFont = $.cookie( 'a1-populate-font' );
    if (optionPopulateFont !== null) {
        sheetConfig.populateFont = optionPopulateFont;
        $('#populate-font-field').val( optionPopulateFont );
    }

    $('#apply-populate-font-button').click(function() {
        var fontName = $('#populate-font-field').val();
        if (fontName.trim().length === 0) {
           sheetConfig.populateFont = "";
           $('.populated').css('font-family', '' );
           $.cookie( 'a1-populate-font', '', {expires: 365, path: '/'} );
           return;
        }

        sheetConfig.populateFont = fontName;
        $('.populated').css('font-family', '"' + sheetConfig.populateFont + '"' );
        $.cookie( 'a1-populate-font', sheetConfig.populateFont, {expires: 365, path: '/'} );
    });


    // Display on-sheet controls or not...
    $( '#on-sheet-controls-checkbox' ).change( function() {
       var checkbox = $(this);
       sheetConfig.displayOnSheetControls = checkbox.is( ':checked' );

       fixOnSheetControls();
    });


    $('#enable-textedit-checkbox').change(function(){
       var checkbox = $(this);
       sheetConfig.editItemText = checkbox.is( ':checked' );
       fixTextEditing();
    });





    $('#magic-item-descriptions-checkbox').change(function(){
       var checkbox = $(this);
       sheetConfig.showMagicItemDescriptions = checkbox.is( ':checked' );
       $.cookie( 'a1-show-magic-item-descriptions', sheetConfig.showMagicItemDescriptions, {expires: 365, path: '/'} );
       doRedrawingWork( regenerateFullDetails );
    });


    var showMagicItemDescriptionsCookie = $.cookie( 'a1-show-magic-item-descriptions' );
    if (showMagicItemDescriptionsCookie !== null && showMagicItemDescriptionsCookie.length > 0) {
        sheetConfig.showMagicItemDescriptions = showMagicItemDescriptionsCookie;

        var showMagicItemDescriptionsCheckedValue = (showMagicItemDescriptionsCookie=='true') ? 'checked' : null;
        $( '#magic-item-descriptions-checkbox' ).attr( 'checked', showMagicItemDescriptionsCheckedValue ).change();
    }



    $('#feats-included-select').change(function(){
        sheetConfig.featsIncluded = $( '#feats-included-select option:selected' ).attr('value');
        $.cookie( 'a1-feats-included', sheetConfig.featsIncluded, {expires: 365, path: '/'} );

        if (sheetConfig.sheetStyle === 'styleStatblock') {
           doRedrawingWork( regenerateCharacterSheets );
        } else {
           doRedrawingWork( function() {
               regenerateFeats();
               regenerateFullDetails();
           });
       }
    });

    var featsIncludedCookie = $.cookie( 'a1-feats-included' );
    if (featsIncludedCookie !== null && featsIncludedCookie.length > 0) {
        sheetConfig.featsIncluded = featsIncludedCookie;
        $('#feats-included-select').val( sheetConfig.featsIncluded );
    }



    /*$('#resources-location-select').change(function(){
        sheetConfig.resourcesLocation = $( '#resources-location-select option:selected' ).attr('value');
        $.cookie( 'a1-resources-location', sheetConfig.resourcesLocation, {expires: 365, path: '/'} );


        doRedrawingWork( regenerateTrackedResources );
    });

    var resourcesLocationCookie = $.cookie( 'a1-resources-location' );
    if (resourcesLocationCookie != null && resourcesLocationCookie.length > 0) {
        sheetConfig.resourcesLocation = resourcesLocationCookie;
        $('#resources-location-select').val( sheetConfig.resourcesLocation );
    }*/




    $('#spell-descriptions-checkbox').change(function(){
       var checkbox = $(this);
       sheetConfig.showSpellDescriptions = checkbox.is( ':checked' );
       $.cookie( 'a1-show-spell-descriptions', sheetConfig.showSpellDescriptions, {expires: 365, path: '/'} );
       doRedrawingWork( regenerateSpellDescriptions );
    });


    var showSpellDescriptionsCookie = $.cookie( 'a1-show-spell-descriptions' );
    if (showSpellDescriptionsCookie !== null && showSpellDescriptionsCookie.length > 0) {
        sheetConfig.showSpellDescriptions = showSpellDescriptionsCookie;

        var showSpellDescriptionsCheckedValue = (showSpellDescriptionsCookie=='true') ? 'checked' : null;
        $( '#spell-descriptions-checkbox' ).attr( 'checked', showSpellDescriptionsCheckedValue ).change();
    }




    $('#show-minions-checkbox').change(function(){
       var checkbox = $(this);
       sheetConfig.showMinions = checkbox.is( ':checked' );
       $.cookie( 'a1-show-minions', sheetConfig.showMinions, {expires: 365, path: '/'} );
       doRedrawingWork( regenerateMinions );
    });


    var showMinionsCookie = $.cookie( 'a1-show-minions' );
    if (showMinionsCookie !== null && showMinionsCookie.length > 0) {
        sheetConfig.showMinions = showMinionsCookie;

        var showMinionsCheckedValue = (showMinionsCookie=='true') ? 'checked' : null;
        $( '#show-minions-checkbox' ).attr( 'checked', showMinionsCheckedValue ).change();
    }





    $('#spells-location-select').change(function(){
        sheetConfig.spellsLocation = $( '#spells-location-select option:selected' ).attr('value');
        $.cookie( 'a1-spells-location', sheetConfig.spellsLocation, {expires: 365, path: '/'} );


        doRedrawingWork( regenerateSpellSummary );
    });

    var spellsLocationCookie = $.cookie( 'a1-spells-location' );
    if (spellsLocationCookie !== null && spellsLocationCookie.length > 0) {
        sheetConfig.spellsLocation = spellsLocationCookie;
        $('#spells-location-select').val( sheetConfig.spellsLocation );
    }




    $('#two-weapon-checkbox').change(function() {
       var checkbox = $(this);
       sheetConfig.alwaysPrintTwoWeaponAttacks = checkbox.is( ':checked' );
       doRedrawingWork( regenerateWeapons );
    });

    $('#hide-ammo-checkbox').change(function() {
       var checkbox = $(this);
       sheetConfig.hideAmmoInWeapons = checkbox.is( ':checked' );
       doRedrawingWork( regenerateWeapons );
    });

    $('#hide-background-checkbox').change(function() {
       var checkbox = $(this);
       sheetConfig.hideBackgroundDetails = checkbox.is( ':checked' );

       if (sheetConfig.sheetStyle === 'styleStatblock') {
          doRedrawingWork( regenerateCharacterSheets );
       } else {
          doRedrawingWork( regenerateFullDetails );
       }
    });

    $('#hide-unarmed-checkbox').change(function() {
       var checkbox = $(this);
       sheetConfig.hideUnarmedInWeapons = checkbox.is( ':checked' );
       doRedrawingWork( regenerateWeapons );
    });


    $('#hide-unusable-skills-checkbox').change(function() {
       var checkbox = $(this);
       sheetConfig.hideUnusableSkills = checkbox.is( ':checked' );

       if (sheetConfig.sheetStyle === 'styleStatblock') {
          doRedrawingWork( regenerateCharacterSheets );
       } else {
          doRedrawingWork( regenerateSkills );
       }
    });

    $('#feat-ability-descriptions-checkbox').change(function() {
       var checkbox = $(this);
       sheetConfig.showFeatAbilityDescriptions = checkbox.is( ':checked' );

       if (sheetConfig.sheetStyle === 'styleStatblock') {
          doRedrawingWork( regenerateCharacterSheets );
       } else {
          doRedrawingWork( regenerateFullDetails );
       }
    });


    // re-render the character sheets if the sheet style is changed
    $('#sheet-style-select').change(function(){
        sheetConfig.sheetStyle = $( '#sheet-style-select option:selected' ).attr('value');
        $.cookie( 'a1-sheet-style', sheetConfig.sheetStyle, {expires: 365, path: '/'} );

        handleSheetStyleSelection();
        doRedrawingWork( regenerateCharacterSheets );
    });

    var sheetStyleCookie = $.cookie( 'a1-sheet-style' );
    if (sheetStyleCookie !== null && sheetStyleCookie.length > 0) {
        sheetConfig.sheetStyle = sheetStyleCookie;
        $('#sheet-style-select').val( sheetConfig.sheetStyle ).change();
    } else {
        handleSheetStyleSelection();
        doRedrawingWork( regenerateCharacterSheets );
    }




    // Make dialogs fixed-position...
    // MAYBE FIX:  set an @media print style to display: none?
    $.ui.dialog.prototype._oldinit = $.ui.dialog.prototype._init;
    $.ui.dialog.prototype._init = function() {
       $(this.element).parent().css('position', 'fixed');
       $(this.element).dialog("option",{
          resizeStop: function(event,ui) {
             var position = [(Math.floor(ui.position.left) - $(window).scrollLeft()),
             (Math.floor(ui.position.top) - $(window).scrollTop())];
             $(event.target).parent().css('position', 'fixed');
             $(event.target).parent().dialog('option','position',position);
             return true;
          }
       });
       this._oldinit();
    };


    controlPanelDialog = $('#control-panel').dialog({
       closeOnEscape: false,
       dialogClass:'control-panel-theme',
       position:[1000, 5], // FIX: set this based on initial page orientation
       resizable:false,
       width: 400,
       zIndex: 50
    });

    infoPanelDialog = $('#info-panel').dialog({
       closeOnEscape: false,
       dialogClass:'info-panel-theme',
       position:[1000, 500], // FIX: set this based on initial page orientation
       width: 400,
       zIndex: 60
    });
}


