var parent_supplier;
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
	},
	refresh: function (frm) {
		if (!frm.doc.__islocal) {
			parent_supplier = frm.doc.parent_supplier
			frappe.call({
				method: "naked_manufacturing.naked_manufacturing.doctype.supplier.supplier.onload",
				args: {
					doc: frm.doc.name
				},
				async: false,
				callback: function (r) {
					frm.set_df_property('contacts_details_', 'options', r.message)
					refresh_field("contacts_details_");
				}
			});
		}
	},
	parent_supplier: function (frm) {
		if (frm.doc.parent_supplier != parent_supplier) {
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
	}
})
