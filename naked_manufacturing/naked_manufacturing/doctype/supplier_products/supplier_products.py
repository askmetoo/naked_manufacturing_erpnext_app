# Copyright (c) 2022, admin@gmail.com and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class SupplierProducts(Document):
	def after_insert(self):
		value=self.name
		name_list = frappe.get_list('Supplier Report',filters={'import_log': ['like', '%value%'] },fields=['name'],order_by='modified desc')
		#name=frappe.get_value('Supplier Report',{'import_log': ['like', '%value%'] },'name')
		for val in name_list:
			self.add_comment('Info', 'Data added by Report Upload '+val.name)
			self.save()
		
