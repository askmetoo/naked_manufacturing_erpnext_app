console.log('treeview')
frappe.treeview_settings["Supplier"] = {
	get_tree_nodes: 'naked_manufacturing.doctype.supplier.supplier.get_children',
	filters: [
		{
			fieldname: "parent_supplier",
			fieldtype:"Link",
			options: "supplier",
			label: __("Supplier")
		}
	],
	title: "Supplier",
	//breadcrumb: "Buying",
	disable_add_node: true,
	root_label: "Supplier", //fieldname from filters
	get_tree_root: false,
	show_expand_all: false,
	onload: function(me) {
		var label = frappe.get_route()[0] + "/" + frappe.get_route()[1];
		if(frappe.pages[label]) {
			delete frappe.pages[label];
		}

		var filter = me.opts.filters[0];
		if(frappe.route_options && frappe.route_options[filter.fieldname]) {
			var val = frappe.route_options[filter.fieldname];
			delete frappe.route_options[filter.fieldname];
			filter.default = "";
			me.args[filter.fieldname] = val;
			me.root_label = val;
			me.page.set_title(val);
		}
		me.make_tree();
	},
	toolbar: [
		{ toggle_btn: true },
		{
			label:__("Edit"),
			condition: function(node) {
				return node.expandable;
			},
			click: function(node) {

				frappe.set_route("Form", "supplier", node.data.value);
			}
		}
	]
	
}
