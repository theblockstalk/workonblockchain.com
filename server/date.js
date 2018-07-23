var current_date = new Date();
	var day = current_date.getDate();
	if(day < 10){
		day = '0'+day;
	}
	var month = current_date.getMonth();
	month = month+1;
	if(month < 10){
		month = '0'+month;
	}
	var year = current_date.getFullYear();
	var hours = current_date.getHours();
	if(hours < 10){
		hours = '0'+hours;
	}
	var minutes = current_date.getMinutes();
	if(minutes < 10){
		minutes = '0'+minutes;
	}
	var seconds = current_date.getSeconds();
	if(seconds < 10){
		seconds = '0'+seconds;
	}
	var my_date = day+'/'+month+'/'+year+' '+hours+':'+minutes+':'+seconds;
	console.log(my_date);