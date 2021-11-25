from __future__ import unicode_literals
import frappe, erpnext
from frappe.frappeclient import FrappeClient
from frappe.model.document import Document


@frappe.whitelist()
def set_email_ids(email_id):
	email=frappe.db.get_value("Contact Email",{'email_id':email_id},'name')
	if email!=email_id:
		frappe.db.sql("""update `tabContact Email` set name=%s where email_id=%s""",(email_id,email_id))

