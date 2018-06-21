//alert("wob js");

$('label input[type=radio]').click(function() {
    alert("function executed");
    //console.log("function executed");

    $('input[name="' + this.name + '"]').each(function(){
        $(this.parentNode).toggleClass('activee', this.checked);
    });
});

