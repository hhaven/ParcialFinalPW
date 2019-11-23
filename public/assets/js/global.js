// Userlist data array for filling in info box
var userListData = [];

// DOM Ready =============================================================
$(document).ready(function() {

  // Populate the user table on initial page load
  populateTable();

});

// Functions =============================================================

// Fill table with data
function populateTable() {

  // Empty content string
  var tableContent = '';

  // jQuery AJAX call for JSON
  $.getJSON( '/songs', function( data ) {

    // For each item in our JSON, add a table row and cells to the content string
    $.each(data, function(){
      // Stick our user data array into a userlist variable in the global object

      tableContent += '<tr>';
      tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.songname + '">' + this.songname + '</a></td>';
      tableContent += '<td>' + this.songlink + '</td>';
      tableContent += '<td><a href="#" class="linkdeletesong" rel="' + this.songname + '">delete</a></td>';
      tableContent += '</tr>';
    });
      // Delete User link click
    $('#songList table tbody').on('click', 'td a.linkdeletesong', deleteSong);


      // Add User button click
    $('#btnAddSong').on('click', addSong);

    // Inject the whole content string into our existing HTML table
    $('#songList table tbody').html(tableContent);
  });
};
// Add User
function addSong(event) {
    event.preventDefault();
  
    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#addSong input').each(function(index, val) {
      if($(this).val() === '') { errorCount++; }
    });
  
    // Check and make sure errorCount's still at zero
    if(errorCount === 0) {
  
      // If it is, compile all user info into one object
      var newSong = {
        'songname': $('#addSong fieldset input#inputsongname').val(),
        'songlink': $('#addSong fieldset input#inputsonglink').val()
      }
  
      // Use AJAX to post the object to our addSong service
      $.ajax({
        type: 'POST',
        data: newSong,
        url: '/songs/',
        dataType: 'JSON'
      }).done(function( response ) {
  
        // Check for successful (blank) response
        if (response.msg === '') {
  
          // Clear the form inputs
          $('#addSong fieldset input').val('');
  
          // Update the table
          populateTable();
  
        }
        else {
  
          // If something goes wrong, alert the error message that our service returned
          alert('Error: ' + response.msg);

          // Update the table
          populateTable();
  
        }
      });
    }
    else {
      // If errorCount is more than 0, error out
      alert('Please fill in all fields');
      return false;
    }
  };

  // Delete Song
function deleteSong(event) {

    event.preventDefault();
  
    // Pop up a confirmation dialog
    var confirmation = confirm('Are you sure you want to delete this song?');
  
    // Check and make sure the user confirmed
    if (confirmation === true) {
  
      // If they did, do our delete
      $.ajax({
        type: 'DELETE',
        url: '/songs/' + $(this).attr('rel')
      }).done(function( response ) {
  
  
        // Update the table
        populateTable();
  
      });
  
    }
    else {
  
      // If they said no to the confirm, do nothing
      return false;
  
    }
  
  };