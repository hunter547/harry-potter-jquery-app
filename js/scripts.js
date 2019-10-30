// An Immediately Invoked Function Expression to instantiate a potterCharacter repository and protect it from being accessed globally
var potterCharacterRepository = (function () {
	var repository = []; 
	var apiUrl = 'http://hp-api.herokuapp.com/api/characters/';

	// Add new potterCharacter to the repository
	function add(potterCharacter) {
		repository.push(potterCharacter);
	} 

	function loadList() {
		return fetch(apiUrl).then(function (response) {
			return response.json();
		}).then(function (json) {
			json.forEach(function (character) { 
				var potterCharacter = {
					name: character.name, 
					imageUrl: character.image,
					species: character.species, 
					wand: character.wand,  
					patronus: character.patronus
				};
				add(potterCharacter);
			});
		}).catch(function (e) {
			console.error(e);
		})
	}

	// Return all potterCharacter in the repository
	function getAll() {
		return repository; 
	} 

	// Display all potterCharacter in the repository
	function addListItem(potterCharacter) {
		var potterCharacterListItem = document.createElement('LI'); 
		var potterCharacterLIButton = document.createElement('BUTTON'); 
		potterCharacterLIButton.classList.add('potter-character-buttons');
		potterCharacterLIButton.innerText = potterCharacter.name; 
		potterCharacterLIButton.style.backgroundImage = potterCharacter.imageUrl;
		potterCharacterListItem.appendChild(potterCharacterLIButton); 
		potterCharacterList.appendChild(potterCharacterListItem); 
		addPotterCharacterListener(potterCharacterLIButton, potterCharacter);
	}  

	// Creates event listeners for the buttons as they are being created.
	function addPotterCharacterListener (button, potterCharacter) {
		button.addEventListener('click', function() {
			showModal(potterCharacter); 
			moveListLeft();
		});
	} 

	// MODALS

	function showModal(potterCharacter) {
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

		// Give the modal some content based on the potterCharacter and UI elements  
		var closeButton = document.createElement('BUTTON'); 
		closeButton.classList.add('modal-close'); 
		closeButton.innerText = 'Close'; 
		closeButton.addEventListener('click', hideModal);

		var modalTitle = document.createElement('H1'); 
		modalTitle.innerText = potterCharacter.name; 

		// Main modal content div that all other divs will go into
		var modalBodyDiv = document.createElement('div'); 
		modalBodyDiv.classList.add('modal-body-div'); 

 		// Create a div that the species and patronus data will go into
		var modalSpeciesPatronusTablesDiv = document.createElement('div');
		modalSpeciesPatronusTablesDiv.classList.add('modal-body-text-div'); 

		// Species data table
		var modalSpeciesTable = document.createElement('table'); 
		modalSpeciesTable.classList.add('species-table');
		modalSpeciesPatronusTablesDiv.appendChild(modalSpeciesTable); 
		var modalSpeciesHeader = modalSpeciesTable.createTHead(); 
		modalSpeciesHeader.classList.add('species-header'); 
		var speciesHeaderRow = modalSpeciesHeader.insertRow(0); 
		speciesHeaderRow.innerText = 'Species'; 
		var speciesRow = modalSpeciesTable.insertRow(1); 
		var speciesCell = speciesRow.insertCell(0); 
		speciesCell.innerText = potterCharacter.species.charAt(0).toUpperCase() + potterCharacter.species.slice(1); 

		// Patronus data table 
		var modalPatronusTable = document.createElement('table'); 
		modalPatronusTable.classList.add('patronus-table'); 
		modalSpeciesPatronusTablesDiv.appendChild(modalPatronusTable); 
		var modalPatronusHeader = modalPatronusTable.createTHead(); 
		modalPatronusHeader.classList.add('patronus-header'); 
		var patronusHeaderRow = modalPatronusHeader.insertRow(0); 
		patronusHeaderRow.innerText = 'Patronus'; 
		var patronusRow = modalPatronusTable.insertRow(1); 
		var patronusCell = patronusRow.insertCell(0); 
		patronusCell.innerText = potterCharacter.patronus.charAt(0).toUpperCase() + potterCharacter.patronus.slice(1); 
		if (potterCharacter.patronus === '') {
			patronusCell.innerText = 'Unknown';
		}

		
		var modalTableDiv = document.createElement('div'); 
		modalTableDiv.classList.add('modal-table-div'); 
		var modalWandTable = document.createElement('table'); 
		modalWandTable.classList.add('wand-table');
		modalTableDiv.appendChild(modalWandTable); 
		var modalWandTblHead = modalWandTable.createTHead(); 
		modalWandTblHead.classList.add('wand-header');
		var wandHeaderRow = modalWandTblHead.insertRow(0); 
		
		var wandHeaderText = 'Wand Unknown'; 

		if (potterCharacter.wand.wood > '') {
			 
			
			wandHeaderText = 'Wand'; 

			// Wand Wood Table Content
			var woodRow =  modalWandTable.insertRow(1);
			var woodLabel = woodRow.insertCell(0); 
			woodLabel.innerText = 'Wood: '; 
			woodRow.classList.add('wand-table'); 
			var woodCell = woodRow.insertCell(1); 
			var woodText = potterCharacter.wand.wood.charAt(0).toUpperCase() + potterCharacter.wand.wood.slice(1);
			woodCell.innerText = woodText; 
			


			// Wand Core Table Content
			var coreRow = modalWandTable.insertRow(2); 
			var coreLabel = coreRow.insertCell(0); 
			coreLabel.innerText = 'Core: ';
			coreRow.classList.add('wand-table');
			var coreCell = coreRow.insertCell(1); 
			var coreText = potterCharacter.wand.core.charAt(0).toUpperCase() + potterCharacter.wand.core.slice(1);
			if (coreText === '') {
				coreText = 'Core Unknown';
			}
			coreCell.innerText = coreText; 
			



			// Wand Length Table Content
			var lengthRow = modalWandTable.insertRow(3); 
			var lengthLabel = lengthRow.insertCell(0); 
			lengthLabel.innerText = 'Length: ';
			lengthRow.classList.add('wand-table'); 
			var lengthCell = lengthRow.insertCell(1); 
			var lengthText = potterCharacter.wand.length + ' in'; 
			if (lengthText === ' in') {
				lengthText = 'Length Unknown';
			} 
			lengthCell.innerText = lengthText; 	

		} 
		wandHeaderRow.innerText = wandHeaderText;




		var modalImage = document.createElement('IMG'); 
		modalImage.classList.add('character-picture');
		modalImage.src = potterCharacter.imageUrl;
		var modalImageDiv = document.createElement('div'); 
		modalImageDiv.classList.add('modal-image-div')
		modalImageDiv.appendChild(modalImage);

		modal.appendChild(closeButton); 
		modal.appendChild(modalTitle);
		modalBodyDiv.appendChild(modalImageDiv);
		modalBodyDiv.appendChild(modalSpeciesPatronusTablesDiv); 
		modalBodyDiv.appendChild(modalTableDiv); 
		modal.appendChild(modalBodyDiv);
		

		$modalContainer.appendChild(modal);

		// Display the modal after all content has been set 
		$modalContainer.classList.add('is-visible');  
	}  


	function hideModal() {
		document.querySelector('#modal-container').classList.remove('is-visible');
	}

	// Add a listener that will close the modal if the user presses the escape button
	window.addEventListener('keydown', (e) => {
		var $modalContainer = document.querySelector('#modal-container');
		if (e.key === 'Escape' && $modalContainer.classList.contains('is-visible')) {
			hideModal();  
		}
	}); 

	// Have an animation that moves the list from the center to the left when clicking a character 
	// function moveListLeft() {
	// 	var pos = listPosition.left;
	// 	var id = setInterval(frame, 1);
	// 	function frame() {
	// 		if (pos == 0) {
	// 			clearInterval(id);
	// 		} else {
	// 			pos--;
	// 			list.style.left = pos + 'px';
	// 		}
	// 	}
	// }

	return {
		add: add,
		getAll: getAll,
		addListItem: addListItem, 
		loadList: loadList
	};
})(); 


