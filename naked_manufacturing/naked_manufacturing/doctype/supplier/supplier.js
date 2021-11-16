frappe.ui.form.on('Supplier', {
onload: function(frm) {
		frm.list_route = "Tree/Supplier";

		//get query select item group
		frm.fields_dict['parent_supplier'].get_query = function(doc,cdt,cdn) {
			return{
				filters:[
					['Supplier', 'is_group', '=', 1],
					['Supplier', 'name', '!=', doc.supplier_name]
				]
			}
		}
},
before_save:function(frm){
	frappe.db.get_value('Supplier',frm.doc.parent_supplier,'parent_supplier',(s)=>{
		if (frm.doc.supplier_name==s.parent_supplier){
			frappe.validated = false;
			msgprint("Supplier cannot be added to its own descendants")
		}
	})
},
refresh:function(frm){
	frm.toggle_display(['contact_details_'], !frm.doc.__islocal);
	frappe.dynamic_link = {doc: frm.doc, fieldname: 'name', doctype: 'Supplier'}

		if(!frm.doc.__islocal) {
			unhide_field(['contact_details_']);
			frappe.contacts.render_address_and_contact(frm);
		} else {
			hide_field(['contact_details_']);
			frappe.contacts.clear_address_and_contact(frm);
		}
}
})
