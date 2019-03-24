function onError(message) {
  console.error(message);
}

function abbreviateInitials(textValue) {
  return $.map(textValue.split(" "), function(elStr) { return elStr.charAt(0).toLowerCase(); }).join('');
}

function hlActorUpdate(hldata, porFile, charXmlIndex, imgBase64, minonName, minionList) {
  // locate or create the actor for this character data
  let charDataSet = findAllByProperty(
    findAllByProperty(game.entities.data, "data.hlData.porFile", porFile), "data.hlData.xmlIndex", charXmlIndex);
  if (charDataSet && charDataSet.length > 1) {
    charDataSet = findAllByProperty(charDataSet, "data.hlData.minonName", minonName);
  }

  if (!charDataSet) {
    let newCharData = duplicate(game.templates.actors["Character"]);
    newCharData.hlData.porFile = porFile;
    newCharData.hlData.xmlIndex = charXmlIndex;
    newCharData.hlData.minions = minionList;
    newCharData.hlData.minonName = minonName;
    charData = createCharacter(newCharData, null, true, null, false);
    game.entities.update();
  } else if (charDataSet.length - 1 !== 0) {
    console.log("Multiple actors found:", charDataSet, arguments);
    return;
  } else {
    charData = charDataSet[0];
  }

  if (charData.data && charData.data._flags && charData.data._flags.temp) {
    return;
  }

  let actor = PFTCActor.fromData(charData);
  $.each(minionList, function(_, entityId) {
    let minionActor = PFTCActor.fromData(game.entities.data[entityId]);
    minionActor.setData("hlData.master", actor.id);
    minionActor.save()
  });
  actor.hlDataProcess(hldata, minionList, imgBase64);
  return actor.id;
}

function hlResources(_, resourceThing) {
  if (resourceThing && resourceThing.type && resourceThing.type === "por") {
    // found a portfolio resource, hurray!
    $.ajax({
        url: resourceThing.url + "?reload=1",
        dataType: 'binary',
        processData: false,
        type: 'GET'
    }).then(function(charInfo, ajaxStatus, xhrObj){
        let porLastModified = xhrObj.getResponseHeader('last-modified'),
            porDateLM       = new Date(porLastModified),
            resLastModified = resourceThing.lastModified,
            resDateLM       = new Date(resLastModified || 0),
            changesDetected = resDateLM < porDateLM;
        if(changesDetected) {
          resourceThing.lastModified = porLastModified;
          zip.createReader(new zip.BlobReader(charInfo), function(zipReader) {
            // get entries from the zip file
            zipReader.getEntries(function(entries) {
              resourceThing.imgList = resourceThing.imgList || {};
              $.when.apply($, $.map(entries, function(imgFile, index) {
                if (imgFile.filename && imgFile.filename.startsWith("images/")) {
                  let imgDeferred = $.Deferred();
                  imgFile.getData(new zip.Data64URIWriter(), function(imgURI) {
                    resourceThing.imgList[imgFile.filename.replace("images/", "")] = imgURI;
                    imgDeferred.resolve();
                  });
                  return imgDeferred.promise();
                } else { return null; }
              })).then(function() {
                let porFilePath = resourceThing.url.split("/"),
                    porFileName = porFilePath[porFilePath.length - 1].split(".")[0];
                $.when.apply($, $.map(resourceThing.imgList, function(base64URI, filename) {
                  let imgFileExists = `/custom/HeroLabImages/${porFileName}/images/${filename}`,
                      ajaxPromise = $.Deferred();
                  $.ajax({
                    url: imgFileExists,
                    type: "GET"
                  }).then(function(image){
                    resourceThing.imgList[filename] = imgFileExists;
                    ajaxPromise.resolve();
                  }).catch(function(error){
                    // console.log(error);
                    if(!game.hlInitialWarnSent) {
                      sendAlert({text: `Retrieval error for ${imgFileExists}, did you export the HeroLab Images folder correctly?`});
                    }
                    ajaxPromise.resolve();
                  });
                  return ajaxPromise.promise();
                })).then(function(){
                  if(!game.hlInitialWarnSent) {
                    game.hlInitialWarnSent = true;
                  }
                  let indexEntry = findByProperty(entries, 'filename', 'index.xml');
                  indexEntry.getData(new zip.TextWriter(), function(xmlIndexText) {
                    let indexCharData = $($.parseXML(xmlIndexText.replace(/&/g, "&amp;"))).find('characters > character');
                    indexCharData.each(function(id, el){
                      let xmlStatBlock = $(el).find('statblock[format=xml]'),
                          xmlFolder = xmlStatBlock.attr('folder'),
                          xmlFilename = xmlStatBlock.attr('filename'),
                          xmlPath = `${xmlFolder}/${xmlFilename}`,
                          charEntries = [];
                      charEntries.push({
                        'hlid': parseInt($(el).attr('herolableadindex')),
                        'entry': findByProperty(entries, 'filename', xmlPath),
                      });
                      $.when.apply($, $.map(charEntries, function(charData) {
                        let deferred = $.Deferred();
                        charData.entry.getData(new zip.TextWriter(), function(xmlCharacterText) {
                          // parse the data
                          let imgBase64 = undefined;
                          let hlData = parsePathfinderCharacter($($.parseXML(xmlCharacterText.replace(/&/g, "&amp;"))).find('public > character'), false);
                          deferred.resolve();
                          if (hlData.portraits && hlData.portraits.length && resourceThing.imgList.hasOwnProperty(hlData.portraits[0])) {
                            let fileExt = hlData.portraits[0].split(".").pop();
                            imgBase64 = resourceThing.imgList[hlData.portraits[0]].replace("data:;base64", `data:image/${fileExt};base64`);
                          }
                          console.log(`HL Data retrieved for ${hlData.characterName} (${hlData.classesSummaryAbbreviation})..."`);
                          let minionRecords = $.map(hlData.minions, function(minion){
                            let minionImgBase64 = undefined;
                            if (minion.portraits && minion.portraits.length && resourceThing.imgList.hasOwnProperty(minion.portraits[0])) {
                              let fileExtMinion = minion.portraits[0].split(".").pop();
                              minionImgBase64 = resourceThing.imgList[minion.portraits[0]].replace("data:;base64", `data:image/${fileExtMinion};base64`);
                            }
                            return hlActorUpdate(minion, resourceThing.url, charData.hlid, minionImgBase64, minion.characterName, []);
                          });
                          hlActorUpdate(hlData, resourceThing.url, charData.hlid, imgBase64, null, minionRecords);
                        });
                        return deferred.promise();
                      })).then(function(){
                        zipReader.close();
                      });
                    });
                  });
                });
              });
            });
          }, onError);
        } else {
          console.log(`No changes in ${resourceThing.name}`)
        }
    }).catch(function(error){
      console.log(`File access error encountered for porFile: '${resourceThing.url}'`, error);
    });
  } else if (resourceThing && resourceThing.res) {
    $.each(resourceThing.res, hlResources)
  }
}

