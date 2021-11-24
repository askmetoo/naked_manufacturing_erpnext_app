frappe.provide("naked_manufacturing.supplier");
var parent_supplier;
var report_manager;
frappe.ui.form.on('Supplier', {
	onload: function (frm) {
		frm.list_route = "Tree/Supplier";

		//get query select item group
		frm.fields_dict['parent_supplier'].get_query = function (doc, cdt, cdn) {
			return {
				filters: [
					['Supplier', 'is_group', '=', 1],
					['Supplier', 'name', '!=', doc.supplier_name]
				]
			}
		}
	},
	before_save: function (frm) {
		frappe.db.get_value('Supplier', frm.doc.parent_supplier, 'parent_supplier', (s) => {
			if (frm.doc.supplier_name == s.parent_supplier) {
				frappe.validated = false;
				msgprint("Supplier cannot be added to its own descendants")
			}
		})
		if (frm.doc.is_manager == 0) {
			frappe.call({
				method: "frappe.client.get_list",
				args: {
					doctype: "Supplier",
					fields: ["name"],
					filters: {
						'report_manager': frm.doc.supplier_name,
						'is_manager': 1
					},
					"limit_page_length": 0
				},
				callback: function (r) {
					if (r.message.length > 0) {
						frappe.validated = false;
						msgprint("Supplier " + frm.doc.supplier_name + " is a manager.Not able to change as member")
					}
				}
			})
		}
	},
	refresh: function (frm) {
		if (!frm.doc.__islocal) {
			parent_supplier = frm.doc.parent_supplier
			report_manager = frm.doc.report_manager
			frappe.call({
				method: "naked_manufacturing.naked_manufacturing.doctype.supplier.supplier.onload",
				args: {
					doc: frm.doc.name
				},
				async: false,
				callback: function (r) {
					if (r.length > 0) {
						frm.set_df_property('contacts_details_', 'options', r.message)
						//frm.set_df_property('line_break', 'options', r.message[1])
						//frm.set_df_property('line_break_1', 'options', r.message[1])
						frm.refresh_fields();
					}
				}
			});
			if (frm.doc.supplier_primary_contact != undefined) {
				frm.doc.coordinator_name = frm.doc.supplier_primary_contact
				frm.doc.cooridnator_email_id = frm.doc.email_id
				frm.refresh_fields()
			}
			if ((frm.doc.supplier_id != '' || frm.doc.supplier_id != undefined) && frm.doc.is_factory_location == 1) {
				update_factory_details(frm)
			}
		}
		frm.set_query("report_manager", function () {
			return {
				filters: {
					"is_manager": 1,
					"parent_supplier": frm.doc.parent_supplier
				}
			};
		});
	},
	parent_supplier: function (frm) {
		if (frm.doc.parent_supplier != parent_supplier && parent_supplier !== undefined) {
			frappe.call({
				method: "naked_manufacturing.naked_manufacturing.doctype.supplier.supplier.delete_child_supplier_details",
				args: {
					parent_supplier: parent_supplier,
					name: frm.doc.name
				},
				async: false,
				callback: function (r) {
				}
			})
		}
	},
	is_factory_location: function (frm) {
		update_factory_details(frm)
	},
	after_save: function (frm) {
		update_factory_details(frm)
		if (frm.doc.is_manager == 1) {
			frm.doc.report_manager = frm.doc.name
			frm.refresh_field("report_manager")
		}
	},
	is_manager: function (frm) {
		if (frm.doc.is_manager == 0 && frm.doc.is_factory_location == 0) {
			frm.doc.is_factory_location = 1
			frm.refresh_field("is_factory_location");
		}
	},
	supplier_primary_contact(frm) {
		update_product_fields(frm)
	},
	coordinator_name:function(frm){
		//frappe.dynamic_link = { doc: frm.doc, fieldname: 'coordinator_name', doctype: 'Supplier' }
	}
})

function update_product_fields(frm) {
	frm.doc.coordinator_name = frm.doc.supplier_primary_contact
	frm.doc.cooridnator_email_id = frm.doc.email_id
	frm.refresh_fields()
}

function update_factory_details(frm) {
	if(frm.doc.is_manager==0){
		frm.doc.is_factory_location = 1
		frm.refresh_field("is_factory_location");
	}
	if (frm.doc.is_factory_location == 0) {
		frm.doc.supplier_id = ''
		frm.refresh_field("supplier_id");
	}
	else if (!frm.doc.__islocal && frm.doc.is_factory_location == 1) {
		frm.doc.supplier_id = frm.doc.name
		frm.refresh_field("supplier_id");
	}
}