# -*- coding: utf-8 -*-
# Copyright (c) 2020, seabridge_app and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document
import json
import erpnext
from frappe.contacts.address_and_contact import (
    delete_contact_and_address,
    load_address_and_contact,
)
from frappe import _


class Supplier(Document):
    pass


@frappe.whitelist()
def onload(doc):
    documents = frappe.get_doc('Supplier', doc)
    if documents.meta.get_field("supplier_primary_contact"):
        contact_list=frappe.db.sql(""" select c.name,c.designation ,c.email_id,c.mobile_no from `tabContact`c 
                INNER JOIN `tabDynamic Link` tdl  on c.name=tdl.parent
                where  tdl.link_name ='{supplier}'""".format(supplier=doc),as_dict=True)
        if contact_list:
            contact_details = get_contact_details(contact_list)
            return contact_details

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
    frappe.db.sql("""delete from `tabReport Member Details` where parent='{report_manager}' and supplier_name='{name}'""".format(report_manager=report_manager,name=name))