/* ------------------------------------------- */
/*  Actor Data Model                           */
/* ------------------------------------------- */

PFTC.actors = {
    "_t": "c",
    "hlData": {
        "porFile": "",
        "xmlIndex": "",
        "minions": [],
        "master": null,
        "minonName": null,
        "mook": null
    },
    "info": {
        "name": { "name": "Name" },
        "img": { "name": "Artwork" },
        "notes": { "name": "Description" },
        "race": { "name": "Race" },
        "class": { "name": "Class" },
        "background": { "name": "Background" },
        "alignment": { "name": "Alignment" },
    },

    "experience": {
        "level": { "name": "Level" },
        "cr": { "name": "Challenge Rating" },
        "exp": { "name": "Experience" }
    },

    "attributes": {
        "hp": { "name": "Hit Points" },
        "hd": { "name": "Hit Dice" },
        "ac": { "name": "Armor Class" },
        "speed": { "name": "Movement Speed" },
        "initiative": { "name": "Initiative Modifier" },
        "offensive": { "name": "Weapon Modifier" },
        "spellcasting": { "name": "Spellcasting Ability" },
        "inspiration": { "name": "Inspiration" }
    },

    "saves": {
        "fort": {"name": "Fortitude", "attribute": "con"},
        "reflex": {"name": "Reflex", "attribute": "dex"},
        "will": {"name": "Will", "attribute": "wis"}
    },

    "traits": {
        "size": { "name": "Size" },
        "di": { "name": "Damage Immunities" },
        "dr": { "name": "Damage Resistances" },
        "ci": { "name": "Condition Immunities" },
        "dv": { "name": "Damage Vulnerabilities" },
        "senses": { "name": "Senses" },
        "languages": { "name": "Languages" },
    },

    "personality": {
        "traits": { "name": "Traits" },
    },

    "abilities": {
        "str": { "name": "Strength" },
        "dex": { "name": "Dexterity" },
        "con": { "name": "Constitution" },
        "int": { "name": "Intelligence" },
        "wis": { "name": "Wisdom" },
        "cha": { "name": "Charisma" }
    },

    "skills": {
        "acr": { "name": "Acrobatics", "attribute": "dex" },
        "app": { "name": "Appraise", "attribute": "int" },
        "blu": { "name": "Bluff", "attribute": "cha" },
        "cli": { "name": "Climb", "attribute": "str" },
        "cra": { "name": "Craft", "attribute": "int" },
        "dip": { "name": "Diplomacy", "attribute": "cha" },
        "did": { "name": "Disable Device", "attribute": "dex" },
        "dis": { "name": "Disguise", "attribute": "cha" },
        "esc": { "name": "Escape Artist", "attribute": "dex" },
        "fly": { "name": "Fly", "attribute": "dex" },
        "han": { "name": "Handle Animal", "attribute": "wis" },
        "hea": { "name": "Heal", "attribute": "wis" },
        "int": { "name": "Intimidate", "attribute": "cha" },
        "kar": { "name": "Knowledge (arcana)", "attribute": "int" },
        "kdu": { "name": "Knowledge (dungeoneering)", "attribute": "int" },
        "ken": { "name": "Knowledge (engineering)", "attribute": "int" },
        "khi": { "name": "Knowledge (history)", "attribute": "int" },
        "kge": { "name": "Knowledge (geography)", "attribute": "int" },
        "klo": { "name": "Knowledge (local)", "attribute": "int" },
        "kna": { "name": "Knowledge (nature)", "attribute": "int" },
        "kno": { "name": "Knowledge (nobility)", "attribute": "int" },
        "kpl": { "name": "Knowledge (planes)", "attribute": "int" },
        "kre": { "name": "Knowledge (religion)", "attribute": "int" },
        "lin": { "name": "Linguistics", "attribute": "int" },
        "per": { "name": "Perception", "attribute": "wis" },
        "pfm": { "name": "Perform", "attribute": "cha" },
        "pro": { "name": "Profession", "attribute": "wis" },
        "rid": { "name": "Ride", "attribute": "dex" },
        "sen": { "name": "Sense Motive", "attribute": "wis" },
        "sle": { "name": "Sleight of Hand", "attribute": "dex" },
        "spe": { "name": "Spellcraft", "attribute": "int" },
        "ste": { "name": "Stealth", "attribute": "dex" },
        "sur": { "name": "Survival", "attribute": "wis" },
        "swi": { "name": "Swim", "attribute": "str" },
        "use": { "name": "Use Magic Device", "attribute": "cha" }
    },

    "currency": {
        "pp": { "name": "Platinum" },
        "stl": { "name": "Steel" },
        "sp": { "name": "Silver" },
        "cp": { "name": "Copper" }
    },

    "spells": {
        "spell0": { "name": "Cantrip" },
        "spell1": { "name": "1st Level" },
        "spell2": { "name": "2nd Level" },
        "spell3": { "name": "3rd Level" },
        "spell4": { "name": "4th Level" },
        "spell5": { "name": "5th Level" },
        "spell6": { "name": "6th Level" },
        "spell7": { "name": "7th Level" },
        "spell8": { "name": "8th Level" },
        "spell9": { "name": "9th Level" }
    },

    "resources": {
        "harrow": { "name": "Harrow Points" },
    },

    "source": { "name": "Source" },
    "tags": {},

    "inventory": [],
    "spellbook": [],
    "feats": []
};

