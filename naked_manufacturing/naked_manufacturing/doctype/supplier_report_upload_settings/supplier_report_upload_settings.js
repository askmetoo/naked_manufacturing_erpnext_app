// Copyright (c) 2022, admin@gmail.com and contributors
// For license information, please see license.txt
let options = [];
frappe.ui.form.on('Supplier Report Upload Settings', {
	onload: function (frm) {
		add_fields_to_mapping_table(frm);
	},
	before_save: function (frm) {
		$.each(frm.doc.supplier_report_mapping, function (idx, supplier) {
			console.log(supplier.file_field)
			if (supplier.file_field == undefined || supplier.file_field == '') {
				frappe.validated = false;
				msgprint('Unable to save the details.Please provide the column number in ' + supplier.field_in_supplier_products)
			}
		})
	},
	supplier_id: function (frm) {
		if (frm.doc.supplier_id != undefined) {
			add_fields_to_mapping_table(frm);
			if (frm.doc.product_identifier == 'Template and Variant ID') {
				$.each(options, function (idx, field) {
					if (!['product_identifier', 'unique_id'].includes(field)) {
						var child = cur_frm.add_child("supplier_report_mapping");
						frappe.model.set_value(child.doctype, child.name, "field_in_supplier_products", field);
						cur_frm.refresh_field("supplier_report_mapping");
					}
				})
			}
			else if (frm.doc.product_identifier == 'Unique ID') {
				$.each(options, function (idx, field) {
					if (!['product_identifier', 'template_id', 'variant_id'].includes(field)) {
						var child = cur_frm.add_child("supplier_report_mapping");
						frappe.model.set_value(child.doctype, child.name, "field_in_supplier_products", field);
						cur_frm.refresh_field("supplier_report_mapping");
					}
				})
			}
		}

	}

});

let add_fields_to_mapping_table = function (frm) {

	frappe.model.with_doctype("Supplier Report Uploads", function () {
		let meta = frappe.get_meta("Supplier Report Uploads");
		meta.fields.forEach(value => {
			if (!["Section Break", "Column Break"].includes(value.fieldtype) && !options.includes(value.fieldname)) {
				options.push(value.fieldname);
			}
		});
	});
	frm.fields_dict.supplier_report_mapping.grid.update_docfield_property(
		'field_in_supplier_products', 'options', options
	);
};
