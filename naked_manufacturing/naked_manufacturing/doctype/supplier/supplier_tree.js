frappe.treeview_settings["Supplier"] = {
    get_tree_nodes: 'naked_manufacturing.naked_manufacturing.doctype.supplier.supplier.get_descendents',
    filters: [
        {
            fieldname: "supplier_name",
            fieldtype: "Link",
            options: "Supplier",
            label: "Supplier",
            hidden: true,
        }
    ],
    title: "Supplier",
    breadcrumb: "Buying",
    disable_add_node: true,
    root_label: "Supplier",//fieldname from filters
    get_tree_root: true,
    show_expand_all: false,
    get_label: function (node) {
        if (node.data.value) {
            return node.data.value
        }
    },
    onrender: function (node) {
    }
}