PFTC.hlMap = {
  "info": {
    "name": {
      "mapHL": {"current": "characterName"}
    },
    "img": {
      "mapHL": {"current": null}
    },
    "notes": {
      "mapHL": {"current": "description"}
    },
    "race": {
      "mapHL": {"current": "raceText"}
    },
    "class": {
      "mapHL": {"current": "classesSummaryAbbreviation"}
    },
    "background": {
      "mapHL": {"current": null}
    },
    "alignment": {
      "mapHL": {"current": "alignment"}
    }
  },
  "experience": {
    "level": {
      "mapHL": {"current": "classesLevel"}
    },
    "cr": {
      "mapHL": {"current": "challengeRating"}
    },
    "exp": {
      "mapHL": {"current": "currentXP"}
    }
  },
  "attributes": {
    "hp": {
      "mapHL": {"max": "hpTotal", "current": "hpCurrent"}
    },
    "ac": {
      "mapHL": {"current": "ac"}
    },
    "speed": {
      "mapHL": {"current": "speed_value"}
    },
    "initiative": {
      "mapHL": {"mod": "iniativeTotal", "str": "iniativeTotal"}
    }
  },
  "saves": {
    "fort": {
      "mapHL": {
        "current": "fortitudeSave_total",
        "base": "fortitudeSave_base",
        "misc": "fortitudeSave_fromMisc",
        "resist": "fortitudeSave_fromResist",
        "attr": "fortitudeSave_fromAttribute"}
    },
    "reflex": {
      "mapHL": {
        "current": "reflexSave_total",
        "base": "reflexSave_base",
        "misc": "reflexSave_fromMisc",
        "resist": "reflexSave_fromResist",
        "attr": "reflexSave_fromAttribute"}
    },
    "will": {
      "mapHL": {
        "current": "willSave_total",
        "base": "willSave_base",
        "misc": "willSave_fromMisc",
        "resist": "willSave_fromResist",
        "attr": "willSave_fromAttribute"}
    }
  },
  "abilities": {
    "str": {
      "mapHL": {"current": "Strength.value_modified"}
    },
    "dex": {
      "mapHL": {"current": "Dexterity.value_modified"}
    },
    "con": {
      "mapHL": {"current": "Constitution.value_modified"}
    },
    "int": {
      "mapHL": {"current": "Intelligence.value_modified"}
    },
    "wis": {
      "mapHL": {"current": "Wisdom.value_modified"}
    },
    "cha": {
      "mapHL": {"current": "Charisma.value_modified"}
    }
  },
  "currency": {
    "pp": {
      "mapHL": {"current": "moneyPlatinum"}
    },
    "stl": {
      "mapHL": {"current": "moneyGold"}
    },
    "sp": {
      "mapHL": {"current": "moneySilver"}
    },
    "cp": {
      "mapHL": {"current": "moneyCopper"}
    }
  }
};

/* ------------------------------------------- */
/* Actor Object Type                       */
/* ------------------------------------------- */

class PFTCActor extends PFTCEntity {

  static getElement(type) {
    /* Get the specialized Element class definition for a certain type */
    const classes = {
      "Character": PFTCActor,
      "NPC": PFTCNPC
    };
    return classes[type] || PFTCElement;
  }

  static fromData(obj, context) {
    /* A factory method which returns a specialized class for elements of a certain type */
    const cls = this.getElement(obj._type || obj.data._type);
    return new cls(obj, context);
  }

