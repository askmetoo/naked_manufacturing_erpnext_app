// Copyright (c) 2021, admin@gmail.com and contributors
// For license information, please see license.txt

frappe.ui.form.on('Supplier Report', {
	modified_report: function (frm) {
		if(frm.doc.modified_report!=""||frm.doc.modified_report!=undefined){
			frm.doc.doc_status="Processed"
			frm.refresh_field("doc_status")
		}
	},
	before_submit:function(frm){
		if((frm.doc.modified_report==""||frm.doc.modified_report==undefined)&&(frm.doc.original_report==""||frm.doc.original_report==undefined)){
			frappe.validated = false;
			msgprint("Original report and Modified report are mandatory")
		}
		else if(frm.doc.modified_report==""||frm.doc.modified_report==undefined){
			frappe.validated = false;
			msgprint("Modified report is mandatory")
		}
		else if(frm.doc.original_report==""||frm.doc.original_report==undefined){
			frappe.validated = false;
			msgprint("Original report is mandatory")
		}
	}
});
