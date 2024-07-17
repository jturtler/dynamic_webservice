// script.js
$(document).ready(() => {
	const itemsList = $('#itemsList');
	const addItemForm = $('#addItemForm');
	const itemNameInput = $('#itemName');

	// Function to fetch items from the backend
	const fetchItems = () => {
		 $.get('/apiItem/items')
			  .done(data => displayItems(data))
			  .fail(error => console.error('Error fetching items:', error));
	};

	// Function to display items on the page
	const displayItems = items => {
		 itemsList.empty();
		 items.forEach(item => {
			  const li = $('<li>').text(item.name);
			  itemsList.append(li);
		 });
	};

	// Event listener for form submission to add a new item
	addItemForm.submit(event => {
		 event.preventDefault();
		 const itemName = itemNameInput.val();
		 if (!itemName) return;

		 console.log( 'itemName: ' + itemName );

		$.ajax( {
			type: 'POST',
			url: '/api/apiItem',
			dataType: 'json',
			data: {
				name: 'james',
				others: 'testing'
			},
			success: function() {
				fetchItems();
				itemNameInput.val('');
			}
		});

		/*
		 $.post('/api/items', { name: itemName } )
			  .done(() => {
					fetchItems();
					itemNameInput.val('');
			  })
			  .fail(error => console.error('Error adding item:', error));
			  */
	});

	// Fetch items when the page loads
	fetchItems();
});
