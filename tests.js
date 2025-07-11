// this file is for quickly balancing the battle function so that I don't have
// to constantly run bot commands. it supersedes the old files testfight.js
// and testanalyze.js.

// --- BATTLE FUNCTION ---

function battle(atkStartTroops, defStartTroops, atkStance, defStance, atkNaval) {

	// ----- CONSTANTS -----
	// these aren't actually consts but they're used like them so they're here lol

	let atkChanceHit = Math.floor(Math.random() * 41 + 10)/100;
	if (atkNaval) { atkChanceHit *= 0.65; } // if naval invasion, lower attacker kill change
	let atkChanceCauseRout = 0.25;

	let defChanceHit = Math.floor(Math.random() * 41 + 10)/100;
	let defChanceCauseRout = 0.25;



	// ----- STANCE LOGIC -----
	switch (atkStance) {
		// case 0:	// assault; do nothing
			// break;
		case 1:		// raid
			if (defStance === 2) { atkChanceHit *= 1.75; }
			else { defChanceCauseRout = 1; }
			break;
		case 2:		// shock
			if (defStance !== 1) { atkChanceCauseRout *= 3; }
			defChanceCauseRout = 0;
			break;
	}
	switch(defStance) {
		// case 0:	// hold; do nothing
			// break;
		case 1:		// retreat
			if (atkStance === 2) { defChanceHit *= 1.75; }
			else { atkChanceCauseRout = 1; }
			break;
		case 2:		// entrench
			if (atkStance !== 1) { defChanceCauseRout *= 3; }
			atkChanceCauseRout = 0;
			break;
	}



	// ----- BATTLE LOOP -----

	// running troop counts
	let atkTroops = atkStartTroops;
	let defTroops = defStartTroops;
	// running total of routed troops for each side
	let atkRouts = 0;
	let defRouts = 0;
	// self-explanatory
	let roundCount = 0;

	while (atkTroops > 0 && defTroops > 0) {

		let currentAtkDeaths = 0;
		let currentAtkRouts = 0;
		let currentDefDeaths = 0;
		let currentDefRouts = 0;

		let currentAtkChanceHit = atkChanceHit;
		let currentDefChanceHit = defChanceHit;

		// iterate through atk troops to see if shot hit/caused rout/missed
		for (let i = 0; i < atkTroops; i++) {
			if (currentDefDeaths + currentDefRouts < defTroops) { // don't try to kill troops that don't exist
				if (Math.random() > (1 - currentAtkChanceHit)) {
					currentDefDeaths++;
					// additional chance to rout
					if (Math.random() > (1 - atkChanceCauseRout)) {
						currentDefRouts++;
					}
				}
			} else { break; }
		}

		// same thing for def troops
		for (let j = 0; j < defTroops; j++) {
			if (currentAtkDeaths + currentAtkRouts < atkTroops) { // don't try to kill troops that don't exist
				if (Math.random() > (1 - currentDefChanceHit)) {
					currentAtkDeaths++;
					// additional chance to rout
					if (Math.random() > (1 - defChanceCauseRout)) {
						currentAtkRouts++;
					}
				}
			} else { break; }
		}

		atkTroops -= (currentAtkDeaths + currentAtkRouts);
		defTroops -= (currentDefDeaths + currentDefRouts);

		// fun fact: there is a chance that gets smaller as troop counts go up that
		// all combatants will die or be routed. no iteration of the code has ever
		// made provisions for this not to happen. as such, it is considered a draw.
		// the defenders hold the state but both states now have 0 troops.

		atkRouts += currentAtkRouts;
		defRouts += currentDefRouts;
		roundCount += 1;
	}

	
	return [atkTroops, defTroops, atkRouts, defRouts, roundCount];
}

// --- ANALYZE FUNCTION ---

function analyze(atkStartTroops, defStartTroops, atkStance, defStance, atkNaval) {
	const precision = 5000; // adjust to balance computation time vs. accuracy
	let atkDeaths = 0;
	let defDeaths = 0;
	let atkTotalRouts = 0;
	let defTotalRouts = 0;
	let atkVictories = 0;
	let rounds = 0;

	for (let i = 0; i < precision; i++) {
		let [atkTroops, defTroops, atkRouts, defRouts, roundCount] = battle(atkStartTroops, defStartTroops, atkStance, defStance, atkNaval);
		if (atkTroops > 0) { atkVictories++; }
		rounds += roundCount;
		atkDeaths += atkStartTroops - atkTroops - atkRouts; // figured this out with algebra. i dont really understand the logic behind it but whatever
		defDeaths += defStartTroops - defTroops - defRouts;
		atkTotalRouts += atkRouts;
		defTotalRouts += defRouts;
	}

	const avgAtkDeaths = Math.floor(atkDeaths / precision);
	const avgDefDeaths = Math.floor(defDeaths / precision);
	const avgAtkRouts = Math.floor(atkTotalRouts / precision);
	const avgDefRouts = Math.floor(defTotalRouts / precision);
	const avgRounds = Math.floor(rounds / precision);
	const atkWinPct = Math.floor(atkVictories / precision * 100);

	return [avgAtkDeaths, avgDefDeaths, avgAtkRouts, avgDefRouts, avgRounds, atkWinPct];
}

// args to pass
const atkStartTroops = 100;
const defStartTroops = 100;
const atkStance = 0;
const defStance = 0;
const atkNaval = 0;

[avgAtkDeaths, avgDefDeaths, avgAtkRouts, avgDefRouts, avgRounds, atkWinPct] = analyze(atkStartTroops, defStartTroops, atkStance, defStance, atkNaval);
[atkTroops, defTroops, atkRouts, defRouts, roundCount] = battle(atkStartTroops, defStartTroops, atkStance, defStance, atkNaval, 0);

console.log("Stances: " + atkStance + " vs. " + defStance);
console.log("ANALYSIS");
console.log("Avg atk deaths: " + avgAtkDeaths);
console.log("Avg def deaths: " + avgDefDeaths);
console.log("Avg atk routs: " + avgAtkRouts);
console.log("Avg def routs: " + avgDefRouts);
console.log("Avg rounds: " + avgRounds);
console.log("Atk win pct: " + atkWinPct + "%");
console.log("SINGLE BATTLE (no crits)");
console.log("Atk remaining: " + atkTroops);
console.log("Atk routed: " + atkRouts);
console.log("Def remaining: " + defTroops);
console.log("Def routs: " + defRouts);
console.log("Rounds: " + roundCount);