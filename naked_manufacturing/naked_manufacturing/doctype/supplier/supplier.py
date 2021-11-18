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
        supplier_list = frappe.db.get_list(
            'Supplier', filters={'parent_supplier': doc}, fields=['*'])
        contacts = []
        if documents.supplier_primary_contact != None:
            contacts.append({'supplier_primary_contact': documents.supplier_primary_contact,
                            'designation': documents.designation, 'email_id': documents.email_id, 'mobile_no': documents.mobile_no})
        for row in supplier_list:
            if row not in contacts:
                if row.supplier_primary_contact != None or row.designation != None or row.email_id != None or row.mobile_no != None:
                    contacts.append({'supplier_primary_contact': row.supplier_primary_contact,
                                    'designation': row.designation, 'email_id': row.email_id, 'mobile_no': row.mobile_no})
        if contacts:
            contact_details = get_contact_details(contacts)
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
