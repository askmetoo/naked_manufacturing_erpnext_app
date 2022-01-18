// Copyright (c) 2022, admin@gmail.com and contributors
// For license information, please see license.txt

frappe.ui.form.on('Supplier Product Settings', {
	onload: function (frm) {
		add_fields_to_mapping_table(frm);
	},
	refresh: function (frm) {
		add_fields_to_mapping_table(frm);
	},
	before_save: function (frm) {
		$.each(frm.doc.supplier_report_mapping, function (idx, supplier) {
			if (supplier.file_field == undefined || supplier.file_field == '') {
				frappe.validated = false;
				msgprint('Unable to save the details.Please provide the column number in '+supplier.field_in_supplier_products)
			}
		})
	}

});

let add_fields_to_mapping_table = function (frm) {
	let options = [];
	frappe.model.with_doctype("Supplier Products", function () {
		let meta = frappe.get_meta("Supplier Products");
		meta.fields.forEach(value => {
			if (!["Section Break", "Column Break"].includes(value.fieldtype)) {
				options.push(value.fieldname);
			}
		});
	});
	frm.fields_dict.supplier_report_mapping.grid.update_docfield_property(
		'field_in_supplier_products', 'options', options
	);
};
