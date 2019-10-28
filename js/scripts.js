// An Immediately Invoked Function Expression to instantiate a pokemon repository and protect it from being accessed globally
var pokemonRepository = (function () {
	var repository = []; 
	var apiUrl = 'http://hp-api.herokuapp.com/api/characters/';

	// Add new pokemon to the repository
	function add(pokemon) {
		repository.push(pokemon);
	} 

	function loadList() {
		return fetch(apiUrl).then(function (response) { 
			console.log(response);
			return response.json();
		}).then(function (json) { 
			console.log(json);
			json.forEach(function (item) {
				var potterCharacter = {
					name: item.name
				};
				add(potterCharacter);
			});
		}).catch(function (e) {
			console.error(e);
		})
	}

	// Return all pokemon in the repository
	function getAll() {
		return repository; 
	} 

	// Display all pokemon in the repository
	function addListItem(pokemon) { 
		console.log(pokemon.name);
		var pokemonListItem = document.createElement('LI'); 
		var pokemonLIButton = document.createElement('BUTTON'); 
		pokemonLIButton.classList.add('pokemon-buttons');
		pokemonLIButton.innerText = pokemon.name; 
		pokemonListItem.appendChild(pokemonLIButton); 
		pokemonList.appendChild(pokemonListItem); 
		// addPokemonListener(pokemonLIButton, pokemon);
	}  

	// Creates event listeners for the buttons as they are being created.
	function addPokemonListener (button, pokemon) {
		button.addEventListener('click', function() {
			showDetails(pokemon);
		});
	} 

	// A simple function that logs the contents of the pokemon objects to the console.
	function showDetails(pokemon) {
		loadDetails(pokemon).then(function () { 
			showModal(pokemon);   
    	});
	} 

	function loadDetails(item) {
		var url = item.detailsUrl;
		return fetch(url).then(function (response) {
			return response.json();
		}).then(function (details) { 
	       // Now we add the details to the item
	       item.imageUrl = details.sprites.front_default;
	       item.height = details.height;
	       item.types = details.types;
  		}).catch(function (e) {
  		   console.error(e);
  		});
	}  


	// MODALS

	function showModal(pokemon) {
		var $modalContainer = document.querySelector('#modal-container'); 
		// Clear any existing text if being used again. 
		$modalContainer.innerHTML = ''; 

		// Will close the modal container if the user clicks out side of the modal div 
		$modalContainer.addEventListener('click', (e) => {
		 	var target = e.target;
		  	if (target === $modalContainer) {
		  	hideModal();
			}
		}); 

		// Create a modal div to go into the container 
		var modal = document.createElement('div'); 
		modal.classList.add('modal'); 

		// Give the modal some content based on the pokemon and UI elements  
		var closeButton = document.createElement('BUTTON'); 
		closeButton.classList.add('modal-close'); 
		closeButton.innerText = 'Close'; 
		closeButton.addEventListener('click', hideModal);

		var modalTitle = document.createElement('H1'); 
		modalTitle.innerText = pokemon.name; 

		var modalBodyDiv = document.createElement('div'); 
		modalBodyDiv.classList.add('modal-body-div');

		var modalBody = document.createElement('P'); 
		var modalBodyTextDiv = document.createElement('div'); 
		modalBodyTextDiv.classList.add('modal-body-text-div');
		modalBodyTextDiv.appendChild(modalBody);
		modalBody.innerText = 'Height: ' + (pokemon.height / 10) + ' m';

		var modalTypeTable = document.createElement('table'); 
		modalTypeTable.classList.add('types-table');
		var modalTypeTblHead = document.createElement('th'); 
		modalTypeTblHead.classList.add('types-header');
		modalTypeTblHead.innerText = 'Type:';
		if (pokemon.types.length > 1) {
			modalTypeTblHead.innerText = 'Types:';
		} 

		modalTypeTable.appendChild(modalTypeTblHead);  

		var modalTableDiv = document.createElement('div'); 
		modalTableDiv.classList.add('modal-table-div'); 
		modalTableDiv.appendChild(modalTypeTable);

		pokemon.types.forEach((type) => { 
			var typeText = type.type.name.charAt(0).toUpperCase() + type.type.name.slice(1);
			var modalTableContent = document.createElement('td'); 
			modalTableContent.innerText = typeText; 
			modalTableContent.classList.add('types-table'); 
			modalTableContent.style.background = typeColor(typeText);
			modalTypeTblHead.appendChild(modalTableContent);
		}); 

		var modalImage = document.createElement('IMG'); 
		modalImage.src = pokemon.imageUrl; 
		var modalImageDiv = document.createElement('div'); 
		modalImageDiv.classList.add('modal-image-div')
		modalImageDiv.appendChild(modalImage);

		modal.appendChild(closeButton); 
		modal.appendChild(modalTitle);
		modalBodyDiv.appendChild(modalImageDiv);
		modalBodyDiv.appendChild(modalBodyTextDiv); 
		modalBodyDiv.appendChild(modalTableDiv); 
		modal.appendChild(modalBodyDiv);
		

		$modalContainer.appendChild(modal);

		// Display the modal after all content has been set 
		$modalContainer.classList.add('is-visible');  
	}  


	function hideModal() {
		document.querySelector('#modal-container').classList.remove('is-visible');
	}  

	// Gives coloring based on the value of the type.
	function typeColor(type) {
		switch (type) {
			case 'Grass' : 
				return 'rgba(0,204,0,0.3)'; 
			case 'Poison': 
				return 'rgba(255,0,255,0.3)'; 
			case 'Water' : 
				return 'rgba(0,0,255, 0.3)'; 
			case 'Fire' : 
				return 'rgba(255,128,0,0.65)';  
			case 'Normal' : 
				return 'rgb(255,229,204)'; 
			case 'Flying' : 
				return 'rgb(204,229,255)'; 
			case 'Fairy' : 
				return 'rgb(255,204,229)'; 
			case 'Bug' : 
				return 'rgba(0,153,76, 0.5)'; 
			case 'Ground' : 
				return 'rgba(153,76,0, 0.5)'; 
			case 'Psychic' : 
				return 'rgb(255,255,204)'; 
			case 'Fighting' : 
				return 'rgba(59, 91, 112, 0.6)'; 
			case 'Steel' : 
				return 'rgb(135,137,140)'; 
			case 'Electric' : 
				return 'rgba(255,254,0, 0.8)'; 
			case 'Ice' : 
				return 'rgba(165,242,243, 0.8)'; 
			case 'Rock' : 
				return 'rgba(150,159,178, 0.8)'; 
			case 'Dragon' : 
				return 'rgba(204,122,0, 0.8)';
			default : 
				return 'rgba(0,0,0,0)';			 

		}
	}

	// Add a listener that will close the modal if the user presses the escape button
	window.addEventListener('keydown', (e) => {
		var $modalContainer = document.querySelector('#modal-container');
		if (e.key === 'Escape' && $modalContainer.classList.contains('is-visible')) {
			hideModal();  
		}
	});

	return {
		add: add,
		getAll: getAll,
		addListItem: addListItem, 
		loadList: loadList, 
		loadDetails: loadDetails
	};
})(); 

var pokemonList = document.querySelector('.potter-list'); 

var pokemonLoadingMessage = document.createElement('p'); 
pokemonLoadingMessage.innerText = 'Loading...'; 
pokemonLoadingMessage.classList.add('loading-message');
var pokemonTitle = document.getElementById('title'); 
pokemonTitle.appendChild(pokemonLoadingMessage); 

pokemonRepository.loadList().then(()=>{
  // Data loaded successfully
	pokemonRepository.getAll().forEach((pokemon)=>{
  		pokemonRepository.addListItem(pokemon);
  }); 
	pokemonTitle.removeChild(pokemonLoadingMessage);
});  


 