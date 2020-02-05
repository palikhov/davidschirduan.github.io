var xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function () {
  if (this.readyState == 4 && this.status == 200) {
    tempered = JSON.parse(this.responseText);
  }
};
xmlhttp.open("GET", "/_pages/tempered.json", true);
xmlhttp.send();

function selectRandom(jsonList) {
  result = jsonList[Math.floor(Math.random() * jsonList.length)];
  if (Array.isArray(result)) {
    result = selectRandom(result);
  }
  return result;
}

var Wielder = "Lemuria";
var WeaponName = "Excaliber"
var WeaponType = "Dagger"

function hideWindow() {
  document.getElementById("weaponCard").style = "display:none;";
  document.getElementById("dataCard").style = "display:none;";
}

function generateSlot() {
  document.getElementById("weaponName").innerHTML = "New Slot:";
  WeaponName = "this weapon";
  document.getElementById("weaponDesc").innerHTML ='';
  document.getElementById("temperedSlots").innerHTML = createSlot(1);
  document.getElementById("weaponCard").style = "";
  document.getElementById("weaponImg").style = "display:none;";
  //document.getElementById("downloadBTN").style = "display:none;";
  document.getElementById("interacting").innerHTML = "<p class=\"h3 tightSpacing\">Interacting With Slots</p><p><img style=\"margin-left: 10px;margin-right: 10px;\" class=\"temperedicon\" src=\"/images/TemperedWeapons/unlocked.png\"><strong>Unlock A Slot</strong>.</p><p>When you fulfill the regret of a previous owner a new Slot is revealed! Add the above Slot to your weapon.</p><p><img style=\"margin-left: 10px;margin-right: 10px;\" class=\"temperedicon\" src=\"/images/TemperedWeapons/shaking-hands.png\"><strong>Help An Ally</strong>.</p><p>After you help an ally unlock one of their Slots, you may Replace any Slot in your own weapon with the abhove Slot.</p>";
}

function generateWeapon() {
  //document.getElementById("downloadBTN").style = "min-width:160px;margin-bottom:auto;";
  WeaponName = parseWORDS(selectRandom(tempered.NameTemplates));
  document.getElementById("weaponName").innerHTML = WeaponName;
  weaponDesc();
  document.getElementById("temperedSlots").innerHTML = createSlot(2);
  document.getElementById("weaponCard").style = "";
  document.getElementById("interacting").innerHTML = "<p class=\"h3 tightSpacing\">Interacting With Slots</p><p><img class=\"temperedicon\" style=\"margin-left: 10px;margin-right: 10px;\" src=\"/images/TemperedWeapons/unlocked.png\"><strong>Unlock A Slot</strong>.</p><p>When you fulfill the regret of a previous owner, you unlock that Slot and gain access to their power. In addition this reveals a new Slot in the weapon! Use the \"Generate Slot\" button and add it to your weapon.</p><p><img class=\"temperedicon\" style=\"margin-left: 10px;margin-right: 10px;\" src=\"/images/TemperedWeapons/shaking-hands.png\"><strong>Help An Ally</strong>.</p><p>After you help an ally unlock one of their Slots, you may use the \"Slot Generator\" to replace any Slot in your own weapon with one from the generator.</p><p><img class=\"temperedicon\" style=\"margin-left: 10px;margin-right: 10px;\" src=\"/images/TemperedWeapons/skull-crossed-bones.png\"><strong>Character Death</strong>.</p><p>When a character dies they can choose to have some aspect of themselves stored in the item. Erase all the slots in the weapon, except for the first one. Create a new slot based on the character that just died, along with a Regret for that slot and add it to the weapon.</p>";
}

function weaponDesc() {
  WeaponType = selectRandom(tempered.Weapons);
  slots = 2;
  document.getElementById("weaponDesc").innerHTML = parseWORDS(selectRandom(tempered.DescriptionIntro) + selectRandom(tempered.DescriptionDetails) + selectRandom(tempered.DescriptionSpecial) + " " + selectRandom(tempered.Rumors));

  document.getElementById("weaponImg").src = "/images/TemperedWeapons/" + WeaponType + ".png";
  weaponColors();
}