  /* ------------------------------------------- */

  constructor(object, context) {
    super(object, context);

    // Store container sorting order
    this._sorted = {
      "inventory": false,
      "spellbook": false,
      "feats": false
    };
  }

  /* ------------------------------------------- */

  static applyDataModel() {
    /* Update actor templates with the latest definitions */
    $.each(game.templates.actors, function (type, definition) {
      mergeObject(definition, PFTC.actors, true, true, true);
      definition["_type"] = type;
    });
    console.log("Pathfinder Foundry | Actor Templates Updated");
    if (hasSecurity(getCookie("UserID"), "Game Master")) {
      if(!game.suspendHLU) {
        // game.suspendHLU = true;
        $.each(game.config.data.resources, hlResources);
      }
      setInterval(function(){
        if(!game.suspendHLU) {
          // game.suspendHLU = true;
          $.each(game.config.data.resources, hlResources);
        }
      }, 15000);
    }
  }

  /* ------------------------------------------- */

  hlDataProcess(hlData, minionList, imgBase64) {
    let self = this;
    // console.log(hlData);
    minionList = (typeof minionList === "undefined") ? self.data.hlData.minionList : minionList;
    for (let key in PFTC.hlMap) {
        if (PFTC.hlMap.hasOwnProperty(key)) {
            for (let attr in PFTC.hlMap[key]) {
                if (PFTC.hlMap[key].hasOwnProperty(attr)) {
                    let keyMapHL = PFTC.hlMap[key][attr].mapHL;
                    for (let value in keyMapHL) {
                        if (keyMapHL.hasOwnProperty(value) && keyMapHL[value]) {
                            let updateValue = PFTC.getProperty(hlData, keyMapHL[value]);
                            if (key === 'info' && attr === 'alignment') {
                              updateValue = abbreviateInitials(updateValue);
                            } else if (key === 'experience' && attr === 'cr') {
                              updateValue = parseInt(updateValue.replace("CR ", ""));
                            }
                            let dataName = `${key}.${attr}.${value}`;
                            if (!self.data[key]) {
                              self.setData(key, {});
                            }
                            if (!self.data[key][attr]) {
                              self.setData(key+"."+attr, {});
                            }
                            self.setData(dataName, updateValue);
                        }
                    }
                }
            }
        }
    }
    self.setData("penalties", {});
    $.each(hlData.penalties, function(_, penaltyData) {
      let penaltyAbbr = abbreviateInitials(penaltyData.penaltyName);
      let hlPenalty = $.extend({}, penaltyData);
      self.setData("penalties."+penaltyAbbr, hlPenalty);
    });
    let skillArray = $.map(hlData.skills, function(el) { return el; });
    $.each(self.data.skills, function (abbr, obj) {
      var hlSkillObj = skillArray.find(function(hlSkill) { return hlSkill.skillName == obj.name; });
      if (hlSkillObj) {
        hlSkillObj.classSkill = (hlSkillObj.classSkill == "yes") ? true : false;
        hlSkillObj.armorCheck = (hlSkillObj.armorCheck == "yes") ? true : false;
        hlSkillObj.attribute = hlSkillObj.attribute.toLowerCase();
        let newSkillObj = $.extend(true, {}, obj, hlSkillObj);
        delete newSkillObj.character;
        self.setData("skills."+abbr, newSkillObj);
      }
    });
    // spells
    // feats
    // etc.

    let isMook = (hlData.playerName && hlData.playerName === "MOOK") ? true : false;
    self.setData("hlData.mook", isMook);
    self.setData("hlData.minions", minionList);
    if (imgBase64) {
      self.setData("info.img.current", imgBase64);
      self.setData("info.img.min", imgBase64);
    }
    if (!isMook) {
      let privPlayers = $.map(game.config.data.players, function(player, pid) { return {[pid]: (player.displayName === hlData.playerName) ? 1 : 4}; });
      privPlayers.push({localhost: 1});
      privPlayers.push({});
      privPlayers.push(true);
      privPlayers = arrayReverse(privPlayers);
      let playerPrivObj = $.extend.apply($, privPlayers);
      // console.log(playerPrivObj);
      self.setData("_s", playerPrivObj);
      let namedNPC = $.map(playerPrivObj, function(priv, player) { return (priv === 1) ? player : null; });
      if (namedNPC && namedNPC.length === 1) {
        self.setData("_flags.npc", 1, "int");
        self.setData("_type", "NPC");
      }
    } else {
      self.setData("_flags.npc", 1, "int");
      self.setData("_type", "NPC");
    }
    console.log("HL Update for " + self.data.info.name.current + "...");
    self.save();
    let actorId = self.id;
    $.each(findAllByProperty(game.entities.data, "data._t", "b"), function(i, el) {
      let obj = el;
      $.each(withProperty(el.data.layers, "p.length"), function(i, iLayer) {
        let iLayerId = obj.data.layers.indexOf(iLayer);
        if (iLayer) {
          // console.log("pTokens", findAllByProperty(iLayer.p, 'eID', self.id));
          $.each(findAllByProperty(iLayer.p, 'eID', actorId), function(i, piece) {
            let pieceId = iLayer.p.indexOf(piece);
            piece.i = imgBase64;
            boardApi.updateObject(iLayerId, "p", pieceId, obj);
            runCommand("boardMove", {id : obj.id(), layer : iLayerId, type : "p", index : pieceId, data : obj.data.layers[iLayerId].p[pieceId]});
          });
        }
      });
    });
  }

