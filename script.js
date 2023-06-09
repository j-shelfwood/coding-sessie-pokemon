const pokemonIds = [1, 4, 7, 25, 152, 155, 158];

const pokemonRegions = [
	{
		region: "Kanto",
		pokemons: {
			bulbasaur: ["grass", "poison"],
			charmander: ["fire"],
			squirtle: ["water"],
			pikachu: ["electric"],
		},
	},
	{
		region: "Johto",
		pokemons: {
			chikorita: ["grass"],
			cyndaquil: ["fire"],
			totodile: ["water"],
		},
	},
];

const typeWeaknesses = {
	normal: ["fighting"],
	fighting: ["flying", "psychic", "fairy"],
	flying: ["rock", "electric", "ice"],
	poison: ["ground", "psychic"],
	ground: ["water", "grass", "ice"],
	rock: ["water", "grass", "fighting", "ground", "steel"],
	bug: ["fire", "flying", "rock"],
	ghost: ["ghost", "dark"],
	steel: ["fire", "fighting", "ground"],
	fire: ["water", "rock", "ground"],
	water: ["electric", "grass"],
	grass: ["fire", "ice", "poison", "flying", "bug"],
	electric: ["ground"],
	psychic: ["bug", "ghost", "dark"],
	ice: ["fire", "fighting", "rock", "steel"],
	dragon: ["ice", "dragon", "fairy"],
	dark: ["fighting", "bug", "fairy"],
	fairy: ["poison", "steel"],
};

const pokemon = {
	id: pokemonIds[Math.floor(Math.random() * pokemonIds.length)],
	region: null,
	typeWeaknesses: [],
};

// Get the #at-the-door element
document.querySelector("#at-the-door").addEventListener("click", () => {
	fetchRandomPokemon();
});
// Get the #start-fight element
document.querySelector("#start-fight").addEventListener("click", () => {
	startFight();
});

async function fetchRandomPokemon() {
	const response = await fetch(
		`https://pokeapi.co/api/v2/pokemon/${pokemon.id}`
	);
	pokemon.data = await response.json();
	afterKnock();
}

function afterKnock() {
	console.log(pokemon);
	// Loop over the pokemonRegions array and find the region that matches the pokemon.name
	pokemon.region = pokemonRegions.find((region) =>
		Object.keys(region.pokemons).includes(pokemon.data.name)
	).region;

	// Set the typeWeaknesses for the pokemon's types
	console.log(pokemon.data.types);
	pokemon.typeWeaknesses = pokemon.data.types
		.map((type) => typeWeaknesses[type.type.name])
		.flat();

	showPokemon();
}

function showPokemon() {
	// Show the name, region power-level and basic stats
	document.querySelector("#name").innerText = pokemon.data.name;
	document.querySelector("#region").innerText = pokemon.region;
	document.querySelector("#power-level").innerText =
		pokemon.data.base_experience;
	// Add a ul and li's to the stats div
	const stats = document.querySelector("#stats");
	stats.innerHTML = "";
	const ul = document.createElement("ul");
	stats.appendChild(ul);
	for (const stat of pokemon.data.stats) {
		const li = document.createElement("li");
		li.innerText = `${stat.stat.name}: ${stat.base_stat}`;
		ul.appendChild(li);
	}
	// Add weakness types as badges
	// There is a hidden span #badge template
	let weaknesses = document.querySelector("#weaknesses");
	for (const weakness of pokemon.typeWeaknesses) {
		let badge = document.querySelector("#badge").cloneNode(true);
		badge.classList.remove("hidden");
		badge.innerText = weakness;
		weaknesses.appendChild(badge);
	}

	// Remove the hidden class on #pokemon-details
	document.querySelector("#pokemon-details").classList.remove("hidden");

	// Remove the hidden class from the start fight button
	document.querySelector("#start-fight").classList.remove("hidden");
	// Now hide who's at the door
	document.querySelector("#at-the-door").classList.add("hidden");
}

function startFight() {
	// Check if the power_level of a pokemon is higher than 20, if so start the fight
	if (pokemon.data.base_experience > 20) {
		confetti({
			particleCount: 100,
			spread: 70,
			startVelocity: 20,
			origin: { y: 0.6 },
		});
		// Start confetti
	} else {
		alert("You're too weak to fight!");
	}
}