/*returns a div row of Slots
THE LOGIC
0. Equal chance of every Slot being a Spell, Knowledge, Weapon Property, or Mutation.
1. If there is only one Slot, then it's an ancient Nonsense item.
2. Otherwise the first Slot is always unlocked.
3. Spells and Knowledge can be Real Names(2/3) or Nonsense(1/3)
4. Mutations and Weapon Properties are un-named. But their goals are Nonsense.
*/

function createSlot(numSlots) {
  slotHTML = "";
  powername = "";
  powerdescr = "";
  phrase = "";
  random = 1;
  icon = "";

  //for the number of Slots
  for (i = 0; i < numSlots; i++) {
    random = Math.round(Math.random() * 100);
    Wielder = selectRandom(tempered.Names);
    mutation = false;

    switch (true) {
      //Give a mutation ONLY if it's not the first slot of a weapon.
      case ((numSlots > 1 && random <= 25 && i != 0) || (numSlots == 1 && random <= 15)):
        icon = "mutation.png";
        powername = "<strong>Mutation</strong>";
        powerdescr = selectRandom(tempered.Mutations);
        phrase = "The dense mixture of magic and history in "+WeaponName+" can result in bizarre infections that alter the wielder permanently. They can only be cured by fulfilling their associated regret.";
        mutation = true;
        break;
      case (random < 50):
        icon = "spell.png";
        powername = "<strong>" + Wielder + "'s Spell</strong>";
        powerdescr = parseWORDS(selectRandom(tempered.Spells));
        phrase = "Spells can only be cast while holding "+WeaponName+". L = caster level. Spells last Lx10 minutes, range of 40ft (unless noted otherwise). \"Items\" can be held in one hand, \"objects\" are anything up to human size.";
        break;
      case (random < 75):
        icon = "knowledge.png";
        powername = "<strong>" + Wielder + "'s Knowledge</strong>";
        powerdescr = selectRandom(tempered.Knowledge);
        phrase = "The memories, skills, and training of a previous owner. Knowledge is only accessible while holding "+WeaponName+". After "+WeaponName+" is put away, the knowledge fades away over the next hour.";
        break;
      default:
        icon = "enchantment.png";
        powername = "<strong>" + Wielder + "'s Enchantment</strong>";
        powerdescr = selectRandom(tempered.Enchantments);
        phrase = "Enchantments alter the properties of "+WeaponName+". They are passive bonuses and are always in effect.";
    }

    slotHTML = slotHTML + "<div class=\"row temperedRows\"><div class=\"col-lg-6 col-12 cellGoals\">"

    //SET GOALS.
    //Mutations don't have goals and can't be the first Slot
    if (mutation) {
      slotHTML = slotHTML + "<p style=\"text-align: center;display: flow-root;\"><img style=\"float:left;\" class=\"temperedicon\" src=\"/images/TemperedWeapons/cure.png\"><strong>" + Wielder + "'s Cure</strong><img style=\"float:right;transform: scaleX(-1);\" class=\"temperedicon\" src=\"/images/TemperedWeapons/cure.png\"></p>" + parseWORDS(selectRandom(tempered.GoalTemplates)) + " Then you will cure this Mutation.</p></div>";
      //If you're just generating 1 slot, it's locked behind a goal.
    } else if (numSlots == 1) {
      slotHTML = slotHTML + "<p style=\"text-align: center;display: flow-root;\"><img style=\"float:left;\" class=\"temperedicon\" src=\"/images/TemperedWeapons/locked.png\"><strong>" + Wielder + "'s Regret</strong><img style=\"float:right;transform: scaleX(-1);\" class=\"temperedicon\" src=\"/images/TemperedWeapons/locked.png\"></p><p>" + parseWORDS(selectRandom(tempered.GoalTemplates)) + " Then you will unlock " + powername + ".</p></div>";
      //otherwise the first slot is an introduction
    } else if (i == 0) {
      slotHTML = slotHTML + "<p>As soon as you take hold of "+WeaponName+" you gain awareness of this slot and the Locked one below. <strong>" + powername + "</strong> is already unlocked.</p></div>";      
    } else {
      slotHTML = slotHTML + "<p style=\"text-align: center;display: flow-root;\"><img style=\"float:left;\" class=\"temperedicon\" src=\"/images/TemperedWeapons/locked.png\"><strong>" + Wielder + "'s Regret</strong><img style=\"float:right;transform: scaleX(-1);\" class=\"temperedicon\" src=\"/images/TemperedWeapons/locked.png\"></p>" + parseWORDS(selectRandom(tempered.GoalTemplates)) + " Then you will unlock " + powername + ".</p></div>";
    }

    //SET DETAILS
    slotHTML = slotHTML + "<div class=\"col-lg-6 col-12 cellLegacies\"><p style=\"text-align: center;display: flow-root;\"><img style=\"float:left;\"class=\"temperedicon\" src=\"/images/TemperedWeapons/" + icon + "\">" + powername + "<img style=\"float:right;transform: scaleX(-1);\" class=\"temperedicon\" src=\"/images/TemperedWeapons/" + icon + "\"></p><p>" + powerdescr + "</p></div></div><p class=\"temperedP\">" + phrase + "</p>";
  }

  return slotHTML;
}

