frappe.ui.form.on('Item', {
	gsm_field: function (frm) {
		validate_min_max_value(frm)
	},
	before_save: function (frm) {
		validate_min_max_value(frm)
		validate_fiber_percentage(frm.doc.fiber_type_details)
		validate_total_fiber_percentage(frm.doc.fiber_type_details)
	}
})

frappe.ui.form.on('Product Details', {
	fiber_:function(frm,cdt,cdn){
		validate_fiber_percentage(frm.doc.fiber_type_details)
	}
})

function validate_min_max_value(frm) {
	if (frm.doc.gsm_field < 0 || frm.doc.gsm_field > 1000) {
		frappe.validated = false;
		msgprint("GSM field value should be greater than 0 and less than 1000.")
	}
}

function validate_fiber_percentage(items){
	$.each(items,function(idx,item){
		if(item.fiber_<0 ||item.fiber_>100){
			frappe.validated = false;
			msgprint("Fiber percentage should be greater than 0 and less than 100")
		}
	});
}
function validate_total_fiber_percentage(items){
	var sum_fiber_percent=0
	$.each(items,function(idx,item){
		console.log(item.fiber_)
		sum_fiber_percent+=item.fiber_
	})
	if(sum_fiber_percent!=100){
		frappe.validated = false;
		msgprint("Total Fiber Percentage should be equal to 100")
	}
}