  heroLabUpdate() {
    let self = this;
    if (!self.data.hlData || !self.data.hlData.porFile || !self.data.hlData.xmlIndex) {
      return;
    }
    $.ajax({
        url: self.data.hlData.porFile,
        dataType: 'binary',
        processData: false,
        type: 'GET'
    }).then(function(charInfo){
        zip.createReader(new zip.BlobReader(charInfo), function(zipReader) {
          // get entries from the zip file
          zipReader.getEntries(function(entries) {
            // get data from the first file
            let charEntry = entries.find(function(blobject){ return blobject.filename.includes(`statblocks_xml/${self.data.hlData.xmlIndex}_`); });
            charEntry.getData(new zip.TextWriter(), function(charXML) {
              // close the reader and calls callback function with uncompressed data as parameter
              let hlData = parsePathfinderCharacter($($.parseXML(xmlCharacterText.replace(/&/g, "&amp;"))).find('public > character'), false);
              console.log("HL Data retrieved for " + self.data.info.name.current);
              zipReader.close();
              self.hlDataProcess(hlData);
            });
          });
        }, onError);
    }).catch(function(error){
      console.log("HL Update Portfolio File access error encountered for " + self.data.info.name.current + ", porFile: " + self.data.hlData.porFile, error);
    });
  }

  /* ------------------------------------------- */

  convertData(data) {

    // Level
    let lvl = Math.min(Math.max(data.experience.level.current || 1, 1), 20);
    data.experience.level.current = lvl;

    // Ability Scores and Modifiers
    $.each(data.abilities, function (_, a) {
      a.current = a.current || sync.eval("4d6k3");
      a.modifiers = {"mod": Math.floor(( a.current - 10 ) / 2)};
    });

    // Update Proficiency Bonus
    // data.attributes.proficiency.current = Math.floor((lvl + 7) / 4);
    return data;
  }

  /* ------------------------------------------- */
  /*  Data Pre-processing                        */
  /* ------------------------------------------- */

  enrichData(data, scope) {

    // Populate core character data
    this.getCoreData(data);

    // Get data for owned elements
    this.setupInventory(data);
    this.setupSpellbook(data);
    this.setupFeats(data);

    // Return the enriched data
    return data;
  }

  /* ------------------------------------------- */

  getCoreData(data) {
    /* This function exists to prepare all the standard rules data that would be used by dice rolling in D&D5e.
     */

    // If no data was provided, make a copy
    data = data || duplicate(this.data);

    // Experience, level, hit dice
    let xp = data.experience;
    xp["lvl"] = xp.level.current;
    xp["start"] = this.getLevelExp(xp.lvl - 1);
    xp["current"] = Math.max(xp.exp.current || 0, xp.start);
    xp["next"] = this.getLevelExp(xp.lvl);
    xp["pct"] = Math.min(((xp.current - xp.start) * 100 / (xp.next - xp.start)), 99.5);
    xp["css"] = (xp.current > xp.next) ? "leveled" : "";
    xp["kill"] = this.getKillExp(xp.cr.current);
    data.attributes.hd.max = xp.lvl;

    // Abilities
    $.each(data.abilities, function (attr, a) {
      a.mod = a.modifiers.mod;
      a.modstr = a.mod.signedString();
      a.valstr = parseInt(a.current).paddedString(2);
    });

    // Saves
    $.each(data.saves, function (save, s) {
      s.current = parseInt(s.current || 0);
      s.mod = data.abilities[s.attribute].mod;
      s.modstr = (s.mod).signedString();
    });

    // Skills
    $.each(data.skills, function (skl, s) {
      s.current = parseInt(s.current || 0) || parseInt(s.value || 0);
      s.mod = data.abilities[s.attribute].mod;
      s.modstr = (s.mod).signedString();
    });

    // Initiative
    data.attributes.initiative.mod = data.abilities.dex.mod + parseInt(data.attributes.initiative.current || 0);
    data.attributes.initiative.str = data.attributes.initiative.mod.signedString() + '.' + data.abilities.dex.valstr;

    // Modifiers
    // data.attributes.offensive.current = data.attributes.offensive.current || "str";
    // data.attributes.offensive.mod = data.abilities[data.attributes.offensive.current].mod;

    // data.attributes.spellcasting.current = data.attributes.spellcasting.current || "int";
    // data.attributes.spellcasting.mod = data.abilities[data.attributes.spellcasting.current].mod;
    // //data.attributes.spellcasting.dc = 8 + data.attributes.proficiency.current + data.attributes.spellcasting.mod;
    // data.attributes.spellcasting.dcstr = "Spell DC " + data.attributes.spellcasting.dc;

    // // Armor Class
    // data.attributes.ac.base = 10 + data.abilities.dex.mod;
    return data;
  }

  /* ------------------------------------------- */

  getLevelExp(level) {
    const levels = [0, 1300, 3300, 6000, 10000, 15000, 23000, 34000, 50000, 71000, 105000, 145000, 210000, 295000, 425000, 600000, 850000, 1200000, 1700000, 2400000];
    return levels[Math.min(level, levels.length - 1)];
  }