function showTables() {
  document.getElementById("weaponCard").style = "display:none;";
  document.getElementById("dataCard").style = "";

  var dataHTML = "";

  for (var key in tempered) {
    if (tempered.hasOwnProperty(key)) {
      console.log(key);
      dataHTML = dataHTML + "<div class=\"col col-md-4 dataCol\">";
      dataHTML = dataHTML + "<h3 class=\"tightSpacing\">" + key + "</h3>";
      for (var item in tempered[key]) {
        dataHTML = dataHTML + "<p>" + tempered[key][item] + "</p>";
      }
      dataHTML = dataHTML + "</div>";
    }
  }

  document.getElementById("dataRow").innerHTML = dataHTML;
}
//change the colors, and sometimes flip the weapon sideways
function weaponColors() {
  random = Math.random();
  if (random >= .5) {
    flipped = 1;
  } else {
    flipped = -1;
  }

  var bgstyle = "background: linear-gradient(to right";
  for (i=0;i<8;i++){
    bgstyle = bgstyle + ", #" + (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6);
  }

  document.getElementById("weaponImg").style = bgstyle + ");transform: scaleX(" + flipped + ");";
}

function parseWORDS(WORDstring) {

  //An estoc
    WORDstring = WORDstring.replace(/ANweapontype/g, () => {
      return AvsAnSimple.query(WeaponType).charAt(0).toUpperCase() + AvsAnSimple.query(WeaponType).substring(1) + " " + WeaponType.toLowerCase();;
    });

  //an amazing...
  WORDstring = WORDstring.replace(/anadjective/g, () => {
        wrd = selectRandom(tempered.Adjectives).toLowerCase();
        return AvsAnSimple.query(wrd) + " " + wrd;
  });

  //an otter
  WORDstring = WORDstring.replace(/ancreature/g, () => {
    wrd = selectRandom(tempered.Creatures).toLowerCase();
    return AvsAnSimple.query(wrd) + " " + wrd;
  });

  //an hourglass
  WORDstring = WORDstring.replace(/anobject/g, () => {
    wrd = selectRandom(tempered.Objects).toLowerCase();
    return AvsAnSimple.query(wrd) + " " + wrd;
  });

  //amazing...
  WORDstring = WORDstring.replace(/adjective/g, () => {
    wrd = selectRandom(tempered.Adjectives).toLowerCase();
    return wrd;
  });

  //frog
  WORDstring = WORDstring.replace(/creature/g, () => {
    wrd = selectRandom(tempered.Creatures).toLowerCase();
    return wrd;
  });

  //iron
  WORDstring = WORDstring.replace(/commonmaterial/g, () => {
    wrd = selectRandom(tempered.CommonMaterials).toLowerCase();
    return wrd;
  });

  //emerald
  WORDstring = WORDstring.replace(/rarematerial/g, () => {
    wrd = selectRandom(tempered.RareMaterials).toLowerCase();
    return wrd;
  });

  //Red
  WORDstring = WORDstring.replace(/COLOR/g, () => {
    wrd = selectRandom(tempered.Colors);
    return wrd;
  });

  //Corey
  WORDstring = WORDstring.replace(/NAME/g, () => {
    wrd = selectRandom(tempered.Names);
    return wrd;
  });

  //Ecstacy
  WORDstring = WORDstring.replace(/NOUN/g, () => {
    wrd = selectRandom(tempered.Nouns);
    return wrd;
  });

  //Fuming
  WORDstring = WORDstring.replace(/ADJECTIVE/g, () => {
    wrd = selectRandom(tempered.Adjectives);
    return wrd;
  });

  //Elephant
  WORDstring = WORDstring.replace(/CREATURE/g, () => {
    wrd = selectRandom(tempered.Creatures);
    return wrd;
  });

  //Corey
  WORDstring = WORDstring.replace(/WIELDER/g, () => {
    return Wielder;
  });

  //Bard
  WORDstring = WORDstring.replace(/PERSON/g, () => {
    wrd = selectRandom(tempered.Persons);
    return wrd;
  });

  //bard
  WORDstring = WORDstring.replace(/person/g, () => {
    wrd = selectRandom(tempered.Persons);
    return wrd.toLowerCase();
  });

  //Table
  WORDstring = WORDstring.replace(/OBJECT/g, () => {
    wrd = randomObject();
    return wrd;
  });

  //lamp
  WORDstring = WORDstring.replace(/OBJECT/g, () => {
    wrd = randomObject();
    return wrd.toLowerCase();
  });

  //Mountains
  WORDstring = WORDstring.replace(/LOCATION/g, () => {
    wrd = selectRandom(tempered.Locations);
    return wrd;
  });

  //435
  var regex = /RANDOM-[0-9]+-[0-9]+/;
  while (WORDstring.match(regex)) {
    WORDmatch = WORDstring.match(regex);
    nums = WORDmatch[0].split("-");
    min = parseInt(nums[1]);
    max = parseInt(nums[2]);
    WORDstring = WORDstring.replace(WORDmatch, Math.floor(Math.random() * (max - min + 1)) + min);
  }

  return WORDstring;
}

