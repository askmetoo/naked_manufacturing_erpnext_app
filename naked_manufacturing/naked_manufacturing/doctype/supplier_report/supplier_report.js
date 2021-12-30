// Copyright (c) 2021, admin@gmail.com and contributors
// For license information, please see license.txt

frappe.ui.form.on('Supplier Report', {
	modified_report: function (frm) {
		if(frm.doc.modified_report!=""){
			frm.doc.status="Processed"
			frm.refresh_field("status")
		}
	}
});
