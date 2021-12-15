# -*- coding: utf-8 -*-
# Copyright (c) 2020, seabridge_app and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document
import json
import erpnext
from frappe import _
from frappe.desk.treeview import get_all_nodes,get_children


class Supplier(Document):
    pass


@frappe.whitelist()
def onload(doc):
    contact_list = frappe.db.sql(""" select c.name,c.designation ,c.email_id,c.mobile_no from `tabContact`c 
            INNER JOIN `tabDynamic Link` tdl  on c.name=tdl.parent
            where  tdl.link_name ='{supplier}'""".format(supplier=doc), as_dict=True)
    return get_contact_details(contact_list)


def get_contact_details(doc):
    return frappe.render_template(
        "templates/includes/contact_details.html", {'doc': doc}
    )


@frappe.whitelist()
def delete_child_supplier_details(name, parent_supplier):
    child_supplier_list = frappe.get_list('Child Supplier Details', filters={
        'parent': parent_supplier}, fields=['*'])
    child_supplier = []
    for val in child_supplier_list:
        child_supplier.append(val.name)
    if child_supplier:
        frappe.db.sql(
            """delete from `tabChild Supplier Details` where name in ({0})""".format(', '.join(['%s']*len(child_supplier))), tuple(child_supplier))
    for row in child_supplier_list:
        if row.supplier_name != name:
            doc = frappe.get_doc('Supplier', row.parent)
            supplier_doc = doc.append('individual_supplier_detail', {
                'supplier_name': row.supplier_name,
                'country': row.country,
                'city': row.city
            })
            supplier_doc.save()


@frappe.whitelist()
@frappe.validate_and_sanitize_search_inputs
def get_coordinator_email(doctype, txt, searchfield, start, page_len, filters):
    supplier = filters.get("parent")
    return frappe.db.sql("""
        SELECT
           `tabContact Email`.name from `tabContact Email`
        WHERE
            parent=%(supplier)s
            and parenttype='Contact'
        """, {
        'supplier': supplier,
    })


@frappe.whitelist()
def delete_report_member_details(report_manager, name):
    frappe.db.sql("""delete from `tabReport Member Details` where parent='{report_manager}' and supplier_name='{name}'""".format(
        report_manager=report_manager, name=name))


@frappe.whitelist()
def get_report_manager(name):
    child_supplier = get_query_filter(name)
    return child_supplier


def get_query_filter(name):
    supplier_list = []
    if frappe.db.get_value('Supplier', {'is_manager': 1, 'name': name}, 'name') == name:
        if name not in supplier_list:
            supplier_list.append(name)
    for supplier in frappe.db.get_list("Supplier", filters={"name": name}, fields={'parent_supplier'}):
        if frappe.db.get_value('Supplier', {'is_manager': 1, 'name': supplier.parent_supplier}, 'name') == supplier.parent_supplier:
            if supplier.parent_supplier not in supplier_list and supplier.parent_supplier != None:
                supplier_list.append(supplier.parent_supplier)
        if supplier.parent_supplier:
            for child_item_list in get_query_filter(supplier.parent_supplier):
                if child_item_list not in supplier_list and supplier.parent_supplier != None:
                    supplier_list.append(child_item_list)
    return supplier_list


@frappe.whitelist()
def get_root_supplier(supplier):
    root_supplier = supplier
    parent = frappe.db.get_value(
        'Supplier', {'name': supplier}, 'parent_Supplier')
    if parent:
        root_supplier = get_root_supplier(parent)
    return root_supplier


@frappe.whitelist()
def get_descendents(doctype, parent=None, **filters):
    if not parent or parent == "Supplier":
        return get_children(doctype)
    if parent:
        supplier_doc = frappe.get_cached_doc(
            "Supplier", parent)
        frappe.has_permission("Supplier", doc=supplier_doc, throw=True)
        child_suppliers = frappe.get_all('Supplier',
                                         fields=['parent_supplier',
                                                 'name as value', 'is_group'],
                                         filters=[
                                             ['parent_supplier', '=', parent]],
                                         order_by='idx')
        for supplier in child_suppliers:
            supplier.expanded = 0 if supplier.is_group == 0 else 1
            supplier.expandable = 0 if supplier.is_group == 0 else 1
        return child_suppliers
