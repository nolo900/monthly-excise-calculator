$(document).ready(
		writeTodaysDate()
		// console.log("test")

	);


$('.input-group.date').datepicker({
    format: "mm/yyyy",
    startView: 1,
    minViewMode: 1,
    maxViewMode: 2,
    clearBtn: true
		});	


function writeTodaysDate(){
		$("#todayDate").val(moment().format("d-MMM-YYYY"));
	}


$("#grossSales").keyup(function(){
	recalculateFields()
});

function reportMonthChangeHandler(){
	$("#grossSales").keyup();
}

function recalculateFields(){
	calculateTaxDue();
	calculateVendorCompensation();
	calculateTotalTaxes();
	calculatePenalty();
	calculateInterest();
	calculateTotalDue()
}

function pastCutoff(){
	var cutoffDate = moment(Date.parse($("#reportMonth").val()));
	cutoffDate.add(1,'month').add(19, 'days');	

	if (+moment($('#todayDate').val()) <= +cutoffDate){
		return false;
	} else {
		return true;
	}
	
}

function calculateTaxDue(){
	$("#taxDue").val(accounting.toFixed( (.03 * parseFloat($("#grossSales").val())) ,2));
}

function calculateVendorCompensation(){
	if (pastCutoff()) {
		$("#vendorCompensation").val(accounting.toFixed(0,2));
 	} else {
 		var val = parseFloat($("#taxDue").val()) * .03;
 		$("#vendorCompensation").val(accounting.toFixed(val,2));
 	}
}

function calculateTotalTaxes(){
	var val = parseFloat($("#taxDue").val()) - 
			  parseFloat($("#vendorCompensation").val());
	$("#totalTaxes").val(accounting.toFixed(val,2));
}

function calculatePenalty(){
	if (pastCutoff()){
		var val1 = accounting.toFixed(parseFloat($("#taxDue").val()) * 0.03,2);
		var val2 = 100;
		var final = 0;

		if (val1 > val2){
			final = val1;
		} else {
			final = val2;
		}

		$("#penalty").val(final);

	} else{
		$("#penalty").val(accounting.toFixed(0,2));
	}
}

function calculateInterest(){
	var today = moment(Date.parse($('#todayDate').val()));
	var monthCutoff = moment(Date.parse($("#reportMonth").val())).add(1,'months');

	var monthsLate = today.diff(monthCutoff, 'months');

	var interestPerMonth = 0.00542 * (parseFloat($("#taxDue").val()) + parseFloat($("#penalty").val()));
	var val = monthsLate * interestPerMonth;
	
	if (val > 0){
		$("#interest").val(accounting.toFixed(val,2));
	}

}

function calculateTotalDue(){
	var val = parseFloat($("#totalTaxes").val()) +
			parseFloat($("#penalty").val()) +
			parseFloat($("#interest").val());
	$("#totalDue").val(accounting.toFixed(val,2));
}
