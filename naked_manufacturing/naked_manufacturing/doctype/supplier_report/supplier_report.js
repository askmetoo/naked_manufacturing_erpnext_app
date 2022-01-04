// Copyright (c) 2021, admin@gmail.com and contributors
// For license information, please see license.txt

frappe.ui.form.on('Supplier Report', {
	modified_report: function (frm) {
		if(frm.doc.modified_report){
			var modified=frm.doc.modified_report.lastIndexOf(".");  
			var original=frm.doc.original_report.lastIndexOf("."); 
			if((frm.doc.modified_report.slice(modified + 1))!=(frm.doc.original_report.slice(original + 1))){
				frappe.validated = false;
				frm.doc.modified_report=''
				frm.refresh_field('modified_report')
				msgprint("Original report and Modified report file extension should be same.")
			}

		}
		if(frm.doc.modified_report!=""){
			frm.doc.status="Processed"
			frm.refresh_field("status")
		}
	}
});
