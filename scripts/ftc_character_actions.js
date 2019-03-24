/* jshint -W104 */


/* -------------------------------------------- */


PFTCActor.prototype.rollAbility = function(ability) {
    /*
    Roll a basic Ability check
    d20 + modifier
    */

    // Prepare core data
    let actor = this,
        data = this.getCoreData(this.data),
        a = data.abilities[ability],
        flavor = a.name + " check",
        adv = undefined,
        bonus = undefined,
        formula = undefined,
        attrData = undefined;

    formula = PFTC.Dice.formula(PFTC.Dice.d20(adv), "@mod", bonus);
    attrData = {"mod": a.mod};

    PFTC.Dice.roll(actor, flavor, formula, attrData);
};


/* -------------------------------------------- */


PFTCActor.prototype.rollSave = function(save) {
    /*
    Roll a Saving Throw
    d20 + class-base + attribute-mod + resist-bonus + misc-bonus
    */

    // Prepare core data
    let actor = this,
        data = this.getCoreData(this.data),
        a = data.saves[save],
        flavor = a.name + " Save",
        adv = undefined,
        bonus = undefined,
        formula = undefined,
        saveData = undefined;

    if (![a.base, a.attr].includes(undefined)) {
        formula = PFTC.Dice.formula(PFTC.Dice.d20(adv), "@base", "@attr", "@resist", "@misc", bonus);
        saveData = {"base": a.base, "attr": a.attr, "resist": a.resist || 0, "misc": a.misc || 0};
    } else {
        formula = PFTC.Dice.formula(PFTC.Dice.d20(adv), "@current", bonus);
        saveData = {"current": a.current};
    }

    PFTC.Dice.roll(actor, flavor, formula, saveData);
};


/* -------------------------------------------- */


PFTCActor.prototype.rollSkill = function(skill) {
    /*
    Roll a basic skill check
    d20 + ability mod + proficiency + situational
    */

    // Prepare core data
    let actor = this,
        data = this.getCoreData(this.data),
        s = data.skills[skill],
        flavor = s.name + " Check",
        rolled = false,
        adv = undefined,
        bonus = undefined,
        formula = undefined,
        skillData = undefined;

    if (![s.ranks, s.attributeBonus, s.classSkill, s.armorCheck].includes(undefined)) {
        skillData = {"ranks": s.ranks, "attr": s.attributeBonus, "class": (s.classSkill) ? "3" : "0", "acp": s.armorCheck ? data.penalties.acp.value : "0"};
        let sum = 0;
        $.each(skillData, function(_, val) { sum += parseInt(val); });
        bonus = parseInt(s.value) - sum;
        formula = PFTC.Dice.formula(PFTC.Dice.d20(adv), "@ranks", "@attr", "@class", "@acp", bonus);
    } else if (![s.value].includes(undefined)) {
        formula = PFTC.Dice.formula(PFTC.Dice.d20(adv), "@value", bonus);
        skillData = {"value": s.value};
    } else {
        formula = PFTC.Dice.formula(PFTC.Dice.d20(adv), "@current", "@mod", bonus);
        skillData = {"current": s.current, "mod": s.mod};
    }

    PFTC.Dice.roll(actor, flavor, formula, skillData);
};


/* -------------------------------------------- */


PFTCActor.prototype.basicRoll = function(modifier) {
    /*
    Roll an Ability Test
    d20 + modifier + situational
    */

    // Prepare core data
    let flavor = "Basic Roll",
        rolled = false,
        adv = undefined,
        bonus = undefined;

    // Prepare HTML form
    const html = $('<div id="ftc-dialog" class="ability-roll"></div>');
    html.append($('<label>Situational Modifier?</label>'));
    html.append($('<input type="text" id="roll-bonus" placeholder="Formula"/>'));
    html.append($('<label>Roll With advantage?</label>'));

    // Create a dialogue
    PFTC.ui.createDialogue(html, {
        title: flavor,
        buttons: {
            "Advantage": function () {
                rolled = true;
                adv = true;
                bonus = $(this).find('#roll-bonus').val();
                $(this).dialog("close");
            },
            "Normal": function () {
                rolled = true;
                bonus = $(this).find('#roll-bonus').val();
                $(this).dialog("close");
            },
            "Disadvantage": function () {
                rolled = true;
                adv = false;
                bonus = $(this).find('#roll-bonus').val();
                $(this).dialog("close");
            }
        },
        close: function () {
            html.dialog("destroy");
            if ( !rolled ) return;
            let formula = PFTC.Dice.formula(PFTC.Dice.d20(adv), "@mod", bonus);
            if ( adv !== undefined ) flavor += ( adv ) ? " (Advantage)": " (Disadvantage)";
            PFTC.Dice.roll(this, flavor, formula, {"mod": modifier});
        }
    });
};


/* -------------------------------------------- */
