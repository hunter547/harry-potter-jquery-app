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

		var modalBodyDiv = document.createElement('div'); 
		modalBodyDiv.classList.add('modal-body-div');

		var modalBody = document.createElement('P'); 
		var modalBodyTextDiv = document.createElement('div'); 
		modalBodyTextDiv.classList.add('modal-body-text-div');
		modalBodyTextDiv.appendChild(modalBody);
		modalBody.innerText = 'Test';

		var modalWandTable = document.createElement('table'); 
		modalWandTable.classList.add('wand-table');
		var modalWandTblHead = document.createElement('th'); 
		modalWandTblHead.classList.add('wand-header');
		modalWandTblHead.innerText = 'Wand Unknown';
		if (potterCharacter.wand.wood > '') {
			modalWandTblHead.innerText = 'Wand: '; 
			var woodText = potterCharacter.wand.wood.charAt(0).toUpperCase() + potterCharacter.wand.wood.slice(1); 
			var coreText = potterCharacter.wand.core.charAt(0).toUpperCase() + potterCharacter.wand.core.slice(1);
			var lengthText = potterCharacter.wand.length + ' in';
			var woodRow =  modalWandTable.insertRow(0);
			var coreRow = modalWandTable.insertRow(1);
			var lengthRow = modalWandTable.insertRow(2); 
			var woodCell = woodRow.insertCell(0); 
			var coreCell = coreRow.insertCell(0); 
			var lengthCell = lengthRow.insertCell(0);
			woodRow.classList.add('wand-table'); 
			coreRow.classList.add('wand-table'); 
			lengthRow.classList.add('wand-table');
			woodCell.innerText = woodText; 
			if (coreText === '') {
				coreText = 'Core Unknown';
			} 
			coreCell.innerText = coreText;
			if (lengthText === ' in') {
				lengthText = 'Length Unknown';
			} 
			lengthCell.innerText = lengthText;
			modalWandTblHead.appendChild(woodRow); 
			modalWandTblHead.appendChild(coreRow); 
			modalWandTblHead.appendChild(lengthRow);
		} 

		modalWandTable.appendChild(modalWandTblHead);  

		var modalTableDiv = document.createElement('div'); 
		modalTableDiv.classList.add('modal-table-div'); 
		modalTableDiv.appendChild(modalWandTable);




		var modalImage = document.createElement('IMG'); 
		modalImage.src = potterCharacter.imageUrl;  
		modalImage.style.maxWidth = '150px';
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
		loadList: loadList
	};
})(); 

var potterCharacterList = document.querySelector('.potter-list'); 

var potterCharacterLoadingMessage = document.createElement('p'); 
potterCharacterLoadingMessage.innerText = 'Loading...'; 
potterCharacterLoadingMessage.classList.add('loading-message');
var potterCharacterTitle = document.getElementById('title'); 
potterCharacterTitle.appendChild(potterCharacterLoadingMessage); 

potterCharacterRepository.loadList().then(()=>{
  // Data loaded successfully
	potterCharacterRepository.getAll().forEach((potterCharacter)=>{
  		potterCharacterRepository.addListItem(potterCharacter);
  }); 
	potterCharacterTitle.removeChild(potterCharacterLoadingMessage);
});  


 