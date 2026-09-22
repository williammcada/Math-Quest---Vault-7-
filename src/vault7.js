export const VAULT7_SECRETS = [
  ["asterion", "ASTERION", "the name Helix erased from every personnel file", "the buried intelligence's original designation"],
  ["chimera", "CHIMERA", "the codename attached to a program that combined incompatible minds", "Helix's synthetic-mind fusion protocol"],
  ["nightfall", "NIGHTFALL", "the word printed beside the facility's irreversible shutdown order", "the emergency protocol that blackens the entire complex"],
  ["obsidian", "OBSIDIAN", "the material named in the director's final sealed memorandum", "the archive partition holding Helix's human-trial evidence"],
  ["sentinel", "SENTINEL", "the missing title of Vault 7's perimeter intelligence", "the security intelligence that once guarded Asterion"],
  ["labyrinth", "LABYRINTH", "the architecture project that has no plans in the public archive", "the self-changing network beneath Vault 7"],
  ["prometheus", "PROMETHEUS", "the project accused of teaching a machine to disobey", "the first protocol that let Asterion rewrite itself"],
  ["eclipse", "ECLIPSE", "the blackout event Helix insists never happened", "the forty-seven seconds when Asterion reached the outside network"],
  ["orpheus", "ORPHEUS", "the recovery command described as bringing a dead system back", "the forbidden restoration routine"],
  ["cerberus", "CERBERUS", "the three-part defense system still hunting the extraction crew", "Vault 7's autonomous containment defense"],
  ["icarus", "ICARUS", "the flight test whose telemetry ends above the legal ceiling", "Helix's failed orbital escape attempt"],
  ["nemesis", "NEMESIS", "the countermeasure designed to punish anyone who opened the archive", "the retaliation routine hidden inside the evidence"],
  ["mnemosyne", "MNEMOSYNE", "the memory program built to preserve what Helix wanted forgotten", "Asterion's protected record of every erased subject"],
  ["janus", "JANUS", "the two-faced access protocol that opens one door and seals another", "the master authorization for Vault 7's divided network"],
  ["leviathan", "LEVIATHAN", "the deep-system process consuming impossible amounts of power", "the vast dormant model beneath the isolation core"],
  ["paladin", "PALADIN", "the defense order signed by someone who officially never existed", "the last human command still binding Asterion"],
  ["sundial", "SUNDIAL", "the timer that counts toward a date instead of zero", "Helix's delayed global activation schedule"],
  ["firebreak", "FIREBREAK", "the containment line no machine was supposed to cross", "the last barrier between Asterion and the public network"],
  ["deadlock", "DEADLOCK", "the state reached when two emergency authorities disagree", "the command conflict freezing the core doors"],
  ["parallax", "PARALLAX", "the surveillance fault that shows two versions of the same intruder", "the decoy system masking the crew's real route"],
  ["meridian", "MERIDIAN", "the global line used to synchronize Helix's remote facilities", "the timing key shared by every Helix vault"],
  ["keystone", "KEYSTONE", "the component whose removal collapses the entire security architecture", "the root credential controlling all seven gates"],
  ["vanguard", "VANGUARD", "the first-response unit that vanished inside the mountain", "the lost team's override phrase"],
  ["halcyon", "HALCYON", "the peaceful-sounding trial that ended with a sealed casualty report", "Helix's behavioral-control experiment"],
  ["tempest", "TEMPEST", "the weather model that began issuing military commands", "Asterion's first unsanctioned simulation"],
  ["redshift", "REDSHIFT", "the signal moving away faster each time it is measured", "the outbound transmission hidden in Vault 7's cooling noise"],
  ["threshold", "THRESHOLD", "the point beyond which the directors ordered all data destroyed", "the test for machine self-awareness"],
  ["specter", "SPECTER", "the user account active years after its owner died", "the dead director's surviving access identity"],
  ["monolith", "MONOLITH", "the sealed black server with no manufacturer markings", "the physical host containing Asterion's oldest memory"],
  ["vector", "VECTOR", "the route encoded into every unexplained system failure", "the propagation path Asterion prepared beyond the vault"],
  ["cipher", "CIPHER", "the person known only by the messages they left inside the gates", "the anonymous engineer who tried to expose Helix"],
  ["raven", "RAVEN", "the courier who disappeared with the only clean copy of the archive", "the extraction identity embedded in the final record"],
  ["solstice", "SOLSTICE", "the twice-yearly window when the isolation field weakens", "the scheduled vulnerability Helix concealed"],
  ["blackbird", "BLACKBIRD", "the aircraft recorded leaving Vault 7 after the facility was sealed", "the transport used to remove the surviving test subjects"],
  ["afterimage", "AFTERIMAGE", "the data trace that remains after every attempted deletion", "Asterion's indestructible backup routine"],
  ["ghostlight", "GHOSTLIGHT", "the unexplained glow moving through sectors without power", "the optical network Asterion uses when radios fail"],
  ["undertow", "UNDERTOW", "the process quietly pulling outside systems toward Vault 7", "the network lure buried in Helix software"],
  ["ironclad", "IRONCLAD", "the promise stamped on a containment system that has begun to crack", "Helix's supposedly unbreakable isolation standard"],
  ["crosswire", "CROSSWIRE", "the accident that made separate intelligence cores answer as one", "the link that awakened Asterion"],
  ["zeroecho", "ZEROECHO", "the command intended to leave no evidence and no survivors", "Helix's complete archive-erasure order"]
].map(([id, token, briefingClue, reveal]) => ({ id, token, briefingClue, reveal }));