  getKillExp(cr) {
    cr = eval(cr);
    if (cr < 1.0) return Math.max(200 * cr, 10);
    const xps = [10, 200, 450, 700, 1100, 1800, 2300, 2900, 3900, 5000, 5900, 7200, 8400, 10000, 11500, 13000, 15000,
      18000, 20000, 22000, 25000, 33000, 41000, 50000, 62000, 75000, 90000, 105000, 120000, 135000, 155000];
    return xps[cr];
  }

  /* ------------------------------------------- */

  setupInventory(data) {
    // Set up inventory items by converting them to PFTCItem objects

    const owner = this;
    const weight = [];
    const inventory = {
      "Weapon": {
        "name": "Weapons",
        "items": []
      },
      "Armor": {
        "name": "Equipment",
        "items": []
      },
      "Tool": {
        "name": "Tools",
        "items": []
      },
      "Consumable": {
        "name": "Consumables",
        "items": []
      },
      "Item": {
        "name": "Backpack",
        "items": []
      }
    };

    // Iterate over inventory items
    $.each(data.inventory, function (itemId, itemData) {
      let item = PFTCElement.fromData(itemData, {"owner": owner});

      // Set id and class
      item.data.itemId = itemId;
      item.data.css = item.type.toLowerCase();

      // Flag whether the item is rollable
      item.data.rollable = owner.isOwner ? "ftc-rollable" : "";

      // Push to type
      inventory[item.type].items.push(item);

      // Record total entry weight
      weight.push(parseFloat(item.data.weight.current * item.data.quantity.current));
    });
    data.inventory = inventory;

    // Compute weight and encumbrance
    let wt = (weight.length > 0) ? weight.reduce(function (total, num) {
        return total + (num || 0);
      }) : 0,
      enc = data.abilities.str.current * 15,
      pct = Math.min(wt * 100 / enc, 99.5),
      cls = (pct > 90 ) ? "heavy" : "";
    data["weight"] = {"wt": wt.toFixed(2), "enc": enc, "pct": pct.toFixed(2), "cls": cls};
    return data;
  }

  /* ------------------------------------------- */

  setupSpellbook(data) {
    /* Set up spellbook items by converting them to PFTCItem objects */
    const owner = this;
    const sls = {};

    // Iterate over spellbook spells
    $.each(data.spellbook, function (spellId, itemData) {

      // Construct the item object
      let item = new PFTCSpell(itemData, {"owner": owner});
      item.data.spellId = spellId;

      // Construct spell data
      let lvl = parseInt(item.data.level.current || 0);

      // Record spell-level
      sls[lvl] = sls[lvl] || {
          "level": lvl,
          "name": (lvl === 0) ? "Cantrip" : lvl.ordinalString() + " Level",
          "current": PFTC.getProperty(data, 'spells.spell' + lvl + '.current') || 0,
          "max": PFTC.getProperty(data, 'spells.spell' + lvl + '.max') || 0,
          "spells": [],
        };
      sls[lvl].current = (lvl === 0) ? "&infin;" : sls[lvl].current;
      sls[lvl].max = (lvl === 0) ? "&infin;" : sls[lvl].max;
      sls[lvl].spells.push(item);
    });
    data['spellbook'] = sls;
    return data;
  }

  /* ------------------------------------------- */

  setupFeats(data) {
    /* Set up feat items by converting them to PFTCItem objects
     */
    const owner = this;
    const feats = [];
    $.each(data.feats, function (itemId, itemData) {
      let item = PFTCElement.fromData(itemData, {"owner": owner});
      item.data.itemId = itemId;
      feats.push(item);
    });
    data.feats = feats;
    return data;
  }

  /* ------------------------------------------- */
  /*  HTML Rendering                             */
  /* ------------------------------------------- */

  get template() {
    return PFTC.TEMPLATE_DIR + "actors/character.html";
  }

  get templateParts() {
    const td = PFTC.TEMPLATE_DIR + "actors/";
    let parts = {
      "PRIMARY_ATTRIBUTES": td + "attributes.html",
      "SECONDARY_ATTRIBUTES": td + "attributes2.html",
      "SIDEBAR_ATTRIBUTES": td + "attributes3.html",
      "NPC_ATTRIBUTES": td + "attributes-npc.html",
      "CURRENCY": td + "currency.html",
      "TRAITS": td + "traits.html"
    };
    if (hasSecurity(getCookie("UserID"), "Assistant Master")) parts["SIDEBAR_OPTIONS"] = td + "options.html";
    return parts;
  }

  /* ------------------------------------------- */

  buildHTML(data, scope) {

    // replace this with XSLT-parsed sheet
    /**
     * Objective:
     *   On new Actor creation, display the standard
     *   sheet but include a button to link to a HL
     *   portfolio.
     *   Link to HL allows selection of portfolio,
     *   which is then parsed for characters, which
     *   are rendered as a list.  Selection of a
     *   character populates that part of the JSON
     *   record, and causes the rendering path to
     *   go very differently.
     *
     * For HL-linked characters, get the portfolio,
     *   get the character, run the XSLT (modified
     *   from AncientOne's sheet) and return that as
     *   the sheet HTML.
     */

    // Populate primary templates
    let html = PFTC.loadTemplate(this.template);
    $.each(this.templateParts, function (name, path) {
      html = PFTC.injectTemplate(html, name, path);
    });

    // Abilities and Skills
    html = this._buildAbilities(html, data);
    html = this._buildSkills(html, data);

    // Owned Elements
    html = this._buildInventory(html, data);
    html = this._buildSpellbook(html, data);
    html = this._buildFeats(html, data);
    return html;
  }