function randomObject() {
  //50% chance of being a weapon or object.
  random = Math.random();

  switch (true) {
    case (random < .06):
      return selectRandom(tempered.Objects);
    default:
      return selectRandom(tempered.Weapons);
  }
}

//by Eamon Nerbonne (from http://home.nerbonne.org/A-vs-An), Apache 2.0 license
var AvsAnSimple = (function (root) {
  var dict = "2h.#2.a;i;&1.N;*4.a;e;i;o;/9.a;e;h1.o.i;l1./;n1.o.o;r1.e.s1./;01.8;12.1a;01.0;12.8;9;2.31.7;4.5.6.7.8.9.8a;0a.0;1;2;3;4;5;6;7;8;9;11; .22; .–.31; .42; .–.55; .,.h.k.m.62; .k.72; .–.82; .,.92; .–.8;<2.m1.d;o;=1.=1.E;@;A6;A1;A1.S;i1;r1;o.m1;a1;r1; .n1;d1;a1;l1;u1;c1.i1.a1.n;s1;t1;u1;r1;i1;a1;s.t1;h1;l1;e1;t1;e1.s;B2.h2.a1.i1;r1;a.á;o1.r1.d1. ;C3.a1.i1.s1.s.h4.a2.i1.s1;e.o1.i;l1.á;r1.o1.í;u2.i;r1.r1.a;o1.n1.g1.j;D7.a1.o1.q;i2.n1.a1.s;o1.t;u1.a1.l1.c;á1. ;ò;ù;ư;E7;U1;R.b1;o1;l1;i.m1;p1;e1;z.n1;a1;m.s1;p5.a1.c;e;h;o;r;u1.l1;o.w1;i.F11. ;,;.;/;0;1;2;3;4;5;6;71.0.8;9;Ae;B.C.D.F.I2.L.R.K.L.M.N.P.Q.R.S.T.B;C1;M.D;E2.C;I;F1;r.H;I3.A1;T.R1. ;U;J;L3.C;N;P;M;O1. ;P1;..R2.A1. ;S;S;T1;S.U2.,;.;X;Y1;V.c;f1.o.h;σ;G7.e1.r1.n1.e;h1.a3.e;i;o;i1.a1.n1.g;o2.f1. ;t1.t1. ;r1.i1.a;w1.a1.r1.r;ú;Hs. ;&;,;.2;A.I.1;2;3;5;7;B1;P.C;D;F;G;H1;I.I6;C.G.N.P.S1.D;T.K1.9;L;M1;..N;O2. ;V;P;R1;T.S1.F.T;V;e2.i1.r;r1.r1.n;o2.n6;d.e1.s;g.k.o2;l.r1;i1.f;v.u1.r;I3;I2;*.I.n1;d1;e1;p1;e1;n1;d2;e1;n1;c1;i.ê.s1;l1;a1;n1;d1;s.J1.i1.a1.o;Ly. ;,;.;1;2;3;4;8;A3. ;P;X;B;C;D;E2. ;D;F1;T.G;H1.D.I1.R;L;M;N;P;R;S1;m.T;U1. ;V1;C.W1.T;Z;^;a1.o1.i1.g;o1.c1.h1.a1;b.p;u1.s1.h1;o.ộ;M15. ;&;,;.1;A1;.1;S./;1;2;3;4;5;6;7;8;Ai;B.C.D.F.G.J.L.M.N.P.R.S.T.V.W.X.Y.Z.B1;S1;T.C;D;E3.P1;S.W;n;F;G;H;I4. ;5;6;T1;M.K;L;M;N;O1.U;P;Q;R;S;T1;R.U2. ;V;V;X;b1.u1.m;f;h;o2.D1.e.U1;..p1.3;s1.c;Ny. ;+;.1.E.4;7;8;:;A3.A1;F.I;S1.L;B;C;D;E3.A;H;S1. ;F1;U.G;H;I7.C.D1. ;K.L.N.O.S.K;L;M1;M.N2.R;T;P1.O1.V1./1.B;R2;J.T.S1;W.T1;L1.D.U1.S;V;W2.A;O1.H;X;Y3.C1.L;P;U;a1.s1.a1.n;t1.h;v;²;×;O5;N1;E.l1;v.n2;c1.e.e1.i;o1;p.u1;i.P1.h2.i1.a;o2.b2;i.o.i;Q1.i1.n1.g1.x;Rz. ;&;,;.1;J./;1;4;6;A3. ;.;F1;T.B1;R.C;D;E3. ;S1.P;U;F;G;H1.S;I2.A;C1. ;J;K;L1;P.M5;1.2.3.5.6.N;O2.H;T2;A.O.P;Q;R1;F.S4;,...?.T.T;U4;B.M.N.S.V;X;c;f1;M1...h2.A;B;ò;S11. ;&;,;.4.E;M;O;T1..3.B;D;M;1;3;4;5;6;8;9;A3. ;8;S2;E.I.B;C3.A1. ;R2.A.U.T;D;E6. ;5;C3;A.O.R.I1.F.O;U;F3;&.H.O1.S.G1;D.H3.2;3;L;I2. ;S1.O.K2.I.Y.L3;A2. ;.;I1. ;O.M3;A1. ;I.U1.R.N5.A.C3.A.B.C.E.F.O.O5. ;A1.I;E;S1;U.V;P7;A7;A.C.D.M.N.R.S.E1. ;I4;C.D.N.R.L1;O.O.U.Y.Q1. ;R;S1;W.T9.A1. ;C;D;F;I;L;M;S;V;U7.B.L.M.N.P.R.S.V;W1.R;X1.M;h1.i1.g1.a1.o;p1.i1.o1;n.t2.B;i1.c1.i;T4.a2.i2.g1.a.s1.c;v1.e1.s;e1.a1.m1.p;u1.i2.l;r;à;Um..1.N1..1.C;/1.1;11. .21.1;L1.T;M1.N;N4.C1.L;D2. .P.K;R1. .a;b2;a.i.d;g1.l;i1.g.l2;i.y.m;no. ;a1.n.b;c;d;e1;s.f;g;h;i2.d;n;j;k;l;m;n;o;p;q;r;s;t;u;v;w;p;r3;a.e.u1.k;s3. ;h;t1;r.t4.h;n;r;t;x;z;í;W2.P1.:4.A1.F;I2.B;N1.H.O1.V;R1.F1.C2.N.U.i1.k1.i1.E1.l1.i;X7;a.e.h.i.o.u.y.Y3.e1.t1.h;p;s;[5.A;E;I;a;e;_2._1.i;e;`3.a;e;i;a7; .m1;a1;r1. .n1;d2; .ě.p1;r1;t.r1;t1;í.u1;s1;s1;i1. .v1;u1;t.d3.a1.s1. ;e2.m1. ;r1. ;i2.c1.h1. ;e1.s1.e2.m;r;e8;c1;o1;n1;o1;m1;i1;a.e1;w.l1;i1;t1;e1;i.m1;p1;e1;z.n1;t1;e1;n1;d.s2;a1. .t4;a1; .e1; .i1;m1;a1;r.r1;u1.t.u1.p1. ;w.f3. ;M;y1.i;h9. ;,;.;C;a1.u1.t1;b.e2.i1.r1;a.r1.m1.a1.n;o4.m2.a1; .m;n8; .b.d.e3; .d.y.g.i.k.v.r1.s1. ;u1.r;r1. ;t1;t1;p1;:.i6;b1;n.e1;r.n2;f2;l1;u1;ê.o1;a.s1;t1;a1;l1;a.r1; .s1; .u.k1.u1. ;l3.c1.d;s1. ;v1.a;ma. ;,;R;b1.a.e1.i1.n;f;p;t1.a.u1.l1.t1.i1.c1.a1.m1.p1.i;×;n6. ;V;W;d1; .t;×;o8;c2;h1;o.u1;p.d1;d1;y.f1; .g1;g1;i.no. ;';,;/;a;b;c1.o;d;e2.i;r;f;g;i;l;m;n;o;r;s;t;u;w;y;z;–;r1;i1;g1;e.t1;r1.s;u1;i.r3. ;&;f;s9.,;?;R;f2.e.o.i1.c1.h;l1. ;p2.3;i1. ;r1.g;v3.a.e.i.t2.A;S;uc; ...b2.e;l;f.k2.a;i;m1;a1. .n3;a3; .n5.a;c;n;s;t;r1;y.e2; .i.i8.c2.o1.r1.p;u1.m;d1;i1.o;g1.n;l1.l;m1;o.n;s1.s;v1.o1;c.r5;a.e.i.l.o.s3. ;h;u1.r2;e.p3;a.e.i.t2.m;t;v.w1.a;xb. ;';,;.;8;b;k;l;m1;a.t;y1. ;y1.l;{1.a;|1.a;£1.8;À;Á;Ä;Å;Æ;É;Ò;Ó;Ö;Ü;à;á;æ;è;é1;t3.a;o;u;í;ö;ü1; .Ā;ā;ī;İ;Ō;ō;œ;Ω;α;ε;ω;ϵ;е;–2.e;i;ℓ;";

  function fill(node) {
    var kidCount = parseInt(dict, 36) || 0,
      offset = kidCount && kidCount.toString(36).length;
    node.article = dict[offset] === "." ? "a" : "an";
    dict = dict.substr(1 + offset);
    for (var i = 0; i < kidCount; i++) {
      var kid = node[dict[0]] = {}
      dict = dict.substr(1);
      fill(kid);
    }
  }
  fill(root);

  return {
    raw: root,
    //Usage example: AvsAnSimple.query("example") 
    //example returns: "an"
    query: function (word) {
      var node = root,
        sI = 0,
        result, c;
      do {
        c = word[sI++];
      } while ('"‘’“”$\'-('.indexOf(c) >= 0); //also terminates on end-of-string "undefined".

      while (1) {
        result = node.article || result;
        node = node[c];
        if (!node) return result;
        c = word[sI++] || " ";
      }
    }
  };
})({});