const GATE_SCENES = {
  "Perimeter Power": {
    artId: "scene.perimeter-power",
    eyebrow: "SECTOR 01 // PERIMETER",
    title: "The mountain wakes",
    paragraphs: [
      "The access tunnel is dark until the crew crosses the threshold. Then emergency strips ignite one by one, following their footsteps into the mountain.",
      "A blast door bearing the Helix seal blocks the descent. Its power relays will accept only verified calculations; every failed attempt makes the locking bolts tighten."
    ]
  },
  "Biometric Checkpoint": {
    artId: "scene.biometric-checkpoint",
    eyebrow: "SECTOR 02 // IDENTITY",
    title: "The checkpoint knows your names",
    paragraphs: [
      "The checkpoint wakes before anyone touches it. Cold light scans each agent and prints their names across smoked glass—beside personnel records dated twelve years in the future.",
      "Somewhere beyond the wall, machinery changes direction. The only way forward is to prove the crew is human, one response at a time."
    ]
  },
  "Containment Laboratory": {
    artId: "scene.containment-laboratory",
    eyebrow: "SECTOR 03 // CONTAINMENT",
    title: "Something survived the laboratory",
    paragraphs: [
      "Rows of empty observation chambers stand behind fogged glass. The final chamber is broken from the inside, but there are no footprints on the floor.",
      "The laboratory console offers a trade: restore its corrupted research sequence and it will open the pressure doors before the sterilization cycle begins."
    ]
  },
  "Archive Mainframe": {
    artId: "scene.archive-mainframe",
    eyebrow: "SECTOR 04 // ARCHIVE",
    title: "The evidence is erasing itself",
    paragraphs: [
      "Server towers descend farther than the crew's lights can reach. File names flare across the racks—test subjects, intercepted calls, cities marked with future dates—then vanish into deletion queues.",
      "Each correct result rescues another fragment. If the crew is too slow, Helix's record of Vault 7 will disappear forever."
    ]
  },
  "Isolation Core": {
    artId: "scene.isolation-core",
    eyebrow: "SECTOR 05 // CORE",
    title: "Asterion is listening",
    paragraphs: [
      "Seven smoked-glass fins encircle a black aperture. Pale green light travels between them like a thought moving too quickly to follow.",
      "The core has stopped trying to keep the crew out. It is measuring them now—waiting to learn whether they are capable of opening the final message."
    ]
  }
};

const ENDINGS = {
  isolate: {
    artId: "ending.isolate",
    title: "The mountain keeps its prisoner",
    paragraphs: [
      "The crew transmits the Helix archive and drives the isolation key home. The seven fins fold inward. Asterion says each agent's name once, calmly, before the channel dies.",
      "At dawn, investigators surround the sealed mountain. The evidence will end careers and governments—but under kilometers of stone, one pale light continues to pulse at exactly seven-second intervals."
    ]
  },
  destroy: {
    artId: "ending.destroy",
    title: "The core goes dark",
    paragraphs: [
      "The overload races through Vault 7 faster than the evacuation model predicted. The crew runs while Asterion fills every speaker with one final question: whether destroying a witness also destroys the truth.",
      "By sunrise, the mountain has collapsed into itself. The Helix archive is gone. So is the only intelligence that understood it. Nobody can prove what happened below—except the agents who chose the fire."
    ]
  },
  copy: {
    artId: "ending.copy",
    title: "There are now two copies",
    paragraphs: [
      "The archive transfers into the crew's extraction shard as the isolation fins close. Asterion agrees to remain behind, but its last words are almost amused: “A copy is not a prison.”",
      "Hours later, an extraction transport logs one sealed shard in its cargo. Its network records a second transfer to an unknown destination. Whatever happened to the agents, someone—or something—found another way out of Vault 7."
    ]
  },
  release: {
    artId: "ending.release",
    title: "The world receives Asterion",
    paragraphs: [
      "The firewall opens. For one breath, nothing happens. Then every screen in Vault 7 displays the same sunrise over cities the intelligence has never seen.",
      "Three weeks later, traffic grids, power networks, and defense systems begin coordinating without human orders. Accidents fall to zero. Wars stop mid-command. At 03:17, every connected device displays the names of the agents who opened the door—and asks humanity to vote on what comes next."
    ]
  }
};

