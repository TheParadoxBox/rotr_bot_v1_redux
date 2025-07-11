// v1 redux bot functions
// written by paradox based on testfight.js

// --- BATTLE FUNCTION ---

// stances key:
// atk:
//   assault (0): standard attack
//   raid (1): more routing
//   shock (2): no routing + higher kill chance
//   naval attack (true): 65% kill chance
// def:
//   hold (0): standard defense
//   retreat (1): more routing
//   entrench (2): no routing + higher kill chance

// allow crit key:
// 0: standard crit behavior
// 1: no crits
// 2: guarantee round 1 crit for atk, then standard behavior
// 3: guarantee round 1 crit for def, then standard behavior

function battle(atkStartTroops, defStartTroops, atkStance, defStance, atkNaval, allowCrit) {

	// ----- CONSTANTS -----
	// these aren't actually consts but they're used like them so they're here lol

	let atkChanceHit = Math.floor(Math.random() * 41 + 10)/100;
	if (atkNaval) { atkChanceHit *= 0.65; } // if naval invasion, lower attacker kill change
	let atkChanceRout = 0.25;

	let defChanceHit = Math.floor(Math.random() * 41 + 10)/100;
	let defChanceRout = 0.25;



	// ----- STANCE LOGIC -----
	switch (atkStance) {
		// case 0:		// assault; do nothing
			// break;
		case 1:		// raid
			atkChanceRout *= 2;
			break;
		case 2:		// shock
			atkChanceHit *= 1.15;
			atkChanceRout = 0;
			break;
	}
	switch(defStance) {
		// case 0:	// hold; do nothing
		// 	break;
		case 1:		// retreat
			defChanceRout *= 2;
			break;
		case 2:		// entrench
			defChanceHit *= 1.15;
			defChanceRout = 0;
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
	let atkCritCount = 0;
	let defCritCount = 0;

	while (atkTroops > 0 && defTroops > 0) {

		let currentAtkDeaths = 0;
		let currentAtkRouts = 0;
		let currentDefDeaths = 0;
		let currentDefRouts = 0;

		let currentAtkChanceHit = atkChanceHit;
		let currentDefChanceHit = defChanceHit;
		let atkCrit = false;
		let defCrit = false;

		// crit logic
		switch(allowCrit) {
			case 0:		// std crits
				if (Math.random() < 0.025) {
					atkCrit = true;
					currentAtkChanceHit *= 1.5;
					atkCritCount++;
				} else if (Math.random() < 0.05) {
					defCrit = true;
					currentDefChanceHit *= 1.5;
					defCritCount++;
				}
				break;
			// case 1:	// no crits; do nothing
				// break
			case 2:		// guaranteed round 1 atk crit
				atkCrit = true;
				currentAtkChanceHit *= 1.5;
				atkCritCount++;
				allowCrit = 0;
				break;
			case 3:		// guaranteed round 1 def crit
				defCrit = true;
				currentDefChanceHit *= 1.5;
				defCritCount++;
				allowCrit = 0;
		}

		// iterate through atk troops to see if shot hit/caused rout/missed
		for (let i = 0; i < atkTroops; i++) {
			if (currentDefDeaths + currentDefRouts < defTroops) { // don't try to kill troops that don't exist
				if (Math.random() > (1 - currentAtkChanceHit)) {
					currentDefDeaths++;
					// additional chance to rout
					if (Math.random() > (1 - defChanceRout)) {
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
					if (Math.random() > (1 - atkChanceRout)) {
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

	
	return [atkTroops, defTroops, atkRouts, defRouts, roundCount, atkCritCount, defCritCount];
}

// --- ANALYZE FUNCTION ---

function analyze(atkStartTroops, defStartTroops, atkStance, defStance, atkNaval) {
	const precision = 10000; // adjust to balance computation time vs. accuracy
	let atkDeaths = 0;
	let defDeaths = 0;
	let atkTotalRouts = 0;
	let defTotalRouts = 0;
	let atkVictories = 0;
	let rounds = 0;

	for (let i = 0; i < precision; i++) {
		let [atkTroops, defTroops, atkRouts, defRouts, roundCount] = battle(atkStartTroops, defStartTroops, atkStance, defStance, atkNaval, 1); // never crit
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

module.exports = { battle, analyze };