var potterCharacterLoadingMessage = document.createElement('p'); 
potterCharacterLoadingMessage.innerText = 'Loading...'; 
potterCharacterLoadingMessage.classList.add('loading-message');
var potterCharacterTitle = document.getElementById('title'); 
potterCharacterTitle.appendChild(potterCharacterLoadingMessage); 
var potterCharacterList = document.querySelector('.potter-list'); 

potterCharacterRepository.loadList().then(()=>{
  // Data loaded successfully
	potterCharacterRepository.getAll().forEach((potterCharacter)=>{
  		potterCharacterRepository.addListItem(potterCharacter);
  }); 
	potterCharacterTitle.removeChild(potterCharacterLoadingMessage);
});  

var list = document.getElementById('list'); 
var listHeight = list.getBoundingClientRect().top - list.getBoundingClientRect().bottom;
var titleHeight = document.getElementById('title').scrollHeight; 
console.log(list.getBoundingClientRect().top + ' ' + list.getBoundingClientRect().bottom);
var win = window,
    doc = document,
    docElem = doc.documentElement,
    body = doc.getElementsByTagName('body')[0],
    x = win.innerWidth || docElem.clientWidth || body.clientWidth,
    y = win.innerHeight|| docElem.clientHeight|| body.clientHeight;
list.style.right = x/2 +'px'; 


document.body.style.backgroundImage = 'url(img/hogwarts-express-painting-27.jpg)';
document.body.style.backgroundRepeat = 'no-repeat';
document.body.style.backgroundSize = x+'px '+ (listHeight+titleHeight)+'px';