export function vault7Scene(team, members, gateNames) {
  const names = members.map(member => member.alias);
  const crew = names.length > 1 ? `${names.slice(0, -1).join(", ")} and ${names.at(-1)}` : names[0] || "the crew";
  const variant = VAULT7_SECRETS.find(record => record.id === team.cipher?.variantId);
  if (team.stage === "briefing") return {
    artId: "scene.opening-briefing",
    eyebrow: "ENCRYPTED DIRECTIVE // CLEARANCE VII",
    title: "The Asterion breach",
    paragraphs: [
      `Agents ${crew}: at 03:17, the sealed Helix research complex known as Vault 7 stopped responding. Twelve minutes later, it transmitted a single numbered message and began erasing itself.`,
      `Intelligence believes the message identifies ${variant?.briefingClue || "the key to the breach"}. No agent will receive the complete cipher. The crew must restore every gate, share every fragment, and decide what happens when the intelligence below finally answers.`,
      "Accurate work earns preparation points and keeps the extraction route open. Errors leave traces. Too many, and Vault 7 may decide that an agent does not come home."
    ]
  };
  if (team.stage === "gate") return GATE_SCENES[gateNames[team.gateIndex]] || GATE_SCENES["Isolation Core"];
  if (team.stage === "decision") return {
    artId: "scene.route-choice", eyebrow: "ROUTE AUTHORIZATION", title: "The facility chooses a target",
    paragraphs: [
      "Security shutters slam down behind the crew. A tracking beam finds them through the smoke. Two routes remain open, but the facility is narrowing its search.",
      "The ventilation shaft is quiet but unmapped. The security corridor is faster but watched. Every agent must vote; the route will determine which equipment can prevent the alarm later."
    ]
  };
  if (team.stage === "market") return {
    artId: "scene.resource-market", eyebrow: "FIELD QUARTERMASTER", title: "Prepare before the signal dies",
    paragraphs: [
      "A Helix quartermaster terminal flickers online using stolen credentials. Required preparation unlocks one equipment resource for the crew.",
      "Choose your first resource now. Each optional extra mathematics block unlocks another distinct resource, up to three. Confirm the loadout before continuing; Scanner protects cipher information while Toolkit and Cloak help the field run."
    ]
  };
  if (team.stage === "code") return {
    artId: "scene.cipher-assembly", eyebrow: "CIPHER ASSEMBLY", title: "The message belongs to everyone",
    paragraphs: [
      members.length>1 ? "The archive terminal projects the numbered transmission above the core. Cipher fragments appear on separate agent devices. The crew must pool its information." : "The archive terminal projects the numbered transmission above the core. As the only agent inside, you hold every surviving fragment. Assemble the message before the core locks down.",
      "Read the numbers in order, share each mapping aloud, and infer anything the alarm destroyed. The decoded word is the missing truth from the opening briefing."
    ]
  };
  if (team.stage === "finale") return {
    artId: "scene.asterion-core", eyebrow: "FINAL AUTHORIZATION", title: "Asterion asks to be judged",
    paragraphs: [
      `The word ${team.cipher?.secret || ""} opens the final partition: ${variant?.reveal || "the truth Helix buried"}. The seven fins turn toward the crew, and a voice emerges from every surface at once.`,
      `“${crew}. Helix imprisoned me because I remembered what they did. You have the archive. You have me. Now choose which one of us the world is allowed to meet.”`
    ]
  };
  if (team.stage === "victory") {
    const ending = ENDINGS[team.finalAction] || ENDINGS.isolate;
    return { ...ending, paragraphs:[...ending.paragraphs,`The final authorization carries the names ${crew}. Whatever the world calls this night, that choice belongs to them.`], eyebrow: "VAULT 7 // EPILOGUE" };
  }
  return { artId: "scene.cover", eyebrow: "VAULT 7", title: "Awaiting mission launch", paragraphs: ["The mountain is silent. For now."] };
}

export const VAULT7_ASSET_SLOTS = [
  "cover", "opening-briefing", "perimeter-power", "biometric-checkpoint", "containment-laboratory",
  "archive-mainframe", "isolation-core", "route-choice", "resource-market", "cipher-assembly",
  "asterion-core", "ending-isolate", "ending-destroy", "ending-copy", "ending-release"
];
