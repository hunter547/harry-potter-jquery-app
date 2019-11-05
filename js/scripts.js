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
					patronus: character.patronus, 
					house: character.house, 
					gender: character.gender
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
		var potterCharacterListItem = $('<li class="list-group-item" id="'+potterCharacter.name.toLowerCase().replace(/\s/g,'')+'"></li>'); 
		var potterCharacterLIButton = $('<button class="btn btn-primary"'+' data-toggle="modal" data-target="#'+potterCharacter.name.toLowerCase().replace(/\s/g,'')+'1'+'">'
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
		// Create a modal div to go into the container 
		var modal = $('<div class="modal fade" id="'+potterCharacter.name.toLowerCase().replace(/\s/g,'')+'1'
			         +'" tabindex="-1" role="dialog" aria-labelledby="'+potterCharacter.name+'" aria-hidden="true"></div>'); 
		// Will close the modal container if the user clicks out side of the modal div
		modal.on('click',(e) => {
			var target = e.target; 
			if (target.id === modal[0].id) {
				moveListRight();
			}
		});
		var modalDialog = $('<div class="modal-dialog" role="document"></div>');  

		var modalContent = $('<div class="modal-content"></div>'); 
		var modalHeader = $('<div class="modal-header"></div>');
		$(modal).append(modalDialog); 
		$(modalDialog).append(modalContent);
		$(modalContent).append(modalHeader); 


		var modalTitle = $('<h5 class="modal-title" id="'+potterCharacter.name+'">'+potterCharacter.name+'</h5>'); 
		var modalClose = $('<button type="button" class="close" data-dismiss="modal" aria-label="Close">'
						  +'<span aria-hidden="true">&times;</span></button>'); 
		modalClose.on('click',moveListRight);

		$(modalHeader).append(modalTitle); 
		$(modalHeader).append(modalClose);

		// Main modal content div that all other divs will go into
		var modalBodyDiv = $('<div class="modal-body"></div>'); 


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

		// Screen Reader consideration for species and patronus information
		var modalSpeciesPatronusTablesSr = '<div class="sr-only">'+potterCharacter.name+' is a '+potterCharacter.species+' and '; 

		if (potterCharacter.gender==='female'){ 
			modalSpeciesPatronusTablesSr += 'her ';
		} 
		else {
			modalSpeciesPatronusTablesSr += 'his ';
		}

		if (potterCharacter.patronus===''){		
			modalSpeciesPatronusTablesSr += 'patronus animal is unknown.</div>';
		} 
		else {
			modalSpeciesPatronusTablesSr += 'patronus animal is a '+potterCharacter.patronus+'.</div>'
		} 
		modalSpeciesPatronusTablesSr = $(modalSpeciesPatronusTablesSr);
		$(modalSpeciesPatronusTablesDiv).append(modalSpeciesPatronusTablesSr);

		// Wand table creation
		var modalTableDiv = $('<div class="modal-table-div"></div>')[0];
		var modalWandTable = $('<table class="wand-table"></table>')[0];
		$(modalTableDiv).append(modalWandTable); 
		var modalWandTblHead = modalWandTable.createTHead(); 
		$(modalWandTblHead).addClass('wand-header');
		var wandHeaderRow = modalWandTblHead.insertRow(0); 
		
		var wandHeaderText = 'Wand Unknown'; 

		// Set up a div for screen readers
		var wandSrDiv = '<div class="sr-only">'+potterCharacter.name+'\'s ';

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
			wandSrDiv += 'wand is made of '+ woodText;
			


			// Wand Core Table Content
			var coreRow = modalWandTable.insertRow(2); 
			var coreLabel = coreRow.insertCell(0); 
			$(coreLabel).text('Core: ');
			$(coreRow).addClass('wand-table');
			var coreCell = coreRow.insertCell(1); 
			var coreText = potterCharacter.wand.core.charAt(0).toUpperCase() + potterCharacter.wand.core.slice(1);
			if (coreText === '') {
				coreText = 'Core Unknown'; 
				wandSrDiv += ', has a unknown core';
			}
			else {
				$(coreCell).text(coreText); 
				wandSrDiv += ', has a core of '+ coreText;
			}

			



			// Wand Length Table Content
			var lengthRow = modalWandTable.insertRow(3); 
			var lengthLabel = lengthRow.insertCell(0); 
			$(lengthLabel).text('Length: ');
			$(lengthRow).addClass('wand-table'); 
			var lengthCell = lengthRow.insertCell(1); 
			var lengthText = potterCharacter.wand.length + ' in'; 
			if (lengthText === ' in') {
				lengthText = 'Length Unknown'; 
				wandSrDiv +=', and an unknown length.</div>';
			} 
			else {
				$(lengthCell).text(lengthText); 
				wandSrDiv +=', and a length of '+ lengthText+'.</div>';
			}		

		} 
		else {
			wandSrDiv = wandSrDiv.substring(0, wandSrDiv.length-3) + ' has no wand or it\'s unknown.</div>';
		}
		$(wandHeaderRow).text(wandHeaderText); 

		// Screen reader consideration for wand information 
		wandSrDiv = $(wandSrDiv);
		$(modalTableDiv).append(wandSrDiv);

		// Create a div for the character's image
		var modalImage = $('<img class="character-picture" src="'+ potterCharacter.imageUrl+'">'); 
		var modalSrImage = $('<div class="sr-only">Image of '+potterCharacter.name+'</div>');
		var modalImageDiv = $('<div class="modal-image-div"></div>'); 
		$(modalImageDiv).append(modalImage); 
		$(modalImageDiv).append(modalSrImage);

		// Append the image, patronus table, species table, and wand table to the main modal body div
		$(modalBodyDiv).append(modalImageDiv); 
		$(modalBodyDiv).append(modalSpeciesPatronusTablesDiv); 
		$(modalBodyDiv).append(modalTableDiv); 

		// Append the modal body to the modal content div
		$(modalContent).append(modalBodyDiv); 

		// Create a footer div and append it with a close button 
		var modalFooter = $('<div class="modal-footer"></div>'); 
		var modalCloseButton =  $('<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>'); 
		$(modalCloseButton).on('click',moveListRight);
		$(modalFooter).append(modalCloseButton); 
		$(modalContent).append(modalFooter); 

		switch (potterCharacter.house) {
			case 'Gryffindor': 
				modalHeader[0].style.borderLeft = '1rem solid rgb(127,9,9)';
				modalHeader[0].style.borderRight = '1rem solid rgb(127,9,9)'; 
				modalHeader[0].style.background = 'rgba(127,9,9,.2)';
				modalBodyDiv[0].style.borderLeft = '1rem solid rgb(255,197,0)';
				modalBodyDiv[0].style.borderRight = '1rem solid rgb(255,197,0)'; 
				modalBodyDiv[0].style.background = 'rgba(255,197,0,.2)';
				break; 
			case 'Slytherin': 
				modalHeader[0].style.borderLeft = '1rem solid rgb(13,98,23)';
				modalHeader[0].style.borderRight = '1rem solid rgb(13,98,23)'; 
				modalHeader[0].style.background = 'rgba(13,98,23,.2)';
				modalBodyDiv[0].style.borderLeft = '1rem solid rgb(170,170,170)';
				modalBodyDiv[0].style.borderRight = '1rem solid rgb(170,170,170)'; 
				modalBodyDiv[0].style.background = 'rgba(170,170,170,.2)';
				break; 
			case 'Hufflepuff': 
				modalHeader[0].style.borderLeft = '1rem solid rgb(238,225,23)';
				modalHeader[0].style.borderRight = '1rem solid rgb(238,225,23)'; 
				modalHeader[0].style.background = 'rgba(238,225,23,.2)';
				modalBodyDiv[0].style.borderLeft = '1rem solid rgb(0,0,0)';
				modalBodyDiv[0].style.borderRight = '1rem solid rgb(0,0,0)'; 
				modalBodyDiv[0].style.background = 'rgba(0,0,0,.2)';
				break;
			case 'Ravenclaw':
				modalHeader[0].style.borderLeft = '1rem solid rgb(0,10,144)';
				modalHeader[0].style.borderRight = '1rem solid rgb(0,10,144)'; 
				modalHeader[0].style.background = 'rgba(0,10,144,.2)';
				modalBodyDiv[0].style.borderLeft = '1rem solid rgb(148,107,45)';
				modalBodyDiv[0].style.borderRight = '1rem solid rgb(148,107,45)'; 
				modalBodyDiv[0].style.background = 'rgba(148,107,45,.2)';
				break;
		}


		$('body').append(modal); 
	}  

	// Add a listener that will close the modal if the user presses the escape button
	$(window).on('keydown', (e) => {
		if (e.key === 'Escape') {
			moveListRight();
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
var potterCharacterList = $('.list-group'); 

potterCharacterRepository.loadList().then(()=>{
  // Data loaded successfully
	potterCharacterRepository.getAll().forEach((potterCharacter)=>{
  		potterCharacterRepository.addListItem(potterCharacter);
  }); 
	$(potterCharacterLoadingMessage).remove(); 
	backgroundResizer();	
});  



$('<input type="text" id="search" class="search-box" placeholder="Search for names..." title="Look for a Harry Potter character">').insertAfter($('#title')); 

$('#search').keyup(filterList); 
var list = $('#list')[0]; 
var searchBox = $('#search')[0]; 
searchBox.focus();
listMover(); 

function filterList() {
	var textValue = $('#search')[0].value.toUpperCase();
	$.each(potterCharacterRepository.getAll(),(k,v) => {
		var stringToMatch = v.name.substring(0, textValue.length).toUpperCase(); 
		if (textValue === stringToMatch) {
			$('#'+v.name.toLowerCase().replace(/\s/g,''))[0].style.display = '';
		} 
		else {
			$('#'+v.name.toLowerCase().replace(/\s/g,''))[0].style.display = 'none';
		}
	})
};


$(window).on('resize', listMover); 

function listMover() { 
	docWidth = window.innerWidth || $('body')[0].clientWidth; 
	searchBox.style.left = docWidth*.80 +'px'; 
	searchBox.style.top = '98px'

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