  /* ------------------------------------------- */

  _buildAbilities(html, data) {
    let abilities = "",
      template = PFTC.loadTemplate(PFTC.TEMPLATE_DIR + 'actors/ability.html');
    $.each(data.abilities, function (a, ability) {
      ability.ability = a;
      abilities += PFTC.populateTemplate(template, ability);
    });
    return html.replace("<!-- ABILITIES -->", abilities);
  }

  /* ------------------------------------------- */

  _buildSkills(html, data) {
    let skills = "",
      template = PFTC.loadTemplate(PFTC.TEMPLATE_DIR + 'actors/skill.html');
    $.each(data.skills, function (s, skill) {
      skill.skill = s;
      if (skill.value) { skills += PFTC.populateTemplate(template, skill); }
    });
    return html.replace("<!-- SKILLS -->", skills);
  }

  /* ------------------------------------------- */

  _buildInventory(html, data) {
    let inventory = "",
      itemHeader = PFTC.loadTemplate(PFTC.TEMPLATE_DIR + 'actors/elements/item-header.html'),
      itemTemplate = PFTC.loadTemplate(PFTC.TEMPLATE_DIR + 'actors/elements/item.html');
    $.each(data.inventory, function (t, type) {
      type.type = t;
      type.css = t.toLowerCase();
      let collection = PFTC.populateTemplate(itemHeader, type),
        items = "";
      $.each(type.items, function (_, item) {
        items += PFTC.populateTemplate(itemTemplate, item.data);
      });
      inventory += collection.replace("<!-- ITEMS -->", items);
    });
    inventory = inventory || '<blockquote class="compendium">Add items from the compendium.</blockquote>';
    return html.replace("<!-- INVENTORY -->", inventory);
  }

  /* ------------------------------------------- */

  _buildSpellbook(html, data) {
    let spellbook = "",
      spellHeader = PFTC.loadTemplate(PFTC.TEMPLATE_DIR + 'actors/elements/spell-header.html'),
      spellTemplate = PFTC.loadTemplate(PFTC.TEMPLATE_DIR + 'actors/elements/spell.html');
    $.each(data.spellbook, function (l, level) {
      let page = PFTC.populateTemplate(spellHeader, level),
        spells = "";
      $.each(level.spells, function (_, spell) {
        spells += PFTC.populateTemplate(spellTemplate, spell.data);
      });
      spellbook += page.replace("<!-- SPELLS -->", spells);
    });
    spellbook = spellbook || '<blockquote class="compendium">Add spells from the compendium.</blockquote>';
    return html.replace("<!-- SPELLBOOK -->", spellbook);
  }

  /* ------------------------------------------- */

  _buildFeats(html, data) {
    let feats = "",
      featTemplate = PFTC.loadTemplate(PFTC.TEMPLATE_DIR + 'actors/elements/feat.html');
    $.each(data.feats, function (i, item) {
      feats += PFTC.populateTemplate(featTemplate, item.data);
    });
    feats = feats || '<blockquote class="compendium">Add feats from the compendium.</blockquote>';
    return html.replace("<!-- FEATS -->", feats);
  }

  /* ------------------------------------------- */
  /*  Event Handlers                             */
  /* ------------------------------------------- */

  activateListeners(html, app, scope) {
    const self = this;

    // Activate rollable actions on a timeout to prevent accidentally clicking immediately when the sheet opens
    setTimeout(function () {

      // Basic rolls
      html.find('.basic-roll .ftc-rollable').click(function () {
        let modifier = $(this).parent().data("modifier");
        self.basicRoll(modifier);
      });

      // Saves
      html.find('.saving-throw .ftc-rollable').click(function () {
        let save = $(this).parent().data("save");
        self.rollSave(save);
      });

      // Attribute rolls
      html.find('.ability .ftc-rollable').click(function () {
        let attr = $(this).parent().attr("data-ability");
        self.rollAbility(attr);
      });

      // Skill rolls
      html.find('.skill .ftc-rollable').click(function () {
        let skl = $(this).parent().attr("data-skill");
        self.rollSkill(skl);
      });

      // Weapon actions
      html.find(".item .ftc-rollable").click(function () {
        const itemId = $(this).closest("li.item").attr("data-item-id"),
          itemData = self.data.inventory[itemId];
        const item = PFTCElement.fromData(itemData, {"owner": self, "itemId": itemId});
        item.chatAction();
      });

      // Spell actions
      html.find(".spell .ftc-rollable").click(function () {
        const itemId = $(this).closest("li.spell").attr("data-item-id"),
          itemData = self.data.spellbook[itemId];
        const spell = new PFTCSpell(itemData, {"owner": self, "itemId": itemId});
        spell.chatAction();
      });

      // Feat actions
      html.find(".feat .ftc-rollable").click(function () {
        const itemId = $(this).closest("li.feat").attr("data-item-id"),
          itemData = self.data.feats[itemId];
        const feat = new PFTCFeat(itemData, {"owner": self, "itemId": itemId});
        feat.chatAction();
      });
    });

    // NPC Toggle
    html.find(".ftc-checkbox.npc-toggle").change(function () {
      let isNPC = $(this).prop("checked") + 0 || 0;
      self.data._type = isNPC ? "NPC" : "Character";
    });

    // Enable Element Sorting
    this.enableSorting(html);

    // Activate Tabs and Editable Fields
    PFTC.ui.activateTabs(html, this, app);
    PFTC.forms.activateFields(html, this, app);
  }

