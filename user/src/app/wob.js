function synapseThrow() 
{
	console.log("throw");
	 window.addEventListener('load', function() {
		 $('label input[type=radio]').click(function() {
			  $('input[name="' + this.name + '"]').each(function(){
			       $(this.parentNode).toggleClass('activee', this.checked);
			  });
			});
	 });
	 
}