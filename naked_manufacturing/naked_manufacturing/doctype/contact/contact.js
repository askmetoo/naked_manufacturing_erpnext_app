frappe.ui.form.on('Contact', {
	after_save(frm) {
		$.each(frm.doc.email_ids, function(idx, contact){
			frappe.call({
				method:"naked_manufacturing.naked_manufacturing.api.set_email_ids",
				args:{
					email_id:contact.email_id		
				},
				async:false,
				callback: function(r){
				}
		    	});
		})
	}
})
