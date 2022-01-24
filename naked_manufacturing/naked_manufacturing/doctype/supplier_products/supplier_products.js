// Copyright (c) 2022, admin@gmail.com and contributors
// For license information, please see license.txt

frappe.ui.form.on("Supplier Products", {
    "supplier_id": function(frm) {
    	frappe.db.get_value("Supplier", frm.doc.supplier_id, "product_lookup",(s)=>{
		frm.set_value('product_identifier',s.product_lookup) 
    });
}


});