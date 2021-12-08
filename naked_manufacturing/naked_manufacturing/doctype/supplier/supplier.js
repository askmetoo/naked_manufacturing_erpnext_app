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
		update_factory_details(frm)
		frm.get_field("individual_supplier_detail").grid.cannot_add_rows = true;
		refresh_field("individual_supplier_detail")
		frm.get_field("report_member_details").grid.cannot_add_rows = true;
		refresh_field("report_member_details")
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
						'report_manager': frm.doc.name,
					},
					"limit_page_length": 0
				},
				callback: function (r) {
					if (r.message.length > 0) {
						frappe.validated = false;
						msgprint("Unable to change " + frm.doc.supplier_name + " from member to manager. Please change the Report manager prior to Is Manager uncheck.")
					}
				}
			})
		}
	},
	refresh: function (frm) {
		parent_supplier = frm.doc.parent_supplier
		report_manager = frm.doc.report_manager
		render_template_contact(frm)
		add_filter_for_report_manager(frm)
		update_filter(frm)
		update_factory_details(frm)
		if(frm.doc.is_active_portal==0){
			if((frm.doc.username||frm.doc.password)!=undefined){
				frm.doc.username=undefined
				frm.doc.password=undefined
				frm.refresh_fields()
			}
		}
		var supplier = frm.doc.name
		if (!frm.doc.__islocal) {
			frappe.call({
				method: "naked_manufacturing.naked_manufacturing.doctype.supplier.supplier.get_root_supplier",
				args: {
					supplier: frm.doc.name
				},
				async: false,
				callback: function (r) {
					supplier = r.message
				}
			})
			frm.add_custom_button(__("Hierarchy"), function () {
				frappe.route_options = {
					"supplier_name": supplier
				};
				frappe.set_route("Tree", "Supplier");
			});
		}
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
		add_filter_for_report_manager(frm)
	},
	after_save: function (frm) {
		if (frm.doc.is_manager == 1) {
			frm.doc.report_manager = frm.doc.name
			frm.refresh_field("report_manager")
		}
		if (frm.doc.is_child == 1) {
			var name = frm.doc.name
			frappe.set_route('Form', 'Supplier', frm.doc.parent_supplier);
			window.location.reload();
			frappe.call({
				"method": "frappe.client.set_value",
				"async": false,
				"args": {
					"doctype": 'Supplier',
					"name": name,
					"fieldname": "is_child",
					"value": 0
				}
			});
		}
	},
	is_manager: function (frm) {
		if (frm.doc.is_manager == 0 && frm.doc.is_factory_location == 0) {
			frm.doc.is_factory_location = 1
			frm.refresh_field("is_factory_location");
		}
		if (frm.doc.is_manager == 0) {
			frm.doc.report_manager = ''
			frm.doc.product_lookup = ''
			frm.refresh_field("report_manager")
			frm.refresh_field("product_lookup")
		}
	},
	coordinator_name: function (frm) {
		if (frm.doc.coordinator_email != undefined) {
			frm.doc.coordinator_email = ''
			frm.refresh_field('coordinator_email')
		}
		if (frm.doc.coordinator_name != undefined) {
			update_filter(frm)
		}
	},
	is_factory_location: function (frm) {
		update_factory_details(frm)
	},

	supplier_name: function (frm) {
		update_filter(frm)
		add_filter_for_report_manager(frm)
	},
	report_manager: function (frm) {
		add_filter_for_report_manager(frm)
		if (frm.doc.report_manager != report_manager && report_manager !== undefined) {
			frappe.call({
				method: "naked_manufacturing.naked_manufacturing.doctype.supplier.supplier.delete_report_member_details",
				args: {
					report_manager: report_manager,
					name: frm.doc.name
				},
				async: false,
				callback: function (r) {
				}
			})
		}
	},
	new_supplier: function (frm) {
		var doc = frappe.model.get_new_doc('Supplier');
		doc.parent_supplier = frm.doc.name;
		doc.is_child = 1
		frappe.set_route('Form', 'Supplier', doc.name);
	}
})
function update_factory_details(frm) {
	if (frm.doc.is_manager == 0 || frm.doc.is_manager == undefined) {
		frm.doc.is_factory_location = 1
		frm.doc.is_manager = 0
		frm.refresh_field("is_factory_location");
	}
	else if (frm.doc.is_manager == 1 && frm.doc.is_factory_location == 0) {
		frm.doc.supplier_id = ''
		frm.refresh_field("supplier_id")
	}
}

function add_filter_for_report_manager(frm) {
	var supplier = []
	if (frm.doc.parent_supplier != undefined) {
		frappe.call({
			method: "naked_manufacturing.naked_manufacturing.doctype.supplier.supplier.get_report_manager",
			"async": false,
			args: {
				'name': frm.doc.parent_supplier
			},
			callback: function (r) {
				for (var i = 0; i < r.message.length; i++) {
					if (!supplier.includes(r.message[i])) {
						supplier.push(r.message[i])
					}
				}
			}
		});
	}

	frm.set_query("report_manager", function () {
		return {
			filters: {
				"is_manager": 1,
				"name": ["in", supplier]
			}
		};
	});
}

function update_filter(frm) {
	frm.set_query("coordinator_name", function () {
		return {
			query: "erpnext.buying.doctype.supplier.supplier.get_supplier_primary_contact",
			filters: {
				"supplier": frm.doc.name
			}
		};
	});
	frm.set_query("coordinator_email", function () {
		return {
			query: "naked_manufacturing.naked_manufacturing.doctype.supplier.supplier.get_coordinator_email",
			filters: {
				"parent": frm.doc.coordinator_name
			}
		};
	});

}
function render_template_contact(frm) {
	frappe.call({
		method: "naked_manufacturing.naked_manufacturing.doctype.supplier.supplier.onload",
		args: {
			doc: frm.doc.name
		},
		async: false,
		callback: function (r) {
			frm.set_df_property('contacts_details_', 'options', r.message)
			frm.refresh_fields();
		}
	});
	if (frm.doc.supplier_primary_contact != undefined) {
		frm.doc.coordinator_name = frm.doc.supplier_primary_contact
		frm.refresh_fields()
	}
}