// An Immediately Invoked Function Expression to instantiate a potterCharacter repository and protect it from being accessed globally
var potterCharacterRepository = (function () {
	var repository = []; 
	var apiUrl = 'http://hp-api.herokuapp.com/api/characters/';

	// Add new potterCharacter to the repository
	function add(potterCharacter) {
		repository.push(potterCharacter);
	} 

	function loadList() {
		return $.ajax(apiUrl,{ dataType: 'json' }).then(function (json) {
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
		var potterCharacterListItem = $('<li></li>'); 
		var potterCharacterLIButton = $('<button class="potter-character-buttons">'
										+potterCharacter.name+'</button>');
		$(potterCharacterListItem).append(potterCharacterLIButton); 
		$(potterCharacterList).append(potterCharacterListItem); 
		addPotterCharacterListener(potterCharacterLIButton, potterCharacter);
	}  

	// Creates event listeners for the buttons as they are being created.
	function addPotterCharacterListener (button, potterCharacter) {
		$(button).on('click', function() {
			showModal(potterCharacter); 
			moveListLeft();
		});
	} 

	// MODALS

	function showModal(potterCharacter) {
		var $modalContainer = $('#modal-container')[0]; 
		// Clear any existing text if being used again. 
		$($modalContainer).empty(); 

		// Will close the modal container if the user clicks out side of the modal div 
		$($modalContainer).on('click', (e) => {
		 	var target = e.target;
		  	if (target === $modalContainer) {
		  		hideModal();
			}
		}); 

		// Create a modal div to go into the container 
		var modal = $('<div class="modal"></div>');

		// Give the modal a close button and title  
		var closeButton = $('<button class="modal-close">Close</button>');
		$(closeButton).on('click', hideModal);

		var modalTitle = $('<h1>'+potterCharacter.name+'</h1>'); 

		// Main modal content div that all other divs will go into
		var modalBodyDiv = $('<div class="modal-body-div"></div>'); 

 		// Create a div that the species and patronus data will go into
		var modalSpeciesPatronusTablesDiv = $('<div class="modal-body-text-div"></div>'); 

		// Species data table
		var modalSpeciesTable = $('<table class="species-table"></table>');
		$(modalSpeciesPatronusTablesDiv).append(modalSpeciesTable); 
		var modalSpeciesHeader = modalSpeciesTable[0].createTHead(); 
		$(modalSpeciesHeader).addClass('species-header'); 
		var speciesHeaderRow = modalSpeciesHeader.insertRow(0); 
		$(speciesHeaderRow).text('Species'); 
		var speciesRow = modalSpeciesTable[0].insertRow(1); 
		var speciesCell = speciesRow.insertCell(0); 
		$(speciesCell).text(potterCharacter.species.charAt(0).toUpperCase() + potterCharacter.species.slice(1)); 

		// Patronus data table 
		var modalPatronusTable = $('<table class="patronus-table"></table>');
		$(modalSpeciesPatronusTablesDiv).append(modalPatronusTable); 
		var modalPatronusHeader = modalPatronusTable[0].createTHead(); 
		$(modalPatronusHeader).addClass('patronus-header'); 
		var patronusHeaderRow = modalPatronusHeader.insertRow(0); 
		$(patronusHeaderRow).text('Patronus'); 
		var patronusRow = modalPatronusTable[0].insertRow(1); 
		var patronusCell = patronusRow.insertCell(0); 
		$(patronusCell).text(potterCharacter.patronus.charAt(0).toUpperCase() + potterCharacter.patronus.slice(1)); 
		if (potterCharacter.patronus === '') {
			$(patronusCell).text('Unknown');
		}

		
		var modalTableDiv = $('<div class="modal-table-div"></div>')[0];
		var modalWandTable = $('<table class="wand-table"></table>')[0];
		$(modalTableDiv).append(modalWandTable); 
		var modalWandTblHead = modalWandTable.createTHead(); 
		$(modalWandTblHead).addClass('wand-header');
		var wandHeaderRow = modalWandTblHead.insertRow(0); 
		
		var wandHeaderText = 'Wand Unknown'; 

		if (potterCharacter.wand.wood > '') {
			 
			
			wandHeaderText = 'Wand'; 

			// Wand Wood Table Content
			var woodRow =  modalWandTable.insertRow(1);
			var woodLabel = woodRow.insertCell(0); 
			$(woodLabel).text('Wood: '); 
			$(woodRow).addClass('wand-table'); 
			var woodCell = woodRow.insertCell(1); 
			var woodText = potterCharacter.wand.wood.charAt(0).toUpperCase() + potterCharacter.wand.wood.slice(1);
			$(woodCell).text(woodText); 
			


			// Wand Core Table Content
			var coreRow = modalWandTable.insertRow(2); 
			var coreLabel = coreRow.insertCell(0); 
			$(coreLabel).text('Core: ');
			$(coreRow).addClass('wand-table');
			var coreCell = coreRow.insertCell(1); 
			var coreText = potterCharacter.wand.core.charAt(0).toUpperCase() + potterCharacter.wand.core.slice(1);
			if (coreText === '') {
				coreText = 'Core Unknown';
			}
			$(coreCell).text(coreText); 
			



			// Wand Length Table Content
			var lengthRow = modalWandTable.insertRow(3); 
			var lengthLabel = lengthRow.insertCell(0); 
			$(lengthLabel).text('Length: ');
			$(lengthRow).addClass('wand-table'); 
			var lengthCell = lengthRow.insertCell(1); 
			var lengthText = potterCharacter.wand.length + ' in'; 
			if (lengthText === ' in') {
				lengthText = 'Length Unknown';
			} 
			$(lengthCell).text(lengthText); 	

		} 
		$(wandHeaderRow).text(wandHeaderText);




		var modalImage = $('<img class="character-picture" src="'+ potterCharacter.imageUrl+'">')
		var modalImageDiv = $('<div class="modal-image-div"></div>');
		$(modalImageDiv).append(modalImage);

		$(modal).append(closeButton); 
		$(modal).append(modalTitle);
		$(modalBodyDiv).append(modalImageDiv);
		$(modalBodyDiv).append(modalSpeciesPatronusTablesDiv); 
		$(modalBodyDiv).append(modalTableDiv); 
		$(modal).append(modalBodyDiv);
		

		$($modalContainer).append(modal);

		// Display the modal after all content has been set 
		$($modalContainer).addClass('is-visible');
	}  


	function hideModal() { 
		$('#modal-container').removeClass('is-visible'); 
		moveListRight();
	}

	// Add a listener that will close the modal if the user presses the escape button
	$(window).on('keydown', (e) => {
		var $modalContainer = $('#modal-container');
		if (e.key === 'Escape' && $($modalContainer.hasClass('is-visible'))) {
			hideModal();
		}
	}); 

	// Have an animation that moves the list from the center to the left when clicking a character 
	function moveListLeft() {
		var pos = list.getBoundingClientRect().left;
		var id = setInterval(frame, 1);
		function frame() {
			if (pos < 100) {
				clearInterval(id);
			} else {
				pos -= 20;
				list.style.left = pos + 'px';
			}
		}
	} 

	// Have an animation that moves the list from the left to the center after closing a modal
	function moveListRight() { 
		var currentWidth = getDocWidth(); 
		var middlePosition = Math.round(currentWidth*.42);
		var pos = Math.round(list.getBoundingClientRect().left); 
		var id = setInterval(frame, 1); 
		function frame() { 
			if (pos == middlePosition) {
				clearInterval(id);
			}
			else if (pos <= (middlePosition-20)) { 
				pos += 20;
				list.style.left = pos + 'px';
			} 
			else if (pos <= (middlePosition-10)) {
				pos += 10;
				list.style.left = pos + 'px';
			} 
			else if (pos <= (middlePosition-5)) {
				pos+=5; 
				list.style.left = pos + 'px';
			}  
			else {
				pos ++; 
				list.style.left = pos + 'px';
			}
		}
	}

	return {
		add: add,
		getAll: getAll,
		addListItem: addListItem, 
		loadList: loadList
	};
})(); 


var potterCharacterLoadingMessage = $('<p class="loading-message">Loading...</p>');
var potterCharacterTitle = $('#title'); 
$(potterCharacterTitle).append(potterCharacterLoadingMessage); 
var potterCharacterList = $('.potter-list'); 

potterCharacterRepository.loadList().then(()=>{
  // Data loaded successfully
	potterCharacterRepository.getAll().forEach((potterCharacter)=>{
  		potterCharacterRepository.addListItem(potterCharacter);
  }); 
	$(potterCharacterLoadingMessage).remove(); 
	backgroundResizer();	
});  


var list = $('#list')[0];
listMover();
    


$(window).on('resize', listMover); 

function listMover() { 
	docWidth = window.innerWidth || $('body')[0].clientWidth; 
	// If a modal is open and the window is resized, keep the list to the left
	if ($('#modal-container').hasClass('is-visible')) {
		list.style.left = '100 px';
	} 
	// Else if the modal is closed and the window is resized, keep the list in the middle of the screen
	else {
		list.style.left = docWidth*.42+'px'; 
	}
}; 

function getDocWidth() {
	return window.innerWidth||
		   $('body')[0].clientWidth;
}; 

// Resizes the background image based on the height of list and the html
function backgroundResizer() {
	var listHeight = list.getBoundingClientRect().height; 
	var htmlHeight = $('html')[0].getBoundingClientRect().height; 
	var totalHeight = listHeight + htmlHeight
	$('body')[0].style.backgroundSize = 'auto '+ totalHeight +'px';
}

$('body')[0].style.backgroundImage = 'url(img/hogwarts-express-painting-27.jpg)';
$('body')[0].style.backgroundRepeat = 'no-repeat';