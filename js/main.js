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
	$("#todayDate").val(new Date.today().toString("d-MMM-yyyy"));
	};


$("#grossSales").keyup(function(){
	recalculateFields()
});


function pastCutoff(){
	var cutoffDate = Date.parse($("#reportMonth").val());
	cutoffDate.addMonths(1).add(19).days();

	if (+Date.today() <= +cutoffDate) {
		return false;
	} else {
		return true;
	}
}

function reportMonthChangeHandler(){
	$("#grossSales").keyup();
};


function recalculateFields(){
	calculateTaxDue()
	calculateVendorCompensation()
	calculateTotalTaxes()
	calculatePenalty()
	calculateInterest()
	calculateTotalDue()
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
	var monthCutoff = Date.parse($("#reportMonth").val()); 
	var monthsLate = monthDiff(monthCutoff,Date.parse($("#todayDate").val()));
	var interestPerMonth = 0.00542 * (parseFloat($("#taxDue").val()) + parseFloat($("#penalty").val()));
	var val = monthsLate * interestPerMonth;
	
	$("#interest").val(accounting.toFixed(val,2)); 
}

function calculateTotalDue(){
	var val = parseFloat($("#totalTaxes").val()) +
			parseFloat($("#penalty").val()) +
			parseFloat($("#interest").val())
	$("#totalDue").val(
			accounting.toFixed(val,2)
		);
}

function monthDiff(d1, d2) {
    var months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth() + 1;
    months += d2.getMonth();
    return months <= 0 ? 0 : months;
}

// function calculateTaxDue(){
// 	$("#taxDue").val(.03 * $("#grossSales").val());
// 	console.log("test")
// };



// $("vendorCompensation").val(function(){
// 	if(true){console.log("test")}
// });