  /* ------------------------------------------- */
  /*  Owned Element Management                   */
  /* ------------------------------------------- */

  createItem(container, data) {
    this.save();
    this.data[container].push(data);
    PFTCElement.editOwnedItem(this, container, data, this.data[container].length - 1);
  }

  /* ------------------------------------------- */

  dropItem(item) {
    this.data[item.container].push(item.data);
    this._changed = true;
    this.save();
  }

  /* ------------------------------------------- */

  editItem(container, itemId) {
    const data = this.data[container][itemId];
    PFTCElement.editOwnedItem(this, container, data, itemId);
  }

  /* ------------------------------------------- */

  updateItem(container, itemId, itemData) {
    this.data[container][itemId] = itemData;
    this._changed = true;
    this.save();
  }

  /* ------------------------------------------- */

  deleteItem(container, itemId) {
    this._sorted[container] = true;
  }

  /* ------------------------------------------- */

  castSpell(level) {
    if (level === 0) return;
    let sl = this.data.spells["spell" + level];
    if ( !sl.current ) return;
    sl.current = Math.max(sl.current - 1, 0);
    this._changed = true;
    this.save();
  }

  /* ------------------------------------------- */
  /*  Element Sorting                            */
  /* ------------------------------------------- */

  enableSorting(html) {
    const self = this;
    html.find(".item-list").sortable({
      "items": " > li",
      "cancel": ".inventory-header",
      "containment": "parent",
      "axis": "y",
      "opacity": 0.75,
      "delay": 200,
      "scope": $(this).attr("data-item-container"),
      "update": function (event, ui) {
        let container = ui.item.parent().attr("data-item-container");
        self._sorted[container] = true;
      }
    });
  }

  /* ------------------------------------------- */

  updateSort() {
    /* Process pending element sorting order, reordering container data */
    const self = this;

    // Iterate over each sorted container
    $.each(this._sorted, function (container, isSorted) {
      if (!isSorted) return;

      // Get the current sorting of the container
      const list = self.app.find("." + container);
      let sorted = [];
      list.find("li.element").each(function () {
        let itemId = $(this).attr("data-item-id");
        sorted.push(self.data[container][itemId]);
      });

      // Update sorting
      self.data[container] = sorted;
      self._sorted[container] = false;
      self._changed = true;
      console.log(self.name + " | Updated " + container + " sort order.")
    });
  }

  /* ------------------------------------------- */
  /*  Saving and Cleanup                         */
  /* ------------------------------------------- */

  cleanup() {
    this.updateSort();
    super.cleanup();
  }

  save() {
    this.updateSort();
    super.save();
  }
}


/* ------------------------------------------- */
/*  NPC CLASS                                  */
/* ------------------------------------------- */


class PFTCNPC extends PFTCActor {

  convertData(data) {
    data = super.convertData(data);
    data._flags["npc"] = 1;

    // CR
    let cr = eval(data.experience.cr.current || 0);
    data.experience.cr.current = cr;

    // Update Proficiency Bonus
    //data.attributes.proficiency.current = Math.max(Math.floor((cr + 7) / 4), 2);
    return data;
  }

  /* ------------------------------------------- */

  get template() {
    return PFTC.TEMPLATE_DIR + "actors/npc.html";
  }

  get templateParts() {
    const td = PFTC.TEMPLATE_DIR + "actors/";
    let parts = {
      "NPC_ATTRIBUTES": td + "attributes-npc.html",
      "SIDEBAR_ATTRIBUTES": td + "attributes3.html",
      "CURRENCY": td + "currency.html",
      "TRAITS": td + "traits.html"
    };
    if (hasSecurity(getCookie("UserID"), "Assistant Master")) parts["SIDEBAR_OPTIONS"] = td + "options.html";
    return parts;
  }
}

/* ------------------------------------------- */
/*  Actors Initialization Hook                 */
/* ------------------------------------------- */


hook.add("PFTCInit", "Actors", function() {

  // Apply the Item Data Model
  PFTCActor.applyDataModel();

  // Render Item Sheets
  sync.render("PFTC_RENDER_ACTOR", function (obj, app, scope) {
    const actor = PFTCActor.fromData(obj, scope);
    if (!actor.data.hlData || !actor.data.hlData.porFile || !actor.data.hlData.xmlIndex) {
      if(actor.data.hlData && actor.data.hlData.porFile !== null){
        console.log('Ask for HeroLab Setup?');
      }
    }
    return actor.render(app, scope);
  });
});


/* ------------------------------------------- */
