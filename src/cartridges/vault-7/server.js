import {readyToLeave} from '../../engine/equipment.js';
import {VAULT7_SECRETS,vault7Scene} from '../../vault7.js';
import {hashSeed} from '../../math.js';
import {beginExtraction} from '../../extraction.js';
function shuffle(records,seed){const result=[...records];for(let i=result.length-1;i>0;i--){const j=hashSeed(`${seed}:${i}`)% (i+1);[result[i],result[j]]=[result[j],result[i]];}return result;}
export const vault7Server={
prepareCipher(team, sessionUsed = new Set()) {
    const members = this.members(team.id);
    if (!members.length) return;
    const excluded = new Set([...(this.state.config.excludedSecretIds || []), ...sessionUsed]);
    const eligible = VAULT7_SECRETS.filter(record => !excluded.has(record.id));
    const pool = eligible.length ? eligible : VAULT7_SECRETS.filter(record => !sessionUsed.has(record.id));
    const variant = pool[hashSeed(`${this.state.code}:${team.id}:secret`) % pool.length];
    const secret = variant.token;
    const numbers = shuffle(Array.from({ length: 26 }, (_, index) => index + 1), `${this.state.code}:${team.id}:cipher`).slice(0, secret.length);
    team.cipher = {
      variantId: variant.id,
      secret,
      numbers,
      mappings: secret.split("").map((letter, position) => ({
        position,
        number: numbers[position],
        letter,
        studentId: members[position % members.length].id,
        status: "earned"
      }))
    };
  },
vote(student, input) {
    const team = this.teamFor(student);
    if (team.stage !== "decision") return { error: "Voting is not open." };
    const choice = ["shaft", "corridor"].includes(input.choice) ? input.choice : null;
    if (!choice) return { error: "Choose a route." };
    team.votes[student.id] = choice;
    this.addEvent("vote", `${student.alias} voted`, team.id, student.id);
    this.bump();
    return this.snapshot({ deviceId: student.id });
  },
resolveDecision(student) {
    const team = this.teamFor(student);
    if (team.stage !== "decision") return { error: "This decision is already closed." };
    if (!this.isLead(student, team)) return { error: "Only the Event Lead can submit the decision." };
    const members = this.members(team.id);
    if (!members.every(member => team.votes[member.id])) return { error: "Every team member must vote first." };
    const counts = { shaft: 0, corridor: 0 };
    Object.values(team.votes).forEach(choice => counts[choice] += 1);
    if (counts.shaft === counts.corridor) return { error: "The vote is tied. The Event Lead must change their vote after discussion." };
    team.route = counts.shaft > counts.corridor ? "shaft" : "corridor";
    team.leadIndex = (team.leadIndex + 1) % members.length;
    this.addEvent("decision-resolved", `${team.name} chose the ${team.route}`, team.id);
    this.openGate(team, 1);
    this.bump();
    return this.snapshot({ deviceId: student.id });
  },
marketSelect(student, input) {
    const team = this.teamFor(student);
    if (team.stage !== "market") return { error: "The market is not open." };
    const selection = ["scanner", "toolkit", "cloak", "none"].includes(input.item) ? input.item : null;
    if (!selection) return { error: "Choose an equipment recommendation." };
    team.marketSelections[student.id] = selection;
    delete team.marketReady[student.id];
    this.addEvent("market-selection", `${student.alias} selected a market recommendation`, team.id, student.id);
    this.bump();
    return this.snapshot({ deviceId: student.id });
  },
marketReady(student) {
    const team = this.teamFor(student);
    if (team.stage !== "market") return { error: "The market is not open." };
    if (!team.marketSelections[student.id]) return { error: "Select an equipment recommendation—or save the credits—first." };
    team.marketReady[student.id] = true;
    this.addEvent("market-ready", `${student.alias} locked a market recommendation`, team.id, student.id);
    this.bump();
    return this.snapshot({ deviceId: student.id });
  },
marketBuy(student, input) {
    const team = this.teamFor(student);
    if (team.stage !== "market") return { error: "The market is not open." };
    if (!this.isLead(student, team)) return { error: "Only the Event Lead confirms purchases." };
    if (!this.members(team.id).every(member => team.marketReady[member.id])) return { error: "Every member must mark the plan ready first." };
    const items = {
      scanner: { name: "Code Scanner", cost: 40 },
      toolkit: { name: "Silent Toolkit", cost: 30 },
      cloak: { name: "Cloak", cost: 30 }
    };
    const chosen = items[input.item];
    if (!chosen) return { error: "Choose an available item." };
    if (team.inventory.length) return { error: "Your team may purchase only one upgrade in this prototype." };
    if (team.currency < chosen.cost) return { error: "Your team does not have enough credits." };
    team.currency -= chosen.cost;
    team.inventory.push(input.item);
    this.addEvent("purchase", `${team.name} bought ${chosen.name} for ${chosen.cost} credits`, team.id, student.id);
    this.bump();
    return this.snapshot({ deviceId: student.id });
  },
marketContinue(student) {
    const team = this.teamFor(student);
    if (team.stage !== "market") return { error: "The market is not open." };
    if (!this.isLead(student, team)) return { error: "Only the Event Lead can continue." };
    if (!this.members(team.id).every(member => team.marketReady[member.id])) return { error: "Every member must mark the plan ready first." };
    if(!readyToLeave(this,team))return {error:'Confirm all earned equipment slots before continuing.'};
    const protectedRoute = team.route === "corridor" && team.inventory.includes("toolkit");
    if (!protectedRoute) {
      const mapping = team.cipher.mappings.find(record => record.status === "earned");
      if (mapping) {
        mapping.status = team.inventory.includes("scanner") ? "restored" : "corrupted";
        team.adverseEvents.push({ type: "alarm", mappingPosition: mapping.position, restored: mapping.status === "restored" });
        this.addEvent(mapping.status === "restored" ? "cipher-restored" : "cipher-corrupted", mapping.status === "restored" ? "The alarm damaged a mapping, but the Code Scanner restored it." : "The alarm corrupted one cipher mapping.", team.id);
      }
    }
    team.leadIndex = (team.leadIndex + 1) % this.members(team.id).length;
    this.addEvent("market-closed", `${team.name} entered the deeper complex`, team.id);
    this.openGate(team, 2);
    this.bump();
    return this.snapshot({ deviceId: student.id });
  },
submitCode(student, input) {
    const team = this.teamFor(student);
    if (team.stage !== "code") return { error: "The secret message is not ready." };
    if (!this.isLead(student, team)) return { error: "Only the Event Lead can submit the decoded message." };
    const submitted = String(input.code || "").toUpperCase().replace(/[^A-Z]/g, "");
    team.codeAttempts += 1;
    if (submitted !== team.cipher.secret) {
      this.addEvent("code-incorrect", `${team.name} submitted an incorrect decoded message`, team.id, student.id);
      this.bump();
      return { ...this.snapshot({ deviceId: student.id }), feedback: { correct: false, message: "Message rejected. Compare every number with the crew’s mappings." } };
    }
    team.stage = "finale";
    this.addEvent("code-decoded", `${team.name} decoded ${team.cipher.secret} and reached Asterion`, team.id);
    this.bump();
    return { ...this.snapshot({ deviceId: student.id }), feedback: { correct: true, message: "Secret message decoded. Asterion is waiting for your decision." } };
  },
finaleVote(student, input) {
    const team = this.teamFor(student);
    if (team.stage !== "finale") return { error: "The final decision is not open." };
    const choice = ["isolate", "destroy", "release", "copy"].includes(input.choice) ? input.choice : null;
    if (!choice) return { error: "Choose Asterion's fate." };
    team.finalVotes[student.id] = choice;
    this.addEvent("finale-vote", `${student.alias} voted on Asterion's fate`, team.id, student.id);
    this.bump();
    return this.snapshot({ deviceId: student.id });
  },
resolveFinale(student) {
    const team = this.teamFor(student);
    if (team.stage !== "finale") return { error: "The final decision is already closed." };
    if (!this.isLead(student, team)) return { error: "Only the Event Lead can submit the final decision." };
    const members = this.members(team.id);
    if (!members.every(member => team.finalVotes[member.id])) return { error: "Every team member must vote first." };
    const totals = { isolate: 0, destroy: 0, release: 0, copy: 0 };
    Object.values(team.finalVotes).forEach(choice => totals[choice] += 1);
    const high = Math.max(...Object.values(totals));
    const tied = Object.keys(totals).filter(choice => totals[choice] === high);
    team.finalAction = tied.includes(team.finalVotes[student.id]) ? team.finalVotes[student.id] : tied[0];
    beginExtraction(this,team);
    this.addEvent('final-choice',`${team.name} chose to ${team.finalAction} Asterion`,team.id);
    this.bump();
    return this.snapshot({ deviceId: student.id });
  },
advance(team) {
    const members = this.members(team.id);
    if (!members.length || !members.every(member => member.gateComplete)) return;
    team.currency += 20;
    if (team.gateIndex === 0) team.stage = "decision";
    else if (team.gateIndex === 1) team.stage = "market";
    else if (team.gateIndex >= this.state.config.gateCount - 1) {
      team.stage = "code";
      team.leadIndex = (team.leadIndex + 1) % members.length;
    } else this.openGate(team, team.gateIndex + 1);
  },
scene:vault7Scene
};
