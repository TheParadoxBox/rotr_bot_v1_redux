// this file is for quickly balancing the battle function so that I don't have
// to constantly run bot commands. it supersedes the old files testfight.js
// and testanalyze.js.

// --- BATTLE FUNCTION ---

function battle(atkStartTroops, defStartTroops, atkStance, defStance, atkNaval) {

	// ----- CONSTANTS -----
	// these aren't actually consts but they're used like them so they're here lol

	let atkChanceHit = Math.floor(Math.random() * 41 + 10)/100;
	if (atkNaval) { atkChanceHit *= 0.65; } // if naval invasion, lower attacker kill change
	let atkChanceCauseRetreat = 0.25;

	let defChanceHit = Math.floor(Math.random() * 41 + 10)/100;
	let defChanceCauseRetreat = 0.25;



	// ----- STANCE LOGIC -----
	switch (atkStance) {
		// case 0:	// assault; do nothing
			// break;
		case 1:		// raid
			if (defStance === 2) { atkChanceHit *= 1.75; }
			else { defChanceCauseRetreat = 1; }
			break;
		case 2:		// shock
			if (defStance !== 1) { atkChanceCauseRetreat *= 3; }
			defChanceCauseRetreat = 0;
			break;
	}
	switch(defStance) {
		// case 0:	// hold; do nothing
			// break;
		case 1:		// guerrilla
			if (atkStance === 2) { defChanceHit *= 1.75; }
			else { atkChanceCauseRetreat = 1; }
			break;
		case 2:		// entrench
			if (atkStance !== 1) { defChanceCauseRetreat *= 3; }
			atkChanceCauseRetreat = 0;
			break;
	}



	// ----- BATTLE LOOP -----

	// running troop counts
	let atkTroops = atkStartTroops;
	let defTroops = defStartTroops;
	// running total of retreat troops for each side
	let atkRetreats = 0;
	let defRetreats = 0;
	// self-explanatory
	let roundCount = 0;

	while (atkTroops > 0 && defTroops > 0) {

		let currentAtkDeaths = 0;
		let currentAtkRetreats = 0;
		let currentDefDeaths = 0;
		let currentDefRetreats = 0;

		let currentAtkChanceHit = atkChanceHit;
		let currentDefChanceHit = defChanceHit;

		// iterate through atk troops to see if shot hit/caused retreat/missed
		for (let i = 0; i < atkTroops; i++) {
			if (currentDefDeaths + currentDefRetreats < defTroops) { // don't try to kill troops that don't exist
				if (Math.random() > (1 - currentAtkChanceHit)) {
					currentDefDeaths++;
					// additional chance to retreat
					if (Math.random() > (1 - atkChanceCauseRetreat)) {
						currentDefRetreats++;
					}
				}
			} else { break; }
		}

		// same thing for def troops
		for (let j = 0; j < defTroops; j++) {
			if (currentAtkDeaths + currentAtkRetreats < atkTroops) { // don't try to kill troops that don't exist
				if (Math.random() > (1 - currentDefChanceHit)) {
					currentAtkDeaths++;
					// additional chance to retreat
					if (Math.random() > (1 - defChanceCauseRetreat)) {
						currentAtkRetreats++;
					}
				}
			} else { break; }
		}

		atkTroops -= (currentAtkDeaths + currentAtkRetreats);
		defTroops -= (currentDefDeaths + currentDefRetreats);

		// fun fact: there is a chance that gets smaller as troop counts go up that
		// all combatants will die or retreat. no iteration of the code has ever
		// made provisions for this not to happen. as such, it is considered a draw.
		// the defenders hold the state but both states now have 0 troops.

		atkRetreats += currentAtkRetreats;
		defRetreats += currentDefRetreats;
		roundCount += 1;
	}

	
	return [atkTroops, defTroops, atkRetreats, defRetreats, roundCount];
}

// --- ANALYZE FUNCTION ---

function analyze(atkStartTroops, defStartTroops, atkStance, defStance, atkNaval) {
	const precision = 5000; // adjust to balance computation time vs. accuracy
	let atkDeaths = 0;
	let defDeaths = 0;
	let atkTotalRetreats = 0;
	let defTotalRetreats = 0;
	let atkVictories = 0;
	let rounds = 0;

	for (let i = 0; i < precision; i++) {
		let [atkTroops, defTroops, atkRetreats, defRetreats, roundCount] = battle(atkStartTroops, defStartTroops, atkStance, defStance, atkNaval);
		if (atkTroops > 0) { atkVictories++; }
		rounds += roundCount;
		atkDeaths += atkStartTroops - atkTroops - atkRetreats; // figured this out with algebra. i dont really understand the logic behind it but whatever
		defDeaths += defStartTroops - defTroops - defRetreats;
		atkTotalRetreats += atkRetreats;
		defTotalRetreats += defRetreats;
	}

	const avgAtkDeaths = Math.floor(atkDeaths / precision);
	const avgDefDeaths = Math.floor(defDeaths / precision);
	const avgAtkRetreats = Math.floor(atkTotalRetreats / precision);
	const avgDefRetreats = Math.floor(defTotalRetreats / precision);
	const avgRounds = Math.floor(rounds / precision);
	const atkWinPct = Math.floor(atkVictories / precision * 100);

	return [avgAtkDeaths, avgDefDeaths, avgAtkRetreats, avgDefRetreats, avgRounds, atkWinPct];
}

// args to pass
const atkStartTroops = 100;
const defStartTroops = 100;
const atkStance = 0;
const defStance = 0;
const atkNaval = 0;

[avgAtkDeaths, avgDefDeaths, avgAtkRetreats, avgDefRetreats, avgRounds, atkWinPct] = analyze(atkStartTroops, defStartTroops, atkStance, defStance, atkNaval);
[atkTroops, defTroops, atkRetreats, defRetreats, roundCount] = battle(atkStartTroops, defStartTroops, atkStance, defStance, atkNaval, 0);

console.log("Stances: " + atkStance + " vs. " + defStance);
console.log("ANALYSIS");
console.log("Avg atk deaths: " + avgAtkDeaths);
console.log("Avg def deaths: " + avgDefDeaths);
console.log("Avg atk Retreats: " + avgAtkRetreats);
console.log("Avg def Retreats: " + avgDefRetreats);
console.log("Avg rounds: " + avgRounds);
console.log("Atk win pct: " + atkWinPct + "%");
console.log("SINGLE BATTLE (no crits)");
console.log("Atk remaining: " + atkTroops);
console.log("Atk Retreated: " + atkRetreats);
console.log("Def remaining: " + defTroops);
console.log("Def Retreats: " + defRetreats);
console.log("Rounds: " + roundCount);