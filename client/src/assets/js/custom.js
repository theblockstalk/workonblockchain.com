//file label js. here....upload image
window.pressed = function(){
    var a = document.getElementById('aa');
    if(a.value == "")
    {
        fileLabel.innerHTML = "Choose file";
    }
    else
    {
        var theSplit = a.value.split('\\');
        fileLabel.innerHTML = theSplit[theSplit.length-1];
    }
};



//acitve radio button js.....
/*
	$('label input[type=radio]').click(function() {
  $('input[name="' + this.name + '"]').each(function(){
       $(this.parentNode).toggleClass('activee', this.checked);
  });
});
*/

$('input:radio').click(function() {
        $('label:has(input:radio:checked)').addClass('activee');
        $('label:has(input:radio:not(:checked))').removeClass('activee');
    });

$('#new-radio:radio').click(function() {
        $('label:has(#new-radio:radio:checked)').addClass('activeee');
        $('label:has(#new-radio:radio:not(:checked))').removeClass('activeee');
    });
$('#new-radio1:radio').click(function() {
        $('label:has(#new-radio1:radio:checked)').addClass('activeee');
        $('label:has(#new-radio1:radio:not(:checked))').removeClass('activeee');
    });



//change text and copy text funciton ....

$("#example-one").on("click", function() {
	  var el = $(this);
	  el.text() == el.data("text-swap") 
	    ? el.text(el.data("text-original")) 
	    : el.text(el.data("text-swap"));
	});

	function copyToClipboard(element) {
	  var $temp = $("<input>");
	  $("body").append($temp);
	  $temp.val($(element).text()).select();
	  document.execCommand("copy");
	  $temp.remove();
	}



//hide step when click checkbox....


/*$(function () {
    $('#1step').change(function () {
        if ($('#1step').is(':checked')) {
            $("#input_field").hide();
        } else {
            $("#input_field").show();
        }
    }).change();
});*/


//show hide password
		$(".toggle-password").click(function() {

		  $(this).toggleClass("fa-eye fa-eye-slash");
		  var input = $($(this).attr("toggle"));
		  if (input.attr("type") == "password") {
		    input.attr("type", "text");
		  } else {
		    input.attr("type", "password");
		  }
		});
		

//scroll to top js....


				$(document).ready(function(){
	
				//Check to see if the window is top if not then display button
				$(window).scroll(function(){
					if ($(this).scrollTop() > 100) {
						$('#scroll-to-top').fadeIn();
					} else {
						$('#scroll-to-top').fadeOut();
					}
				});
				
				//Click event to scroll to top
				$('#scroll-to-top').click(function(){
					$('html, body').animate({scrollTop : 0},800);
					return false;
				});
				
			});

//add class active on side_bar

$(function() {
      $( '.side_bar ul li' ).on( 'click', function() {
            $( this ).parent().find( 'li.activee' ).removeClass( 'activee' );
            $( this ).addClass( 'activee' );
      });
});

//date picker
/*$( function() {
    $( "#datepicker" ).datepicker();
  } );

$( function() {
    $( "#datepicker_b" ).datepicker();
  } );
*/

// select javascript here   

$(document).ready(function(){
  var $progControl = $(".progControlSelect0").select2({
        placeholder: "Skills"//placeholder
    });
})

$(document).ready(function(){
  var $progControl = $(".progControlSelect1").select2({
        placeholder: "Desired Location"//placeholder
    });
})

$(document).ready(function(){
  var $progControl = $(".progControlSelect2").select2({
        placeholder: "Position"//placeholder
    });
})

$(document).ready(function(){
  var $progControl = $(".progControlSelect3").select2({
        placeholder: "Blockchain experience"//placeholder
    });
})

$(document).ready(function(){
  var $progControl = $(".progControlSelect4").select2({
        placeholder: "Availablity"//placeholder
    });
})

        
  //pannel icon function

// alert on checkBox checked...
  
function myFunction() {
  // Get the checkbox
  var checkBox = document.getElementById("myCheck");
  // Get the output text
  var text = document.getElementById("text1");

  // If the checkbox is checked, display the output text
  if (checkBox.checked == true){
    text1.style.display = "block";
  } else {
    text1.style.display = "none";
  }
  
  if (checkBox.checked == false){
    text2.style.display = "block";
  } else {
    text2.style.display = "none";
  }
}


$(function() {
  $('.link').click(function() {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
      if (target.length) {
        $('#message_body').animate({
          scrollTop: $('#container').scrollTop() + target.offset().top
        }, 500);
        return false;
      }
    }
  });
});



  