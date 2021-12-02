from . import __version__ as app_version

app_name = "naked_manufacturing"
app_title = "naked_manufacturing"
app_publisher = "admin@gmail.com"
app_description = "naked_manufacturing"
app_icon = "octicon octicon-file-directory"
app_color = "grey"
app_email = "admin@gmail.com"
app_license = "MIT"

fixtures = ["Server Script",
{"dt": "Custom Field",
		"filters": [
        [
        "name","in",[
		"Supplier-is_group",
		"Supplier-parent_supplier",
		"Supplier-individual_supplier_details",
		"Supplier-individual_supplier_detail",
		"Supplier-designation",
		"Supplier-contacts_details_",
		"Supplier-contacts",
		"Supplier-is_factory_location",
		"Supplier-manager",
		"Supplier-is_manager",
		"Supplier-supplier_id",
		"Supplier-supplier_product_management",
		"Supplier-is_active_portal",
		"Supplier-username",
		"Supplier-password",
		"Supplier-cooridnator_email_id",
		"Supplier-coordinator_name",
		"Supplier-product_reports",
		"Supplier-product_break",
		"Supplier-report_manager",
		"Supplier-product_lookup",
		"Supplier-report_member_details",
		"Supplier-display_name",
		"Supplier-supplier_portal",
		"Supplier-coordinator_email",
		"Supplier-new_supplier",
		"Supplier-is_child"
	]
	]
]
},
{"dt": "Property Setter",
		"filters":[
	["name","in",[
		"Supplier-address_contacts-label",
		"Supplier-contact_html-permlevel"
	]
	]
	
]
}
]
doctype_js = {
	"Supplier" : "naked_manufacturing/doctype/supplier/supplier.js",
	"Contact" : "naked_manufacturing/doctype/contact/contact.js"
}

# Includes in <head>
# ------------------

# include js, css files in header of desk.html
# app_include_css = "/assets/naked_manufacturing/css/naked_manufacturing.css"
# app_include_js = "/assets/naked_manufacturing/js/naked_manufacturing.js"

# include js, css files in header of web template
# web_include_css = "/assets/naked_manufacturing/css/naked_manufacturing.css"
# web_include_js = "/assets/naked_manufacturing/js/naked_manufacturing.js"

# include custom scss in every website theme (without file extension ".scss")
# website_theme_scss = "naked_manufacturing/public/scss/website"

# include js, css files in header of web form
# webform_include_js = {"doctype": "public/js/doctype.js"}
# webform_include_css = {"doctype": "public/css/doctype.css"}

# include js in page
# page_js = {"page" : "public/js/file.js"}

# include js in doctype views
# doctype_js = {"doctype" : "public/js/doctype.js"}
# doctype_list_js = {"doctype" : "public/js/doctype_list.js"}
doctype_tree_js = {"Supplier" : "naked_manufacturing/doctype/supplier/supplier_tree.js"}
# doctype_calendar_js = {"doctype" : "public/js/doctype_calendar.js"}

# Home Pages
# ----------

# application home page (will override Website Settings)
# home_page = "login"

# website user home page (by Role)
# role_home_page = {
#	"Role": "home_page"
# }

# Generators
# ----------

# automatically create page for each record of this doctype
# website_generators = ["Web Page"]

# Installation
# ------------

# before_install = "naked_manufacturing.install.before_install"
# after_install = "naked_manufacturing.install.after_install"

# Desk Notifications
# ------------------
# See frappe.core.notifications.get_notification_config

# notification_config = "naked_manufacturing.notifications.get_notification_config"

# Permissions
# -----------
# Permissions evaluated in scripted ways

# permission_query_conditions = {
# 	"Event": "frappe.desk.doctype.event.event.get_permission_query_conditions",
# }
#
# has_permission = {
# 	"Event": "frappe.desk.doctype.event.event.has_permission",
# }

# DocType Class
# ---------------
# Override standard doctype classes

# override_doctype_class = {
# 	"ToDo": "custom_app.overrides.CustomToDo"
# }

# Document Events
# ---------------
# Hook on document methods and events

# doc_events = {
# 	"*": {
# 		"on_update": "method",
# 		"on_cancel": "method",
# 		"on_trash": "method"
#	}
# }

# Scheduled Tasks
# ---------------

# scheduler_events = {
# 	"all": [
# 		"naked_manufacturing.tasks.all"
# 	],
# 	"daily": [
# 		"naked_manufacturing.tasks.daily"
# 	],
# 	"hourly": [
# 		"naked_manufacturing.tasks.hourly"
# 	],
# 	"weekly": [
# 		"naked_manufacturing.tasks.weekly"
# 	]
# 	"monthly": [
# 		"naked_manufacturing.tasks.monthly"
# 	]
# }

# Testing
# -------

# before_tests = "naked_manufacturing.install.before_tests"

# Overriding Methods
# ------------------------------
#
# override_whitelisted_methods = {
# 	"frappe.desk.doctype.event.event.get_events": "naked_manufacturing.event.get_events"
# }
#
# each overriding function accepts a `data` argument;
# generated from the base implementation of the doctype dashboard,
# along with any modifications made in other Frappe apps
# override_doctype_dashboards = {
# 	"Task": "naked_manufacturing.task.get_dashboard_data"
# }

# exempt linked doctypes from being automatically cancelled
#
# auto_cancel_exempted_doctypes = ["Auto Repeat"]


# User Data Protection
# --------------------

user_data_fields = [
	{
		"doctype": "{doctype_1}",
		"filter_by": "{filter_by}",
		"redact_fields": ["{field_1}", "{field_2}"],
		"partial": 1,
	},
	{
		"doctype": "{doctype_2}",
		"filter_by": "{filter_by}",
		"partial": 1,
	},
	{
		"doctype": "{doctype_3}",
		"strict": False,
	},
	{
		"doctype": "{doctype_4}"
	}
]

# Authentication and authorization
# --------------------------------

# auth_hooks = [
# 	"naked_manufacturing.auth.validate"
# ]

