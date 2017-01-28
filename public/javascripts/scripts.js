/* use JQUERY which we downloaded
find any html element with the class "confirmation"
attach a js confirmation popup to the click event of these html elements
 */

$('.confirmation').on('click', function(){

    return confirm('Are you sure you want to delete this?');

});


//password check on register form
var validator = $('#registrationForm').validate({
    rules: {
        confirm: {
            required: true,
            equalTo: '#password'
        }
    },
    messages: {
        confirm: {
            equalTo: 'Your passwords do not match'
        }
    }
});

/*-- This code is from https://datatables.net/ */
$(document).ready(function() {
    $('#itemtable').DataTable( {
        "paging":   false,
        "info":     true,
        "order": [[ 1, "asc" ]],
        "paging": true,
        "pageLength": 15,
        "lengthChange": false

    });
});
